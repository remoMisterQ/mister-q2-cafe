import { NextRequest, NextResponse } from "next/server";
import { calculateTax, roundMoney } from "@/lib/tax";
import { createServiceClient } from "@/lib/supabase/server";
import { makeOrderNumber } from "@/lib/utils";
import type { CheckoutPayload } from "@/types/order";
import { cartItemTotal, cartItemUnitPrice } from "@/lib/cart";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CheckoutPayload;
  const supabase = createServiceClient();

  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!payload.locationId) return NextResponse.json({ error: "Choose a pickup location." }, { status: 400 });
  if (!payload.pickupTime) return NextResponse.json({ error: "Choose a pickup time." }, { status: 400 });
  if (!payload.cart?.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  if (!payload.customer?.name || !payload.customer?.email || !payload.customer?.phone) {
    return NextResponse.json({ error: "Customer name, email, and phone are required." }, { status: 400 });
  }
  if (payload.cart.some((item) => !item.available || item.quantity < 1)) {
    return NextResponse.json({ error: "Sold out items cannot be checked out." }, { status: 400 });
  }

  const subtotal = roundMoney(payload.cart.reduce((sum, item) => sum + cartItemTotal(item), 0));
  const tax = calculateTax(subtotal);
  const tip = roundMoney(Number(payload.tip || 0));
  const total = roundMoney(subtotal + tax + tip);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: makeOrderNumber(),
      location_id: payload.locationId,
      customer_name: payload.customer.name,
      customer_email: payload.customer.email,
      customer_phone: payload.customer.phone,
      pickup_time: payload.pickupTime,
      notes: payload.customer.notes || "",
      subtotal,
      tax,
      tip,
      total,
      payment_status: "pay_at_pickup",
      order_status: "New"
    })
    .select("id, order_number")
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const { error: itemsError } = await supabase.from("order_items").insert(
    payload.cart.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      unit_price: cartItemUnitPrice(item),
      total_price: cartItemTotal(item),
      modifiers: item.selected_modifiers || []
    }))
  );
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  await sendOrderConfirmationEmail({
    customer: payload.customer,
    orderNumber: order.order_number,
    pickupTime: payload.pickupTime,
    items: payload.cart
  });

  return NextResponse.json({ url: `${siteUrl}/checkout/success?order=${order.id}` });
}
