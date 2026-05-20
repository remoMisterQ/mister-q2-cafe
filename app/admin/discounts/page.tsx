import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DiscountManager } from "@/components/admin/discount-manager";
import { requireAdmin } from "@/lib/admin";

export default async function AdminDiscountsPage() {
  const supabase = await requireAdmin();
  const { data } = supabase
    ? await supabase.from("discount_codes").select("*").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Admin</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Discount codes</h1>
            <p className="mt-3 max-w-2xl text-stone-600">Create percentage or dollar-off pickup promos and turn them on or off from one place.</p>
          </div>
          <DiscountManager discounts={data || []} />
        </section>
      </div>
    </main>
  );
}
