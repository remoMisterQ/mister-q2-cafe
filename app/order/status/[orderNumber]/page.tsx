import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";

const statuses = ["New", "Preparing", "Ready", "Completed"];

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const supabase = createServiceClient();
  const { data: order } = supabase
    ? await supabase
        .from("orders")
        .select("*, location:locations(*), order_items(*)")
        .eq("order_number", decodeURIComponent(orderNumber))
        .maybeSingle()
    : { data: null };

  if (!order) {
    return (
      <main className="section-pad">
        <div className="container-page grid place-items-center">
          <Card className="max-w-xl">
            <CardContent className="p-8 text-center">
              <h1 className="text-3xl font-black text-espresso">Order not found</h1>
              <p className="mt-3 text-stone-600">Check the order number and try again.</p>
              <Button asChild className="mt-6">
                <Link href="/order">Back to order</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const activeIndex = Math.max(0, statuses.indexOf(order.order_status));

  return (
    <main className="section-pad">
      <div className="container-page max-w-3xl">
        <Card>
          <CardContent className="p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Order status</p>
            <h1 className="mt-2 text-3xl font-black text-espresso md:text-4xl">{order.order_number}</h1>
            <p className="mt-3 text-stone-600">
              Pickup at {order.location?.name || "Mister Q Cafe"} - {order.pickup_time}
            </p>

            <div className="my-8 grid gap-3 sm:grid-cols-4">
              {statuses.map((status, index) => {
                const done = index <= activeIndex && order.order_status !== "Cancelled";
                return (
                  <div key={status} className={`rounded-lg border p-4 ${done ? "border-green-200 bg-green-50" : "border-stone-200 bg-white"}`}>
                    {done ? <CheckCircle2 className="text-green-700" size={22} /> : <Clock className="text-stone-400" size={22} />}
                    <strong className="mt-3 block text-espresso">{status}</strong>
                  </div>
                );
              })}
            </div>

            {order.order_status === "Cancelled" && (
              <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 font-bold text-red-800">This order has been cancelled.</p>
            )}

            <div className="rounded-lg bg-cream p-4">
              <h2 className="mb-3 font-black text-espresso">Items</h2>
              <div className="grid gap-3">
                {(order.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex justify-between gap-4 border-b border-stone-200 pb-3 text-sm">
                    <div>
                      <strong>{item.quantity} x {item.item_name}</strong>
                      {!!item.modifiers?.length && (
                        <p className="mt-1 text-xs text-stone-600">
                          {item.modifiers.map((modifier: any) => `${modifier.group_name}: ${modifier.name}`).join(", ")}
                        </p>
                      )}
                      {item.item_comment && <p className="mt-1 text-xs font-semibold text-mocha">Comment: {item.item_comment}</p>}
                    </div>
                    <span>{currency(item.total_price)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between font-black text-espresso">
                <span>Total</span>
                <span>{currency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
