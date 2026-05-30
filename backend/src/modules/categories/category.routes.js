const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');
const { createSchema, updateSchema } = require('./category.validation');
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

router.use(authMiddleware, permissionMiddleware('manage:categories'));
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', validate(createSchema), categoryController.create);
router.put('/:id', validate(updateSchema), categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;