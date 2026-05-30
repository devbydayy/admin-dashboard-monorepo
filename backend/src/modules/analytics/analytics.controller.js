const analyticsService = require('./analytics.service');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

module.exports = {
  getOverview: asyncHandler(async (req, res) => {
    const overview = await analyticsService.getOverview();
    res.json(new ApiResponse(overview));
  }),

  getSalesReport: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json(new ApiResponse(null, 400, 'Start and end dates are required'));
    }
    const report = await analyticsService.getSalesReport(startDate, endDate);
    res.json(new ApiResponse(report));
  }),

  getSnapshots: asyncHandler(async (req, res) => {
    const { period = 'daily', limit = 30 } = req.query;
    const snapshots = await analyticsService.getSnapshots(period, parseInt(limit));
    res.json(new ApiResponse(snapshots));
  }),
};