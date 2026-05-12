import Link from "next/link";
import { Coffee } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2 font-black text-espresso">
            <Coffee size={20} />
            Mister Q Cafe
          </div>
          <p className="max-w-sm text-sm leading-6 text-stone-600">
            Boutique coffee, pastries, sandwiches, soups, and ice cream ready for pickup across Massachusetts.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-espresso">Visit</h3>
          <p className="text-sm leading-6 text-stone-600">Charlestown, Revere, Cambridge, Marblehead</p>
          <p className="text-sm text-stone-600">Daily 6:00 AM - 5:00 PM</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-espresso">Quick links</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/menu">Menu</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/order">Order Pickup</Link>
            <Link href="/admin/login">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
