const Bull = require('bull');
const notificationService = require('../services/notification.service');
const { getIO } = require('../sockets');

const orderQueue = new Bull('order-processing', {
  redis: { host: '127.0.0.1', port: 6379 },
});

orderQueue.process('send-shipment-notification', async (job) => {
  const { order } = job.data;
  console.log(`[QUEUE] Processing shipment notification for order ${order.orderNumber}`);
  try {
    await notificationService.sendShipmentEmail(order);
    await notificationService.sendShipmentSMS(order);
    console.log(`[QUEUE] Shipment notification completed for order ${order.orderNumber}`);

    const io = getIO();
    if (io) {
      io.emit('notification-sent', { orderId: order.id, success: true });
    }

    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    console.error(`[QUEUE] Failed shipment notification for order ${order.orderNumber}:`, error);
    throw error;
  }
});

orderQueue.on('completed', (job, result) => {
  console.log(`[QUEUE] Job ${job.id} completed for order ${result.orderNumber}`);
});

orderQueue.on('failed', (job, err) => {
  console.error(`[QUEUE] Job ${job.id} failed:`, err.message);
});

async function scheduleShipmentNotification(order) {
  await orderQueue.add('send-shipment-notification', { order });
  console.log(`[QUEUE] Shipment notification job enqueued for order ${order.orderNumber}`);
}

module.exports = { scheduleShipmentNotification, orderQueue };