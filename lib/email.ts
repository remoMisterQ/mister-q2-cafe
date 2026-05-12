import type { CartItem } from "@/types/menu";
import type { CustomerInfo } from "@/types/order";

export async function sendOrderConfirmationEmail({
  customer,
  orderNumber,
  pickupTime,
  items
}: {
  customer: CustomerInfo;
  orderNumber: string;
  pickupTime: string;
  items: CartItem[];
}) {
  // Placeholder email hook. Later this can call Resend, SendGrid, or Supabase Edge Functions.
  console.info("Order confirmation email queued", {
    to: customer.email,
    orderNumber,
    pickupTime,
    itemCount: items.length
  });
}
