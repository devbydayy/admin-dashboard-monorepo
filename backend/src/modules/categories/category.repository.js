const { prisma } = require('../../db/prisma');

class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: true,
      },
    });
  }

  async findByName(name) {
    return prisma.category.findFirst({
      where: { name },
    });
  }

  async create(data) {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    return prisma.category.create({
      data,
      include: {
        products: true,
      },
    });
  }

  async update(id, data) {
    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    return prisma.category.update({
      where: { id },
      data,
      include: {
        products: true,
      },
    });
  }

  async delete(id) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (category.products.length > 0) {
      throw new Error('Cannot delete category with associated products');
    }

    return prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryProductCount(id) {
    return prisma.product.count({
      where: { categoryId: id },
    });
  }

  async getCategoriesByType(type) {
    return prisma.category.findMany({
      where: { type },
      include: {
        products: true,
      },
    });
  }
}

module.exports = new CategoryRepository();