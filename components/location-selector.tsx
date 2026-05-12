"use client";

import type { Location } from "@/types/location";
import { Select } from "@/components/ui/select";

export function LocationSelector({
  locations,
  value,
  onChange
}: {
  locations: Location[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-espresso">
      Pickup location
      <Select id="pickup-location" value={value} onChange={(event) => onChange(event.target.value)} required>
        <option value="">Choose a location</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </Select>
    </label>
  );
}
