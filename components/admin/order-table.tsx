"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Printer, RefreshCw, Volume2 } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { currency } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const statuses: OrderStatus[] = ["New", "Preparing", "Ready", "Completed", "Cancelled"];
const activeStatuses: OrderStatus[] = ["New", "Preparing", "Ready"];

export function OrderTable({ orders }: { orders: any[] }) {
  const [rows, setRows] = useState(orders);
  const [open, setOpen] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newOrderNotice, setNewOrderNotice] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const seenOrderIds = useRef(new Set(orders.map((order) => order.id)));
  const locations = getOrderLocations(rows);
  const filteredRows = locationFilter === "all" ? rows : rows.filter((order) => order.location_id === locationFilter);
  const activeOrders = filteredRows.filter((order) => activeStatuses.includes(order.order_status));

  async function refreshOrders({ quiet = false } = {}) {
    if (!quiet) setRefreshing(true);
    const response = await fetch("/api/orders", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const nextOrders = data.orders || [];
      const newOrders = nextOrders.filter((order: any) => !seenOrderIds.current.has(order.id));
      if (newOrders.length) {
        newOrders.forEach((order: any) => seenOrderIds.current.add(order.id));
        setNewOrderNotice(`${newOrders.length} new order${newOrders.length === 1 ? "" : "s"} received`);
        playNewOrderSound();
      }
      setRows(nextOrders);
      setLastUpdated(new Date());
    }
    if (!quiet) setRefreshing(false);
  }

  function printTicket(order: any) {
    const items = (order.order_items || []).length
      ? (order.order_items || [])
          .map(
            (item: any) => `
          <li>
            <strong>${item.quantity} x ${item.item_name}</strong>
            ${item.modifiers?.length ? `<div>${item.modifiers.map((modifier: any) => `${modifier.group_name}: ${modifier.name}`).join(", ")}</div>` : ""}
            ${item.item_comment ? `<div><strong>Comment:</strong> ${item.item_comment}</div>` : ""}
          </li>
        `
          )
          .join("")
      : "<li>No line items saved for this order.</li>";
    const ticket = window.open("", "print-ticket", "width=420,height=720");
    if (!ticket) return;
    ticket.document.write(`
      <html>
        <head>
          <title>${order.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 18px; color: #111; }
            h1 { font-size: 22px; margin: 0 0 8px; }
            p { margin: 4px 0; }
            ul { padding-left: 18px; }
            li { margin: 12px 0; }
            .total { border-top: 1px solid #111; margin-top: 16px; padding-top: 12px; font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>Mister Q Cafe</h1>
          <p><strong>Order:</strong> ${order.order_number}</p>
          <p><strong>Status:</strong> ${order.order_status}</p>
          <p><strong>Pickup:</strong> ${order.pickup_time}</p>
          <p><strong>Location:</strong> ${order.location?.name || ""}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Notes:</strong> ${order.notes || "None"}</p>
          <ul>${items}</ul>
          <p class="total">Total: ${currency(order.total)}</p>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    ticket.document.close();
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
        <div>
          <p className="text-sm font-semibold text-stone-600">
            Auto-refresh every 8 seconds{lastUpdated ? ` - updated ${lastUpdated.toLocaleTimeString()}` : ""}
          </p>
          {newOrderNotice && (
            <p className="mt-1 flex items-center gap-2 text-sm font-black text-green-700">
              <Volume2 size={15} />
              {newOrderNotice}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} className="h-9 w-auto min-w-40">
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </Select>
          <Button type="button" size="sm" variant="secondary" onClick={() => refreshOrders()} disabled={refreshing}>
            <RefreshCw size={15} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      <KitchenBoard orders={activeOrders} onStatusChange={updateStatus} onPrint={printTicket} />
      <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-cream text-espresso">
          <tr>
            <th className="p-3">Details</th>
            <th className="p-3">Order</th>
            <th className="p-3">Date / Time</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Location</th>
            <th className="p-3">Pickup</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Print</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((order) => (
            <Fragment key={order.id}>
              <tr className={`border-t align-top ${rowTone(order.order_status)}`}>
                <td className="p-3">
                  <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(open === order.id ? null : order.id)}>
                    {open === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    View
                  </Button>
                </td>
                <td className="p-3 font-bold text-espresso">{order.order_number}</td>
                <td className="p-3 text-stone-700">{formatDateTime(order.created_at)}</td>
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
                <td className="p-3">
                  <Button type="button" size="sm" variant="secondary" onClick={() => printTicket(order)}>
                    <Printer size={15} />
                    Print
                  </Button>
                </td>
              </tr>
              {open === order.id && (
                <tr className="border-t border-stone-100 bg-cream/45">
                  <td colSpan={10} className="p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_260px]">
                      <div className="rounded-lg bg-white p-4">
                        <h3 className="mb-3 font-black text-espresso">Items</h3>
                        <div className="grid gap-3">
                          {(order.order_items || []).length ? (
                            (order.order_items || []).map((item: any) => (
                              <div key={item.id} className="flex justify-between gap-4 border-b border-stone-100 pb-3">
                                <div>
                                  <strong>{item.quantity} x {item.item_name}</strong>
                                  {!!item.modifiers?.length && (
                                    <p className="mt-1 text-xs leading-5 text-stone-600">
                                      {item.modifiers.map((modifier: any) => `${modifier.group_name}: ${modifier.name}`).join(", ")}
                                    </p>
                                  )}
                                  {item.item_comment && <p className="mt-1 text-xs font-semibold leading-5 text-mocha">Comment: {item.item_comment}</p>}
                                </div>
                                <span>{currency(item.total_price)}</span>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-lg border border-dashed border-stone-200 p-4 text-sm text-stone-600">
                              No line items are saved for this order yet. If this is an older test order, submit a new checkout after the latest database update.
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-4">
                        <h3 className="mb-3 font-black text-espresso">Order notes</h3>
                        <p className="min-h-12 text-sm text-stone-600">{order.notes || "No notes."}</p>
                        <div className="mt-4 grid gap-2 text-sm">
                          <Line label="Subtotal" value={order.subtotal} />
                          {!!Number(order.discount_amount || 0) && <Line label={`Discount${order.discount_code ? ` (${order.discount_code})` : ""}`} value={-Number(order.discount_amount)} />}
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
          {!filteredRows.length && (
            <tr>
              <td colSpan={10} className="p-8 text-center text-stone-600">
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

function KitchenBoard({
  orders,
  onStatusChange,
  onPrint
}: {
  orders: any[];
  onStatusChange: (id: string, status: string) => void;
  onPrint: (order: any) => void;
}) {
  return (
    <div className="border-b border-stone-100 bg-cream/35 p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-mocha">Kitchen board</p>
          <h2 className="text-xl font-black text-espresso">Active pickup queue</h2>
        </div>
        <p className="text-sm font-semibold text-stone-600">{orders.length} active order{orders.length === 1 ? "" : "s"}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {activeStatuses.map((status) => {
          const statusOrders = orders.filter((order) => order.order_status === status);
          return (
            <div key={status} className="rounded-lg border border-stone-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${badgeTone(status)}`}>{status}</span>
                <span className="text-xs font-bold text-stone-500">{statusOrders.length}</span>
              </div>
              <div className="grid gap-2">
                {statusOrders.slice(0, 6).map((order) => (
                  <div key={order.id} className={`rounded-lg border p-3 ${cardTone(order.order_status)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <strong className="text-espresso">{order.order_number}</strong>
                        <p className="mt-1 text-xs font-semibold text-stone-700">{order.customer_name}</p>
                        <p className="text-xs text-stone-600">{order.location?.name || "Location"} - {order.pickup_time}</p>
                      </div>
                      <strong className="text-sm text-espresso">{currency(order.total)}</strong>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {status !== "Preparing" && (
                        <Button type="button" size="sm" variant="secondary" onClick={() => onStatusChange(order.id, "Preparing")}>
                          Preparing
                        </Button>
                      )}
                      {status !== "Ready" && (
                        <Button type="button" size="sm" variant="secondary" onClick={() => onStatusChange(order.id, "Ready")}>
                          Ready
                        </Button>
                      )}
                      <Button type="button" size="sm" variant="secondary" onClick={() => onPrint(order)}>
                        <Printer size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                {!statusOrders.length && <p className="rounded-lg border border-dashed border-stone-200 p-4 text-center text-xs text-stone-500">Empty</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function playNewOrderSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  } catch {
    // Browser audio may be blocked until the admin interacts with the page.
  }
}

function getOrderLocations(orders: any[]) {
  const map = new Map<string, string>();
  for (const order of orders) {
    if (order.location_id) map.set(order.location_id, order.location?.name || order.location_id);
  }
  return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function rowTone(status: OrderStatus) {
  if (status === "New") return "border-red-200 bg-red-50/95";
  if (status === "Preparing") return "border-amber-200 bg-amber-50/80";
  if (status === "Ready") return "border-blue-200 bg-blue-50/80";
  if (status === "Completed") return "border-green-200 bg-green-50/90";
  if (status === "Cancelled") return "border-stone-200 bg-stone-100 text-stone-500";
  return "border-stone-100";
}

function badgeTone(status: OrderStatus) {
  if (status === "New") return "bg-red-100 text-red-800";
  if (status === "Preparing") return "bg-amber-100 text-amber-800";
  if (status === "Ready") return "bg-blue-100 text-blue-800";
  if (status === "Completed") return "bg-green-100 text-green-800";
  return "bg-stone-100 text-stone-700";
}

function cardTone(status: OrderStatus) {
  if (status === "New") return "border-red-200 bg-red-50";
  if (status === "Preparing") return "border-amber-200 bg-amber-50";
  if (status === "Ready") return "border-blue-200 bg-blue-50";
  return "border-stone-200 bg-white";
}

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "font-black text-espresso" : "text-stone-700"}`}>
      <span>{label}</span>
      <span>{currency(value)}</span>
    </div>
  );
}
