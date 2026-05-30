const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');
const { createSchema, updateSchema } = require('./product.validation');
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

router.post('/', authMiddleware, permissionMiddleware('manage:products'), validate(createSchema), productController.create);
router.put('/:id', authMiddleware, permissionMiddleware('manage:products'), validate(updateSchema), productController.update);
router.delete('/:id', authMiddleware, permissionMiddleware('manage:products'), productController.delete);

module.exports = router;