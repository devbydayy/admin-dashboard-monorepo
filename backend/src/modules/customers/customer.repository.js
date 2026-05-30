const { prisma } = require('../../db/prisma');

class CustomerRepository {
  async findAll() {
    return prisma.customer.findMany({ include: { orders: true } });
  }

  async findById(id) {
    return prisma.customer.findUnique({ where: { id }, include: { orders: true } });
  }

  async create(data) {
    return prisma.customer.create({ data, include: { orders: true } });
  }

  async update(id, data) {
    return prisma.customer.update({ where: { id }, data, include: { orders: true } });
  }

  async delete(id) {
    return prisma.customer.delete({ where: { id } });
  }
}

module.exports = new CustomerRepository();
