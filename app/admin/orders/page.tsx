import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { OrderTable } from "@/components/admin/order-table";
import { requireAdmin } from "@/lib/admin";

export default async function AdminOrdersPage() {
  const supabase = await requireAdmin();
  const { data } = supabase
    ? await supabase.from("orders").select("*, location:locations(*), order_items(*)").order("created_at", { ascending: false }).limit(100)
    : { data: [] };

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Admin</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Pickup orders</h1>
          </div>
          <OrderTable orders={data || []} />
        </section>
      </div>
    </main>
  );
}
