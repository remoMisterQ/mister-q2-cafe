import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LocationForm } from "@/components/admin/location-form";
import { getLocations } from "@/lib/data";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLocationsPage() {
  await requireAdmin();
  const locations = await getLocations();

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section>
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Admin</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Locations</h1>
            <p className="mt-3 text-stone-600">Update address placeholders, hours, phone numbers, map embeds, and active status.</p>
          </div>
          <div className="grid gap-5">
            {locations.map((location) => (
              <LocationForm key={location.id} location={location} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
