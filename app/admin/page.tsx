import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import { getLocations, getMenuItems } from "@/lib/data";

export default async function AdminPage({ searchParams }: { searchParams?: Promise<{ location?: string; date?: string; chartFrom?: string; chartTo?: string }> }) {
  const supabase = await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const [items, locations] = await Promise.all([getMenuItems(), getLocations()]);
  const [{ data: orders }] = supabase
    ? await Promise.all([
        supabase.from("orders").select("*, location:locations(*), order_items(*)").order("created_at", { ascending: false }).limit(200)
      ])
    : [{ data: [] }];

  const selectedLocation = params.location || "all";
  const selectedDate = params.date || getTodayKey();
  const defaultRange = getCurrentMonthRange();
  const chartFrom = params.chartFrom || defaultRange.from;
  const chartTo = params.chartTo || defaultRange.to;
  const allOrders = orders || [];
  const filteredOrders = selectedLocation === "all" ? allOrders : allOrders.filter((order) => order.location_id === selectedLocation);
  const dashboard = buildDashboardData(filteredOrders, selectedDate);
  const chartLocationOrders = selectedLocation === "all" ? allOrders : allOrders.filter((order) => order.location_id === selectedLocation);
  const revenueDashboard = buildDashboardData(filterOrdersByDateRange(allOrders, chartFrom, chartTo));
  const productDashboard = buildDashboardData(filterOrdersByDateRange(chartLocationOrders, chartFrom, chartTo));
  const selectedLocationName = selectedLocation === "all" ? "All locations" : locations.find((location) => location.id === selectedLocation)?.name || "Selected location";

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Mister Q Cafe</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Admin dashboard</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">Sales filter</p>
                <h2 className="mt-1 text-2xl font-black text-espresso">{selectedLocationName}</h2>
                <p className="mt-2 text-sm text-stone-600">Choose a location and date to see sales, orders, total money, and average ticket.</p>
              </div>
              <form className="flex flex-wrap gap-2" action="/admin" method="get">
                <select name="location" defaultValue={selectedLocation} className="h-11 min-w-48 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-espresso focus-ring">
                  <option value="all">All locations</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <input
                  name="date"
                  type="date"
                  defaultValue={selectedDate}
                  className="h-11 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-espresso focus-ring"
                />
                <Button type="submit">Apply</Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid gap-5 md:grid-cols-4">
            <Metric label="Sales selected day" value={dashboard.daySales} money />
            <Metric label="Orders selected day" value={dashboard.dayOrders} />
            <Metric label="Total money selected day" value={dashboard.daySales} money />
            <Metric label="Average selected day" value={dashboard.dayAverageTicket} money />
          </div>
          <Card>
            <CardContent className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">Chart date range</p>
                <h2 className="mt-1 text-2xl font-black text-espresso">Revenue and top products</h2>
                <p className="mt-2 text-sm text-stone-600">Default range is the first day through the last day of the current month.</p>
              </div>
              <form className="flex flex-wrap gap-2" action="/admin" method="get">
                <input type="hidden" name="location" value={selectedLocation} />
                <input type="hidden" name="date" value={selectedDate} />
                <input
                  name="chartFrom"
                  type="date"
                  defaultValue={chartFrom}
                  className="h-11 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-espresso focus-ring"
                  aria-label="Chart start date"
                />
                <input
                  name="chartTo"
                  type="date"
                  defaultValue={chartTo}
                  className="h-11 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-espresso focus-ring"
                  aria-label="Chart end date"
                />
                <Button type="submit">Apply range</Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Revenue by location" rows={revenueDashboard.locationRows} valuePrefix="$" />
            <ChartCard title="Top products" rows={productDashboard.productRows} />
          </div>
          {!supabase && (
            <Card>
              <CardContent>
                <h2 className="text-xl font-black text-espresso">Connect Supabase</h2>
                <p className="mt-2 text-stone-600">Add environment variables to activate auth, database writes, storage uploads, and live orders.</p>
              </CardContent>
            </Card>
          )}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/menu">Manage menu</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/orders">View orders</Link>
            </Button>
          </div>
          <Card>
            <CardContent>
              <h2 className="text-xl font-black text-espresso">Loyalty / rewards</h2>
              <p className="mt-2 text-sm text-stone-600">Simple repeat-customer view based on pickup phone number. Every 10 orders can earn a reward.</p>
              <div className="mt-5 grid gap-3">
                {dashboard.loyaltyRows.length ? (
                  dashboard.loyaltyRows.map((row) => (
                    <div key={row.phone} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-100 p-3">
                      <div>
                        <strong className="text-espresso">{row.name}</strong>
                        <p className="text-sm text-stone-600">{row.phone} - {row.orders} order{row.orders === 1 ? "" : "s"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${row.earned ? "bg-green-100 text-green-800" : "bg-cream text-mocha"}`}>
                        {row.earned ? "Reward earned" : `${row.remaining} until reward`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-600">No repeat-customer data yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, money = false }: { label: string; value: number; money?: boolean }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">{label}</p>
        <strong className="mt-2 block text-4xl text-espresso">{money ? `$${value.toFixed(2)}` : value}</strong>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, rows, valuePrefix = "" }: { title: string; rows: { label: string; value: number }[]; valuePrefix?: string }) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-black text-espresso">{title}</h2>
        <div className="mt-5 grid gap-4">
          {rows.length ? (
            rows.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between gap-4 text-sm">
                  <span className="font-bold text-espresso">{row.label}</span>
                  <span className="text-stone-600">
                    {valuePrefix}
                    {valuePrefix ? row.value.toFixed(2) : row.value}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-lg bg-cream">
                  <div className="h-full rounded-lg bg-mocha" style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-600">No order data yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function buildDashboardData(orders: any[], selectedDate = getTodayKey()) {
  const dayOrders = orders.filter((order) => getDateKey(order.created_at) === selectedDate);
  const daySales = dayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const averageTicket = orders.length ? totalSales / orders.length : 0;
  const dayAverageTicket = dayOrders.length ? daySales / dayOrders.length : 0;

  const byLocation = new Map<string, number>();
  const byProduct = new Map<string, number>();
  const byCustomer = new Map<string, { name: string; phone: string; orders: number }>();

  for (const order of orders) {
    const location = order.location?.name || "Unknown";
    byLocation.set(location, (byLocation.get(location) || 0) + Number(order.total || 0));
    if (order.customer_phone) {
      const existing = byCustomer.get(order.customer_phone) || { name: order.customer_name || "Customer", phone: order.customer_phone, orders: 0 };
      existing.orders += 1;
      byCustomer.set(order.customer_phone, existing);
    }
    for (const item of order.order_items || []) {
      byProduct.set(item.item_name, (byProduct.get(item.item_name) || 0) + Number(item.quantity || 0));
    }
  }

  return {
    daySales,
    dayOrders: dayOrders.length,
    dayAverageTicket,
    totalSales,
    averageTicket,
    locationRows: Array.from(byLocation, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 5),
    productRows: Array.from(byProduct, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 5),
    loyaltyRows: Array.from(byCustomer.values())
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 6)
      .map((customer) => ({
        ...customer,
        earned: customer.orders >= 10 && customer.orders % 10 === 0,
        remaining: 10 - (customer.orders % 10 || 10)
      }))
  };
}

function getTodayKey() {
  return getDateKey(new Date().toISOString());
}

function getCurrentMonthRange() {
  const today = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit"
  }).formatToParts(today);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const lastDay = new Date(year, month, 0).getDate();
  return {
    from: `${year}-${String(month).padStart(2, "0")}-01`,
    to: `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  };
}

function filterOrdersByDateRange(orders: any[], from: string, to: string) {
  return orders.filter((order) => {
    const key = getDateKey(order.created_at);
    return key >= from && key <= to;
  });
}

function getDateKey(value?: string) {
  const date = value ? new Date(value) : new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}
