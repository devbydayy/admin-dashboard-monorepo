class NotificationService {
  async sendShipmentEmail(order) {
    console.log(`[NOTIFICATION] ✉️ Sending shipment email for order ${order.orderNumber}`);
    console.log(`   To: ${order.customer?.email || 'customer@example.com'}`);
    console.log(`   Subject: Your order has shipped!`);
    console.log(`   Order ID: ${order.id}, Total: $${order.total.toFixed(2)}`);

    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`[NOTIFICATION] ✅ Shipment email sent successfully.`);
    return { sent: true, channel: 'email', orderId: order.id };
  }

  async sendShipmentSMS(order) {
    console.log(`[NOTIFICATION] 📱 Sending shipment SMS for order ${order.orderNumber}`);
    console.log(`   To: ${order.customer?.phone || '+1 000 000 0000'}`);
    console.log(`   Message: Your order ${order.orderNumber} has been shipped!`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`[NOTIFICATION] ✅ Shipment SMS sent successfully.`);
    return { sent: true, channel: 'sms', orderId: order.id };
  }
}

module.exports = new NotificationService();