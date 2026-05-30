
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket() {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}

export function joinAdminRoom() {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit("join-admin");
  }
}

export function joinUserRoom(userId: string) {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit("join-user-room", userId);
  }
}

export function onNewOrder(callback: (order: any) => void) {
  const socket = getSocket();
  socket.on("new-order", callback);
  return () => socket.off("new-order", callback);
}

export function onOrderUpdated(callback: (data: { orderId: string; status: string }) => void) {
  const socket = getSocket();
  socket.on("order-updated", callback);
  return () => socket.off("order-updated", callback);
}

export function onProductUpdated(callback: (product: any) => void) {
  const socket = getSocket();
  socket.on("product-updated", callback);
  return () => socket.off("product-updated", callback);
}