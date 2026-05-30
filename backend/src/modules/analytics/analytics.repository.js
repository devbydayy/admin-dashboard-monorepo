
const { prisma } = require('../../db/prisma');

class AnalyticsRepository {
  async getOrderStats(startDate, endDate) {
    return prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
      _sum: { total: true },
      _avg: { total: true },
    });
  }

  async getOrdersByStatus(startDate, endDate) {
    return prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });
  }

  async getDailyRevenue(startDate, endDate) {
    const results = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        SUM(total) as revenue,
        COUNT(*) as order_count
      FROM orders
      WHERE created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    return results;
  }

  async getTopProducts(startDate, endDate, limit = 10) {
    return prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'COMPLETED',
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });
  }

  async getCustomerStats(startDate, endDate) {
    const [newCustomers, totalCustomers] = await Promise.all([
      prisma.customer.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.customer.count(),
    ]);

    return { newCustomers, totalCustomers };
  }

  async getProductStats() {
    const [totalProducts, lowStock, outOfStock] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lt: 10, gt: 0 } } }),
      prisma.product.count({ where: { stock: 0 } }),
    ]);

    return { totalProducts, lowStock, outOfStock };
  }

  async saveAnalyticsSnapshot(period, data) {
    if (prisma.analyticsLog) {
      return prisma.analyticsLog.create({
        data: {
          period,
          data,
          createdAt: new Date(),
        },
      });
    }
    return null;
  }
}

module.exports = new AnalyticsRepository();