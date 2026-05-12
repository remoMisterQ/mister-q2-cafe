"use client";

import { useState } from "react";
import type { Location } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LocationForm({ location }: { location: Location }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(formData: FormData) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/locations", {
      method: "PUT",
      body: formData
    });
    const data = await response.json();
    setSaving(false);
    setMessage(response.ok ? "Location saved." : data.error || "Unable to save location.");
  }

  return (
    <form action={save} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <input type="hidden" name="id" value={location.id} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">Location</p>
          <h2 className="mt-1 text-2xl font-black text-espresso">{location.name}</h2>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={location.active} />
          Active
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" defaultValue={location.name} placeholder="Name" required />
        <Input name="slug" defaultValue={location.slug} placeholder="Slug" required />
        <Input name="address" defaultValue={location.address} placeholder="Address" required />
        <Input name="city" defaultValue={location.city} placeholder="City" required />
        <Input name="state" defaultValue={location.state} placeholder="State" required />
        <Input name="zip" defaultValue={location.zip} placeholder="Zip" required />
        <Input name="phone" defaultValue={location.phone} placeholder="Phone" required />
        <Input name="hours" defaultValue={location.hours} placeholder="Hours" required />
      </div>
      <Textarea name="map_embed_url" defaultValue={location.map_embed_url || ""} placeholder="Google Maps embed URL" />
      <Button disabled={saving}>{saving ? "Saving..." : "Save location"}</Button>
      {message && <p className="text-sm font-semibold text-mocha">{message}</p>}
    </form>
  );
}
