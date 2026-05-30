const customerService = require('./customers.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const customers = await customerService.getAll();
    res.json(new ApiResponse(customers));
  }),

  getById: asyncHandler(async (req, res) => {
    const customer = await customerService.getById(req.params.id);
    res.json(new ApiResponse(customer));
  }),

  create: asyncHandler(async (req, res) => {
    const customer = await customerService.create(req.body, req.user.id);
    res.status(201).json(new ApiResponse(customer));
  }),

  update: asyncHandler(async (req, res) => {
    const customer = await customerService.update(req.params.id, req.body);
    res.json(new ApiResponse(customer));
  }),

  delete: asyncHandler(async (req, res) => {
    await customerService.delete(req.params.id);
    res.json(new ApiResponse({ message: 'Customer deleted successfully' }));
  }),
};
