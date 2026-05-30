const express = require('express');
const router = express.Router();
const settingsController = require('./settings.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');

router.use(authMiddleware, permissionMiddleware('manage:settings'));
router.get('/', settingsController.get);
router.put('/', settingsController.update);

module.exports = router;