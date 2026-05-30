const inventoryService = require("./inventory.service");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiResponse } = require("../../utils/ApiResponse");

module.exports = {
  getLowStockAlerts: asyncHandler(async (req, res) => {
    const threshold = parseInt(req.query.threshold) || 10;
    const alerts = await inventoryService.getLowStockAlerts(threshold);
    res.json(new ApiResponse(alerts));
  }),

  adjustStock: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { operation, amount } = req.body;
    const product = await inventoryService.adjustStock(id, { operation, amount });
    res.json(new ApiResponse(product));
  }),
};