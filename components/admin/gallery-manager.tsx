"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
  active: boolean;
};

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(formData: FormData) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/gallery", {
      method: editing ? "PUT" : "POST",
      body: formData
    });
    const data = await response.json();
    setSaving(false);
    setMessage(response.ok ? "Gallery image saved." : data.error || "Unable to save gallery image.");
    if (response.ok) window.location.reload();
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery image?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="grid gap-5">
      <form action={save} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <input type="hidden" name="id" value={editing?.id || ""} />
        <h2 className="text-xl font-black text-espresso">{editing ? "Edit gallery photo" : "Add gallery photo"}</h2>
        <div className="grid gap-4 md:grid-cols-[1fr_140px]">
          <Input name="title" placeholder="Photo title" defaultValue={editing?.title} required />
          <Input name="sort_order" type="number" placeholder="Sort" defaultValue={editing?.sort_order ?? 0} />
        </div>
        <label className="grid gap-2 text-sm font-semibold text-espresso">
          Upload / Replace Image
          <Input name="image" type="file" accept="image/png,image/jpeg,image/webp" />
        </label>
        <Input name="image_url" placeholder="Or paste image URL" defaultValue={editing?.image_url} />
        <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} />
          Show on homepage
        </label>
        <div className="flex flex-wrap gap-2">
          <Button disabled={saving}>
            <Upload size={16} />
            {saving ? "Saving..." : "Save photo"}
          </Button>
          {editing && (
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel edit
            </Button>
          )}
        </div>
        {message && <p className="text-sm font-semibold text-mocha">{message}</p>}
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft">
            <div className="relative aspect-square bg-latte">
              <Image src={image.image_url} alt={image.title} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
            </div>
            <div className="grid gap-3 p-4">
              <div>
                <strong className="text-espresso">{image.title}</strong>
                <p className="text-sm text-stone-600">Sort {image.sort_order} - {image.active ? "Visible" : "Hidden"}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(image)}>
                  <Pencil size={15} />
                  Edit
                </Button>
                <Button type="button" size="icon" variant="secondary" onClick={() => remove(image.id)} aria-label={`Delete ${image.title}`}>
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!images.length && <p className="rounded-lg border border-dashed border-stone-200 bg-white p-6 text-sm text-stone-600">No gallery photos yet.</p>}
      </div>
    </div>
  );
}
