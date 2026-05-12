"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const options = ["ASAP - 15 min", "30 min", "45 min"];

export function PickupTimeSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="grid gap-3">
      <span className="text-sm font-semibold text-espresso">Pickup time</span>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <Button key={option} type="button" variant={value === option ? "default" : "secondary"} size="sm" onClick={() => onChange(option)}>
            <Clock size={15} />
            {option}
          </Button>
        ))}
      </div>
      <Input type="time" value={options.includes(value) ? "" : value} onChange={(event) => onChange(event.target.value)} aria-label="Custom pickup time" />
    </div>
  );
}
