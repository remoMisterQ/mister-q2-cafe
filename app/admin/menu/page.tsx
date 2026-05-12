import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MenuForm } from "@/components/admin/menu-form";
import { MenuTable } from "@/components/admin/menu-table";
import { requireAdmin } from "@/lib/admin";
import { getCategories, getLocations, getMenuItems } from "@/lib/data";

export default async function AdminMenuPage() {
  await requireAdmin();
  const [items, categories, locations] = await Promise.all([getMenuItems(), getCategories(), getLocations()]);

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Admin</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Menu manager</h1>
          </div>
          <MenuForm categories={categories} locations={locations} />
          <MenuTable items={items} categories={categories} locations={locations} />
        </section>
      </div>
    </main>
  );
}
