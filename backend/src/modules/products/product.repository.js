const { prisma } = require('../../db/prisma');

class ProductRepository {
  async findAll() {
    return prisma.product.findMany({ include: { category: true } });
  }

  async findById(id) {
    return prisma.product.findUnique({ where: { id }, include: { category: true } });
  }

  async create(data) {
    return prisma.product.create({ data, include: { category: true } });
  }

  async update(id, data) {
    return prisma.product.update({ where: { id }, data, include: { category: true } });
  }

  async delete(id) {
    return prisma.product.delete({ where: { id } });
  }
}

module.exports = new ProductRepository();
