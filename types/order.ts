import type { CartItem } from "./menu";

export type OrderStatus = "New" | "Preparing" | "Ready" | "Completed" | "Cancelled";

export type PickupTime = "ASAP - 15 min" | "30 min" | "45 min" | string;

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  notes?: string;
};

export type Order = {
  id: string;
  order_number: string;
  location_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_time: string;
  notes: string | null;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  discount_code?: string | null;
  discount_amount?: number;
  stripe_session_id: string | null;
  payment_status: string;
  order_status: OrderStatus;
  created_at?: string;
};

export type CheckoutPayload = {
  locationId: string;
  pickupTime: string;
  customer: CustomerInfo;
  cart: CartItem[];
  tip: number;
  discountCode?: string;
};
