const blogService = require('./blog.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const blogs = await blogService.getAll();
    res.json(new ApiResponse(blogs));
  }),

  getById: asyncHandler(async (req, res) => {
    const blog = await blogService.getById(req.params.id);
    res.json(new ApiResponse(blog));
  }),

  create: asyncHandler(async (req, res) => {
    const blog = await blogService.create(req.body, req.user.id);
    res.status(201).json(new ApiResponse(blog));
  }),

  update: asyncHandler(async (req, res) => {
    const blog = await blogService.update(req.params.id, req.body);
    res.json(new ApiResponse(blog));
  }),

  delete: asyncHandler(async (req, res) => {
    await blogService.delete(req.params.id);
    res.json(new ApiResponse({ message: 'Blog deleted successfully' }));
  }),
};
