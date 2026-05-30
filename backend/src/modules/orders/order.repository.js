const { prisma } = require('../../db/prisma');

class OrderRepository {
  async findAll() {
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

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });
  }

  async create(data) {
    return prisma.order.create({ data, include: { customer: true, items: true } });
  }

  async update(id, data) {
    return prisma.order.update({ where: { id }, data, include: { customer: true, items: true } });
  }

  async delete(id) {
    return prisma.order.delete({ where: { id } });
  }
}

module.exports = new OrderRepository();
