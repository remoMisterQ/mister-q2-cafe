import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import { getLocations, getMenuItems } from "@/lib/data";

export default async function AdminPage() {
  const supabase = await requireAdmin();
  const [items, locations] = await Promise.all([getMenuItems(), getLocations()]);
  const { count } = supabase
    ? await supabase.from("orders").select("*", { count: "exact", head: true })
    : { count: 0 };

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Mister Q Cafe</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Admin dashboard</h1>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Metric label="Menu items" value={items.length} />
            <Metric label="Locations" value={locations.length} />
            <Metric label="Orders" value={count || 0} />
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
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">{label}</p>
        <strong className="mt-2 block text-4xl text-espresso">{value}</strong>
      </CardContent>
    </Card>
  );
}
