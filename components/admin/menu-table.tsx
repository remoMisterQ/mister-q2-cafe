"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Settings2, Trash2 } from "lucide-react";
import type { Category, MenuItem, ModifierGroup } from "@/types/menu";
import type { Location } from "@/types/location";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const selectedCategory = categories.find((category) => getCategoryKey(category) === categoryFilter);
  const filteredItems = categoryFilter === "all" ? items : items.filter((item) => matchesCategory(item, categoryFilter, selectedCategory));

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4">
          <div>
            <h2 className="text-lg font-black text-espresso">Menu items</h2>
            <p className="text-sm text-stone-600">
              Showing {filteredItems.length} of {items.length} item{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <label className="grid gap-1 text-sm font-semibold text-espresso">
            Category
            <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-w-48">
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={getCategoryKey(category)}>
                  {category.name}
                </option>
              ))}
            </Select>
          </label>
        </div>
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
            {filteredItems.map((item) => (
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
            {!filteredItems.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-600">
                  No menu items in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getCategoryKey(category: Category) {
  return category.slug || category.id;
}

function matchesCategory(item: MenuItem, categoryKey: string, category?: Category) {
  if (categoryKey === "specials") return item.featured || item.category?.slug === "specials" || item.category?.name?.toLowerCase() === "specials";
  if (item.category_id === categoryKey || item.category?.id === categoryKey || item.category?.slug === categoryKey) return true;
  if (!category) return false;
  return item.category?.slug === category.slug || item.category?.name?.toLowerCase() === category.name.toLowerCase();
}
