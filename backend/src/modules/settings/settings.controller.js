const settingsService = require("./settings.service");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiResponse } = require("../../utils/ApiResponse");

module.exports = {
  get: asyncHandler(async (req, res) => {
    const settings = await settingsService.get();
    res.json(new ApiResponse(settings));
  }),

  update: asyncHandler(async (req, res) => {
    const updated = await settingsService.update(req.body);
    res.json(new ApiResponse(updated));
  }),
};