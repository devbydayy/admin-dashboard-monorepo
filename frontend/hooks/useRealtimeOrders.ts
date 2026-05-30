"use client"
import { useEffect, useState } from "react";
import { getSocket, connectSocket, joinAdminRoom, onNewOrder, onOrderUpdated } from "@/lib/socket";
import type { Order } from "@/types/order.types";

export const useRealtimeOrders = () => {
  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const [orderUpdate, setOrderUpdate] = useState<{ orderId: string; status: string } | null>(null);

  useEffect(() => {
    connectSocket();
    joinAdminRoom();

    const unsubscribeNewOrder = onNewOrder((order) => {
      setNewOrder(order);
      setTimeout(() => setNewOrder(null), 5000);
    });

    const unsubscribeOrderUpdate = onOrderUpdated((update) => {
      setOrderUpdate(update);
      setTimeout(() => setOrderUpdate(null), 5000);
    });

    return () => {
      unsubscribeNewOrder();
      unsubscribeOrderUpdate();
    };
  }, []);

  return { newOrder, orderUpdate };
};

export const useRealtimeOrderCount = () => {
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    connectSocket();
    joinAdminRoom();

    const socket = getSocket();

    const handleOrderCount = (count: number) => {
      setOrderCount(count);
    };

    socket.on("order-count", handleOrderCount);

    return () => {
      socket.off("order-count", handleOrderCount);
    };
  }, []);

  return orderCount;
};
