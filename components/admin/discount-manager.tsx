"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type DiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
};

export function DiscountManager({ discounts }: { discounts: DiscountCode[] }) {
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(formData: FormData) {
    setSaving(true);
    setMessage("");
    const payload = {
      id: editing?.id,
      code: String(formData.get("code") || ""),
      type: String(formData.get("type") || "percent"),
      value: Number(formData.get("value") || 0),
      active: formData.get("active") === "on",
      starts_at: String(formData.get("starts_at") || ""),
      expires_at: String(formData.get("expires_at") || "")
    };
    const response = await fetch("/api/discounts", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setSaving(false);
    setMessage(response.ok ? "Discount code saved." : data.error || "Unable to save discount code.");
    if (response.ok) window.location.reload();
  }

  async function remove(id: string) {
    if (!confirm("Delete this discount code?")) return;
    await fetch(`/api/discounts?id=${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="grid gap-5">
      <form action={save} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-espresso">{editing ? "Edit discount code" : "Add discount code"}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Input name="code" placeholder="Code, e.g. LATTE10" defaultValue={editing?.code} required />
          <Select name="type" defaultValue={editing?.type || "percent"}>
            <option value="percent">Percent off</option>
            <option value="fixed">Dollar off</option>
          </Select>
          <Input name="value" type="number" min="0.01" step="0.01" placeholder="Value" defaultValue={editing?.value} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="starts_at" type="datetime-local" defaultValue={toDateTimeLocal(editing?.starts_at)} />
          <Input name="expires_at" type="datetime-local" defaultValue={toDateTimeLocal(editing?.expires_at)} />
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} />
          Active
        </label>
        <div className="flex flex-wrap gap-2">
          <Button disabled={saving}>{saving ? "Saving..." : "Save discount code"}</Button>
          {editing && (
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel edit
            </Button>
          )}
        </div>
        {message && <p className="text-sm font-semibold text-mocha">{message}</p>}
      </form>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-soft">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-cream text-espresso">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Active</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id} className="border-t border-stone-100">
                <td className="p-3 font-black text-espresso">{discount.code}</td>
                <td className="p-3">{discount.type === "percent" ? `${discount.value}% off` : `$${Number(discount.value).toFixed(2)} off`}</td>
                <td className="p-3">{discount.active ? "Active" : "Inactive"}</td>
                <td className="p-3 text-stone-600">
                  {discount.starts_at ? new Date(discount.starts_at).toLocaleDateString() : "Now"} - {discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : "No end"}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(discount)}>
                      <Pencil size={15} />
                      Edit
                    </Button>
                    <Button type="button" size="icon" variant="secondary" onClick={() => remove(discount.id)} aria-label={`Delete ${discount.code}`}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!discounts.length && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-600">
                  No discount codes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}
