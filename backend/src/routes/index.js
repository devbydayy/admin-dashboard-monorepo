const express = require('express');
const router = express.Router();

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

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/webhooks', webhookRoutes);   

router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = router;