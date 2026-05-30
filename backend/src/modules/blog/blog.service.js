const { prisma } = require('../../db/prisma');
const { ApiError } = require('../../utils/ApiError');

class BlogService {
  async getAll() {
    return prisma.blog.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  }

  async create(blogData, authorId) {
    return prisma.blog.create({
      data: { ...blogData, authorId },
      include: { author: true },
    });
  }

  async update(id, blogData) {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new ApiError(404, 'Blog not found');
    return prisma.blog.update({
      where: { id },
      data: blogData,
      include: { author: true },
    });
  }

  async delete(id) {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new ApiError(404, 'Blog not found');
    await prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted' };
  }
}

module.exports = new BlogService();
