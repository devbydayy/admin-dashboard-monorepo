const express = require('express');
const router = express.Router();
const blogController = require('./blog.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');
const { createSchema, updateSchema } = require('./blog.validation');
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

router.use(authMiddleware, permissionMiddleware('manage:blogs'));
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);
router.post('/', validate(createSchema), blogController.create);
router.put('/:id', validate(updateSchema), blogController.update);
router.delete('/:id', blogController.delete);

module.exports = router;