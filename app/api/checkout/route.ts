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
  if (!/^\d+$/.test(payload.customer.phone)) {
    return NextResponse.json({ error: "Phone number can contain numbers only." }, { status: 400 });
  }
  if (payload.cart.some((item) => !item.available || item.quantity < 1)) {
    return NextResponse.json({ error: "Sold out items cannot be checked out." }, { status: 400 });
  }

  const subtotal = roundMoney(payload.cart.reduce((sum, item) => sum + cartItemTotal(item), 0));
  const discount = await getDiscount(supabase, payload.discountCode, subtotal);
  if (discount.error) return NextResponse.json({ error: discount.error }, { status: 400 });
  const taxableSubtotal = roundMoney(Math.max(0, subtotal - discount.amount));
  const tax = calculateTax(taxableSubtotal);
  const tip = roundMoney(Number(payload.tip || 0));
  const total = roundMoney(taxableSubtotal + tax + tip);

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
      discount_code: discount.code,
      discount_amount: discount.amount,
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
      modifiers: item.selected_modifiers || [],
      item_comment: item.item_comment || ""
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

async function getDiscount(supabase: NonNullable<ReturnType<typeof createServiceClient>>, discountCode: string | undefined, subtotal: number) {
  const code = discountCode?.trim().toUpperCase();
  if (!code) return { amount: 0, code: null as string | null };

  const { data, error } = await supabase.from("discount_codes").select("*").eq("code", code).eq("active", true).maybeSingle();
  if (error) return { amount: 0, code: null as string | null, error: error.message };
  if (!data) return { amount: 0, code: null as string | null, error: "Discount code was not found or is inactive." };

  const now = Date.now();
  if (data.starts_at && new Date(data.starts_at).getTime() > now) return { amount: 0, code: null as string | null, error: "Discount code is not active yet." };
  if (data.expires_at && new Date(data.expires_at).getTime() < now) return { amount: 0, code: null as string | null, error: "Discount code has expired." };

  const rawAmount = data.type === "percent" ? subtotal * (Number(data.value) / 100) : Number(data.value);
  return { amount: roundMoney(Math.min(subtotal, rawAmount)), code };
}
