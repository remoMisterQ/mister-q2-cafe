"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/menu";
import { calculateTax, roundMoney } from "@/lib/tax";
import { currency } from "@/lib/utils";
import { cartItemKey, cartItemTotal, cartItemUnitPrice } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function getCartTotals(cart: CartItem[], tip: number) {
  const subtotal = roundMoney(cart.reduce((sum, item) => sum + cartItemTotal(item), 0));
  const tax = calculateTax(subtotal);
  const total = roundMoney(subtotal + tax + Number(tip || 0));
  return { subtotal, tax, total };
}

export function CartSidebar({
  cart,
  tip,
  onTipChange,
  onIncrement,
  onDecrement,
  onRemove
}: {
  cart: CartItem[];
  tip: number;
  onTipChange: (value: number) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const totals = getCartTotals(cart, tip);

  return (
    <aside className="sticky top-24 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black text-espresso">Cart</h2>
      <div className="mt-4 grid gap-3">
        {cart.map((item) => (
          <div key={cartItemKey(item)} className="grid gap-3 rounded-lg border border-stone-100 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-sm text-espresso">{item.name}</strong>
                <p className="text-sm text-stone-600">{currency(cartItemUnitPrice(item))}</p>
                {!!item.selected_modifiers?.length && (
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    {item.selected_modifiers.map((modifier) => `${modifier.group_name}: ${modifier.name}`).join(", ")}
                  </p>
                )}
              </div>
              <button type="button" className="text-stone-500 hover:text-red-700" onClick={() => onRemove(cartItemKey(item))} aria-label={`Remove ${item.name}`}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button type="button" size="icon" variant="secondary" onClick={() => onDecrement(cartItemKey(item))} aria-label={`Decrease ${item.name}`}>
                  <Minus size={15} />
                </Button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <Button type="button" size="icon" variant="secondary" onClick={() => onIncrement(cartItemKey(item))} aria-label={`Increase ${item.name}`}>
                  <Plus size={15} />
                </Button>
              </div>
              <strong>{currency(cartItemTotal(item))}</strong>
            </div>
          </div>
        ))}
        {!cart.length && <p className="rounded-lg border border-dashed border-stone-200 p-4 text-sm text-stone-600">Your pickup cart is empty.</p>}
      </div>
      <div className="mt-5 grid gap-3 border-t border-stone-200 pt-5">
        <label className="grid gap-2 text-sm font-semibold text-espresso">
          Tip
          <Input type="number" min="0" step="0.01" value={tip} onChange={(event) => onTipChange(Number(event.target.value))} />
        </label>
        <Summary label="Subtotal" value={totals.subtotal} />
        <Summary label="MA tax 6.25%" value={totals.tax} />
        <Summary label="Tip" value={tip} />
        <div className="flex items-center justify-between text-lg font-black text-espresso">
          <span>Total</span>
          <span>{currency(totals.total)}</span>
        </div>
      </div>
    </aside>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm text-stone-700">
      <span>{label}</span>
      <strong>{currency(value)}</strong>
    </div>
  );
}
