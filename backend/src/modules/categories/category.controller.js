const categoryService = require('./category.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const categories = await categoryService.getAll();
    res.json(new ApiResponse(categories));
  }),

  getById: asyncHandler(async (req, res) => {
    const category = await categoryService.getById(req.params.id);
    res.json(new ApiResponse(category));
  }),

  create: asyncHandler(async (req, res) => {
    const category = await categoryService.create(req.body);
    res.status(201).json(new ApiResponse(category));
  }),

  update: asyncHandler(async (req, res) => {
    const category = await categoryService.update(req.params.id, req.body);
    res.json(new ApiResponse(category));
  }),

  delete: asyncHandler(async (req, res) => {
    await categoryService.delete(req.params.id);
    res.json(new ApiResponse({ message: 'Category deleted successfully' }));
  }),
};
