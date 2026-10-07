const express = require('express');
const router = express.Router();

const { prisma } = require('../db/prisma');
const redis = require('../cache/redis');

const authRoutes = require('../modules/auth/auth.routes');
const productRoutes = require('../modules/products/product.routes');
const orderRoutes = require('../modules/orders/order.routes');
const customerRoutes = require('../modules/customers/customers.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const blogRoutes = require('../modules/blog/blog.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const userRoutes = require('../modules/users/user.routes');
const inventoryRoutes = require("../modules/inventory/inventory.routes");
const settingsRoutes = require("../modules/settings/settings.routes");
const webhookRoutes = require('../modules/webhooks/webhook.routes');
const auditLogRoutes = require("../modules/auditLogs/auditLog.routes");
const uploadRoutes    = require('../modules/upload/upload.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/categories', categoryRoutes);
router.use('/blogs', blogRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/settings", settingsRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use('/upload',     uploadRoutes);

router.get('/health', async (req, res) => {
  const result = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  let httpStatus = 200;

  try {
    await prisma.$queryRaw`SELECT 1`;
    result.services.database = 'ok';
  } catch (err) {
    console.error('[Health] Database ping failed:', err.message);
    result.services.database = 'error';
    result.databaseError = err.message;
    httpStatus = 500;
  }

  try {
    await redis.ping();
    result.services.redis = 'ok';
  } catch (err) {
    console.error('[Health] Redis ping failed:', err.message);
    result.services.redis = 'error';
    result.redisError = err.message;
    httpStatus = 500;
  }

  res.status(httpStatus).json(result);
});

router.use('/webhooks', webhookRoutes);

router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = router;
