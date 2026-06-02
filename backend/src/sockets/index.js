const socketIo = require("socket.io");

let io = null;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://admin-dashboard-monorepo.vercel.app"
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

function emitNewOrder(order) {
  if (io) {
    io.emit("new-order", order);
  }
}

function emitOrderUpdate(orderId, status) {
  if (io) {
    io.emit("order-updated", { orderId, status });
  }
}

function emitAnalyticsUpdate(data) {
  if (io) {
    io.emit("analytics-update", data);
  }
}

module.exports = {
  initializeSocket,
  getIO,
  emitNewOrder,
  emitOrderUpdate,
  emitAnalyticsUpdate,
};
