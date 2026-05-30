
const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');

module.exports = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password);
    res.json({
      success: true,
      data: result,
    });
  }),

  getProfile: asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  }),
};
