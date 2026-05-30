"use client";

import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import type { Customer } from "@/types/customer.types"

interface CustomerDetailsSheetProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsSheet({ customer, isOpen, onClose }: CustomerDetailsSheetProps) {
  if (!customer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="d-flex flex-column">
        <SheetHeader>
          <SheetTitle className="d-flex align-items-center gap-2">
            <User size={20} className="text-primary" />
            Customer Details
          </SheetTitle>
          <SheetDescription>
            View and manage customer information and order history.
          </SheetDescription>
        </SheetHeader>

        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
            style={{ width: 64, height: 64, fontSize: "1.5rem", fontWeight: "bold", color: "var(--bs-primary)" }}
          >
            {customer.name.charAt(0)}
          </div>
          <div>
            <h5 className="mb-0">{customer.name}</h5>
            <small className="text-muted">Customer ID: {customer.id}</small>
          </div>
        </div>

        <hr />

        <h6 className="text-muted text-uppercase small fw-semibold mb-3">Contact Information</h6>
        <div className="d-flex flex-column gap-2 mb-4">
          <div className="d-flex align-items-center gap-2">
            <Mail size={16} className="text-muted" />
            <span>{customer.email}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Phone size={16} className="text-muted" />
            <span>{customer.phone || "No phone provided"}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <MapPin size={16} className="text-muted" />
            <span>{customer.address || "No address provided"}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Calendar size={16} className="text-muted" />
            <span>Joined {format(new Date(customer.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>

        <hr />

        <h6 className="text-muted text-uppercase small fw-semibold mb-3">Account Summary</h6>
        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="border rounded p-3 bg-body">
              <div className="d-flex align-items-center gap-2 text-muted mb-2">
                <ShoppingBag size={16} />
                <small className="fw-medium">Total Orders</small>
              </div>
              <h4 className="mb-0">{customer.ordersCount || 0}</h4>
            </div>
          </div>
          <div className="col-6">
            <div className="border rounded p-3 bg-body">
              <small className="text-muted fw-medium">Total Spent</small>
              <h4 className="mb-0">${(customer.totalSpent || 0).toFixed(2)}</h4>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-auto">
          <Button variant="outline" className="flex-grow-1">
            <Edit size={16} className="me-2" /> Edit Customer
          </Button>
          <Button variant="destructive" className="flex-grow-1">
            <Trash2 size={16} className="me-2" /> Delete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}