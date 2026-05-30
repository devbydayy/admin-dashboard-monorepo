const { prisma } = require("../../db/prisma");
const { ApiError } = require("../../utils/ApiError");
const config = require("../../config");

class WebhookService {
  verifySignature(signature) {
    return signature === config.webhookSecret;
  }

  async processPaymentWebhook({ orderId, transactionId, amount }) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });
    if (!order) throw new ApiError(404, "Order not found");

    const allowedStatuses = ["PENDING"];
    if (!allowedStatuses.includes(order.status)) {
      throw new ApiError(400, `Order is already ${order.status}, cannot mark as paid`);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    await prisma.auditLog.create({
      data: {
        action: "Webhook",
        entity: `Order ${order.orderNumber}`,
        details: `Payment received via webhook. Transaction: ${transactionId}, Amount: $${amount}`,
        userId: order.createdById || null,
      },
    });

    return updated;
  }
}

module.exports = new WebhookService();