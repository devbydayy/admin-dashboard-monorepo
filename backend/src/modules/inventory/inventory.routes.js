const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');

router.use(authMiddleware, permissionMiddleware('manage:inventory'));
router.get('/alerts', inventoryController.getLowStockAlerts);
router.patch('/products/:id/stock', inventoryController.adjustStock);

module.exports = router;