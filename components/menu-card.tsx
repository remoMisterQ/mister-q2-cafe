"use client";

import Image from "next/image";
import { Plus, CheckCircle2, CircleSlash } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MenuCard({ item, onAdd }: { item: MenuItem; onAdd?: (item: MenuItem) => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-latte">
        <Image src={item.image_url} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
      <CardContent className="flex min-h-[240px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-mocha">{item.category?.name}</p>
            <h3 className="mt-1 text-lg font-black text-espresso">{item.name}</h3>
          </div>
          <strong className="text-lg text-espresso">{currency(item.price)}</strong>
        </div>
        <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">{item.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className={`flex items-center gap-1 text-xs font-bold ${item.available ? "text-green-700" : "text-red-700"}`}>
            {item.available ? <CheckCircle2 size={15} /> : <CircleSlash size={15} />}
            {item.available ? "Available" : "Sold out"}
          </span>
          {onAdd && (
            <Button type="button" size="sm" disabled={!item.available} onClick={() => onAdd(item)}>
              <Plus size={16} />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
