const { prisma } = require('../../db/prisma');
const { ApiError } = require('../../utils/ApiError');

class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getById(id) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  async create(categoryData) {
    return prisma.category.create({
      data: categoryData,
      include: { products: true },
    });
  }

  async update(id, categoryData) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new ApiError(404, 'Category not found');
    return prisma.category.update({
      where: { id },
      data: categoryData,
      include: { products: true },
    });
  }

  async delete(id) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new ApiError(404, 'Category not found');
    await prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }
}

module.exports = new CategoryService();
