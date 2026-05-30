const express = require('express');
const router = express.Router();
const customersController = require('./customers.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');
const { createSchema, updateSchema } = require('./customers.validation');
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

router.use(authMiddleware);
router.get('/', permissionMiddleware('manage:customers'), customersController.getAll);
router.get('/:id', permissionMiddleware('manage:customers'), customersController.getById);
router.post('/', permissionMiddleware('manage:customers'), validate(createSchema), customersController.create);
router.put('/:id', permissionMiddleware('manage:customers'), validate(updateSchema), customersController.update);
router.delete('/:id', permissionMiddleware('manage:customers'), customersController.delete);

module.exports = router;