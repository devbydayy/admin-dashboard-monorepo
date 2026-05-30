"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Printer, Download, Loader2, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrder, useUpdateOrder } from "@/hooks/useOrders";
import { useSocket } from "@/providers/SocketProvider";
import type { OrderStatus } from "@/types/order.types";

const STATUS_OPTIONS = [
  "PENDING", "PAID", "PROCESSING", "SHIPPED",
  "DELIVERED", "COMPLETED", "CANCELLED",
] as const;

const statusBadgeClass: Record<string, string> = {
  PENDING:    "sa-badge-pending",
  PAID:       "sa-badge-paid",
  PROCESSING: "sa-badge-processing",
  SHIPPED:    "sa-badge-shipped",
  DELIVERED:  "sa-badge-delivered",
  COMPLETED:  "sa-badge-completed",
  CANCELLED:  "sa-badge-cancelled",
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: order, isLoading, error } = useOrder(id);
  const updateOrder = useUpdateOrder();
  const socket = useSocket();

  const [changingStatus, setChangingStatus] = useState(false);
  const [notificationState, setNotificationState] = useState<"idle" | "sending" | "sent">("idle");
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (!socket) return;
    const handleNotificationSent = (data: { orderId: string; success: boolean }) => {
      if (data.orderId === id && data.success) {
        setNotificationState("sent");
        setTimeout(() => setNotificationState("idle"), 5000);
      }
    };
    socket.on("notification-sent", handleNotificationSent);
    return () => {
      socket.off("notification-sent", handleNotificationSent);
    };
  }, [socket, id]);

  const handleStatusChange = (newStatus: string) => {
    if (!id || newStatus === order?.status) return;
    setChangingStatus(true);
    if (newStatus === "SHIPPED") setNotificationState("sending");
    updateOrder.mutate(
      { id, data: { status: newStatus as OrderStatus } },
      { onSettled: () => setChangingStatus(false) }
    );
  };

  const handleSimulatePayment = async () => {
    if (!id) return;
    setSimulatingPayment(true);
    setPaymentResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-signature": "whsec_demo_secret_key_change_me",
        },
        body: JSON.stringify({
          orderId: id,
          transactionId: `txn_sim_${Date.now()}`,
          amount: order?.total ?? 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentResult("success");
        window.location.reload();
      } else {
        setPaymentResult("error");
      }
    } catch {
      setPaymentResult("error");
    } finally {
      setSimulatingPayment(false);
    }
  };

  if (isLoading) return <div className="text-center py-5 text-muted">Loading order...</div>;
  if (error || !order) return <div className="text-center py-5 text-danger">Failed to load order.</div>;

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <Link
            href="/orders"
            className="p-2 rounded-circle"
            style={{
              transition: "background-color 0.15s",
              color: "var(--sa-text-secondary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sa-slate-100)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: "var(--sa-text-primary)" }}>
            Order {order.orderNumber}
          </h1>
          <span className={`sa-badge ${statusBadgeClass[order.status] ?? ""}`}>
            {order.status}
          </span>
        </div>
        <div className="d-flex gap-2">
          <button className="sa-datepicker-btn p-2">
            <Printer size={16} />
          </button>
          <button className="btn btn-indigo d-inline-flex align-items-center gap-2">
            <Download size={16} /> Invoice
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-8">
          <div
            className="card mb-4"
            style={{
              backgroundColor: "var(--sa-card-bg)",
              border: "1px solid var(--sa-slate-200)",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body" style={{ padding: "1.5rem" }}>
              <h2 className="fw-semibold mb-4" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                Order Items
              </h2>
              <div className="d-flex flex-column gap-0">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{ borderBottom: "1px solid var(--sa-slate-200)" }}
                  >
                    <div>
                      <p className="mb-0 fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                        {item.product?.name ?? "Unknown Product"}
                      </p>
                      <p className="mb-0" style={{ fontSize: "0.875rem", color: "var(--sa-text-muted)" }}>
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="d-flex justify-content-between align-items-center mt-3 pt-3"
                style={{ borderTop: "1px solid var(--sa-slate-200)" }}
              >
                <span className="fw-bold" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                  Total
                </span>
                <span className="fw-bold" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div
            className="card mb-4"
            style={{
              backgroundColor: "var(--sa-card-bg)",
              border: "1px solid var(--sa-slate-200)",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body" style={{ padding: "1.5rem" }}>
              <h2 className="fw-semibold mb-4" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                Change Status
              </h2>
              <div className="d-flex align-items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={changingStatus}
                  className="form-select"
                  style={{
                    width: "auto",
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    padding: "0.5rem 0.75rem",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {changingStatus && <Loader2 size={16} className="text-primary animate-spin" />}
              </div>

              {notificationState === "sending" && (
                <p className="mt-3 mb-0 d-flex align-items-center gap-2" style={{ color: "var(--sa-blue)", fontSize: "0.875rem" }}>
                  <Loader2 size={14} className="animate-spin" /> Sending notification…
                </p>
              )}
              {notificationState === "sent" && (
                <p className="mt-3 mb-0 d-flex align-items-center gap-2" style={{ color: "var(--sa-green)", fontSize: "0.875rem" }}>
                  <CheckCircle size={14} /> Notification sent!
                </p>
              )}
            </div>
          </div>

          {order.status === "PENDING" && (
            <div
              className="card"
              style={{
                backgroundColor: "var(--sa-card-bg)",
                border: "1px solid var(--sa-slate-200)",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="card-body" style={{ padding: "1.5rem" }}>
                <h2 className="fw-semibold mb-3" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                  Simulate Payment
                </h2>
                <p className="mb-3" style={{ fontSize: "0.875rem", color: "var(--sa-text-secondary)" }}>
                  This will call a simulated Stripe webhook and mark the order as PAID.
                </p>
                <button
                  onClick={handleSimulatePayment}
                  disabled={simulatingPayment}
                  className="btn d-inline-flex align-items-center gap-2"
                  style={{
                    backgroundColor: "var(--sa-blue-600)",
                    color: "#fff",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    padding: "0.5rem 1rem",
                    border: "none",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!simulatingPayment) {
                      e.currentTarget.style.backgroundColor = "var(--sa-blue-700)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!simulatingPayment) {
                      e.currentTarget.style.backgroundColor = "var(--sa-blue-600)";
                    }
                  }}
                >
                  {simulatingPayment ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Simulate Payment
                    </>
                  )}
                </button>
                {paymentResult === "success" && (
                  <p className="mt-3 mb-0" style={{ color: "var(--sa-green)", fontSize: "0.875rem" }}>
                    ✅ Payment successful! Order is now PAID.
                  </p>
                )}
                {paymentResult === "error" && (
                  <p className="mt-3 mb-0 text-danger" style={{ fontSize: "0.875rem" }}>
                    Payment simulation failed.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="col-12 col-md-4">
          <div
            className="card"
            style={{
              backgroundColor: "var(--sa-card-bg)",
              border: "1px solid var(--sa-slate-200)",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body" style={{ padding: "1.5rem" }}>
              <h2 className="fw-semibold mb-4" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                Customer
              </h2>
              <div className="d-flex flex-column gap-3" style={{ fontSize: "0.875rem" }}>
                <div>
                  <p className="mb-1" style={{ fontSize: "0.8125rem", color: "var(--sa-text-muted)" }}>
                    Name
                  </p>
                  <p className="mb-0 fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                    {order.customer?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="mb-1" style={{ fontSize: "0.8125rem", color: "var(--sa-text-muted)" }}>
                    Email
                  </p>
                  <p className="mb-0 fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                    {order.customer?.email ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="mb-1" style={{ fontSize: "0.8125rem", color: "var(--sa-text-muted)" }}>
                    Phone
                  </p>
                  <p className="mb-0 fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                    {order.customer?.phone ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="mb-1" style={{ fontSize: "0.8125rem", color: "var(--sa-text-muted)" }}>
                    Address
                  </p>
                  <p className="mb-0 fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                    {order.customer?.address ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}