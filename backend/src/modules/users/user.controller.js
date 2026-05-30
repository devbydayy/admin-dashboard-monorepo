const userService = require('./user.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  register: asyncHandler(async (req, res) => {
    const { user, token } = await userService.register(req.body);
    res.status(201).json(new ApiResponse({ user, token }));
  }),

  login: asyncHandler(async (req, res) => {
    const { user, token } = await userService.login(req.body.email, req.body.password);
    res.json(new ApiResponse({ user, token }));
  }),

  getProfile: asyncHandler(async (req, res) => {
    const user = await userService.getById(req.user.id);
    res.json(new ApiResponse(user));
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await userService.update(req.user.id, req.body);
    res.json(new ApiResponse({ ...user, password: undefined }));
  }),

  list: asyncHandler(async (req, res) => {
    const users = await userService.list();
    res.json(new ApiResponse(users));
  }),

  adminUpdate: asyncHandler(async (req, res) => {
    const updated = await userService.adminUpdate(req.params.id, req.body);
    res.json(new ApiResponse(updated));
  }),
};