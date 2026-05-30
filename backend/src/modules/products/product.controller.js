const productService = require('./product.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const products = await productService.getAll();
    res.json(new ApiResponse(products));
  }),

  getById: asyncHandler(async (req, res) => {
    const product = await productService.getById(req.params.id);
    res.json(new ApiResponse(product));
  }),

  create: asyncHandler(async (req, res) => {
    const product = await productService.create(req.body, req.user.id);
    res.status(201).json(new ApiResponse(product));
  }),

  update: asyncHandler(async (req, res) => {
    const product = await productService.update(req.params.id, req.body);
    res.json(new ApiResponse(product));
  }),

  delete: asyncHandler(async (req, res) => {
    await productService.delete(req.params.id);
    res.json(new ApiResponse({ message: 'Product deleted successfully' }));
  }),
};
