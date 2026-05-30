const { prisma } = require('../../db/prisma');
const { ApiError } = require('../../utils/ApiError');

class CustomerService {
  async getAll() {
    return prisma.customer.findMany({
      include: { orders: { include: { items: { include: { product: true } } } } },
    });
  }

  async getById(id) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: { include: { items: { include: { product: true } } } } },
    });
    if (!customer) throw new ApiError(404, 'Customer not found');
    return customer;
  }

  async create(customerData, userId) {
    return prisma.customer.create({
      data: { ...customerData, ownerId: userId },
      include: { orders: true },
    });
  }

  async update(id, customerData) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new ApiError(404, 'Customer not found');
    return prisma.customer.update({
      where: { id },
      data: customerData,
      include: { orders: true },
    });
  }

  async delete(id) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new ApiError(404, 'Customer not found');
    await prisma.customer.delete({ where: { id } });
    return { message: 'Customer deleted' };
  }
}

module.exports = new CustomerService();