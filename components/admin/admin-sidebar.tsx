import Link from "next/link";
import { BadgePercent, ClipboardList, Coffee, Images, LayoutDashboard, MapPin } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: Coffee },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/discounts", label: "Discounts", icon: BadgePercent }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <h2 className="mb-4 text-lg font-black text-espresso">Admin</h2>
      <nav className="grid gap-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-cream">
            <link.icon size={16} />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
