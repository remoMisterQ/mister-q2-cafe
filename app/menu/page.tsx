import { MenuBrowser } from "@/components/menu-browser";
import { getCategories, getMenuItems, getModifierGroups } from "@/lib/data";

export default async function MenuPage() {
  const [categories, items, modifierGroups] = await Promise.all([getCategories(), getMenuItems(), getModifierGroups()]);

  return (
    <main className="section-pad">
      <div className="container-page">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Menu</p>
          <h1 className="mt-2 text-4xl font-black text-espresso md:text-5xl">Browse the pickup menu.</h1>
          <p className="mt-4 leading-7 text-stone-600">Search, filter by category, and add available items to your order.</p>
        </div>
        <MenuBrowser categories={categories} items={items} modifierGroups={modifierGroups} />
      </div>
    </main>
  );
}
