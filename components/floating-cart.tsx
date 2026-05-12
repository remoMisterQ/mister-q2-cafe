"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { CartItem } from "@/types/menu";
import { getCartTotals } from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";

export function FloatingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setCart(JSON.parse(localStorage.getItem("mister-q-cart") || "[]"));
    load();
    window.addEventListener("mister-q-cart-updated", load);
    return () => window.removeEventListener("mister-q-cart-updated", load);
  }, []);

  if (!cart.length) return null;

  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totals = getCartTotals(cart, 0);

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(640px,calc(100%-32px))] -translate-x-1/2 rounded-lg border border-stone-200 bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-espresso text-white">
            <ShoppingBag size={18} />
          </span>
          <div>
            <p className="text-sm font-black text-espresso">{quantity} item{quantity === 1 ? "" : "s"} in cart</p>
            <p className="text-xs text-stone-600">{currency(totals.total)} before tip</p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href="/order#cart">View cart</Link>
        </Button>
      </div>
    </div>
  );
}
