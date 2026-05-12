"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { MenuCard } from "@/components/menu-card";
import { Input } from "@/components/ui/input";
import type { Category, CartItem, MenuItem, ModifierGroup, SelectedModifier } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";
import { FloatingCart } from "@/components/floating-cart";

export function MenuBrowser({
  categories,
  items,
  modifierGroups = [],
  onAdd
}: {
  categories: Category[];
  items: MenuItem[];
  modifierGroups?: ModifierGroup[];
  onAdd?: (item: CartItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(categories[0]?.slug || "specials");
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);
  const groupsForItem = useMemo(() => groupsForItemFactory(modifierGroups), [modifierGroups]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "specials" ? item.featured || item.category?.slug === "specials" : item.category?.slug === category;
      const haystack = `${item.name} ${item.description} ${item.category?.name}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [items, query, category]);

  function add(item: MenuItem, selected_modifiers: SelectedModifier[] = []) {
    const cartItem: CartItem = {
      ...item,
      cart_id: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      quantity: 1,
      selected_modifiers
    };

    if (onAdd) {
      onAdd(cartItem);
      return;
    }

    const existing = JSON.parse(localStorage.getItem("mister-q-cart") || "[]");
    const next = [...existing, cartItem];
    localStorage.setItem("mister-q-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("mister-q-cart-updated"));
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
          <Input className="pl-10" placeholder="Search coffee, croissant, soup..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <CategoryTabs categories={categories} active={category} onChange={setCategory} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={() => (groupsForItem(item).length ? setCustomizing(item) : add(item))} />
        ))}
      </div>
      {!filtered.length && <p className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">No menu items match that search.</p>}
      {customizing && (
        <ModifierDialog
          item={customizing}
          groups={groupsForItem(customizing)}
          onClose={() => setCustomizing(null)}
          onAdd={(modifiers) => {
            add(customizing, modifiers);
            setCustomizing(null);
          }}
        />
      )}
      {!onAdd && <FloatingCart />}
    </div>
  );
}

function groupsForItemFactory(groups: ModifierGroup[]) {
  return (item: MenuItem) => {
    const productGroups = groups.filter((group) => group.menu_item_id === item.id);
    return productGroups.length ? productGroups : groups.filter((group) => !group.menu_item_id);
  };
}

function ModifierDialog({
  item,
  groups,
  onClose,
  onAdd
}: {
  item: MenuItem;
  groups: ModifierGroup[];
  onClose: () => void;
  onAdd: (modifiers: SelectedModifier[]) => void;
}) {
  const [selected, setSelected] = useState<SelectedModifier[]>([]);
  const extras = selected.reduce((sum, modifier) => sum + modifier.price_delta, 0);

  function toggle(group: ModifierGroup, optionId: string) {
    const option = group.options.find((entry) => entry.id === optionId);
    if (!option) return;

    const selectedOption = { ...option, group_name: group.name };
    setSelected((current) => {
      const withoutGroup = group.max_select === 1 ? current.filter((entry) => entry.group_id !== group.id) : current;
      const exists = current.some((entry) => entry.id === option.id);
      if (exists) return current.filter((entry) => entry.id !== option.id);
      const groupSelected = withoutGroup.filter((entry) => entry.group_id === group.id);
      if (groupSelected.length >= group.max_select) return withoutGroup;
      return [...withoutGroup, selectedOption];
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">Customize</p>
            <h2 className="mt-1 text-2xl font-black text-espresso">{item.name}</h2>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-5 grid gap-5">
          {groups.map((group) => (
            <div key={group.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-bold text-espresso">{group.name}</h3>
                <span className="text-xs font-semibold text-stone-500">
                  {group.max_select === 1 ? "Choose one" : `Up to ${group.max_select}`}
                </span>
              </div>
              <div className="grid gap-2">
                {group.options.map((option) => {
                  const checked = selected.some((entry) => entry.id === option.id);
                  return (
                    <label key={option.id} className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2">
                        <input
                          type={group.max_select === 1 ? "radio" : "checkbox"}
                          name={group.id}
                          checked={checked}
                          onChange={() => toggle(group, option.id)}
                        />
                        {option.name}
                      </span>
                      <strong className="text-espresso">{option.price_delta ? `+${currency(option.price_delta)}` : "Included"}</strong>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <Button type="button" className="mt-6 w-full" onClick={() => onAdd(selected)}>
          Add to cart - {currency(Number(item.price) + extras)}
        </Button>
      </div>
    </div>
  );
}
