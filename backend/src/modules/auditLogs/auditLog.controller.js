const auditLogService = require("./auditLog.service");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiResponse } = require("../../utils/ApiResponse");

module.exports = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, action, entity, search, startDate, endDate } = req.query;
    const result = await auditLogService.list({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      action,
      entity,
      search,
      startDate,
      endDate,
    });
    res.json(new ApiResponse(result));
  }),
};