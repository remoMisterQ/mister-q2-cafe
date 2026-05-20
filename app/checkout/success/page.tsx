import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams?: Promise<{ session_id?: string; order?: string }> }) {
  const params = await searchParams;
  const supabase = createServiceClient();
  let order: any = null;

  if (supabase && (params?.session_id || params?.order)) {
    const query = supabase.from("orders").select("*, location:locations(*)").limit(1);
    const { data } = params.session_id
      ? await query.eq("stripe_session_id", params.session_id).maybeSingle()
      : await query.eq("id", params?.order).maybeSingle();
    order = data;
  }

  return (
    <main className="section-pad">
      <div className="container-page grid place-items-center">
        <Card className="max-w-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto text-green-700" size={46} />
            <h1 className="mt-4 text-3xl font-black text-espresso">Order confirmed</h1>
            <p className="mt-3 leading-7 text-stone-600">Thank you. Your pickup order has been sent to Mister Q Cafe. Payment can be handled at pickup until Stripe is activated.</p>
            <div className="my-6 grid gap-2 rounded-lg bg-cream p-4 text-left text-sm">
              <Detail label="Order number" value={order?.order_number || "Available after payment sync"} />
              <Detail label="Pickup location" value={order?.location?.name || "Selected cafe"} />
              <Detail label="Pickup time" value={order?.pickup_time || "Selected pickup time"} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {order?.order_number && (
                <Button asChild>
                  <Link href={`/order/status/${order.order_number}`}>Track order status</Link>
                </Button>
              )}
              <Button asChild variant="secondary">
                <Link href="/menu">Back to menu</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-stone-600">{label}</span>
      <strong className="text-espresso">{value}</strong>
    </div>
  );
}
