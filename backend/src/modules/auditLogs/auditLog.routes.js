const express = require('express');
const router = express.Router();
const auditLogController = require('./auditLog.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');

router.use(authMiddleware, permissionMiddleware('manage:audit-logs'));
router.get('/', auditLogController.list);

module.exports = router;