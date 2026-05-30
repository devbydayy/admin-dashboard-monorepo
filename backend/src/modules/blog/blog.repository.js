const { prisma } = require('../../db/prisma');

class BlogRepository {
  async findAll(options = {}) {
    const { publishedOnly = true, limit, offset, orderBy = 'desc' } = options;
    
    const where = publishedOnly ? { published: true } : {};
    
    return prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
      take: limit,
      skip: offset,
    });
  }

  async findById(id) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findBySlug(slug) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByAuthor(authorId, options = {}) {
    const { publishedOnly = false, limit, offset } = options;
    
    const where = { authorId };
    if (publishedOnly) {
      where.published = true;
    }
    
    return prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  async create(data) {
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    return prisma.blogPost.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    return prisma.blogPost.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return prisma.blogPost.delete({
      where: { id },
    });
  }

  async count(options = {}) {
    const { publishedOnly = false, authorId } = options;
    
    const where = {};
    if (publishedOnly) where.published = true;
    if (authorId) where.authorId = authorId;
    
    return prisma.blogPost.count({ where });
  }

  async search(query, options = {}) {
    const { limit = 20, publishedOnly = true } = options;
    
    return prisma.blogPost.findMany({
      where: {
        AND: [
          publishedOnly ? { published: true } : {},
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

module.exports = new BlogRepository();