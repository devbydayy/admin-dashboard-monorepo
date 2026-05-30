const { prisma } = require('../db/prisma');

async function runTransaction(callback) {
  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

async function updateStockInTransaction(tx, productId, quantity) {
  const product = await tx.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  const newStock = product.stock - quantity;
  if (newStock < 0) {
    throw new Error(`Insufficient stock for product ${product.name}`);
  }

  return tx.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });
}

async function createOrderWithItems(orderData, items, userId) {
  return runTransaction(async (tx) => {
    for (const item of items) {
      await updateStockInTransaction(tx, item.productId, item.quantity);
    }

    const order = await tx.order.create({
      data: {
        ...orderData,
        createdBy: userId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  });
}

module.exports = {
  runTransaction,
  updateStockInTransaction,
  createOrderWithItems,
};
