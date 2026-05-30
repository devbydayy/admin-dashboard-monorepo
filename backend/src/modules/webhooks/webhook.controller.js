const webhookService = require("./webhook.service");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiResponse } = require("../../utils/ApiResponse");

module.exports = {
  handlePaymentWebhook: asyncHandler(async (req, res) => {
    const signature = req.headers["x-webhook-signature"];
    if (!signature || !webhookService.verifySignature(signature)) {
      return res.status(403).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const { orderId, transactionId, amount } = req.body;
    if (!orderId || !transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: orderId, transactionId, amount",
      });
    }

    const order = await webhookService.processPaymentWebhook({
      orderId,
      transactionId,
      amount,
    });

    res.status(200).json(new ApiResponse(order, "Payment processed successfully"));
  }),
};