const { prisma } = require('../../db/prisma');

class AuthRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(userData) {
    return prisma.user.create({ data: userData });
  }
}

module.exports = new AuthRepository();
