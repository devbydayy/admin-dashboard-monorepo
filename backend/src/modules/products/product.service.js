const { prisma } = require('../../db/prisma');
const { ApiError } = require('../../utils/ApiError');

class ProductService {
  async getAll() {
    return prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  async create(productData, userId) {
    return prisma.product.create({
      data: { ...productData, createdById: userId },
      include: { category: true },
    });
  }

  async update(id, productData) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ApiError(404, 'Product not found');
    return prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true },
    });
  }

  async delete(id) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new ApiError(404, 'Product not found');
    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted' };
  }
}

module.exports = new ProductService();