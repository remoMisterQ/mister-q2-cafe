import Link from "next/link";
import { Coffee, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/order", label: "Order" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-black tracking-wide text-espresso">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-espresso text-white">
            <Coffee size={19} />
          </span>
          Mister Q Cafe
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="hidden md:inline-flex">
          <Link href="/order">
            <ShoppingBag size={16} />
            Order Pickup
          </Link>
        </Button>
        <Link href="/order" className="grid h-10 w-10 place-items-center rounded-lg bg-espresso text-white md:hidden" aria-label="Order pickup">
          <ShoppingBag size={18} />
        </Link>
      </div>
    </header>
  );
}
