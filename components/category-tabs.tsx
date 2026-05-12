"use client";

import type { Category } from "@/types/menu";
import { Button } from "@/components/ui/button";

export function CategoryTabs({
  categories,
  active,
  onChange
}: {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          type="button"
          variant={active === category.slug ? "default" : "secondary"}
          size="sm"
          onClick={() => onChange(category.slug)}
          className="shrink-0"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
