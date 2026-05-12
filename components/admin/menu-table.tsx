"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Settings2, Trash2 } from "lucide-react";
import type { Category, MenuItem, ModifierGroup } from "@/types/menu";
import type { Location } from "@/types/location";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuForm } from "@/components/admin/menu-form";
import { ModifierManager } from "@/components/admin/modifier-manager";

export function MenuTable({
  items,
  categories,
  locations,
  modifierGroups
}: {
  items: MenuItem[];
  categories: Category[];
  locations: Location[];
  modifierGroups: ModifierGroup[];
}) {
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="grid gap-5">
      {editing && <MenuForm item={editing} categories={categories} locations={locations} />}
      {customizing && <ModifierManager item={customizing} groups={modifierGroups} />}
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-soft">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-cream text-espresso">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Available</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-stone-100">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-latte">
                      <Image src={item.image_url} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <strong className="text-espresso">{item.name}</strong>
                      <p className="line-clamp-1 max-w-xs text-stone-600">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{item.category?.name}</td>
                <td className="p-3">{currency(item.price)}</td>
                <td className="p-3">{item.available ? "Available" : "Sold out"}</td>
                <td className="p-3">{item.featured ? "Yes" : "No"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(item)}>
                      <Pencil size={15} />
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => setCustomizing(item)}>
                      <Settings2 size={15} />
                      Customize
                    </Button>
                    <Button type="button" size="icon" variant="secondary" onClick={() => remove(item.id)} aria-label={`Delete ${item.name}`}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
