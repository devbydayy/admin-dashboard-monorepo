const { prisma } = require("../../db/prisma");
const { getOrSetCache } = require("../../cache/cacheHelper");

class AnalyticsService {
  async getOverview() {
    return getOrSetCache("analytics:overview", 300, async () => {
      const [revenue, orders, customers, topProducts] = await Promise.all([
        prisma.order.aggregate({
          where: { status: { in: ["DELIVERED", "COMPLETED"] } },
          _sum: { total: true },
        }),
        prisma.order.count(),
        prisma.customer.count(),
        prisma.orderItem.groupBy({
          by: ["productId"],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
      ]);

      const productIds = topProducts.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true, imageUrl: true },
      });

      const formattedProducts = topProducts.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          name: product?.name || "Unknown Product",
          price: product?.price || 0,
          image: product?.imageUrl || null,
          quantitySold: item._sum.quantity || 0,
        };
      });

      return {
        revenue: revenue._sum.total || 0,
        orders,
        customers,
        conversionRate: 3.24,
        topProducts: formattedProducts,
      };
    });
  }

  async getSalesReport(startDate, endDate) {
    return prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
        status: { in: ["DELIVERED", "COMPLETED"] },
      },
      orderBy: { createdAt: "asc" },
      select: { id: true, total: true, createdAt: true },
    });
  }

  async getSnapshots(period, limit = 30) {
    const cacheKey = `snapshots:${period}:${limit}`;
    return getOrSetCache(cacheKey, 86400, async () => {
      return prisma.analyticsLog.findMany({
        where: { period },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          period: true,
          data: true,
          createdAt: true,
        },
      });
    });
  }
}

module.exports = new AnalyticsService();