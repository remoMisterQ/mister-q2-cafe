"use client";

import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { currency } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const statuses: OrderStatus[] = ["New", "Preparing", "Ready", "Completed", "Cancelled"];

export function OrderTable({ orders }: { orders: any[] }) {
  const [rows, setRows] = useState(orders);
  const [open, setOpen] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function refreshOrders({ quiet = false } = {}) {
    if (!quiet) setRefreshing(true);
    const response = await fetch("/api/orders", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setRows(data.orders || []);
      setLastUpdated(new Date());
    }
    if (!quiet) setRefreshing(false);
  }

  useEffect(() => {
    const interval = window.setInterval(() => refreshOrders({ quiet: true }), 8000);
    return () => window.clearInterval(interval);
  }, []);

  async function updateStatus(id: string, order_status: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, order_status } : row)));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, order_status })
    });
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-3">
        <p className="text-sm font-semibold text-stone-600">
          Auto-refresh every 8 seconds{lastUpdated ? ` - updated ${lastUpdated.toLocaleTimeString()}` : ""}
        </p>
        <Button type="button" size="sm" variant="secondary" onClick={() => refreshOrders()} disabled={refreshing}>
          <RefreshCw size={15} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-cream text-espresso">
          <tr>
            <th className="p-3">Details</th>
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Location</th>
            <th className="p-3">Pickup</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <Fragment key={order.id}>
              <tr className="border-t border-stone-100 align-top">
                <td className="p-3">
                  <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(open === order.id ? null : order.id)}>
                    {open === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    View
                  </Button>
                </td>
                <td className="p-3 font-bold text-espresso">{order.order_number}</td>
                <td className="p-3">
                  <strong>{order.customer_name}</strong>
                  <p className="text-stone-600">{order.customer_email}</p>
                  <p className="text-stone-600">{order.customer_phone}</p>
                </td>
                <td className="p-3">{order.location?.name || order.location_id}</td>
                <td className="p-3">{order.pickup_time}</td>
                <td className="p-3">{order.payment_status}</td>
                <td className="p-3">{currency(order.total)}</td>
                <td className="p-3">
                  <Select value={order.order_status} onChange={(event) => updateStatus(order.id, event.target.value)}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </td>
              </tr>
              {open === order.id && (
                <tr className="border-t border-stone-100 bg-cream/45">
                  <td colSpan={8} className="p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_260px]">
                      <div className="rounded-lg bg-white p-4">
                        <h3 className="mb-3 font-black text-espresso">Items</h3>
                        <div className="grid gap-3">
                          {(order.order_items || []).map((item: any) => (
                            <div key={item.id} className="flex justify-between gap-4 border-b border-stone-100 pb-3">
                              <div>
                                <strong>{item.quantity} x {item.item_name}</strong>
                                {!!item.modifiers?.length && (
                                  <p className="mt-1 text-xs leading-5 text-stone-600">
                                    {item.modifiers.map((modifier: any) => `${modifier.group_name}: ${modifier.name}`).join(", ")}
                                  </p>
                                )}
                              </div>
                              <span>{currency(item.total_price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-4">
                        <h3 className="mb-3 font-black text-espresso">Order notes</h3>
                        <p className="min-h-12 text-sm text-stone-600">{order.notes || "No notes."}</p>
                        <div className="mt-4 grid gap-2 text-sm">
                          <Line label="Subtotal" value={order.subtotal} />
                          <Line label="Tax" value={order.tax} />
                          <Line label="Tip" value={order.tip} />
                          <Line label="Total" value={order.total} strong />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={8} className="p-8 text-center text-stone-600">
                No pickup orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "font-black text-espresso" : "text-stone-700"}`}>
      <span>{label}</span>
      <span>{currency(value)}</span>
    </div>
  );
}
