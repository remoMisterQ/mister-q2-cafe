"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import type { MenuItem, ModifierGroup } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ModifierManager({ item, groups }: { item: MenuItem; groups: ModifierGroup[] }) {
  const itemGroups = useMemo(() => groups.filter((group) => group.menu_item_id === item.id), [groups, item.id]);
  const [editing, setEditing] = useState<ModifierGroup | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  async function save(formData: FormData) {
    setMessage("");
    const response = await fetch("/api/modifiers", {
      method: editing ? "PUT" : "POST",
      body: formData
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "Unable to save customization.");
    else window.location.reload();
  }

  async function remove(id: string) {
    if (!confirm("Delete this customization group?")) return;
    const response = await fetch(`/api/modifiers?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "Unable to delete customization.");
    else window.location.reload();
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-cream/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-black text-espresso">
            <Settings2 size={17} />
            Customizations for {item.name}
          </h3>
          <p className="text-sm text-stone-600">Add size, milk, extras, or any product-specific options.</p>
        </div>
        <Button type="button" size="sm" onClick={() => { setEditing(null); setShowForm(!showForm); }}>
          <Plus size={15} />
          Add customization
        </Button>
      </div>

      {(showForm || editing) && (
        <form action={save} className="mt-4 grid gap-3 rounded-lg bg-white p-4">
          <input type="hidden" name="id" value={editing?.id || ""} />
          <input type="hidden" name="menu_item_id" value={item.id} />
          <div className="grid gap-3 md:grid-cols-4">
            <Input name="name" placeholder="Group name, e.g. Milk" defaultValue={editing?.name || ""} required />
            <Input name="min_select" type="number" min="0" placeholder="Min" defaultValue={editing?.min_select ?? 0} />
            <Input name="max_select" type="number" min="1" placeholder="Max" defaultValue={editing?.max_select ?? 1} />
            <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold">
              <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} />
              Active
            </label>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-bold text-espresso">Options</p>
            {Array.from({ length: 6 }).map((_, index) => {
              const option = editing?.options?.[index];
              return (
                <div key={index} className="grid gap-2 md:grid-cols-[1fr_160px]">
                  <Input name="option_name" placeholder={`Option ${index + 1}`} defaultValue={option?.name || ""} />
                  <Input name="option_price" type="number" step="0.01" placeholder="Price delta" defaultValue={option?.price_delta ?? ""} />
                </div>
              );
            })}
          </div>
          <Button>Save customization</Button>
        </form>
      )}

      {message && <p className="mt-3 text-sm font-semibold text-red-700">{message}</p>}
      <div className="mt-4 grid gap-2">
        {itemGroups.map((group) => (
          <div key={group.id} className="rounded-lg bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <strong className="text-espresso">{group.name}</strong>
                <p className="text-xs text-stone-500">
                  Choose {group.min_select}-{group.max_select}: {group.options.map((option) => `${option.name} (+$${option.price_delta})`).join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => { setEditing(group); setShowForm(true); }}>
                  <Pencil size={15} />
                  Edit
                </Button>
                <Button type="button" size="icon" variant="secondary" onClick={() => remove(group.id)} aria-label={`Delete ${group.name}`}>
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!itemGroups.length && <p className="text-sm text-stone-600">No customizations for this product yet.</p>}
      </div>
    </div>
  );
}
