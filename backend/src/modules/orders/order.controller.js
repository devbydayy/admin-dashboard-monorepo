const orderService = require('./order.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const orders = await orderService.getAll();
    res.json(new ApiResponse(orders));
  }),

  getById: asyncHandler(async (req, res) => {
    const order = await orderService.getById(req.params.id);
    res.json(new ApiResponse(order));
  }),

  create: asyncHandler(async (req, res) => {
    const order = await orderService.create(req.body, req.user.id);
    res.status(201).json(new ApiResponse(order));
  }),

  update: asyncHandler(async (req, res) => {
    const order = await orderService.update(req.params.id, req.body, req.user.id);
    res.json(new ApiResponse(order));
  }),

  delete: asyncHandler(async (req, res) => {
    await orderService.delete(req.params.id, req.user.id);
    res.json(new ApiResponse({ message: 'Order deleted successfully' }));
  }),
};