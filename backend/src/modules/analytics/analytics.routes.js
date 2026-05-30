const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');

router.use(authMiddleware, permissionMiddleware('view:analytics'));

router.get('/overview', analyticsController.getOverview);
router.get('/sales-report', analyticsController.getSalesReport);
router.get('/snapshots', analyticsController.getSnapshots);

module.exports = router;