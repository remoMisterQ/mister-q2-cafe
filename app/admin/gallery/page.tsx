import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { requireAdmin } from "@/lib/admin";

export default async function AdminGalleryPage() {
  const supabase = await requireAdmin();
  const { data } = supabase
    ? await supabase.from("gallery_images").select("*").order("sort_order")
    : { data: [] };

  return (
    <main className="section-pad">
      <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="grid gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Admin</p>
            <h1 className="mt-2 text-4xl font-black text-espresso">Photo gallery</h1>
            <p className="mt-3 max-w-2xl text-stone-600">Upload, replace, hide, and reorder the photos shown on the homepage gallery.</p>
          </div>
          <GalleryManager images={data || []} />
        </section>
      </div>
    </main>
  );
}
