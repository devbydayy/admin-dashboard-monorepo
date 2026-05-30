const path = require('path');
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

module.exports = {
  uploadProductImage: asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const url = `/uploads/products/${req.file.filename}`;
    res.status(201).json(new ApiResponse({ url, filename: req.file.filename }));
  }),
};