const { prisma } = require('../../db/prisma');
const { ApiError } = require('../../utils/ApiError');
const { generateOrderNumber } = require('../../utils/helpers');
const { emitNewOrder, emitOrderUpdate } = require('../../sockets');
const { scheduleShipmentNotification } = require('../../queues/order.queue');
const { invalidateCache } = require('../../cache/cacheHelper');

class OrderService {
  async getAll() {
    return prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: { product: { include: { category: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
  }

  async create(orderData, userId) {
    const { customerId, items } = orderData;

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new ApiError(404, 'Customer not found');

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product ${product.name}`);
      }
    }

    const orderNumber = generateOrderNumber();
    let total = 0;
    const itemData = items.map(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      return { productId: item.productId, quantity: item.quantity, price: item.price };
    });

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          total,
          status: 'PENDING',
          customerId,
          createdById: userId,
        },
      });

      for (const item of itemData) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: createdOrder.id,
          },
        });
      }

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.auditLog.create({
        data: {
          action: 'Create',
          entity: `Order ${orderNumber}`,
          details: `Order created with ${items.length} items, total: $${total.toFixed(2)}`,
          userId: userId,
        },
      });

      return createdOrder;
    });

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: true,
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });

    emitNewOrder(completeOrder);
    await invalidateCache('analytics:overview'); 

    return completeOrder;
  }

  async update(id, updateData, userId) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new ApiError(404, 'Order not found');

    const oldStatus = order.status;

    if (updateData.status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
      const items = await prisma.orderItem.findMany({ where: { orderId: id } });
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({
          where: { id },
          data: { ...updateData, status: 'CANCELLED' },
        });
        await tx.auditLog.create({
          data: {
            action: 'Update',
            entity: `Order ${order.orderNumber}`,
            details: `Order status changed from ${oldStatus} to CANCELLED`,
            userId,
          },
        });
      });
    } else {
      await prisma.order.update({
        where: { id },
        data: updateData,
      });
      await prisma.auditLog.create({
        data: {
          action: 'Update',
          entity: `Order ${order.orderNumber}`,
          details: `Order updated: ${JSON.stringify(updateData)}`,
          changes: updateData.status
            ? { status: { old: oldStatus, new: updateData.status } }
            : undefined,
          userId,
        },
      });
    }

    if (updateData.status === 'SHIPPED' && oldStatus !== 'SHIPPED') {
      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          customer: true,
          items: { include: { product: true } },
        },
      });
      if (updatedOrder) {
        scheduleShipmentNotification(updatedOrder);
      }
    }

    const finalOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });

    emitOrderUpdate(id, updateData.status || order.status);
    await invalidateCache('analytics:overview');

    return finalOrder;
  }

  async delete(id, userId) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new ApiError(404, 'Order not found');

    if (!['PENDING', 'CANCELLED'].includes(order.status)) {
      throw new ApiError(400, `Cannot delete order with status: ${order.status}`);
    }

    await prisma.$transaction(async (tx) => {
      if (order.status !== 'CANCELLED') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          action: 'Delete',
          entity: `Order ${order.orderNumber}`,
          details: `Order deleted`,
          userId,
        },
      });
    });

    await invalidateCache('analytics:overview');

    return { message: 'Order deleted successfully' };
  }
}

module.exports = new OrderService();