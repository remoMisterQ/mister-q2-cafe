import Link from "next/link";
import { Clock, Coffee, CupSoda, MapPin, Sandwich, Sparkles } from "lucide-react";
import { Hero } from "@/components/hero";
import { LocationCard } from "@/components/location-card";
import { MenuCard } from "@/components/menu-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedMenuItems, getLocations } from "@/lib/data";

export default async function HomePage() {
  const [featured, locations] = await Promise.all([getFeaturedMenuItems(), getLocations()]);

  return (
    <main>
      <Hero />

      <section className="section-pad bg-cream">
        <div className="container-page">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Featured menu</p>
              <h2 className="mt-2 text-3xl font-black text-espresso md:text-4xl">Cafe favorites, ready ahead.</h2>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/menu">View full menu</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Locations</p>
            <h2 className="mt-2 text-3xl font-black text-espresso md:text-4xl">Order from the Mister Q near you.</h2>
            <p className="mt-4 leading-7 text-stone-600">Choose Charlestown, Revere, Cambridge, or Marblehead for pickup-only ordering.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Why order ahead</p>
            <h2 className="mt-2 text-3xl font-black text-espresso md:text-4xl">Pickup that respects your morning.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Why icon={<Clock />} title="Ready timing" copy="Pick ASAP, 30 minutes, 45 minutes, or a custom pickup time." />
            <Why icon={<CupSoda />} title="Full cafe menu" copy="Coffee, iced drinks, pastries, breakfast, sandwiches, soups, and ice cream in one cart." />
            <Why icon={<Sparkles />} title="Simple checkout" copy="Quick pickup checkout now, with Stripe-ready routes available for payments later." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Why({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <Card>
      <CardContent>
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-espresso text-white">{icon}</div>
        <h3 className="text-lg font-black text-espresso">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
      </CardContent>
    </Card>
  );
}
