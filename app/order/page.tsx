import { OrderFlow } from "@/components/order-flow";
import { getCategories, getLocations, getMenuItems, getModifierGroups } from "@/lib/data";

export default async function OrderPage({ searchParams }: { searchParams?: Promise<{ location?: string }> }) {
  const params = await searchParams;
  const [locations, categories, items, modifierGroups] = await Promise.all([getLocations(), getCategories(), getMenuItems(), getModifierGroups()]);

  return (
    <main className="section-pad">
      <div className="container-page">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Order pickup</p>
          <h1 className="mt-2 text-4xl font-black text-espresso md:text-5xl">Build your pickup order.</h1>
          <p className="mt-4 leading-7 text-stone-600">Pickup only. Choose your cafe, time, items, modifiers, tip, and place the order.</p>
        </div>
        <OrderFlow locations={locations} categories={categories} items={items} modifierGroups={modifierGroups} initialLocationSlug={params?.location} />
      </div>
    </main>
  );
}
