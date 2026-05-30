const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const permissionMiddleware = require('../../middleware/permission.middleware');
const { registerSchema, loginSchema, updateSchema } = require('./user.validation');
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validate(updateSchema), userController.updateProfile);

router.get('/', authMiddleware, permissionMiddleware('manage:users'), userController.list);
router.put('/:id', authMiddleware, permissionMiddleware('manage:users'), userController.adminUpdate);

module.exports = router;