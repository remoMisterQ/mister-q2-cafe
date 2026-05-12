"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Category } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [message, setMessage] = useState("");

  async function save(formData: FormData) {
    setMessage("");
    const response = await fetch("/api/categories", {
      method: editing ? "PUT" : "POST",
      body: formData
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "Unable to save category.");
    else window.location.reload();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products in this category should be moved first.")) return;
    const response = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "Unable to delete category.");
    else window.location.reload();
  }

  return (
    <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">Categories</p>
        <h2 className="mt-1 text-2xl font-black text-espresso">Menu categories</h2>
      </div>
      <form action={save} className="grid gap-3 md:grid-cols-[1fr_1fr_120px_140px_auto]">
        <input type="hidden" name="id" value={editing?.id || ""} />
        <Input name="name" placeholder="Category name" defaultValue={editing?.name || ""} required />
        <Input name="slug" placeholder="Slug" defaultValue={editing?.slug || ""} />
        <Input name="sort_order" type="number" placeholder="Order" defaultValue={editing?.sort_order || 0} />
        <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} />
          Active
        </label>
        <Button>
          <Plus size={16} />
          {editing ? "Save" : "Add"}
        </Button>
      </form>
      {message && <p className="text-sm font-semibold text-red-700">{message}</p>}
      <div className="grid gap-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-3 rounded-lg border border-stone-100 p-3">
            <div>
              <strong className="text-espresso">{category.name}</strong>
              <p className="text-xs text-stone-500">{category.slug} - order {category.sort_order}</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(category)}>
                <Pencil size={15} />
                Edit
              </Button>
              <Button type="button" size="icon" variant="secondary" onClick={() => remove(category.id)} aria-label={`Delete ${category.name}`}>
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
