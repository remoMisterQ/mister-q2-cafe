"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import type { Category, MenuItem } from "@/types/menu";
import type { Location } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function MenuForm({ categories, locations, item }: { categories: Category[]; locations: Location[]; item?: MenuItem }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(formData: FormData) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/menu", {
      method: item ? "PUT" : "POST",
      body: formData
    });
    const data = await response.json();
    setSaving(false);
    setMessage(response.ok ? "Menu item saved." : data.error || "Unable to save item.");
    if (response.ok) window.location.reload();
  }

  return (
    <form action={save} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <input type="hidden" name="id" value={item?.id || ""} />
      <h2 className="text-xl font-black text-espresso">{item ? "Edit menu item" : "Add menu item"}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" placeholder="Name" defaultValue={item?.name} required />
        <Input name="price" type="number" step="0.01" min="0" placeholder="Price" defaultValue={item?.price} required />
      </div>
      <Textarea name="description" placeholder="Description" defaultValue={item?.description} required />
      <div className="grid gap-4 md:grid-cols-3">
        <Select name="category_id" defaultValue={item?.category_id} required>
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold">
          <input type="checkbox" name="available" defaultChecked={item?.available ?? true} />
          Available
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold">
          <input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} />
          Featured
        </label>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-espresso">Locations</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {locations.map((location) => (
            <label key={location.id} className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm">
              <input type="checkbox" name="location_ids" value={location.id} defaultChecked={!item || item.location_ids?.includes(location.id)} />
              {location.name}
            </label>
          ))}
        </div>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-espresso">
        Edit Photo / Replace Image
        <Input name="image" type="file" accept="image/png,image/jpeg,image/webp" />
      </label>
      <Input name="image_url" placeholder="Or paste image URL" defaultValue={item?.image_url} />
      <Button disabled={saving}>
        <Upload size={16} />
        {saving ? "Saving..." : "Save menu item"}
      </Button>
      {message && <p className="text-sm font-semibold text-mocha">{message}</p>}
    </form>
  );
}
