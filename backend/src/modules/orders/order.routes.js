const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');
const { createSchema, updateSchema } = require('./order.validation');
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

router.use(authMiddleware);
router.get('/', permissionMiddleware('manage:orders'), orderController.getAll);
router.get('/:id', permissionMiddleware('manage:orders'), orderController.getById);
router.post('/', permissionMiddleware('manage:orders'), validate(createSchema), orderController.create);
router.put('/:id', permissionMiddleware('manage:orders'), validate(updateSchema), orderController.update);
router.delete('/:id', permissionMiddleware('manage:orders'), orderController.delete);

module.exports = router;