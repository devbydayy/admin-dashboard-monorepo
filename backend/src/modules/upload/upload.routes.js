const express = require('express');
const router = express.Router();
const { upload } = require('../../middleware/upload.middleware');
const uploadController = require('./upload.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');

router.post(
  '/product-image',
  authMiddleware,
  permissionMiddleware('manage:products'),
  upload.single('image'),
  uploadController.uploadProductImage
);

module.exports = router;