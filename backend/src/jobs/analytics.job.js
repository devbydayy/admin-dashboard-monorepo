const { prisma } = require('../db/prisma');
const { emitAnalyticsUpdate } = require('../sockets');

async function runAnalyticsJob(period, targetDate = new Date()) {
  try {
    const startTime = Date.now();
    console.log(`[Analytics Job] Starting ${period} aggregation for ${targetDate.toISOString()}...`);

    const existing = await prisma.analyticsLog.findFirst({
      where: {
        period,
        createdAt: targetDate,
      },
    });

    if (existing) {
      console.log(`[Analytics Job] Snapshot already exists for ${period} at ${targetDate.toISOString()}, skipping.`);
      return existing;
    }

    const now = targetDate;
    let startDate, endDate;

    switch (period) {
      case 'hourly':
        startDate = new Date(now);
        startDate.setHours(startDate.getHours() - 1);
        endDate = new Date(now);
        break;
      case 'daily':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(now);
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date(now);
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date(now);
        break;
      default:
        startDate = new Date(now);
        startDate.setHours(startDate.getHours() - 1);
        endDate = new Date(now);
    }

    console.log(`[Analytics Job] Window: ${startDate.toISOString()} → ${endDate.toISOString()}`);

    const orderStats = await prisma.order.aggregate({
      where: { createdAt: { gte: startDate, lt: endDate } },
      _count: true,
      _sum: { total: true },
      _avg: { total: true },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: { createdAt: { gte: startDate, lt: endDate } },
      _count: true,
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { createdAt: { gte: startDate, lt: endDate } },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const newCustomers = await prisma.customer.count({
      where: { createdAt: { gte: startDate, lt: endDate } },
    });

    const analyticsData = {
      period,
      timestamp: targetDate.toISOString(),
      stats: {
        totalOrders: orderStats._count,
        totalRevenue: orderStats._sum.total || 0,
        averageOrderValue: orderStats._avg.total || 0,
        newCustomers,
      },
      ordersByStatus: ordersByStatus.map(s => ({
        status: s.status,
        count: s._count,
      })),
      topProducts: topProducts.map(p => ({
        productId: p.productId,
        quantitySold: p._sum.quantity,
      })),
    };

    const created = await prisma.analyticsLog.create({
      data: {
        period,
        data: analyticsData,
        createdAt: targetDate,
      },
    });

    const duration = Date.now() - startTime;
    console.log(`[Analytics Job] Completed ${period} aggregation in ${duration}ms`);

    if (typeof emitAnalyticsUpdate === 'function') {
      emitAnalyticsUpdate(analyticsData);
    }

    return created;
  } catch (error) {
    console.error(`[Analytics Job] Failed for ${period}:`, error);
    throw error;
  }
}

module.exports = { runAnalyticsJob };