import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, CupSoda, Quote, Sparkles, Star } from "lucide-react";
import { Hero } from "@/components/hero";
import { LocationCard } from "@/components/location-card";
import { MenuCard } from "@/components/menu-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedMenuItems, getLocations } from "@/lib/data";

const locationImages: Record<string, string> = {
  charlestown: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1000&q=80",
  revere: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&w=1000&q=80",
  cambridge: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80",
  marblehead: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
};

const seasonalSpecials = [
  {
    name: "Honey Lavender Latte",
    price: "$6.75",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Pistachio Cold Brew",
    price: "$6.25",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Strawberry Cream Croissant",
    price: "$5.95",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85"
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85"
];

const reviews = [
  {
    name: "Mara L.",
    location: "Cambridge",
    text: "The pickup flow is easy, the iced latte is consistent, and the pastries taste like they came out of the oven five minutes ago."
  },
  {
    name: "Anthony R.",
    location: "Revere",
    text: "My go-to before work. Ordering ahead saves me time, and the staff always has everything packed neatly."
  },
  {
    name: "Elena P.",
    location: "Charlestown",
    text: "Premium cafe feel without being fussy. The breakfast sandwiches and cappuccino are a perfect morning pair."
  }
];

export default async function HomePage() {
  const [featured, locations] = await Promise.all([getFeaturedMenuItems(), getLocations()]);

  return (
    <main>
      <Hero />

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeader eyebrow="Featured menu" title="Cafe favorites, ready ahead." actionHref="/menu" actionLabel="View full menu" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-page">
          <SectionHeader eyebrow="Seasonal specials" title="Small-batch favorites for right now." actionHref="/order" actionLabel="Order Specials" />
          <div className="grid gap-5 md:grid-cols-3">
            {seasonalSpecials.map((special) => (
              <Card key={special.name} className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-latte">
                  <Image src={special.image} alt={special.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 hover:scale-105" />
                </div>
                <CardContent>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-mocha">Limited time</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-espresso">{special.name}</h3>
                    <strong>{special.price}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeader eyebrow="How pickup works" title="Three steps to a better coffee run." />
          <div className="grid gap-5 md:grid-cols-3">
            <Step number="01" title="Choose a cafe" copy="Select Charlestown, Revere, Cambridge, or Marblehead." />
            <Step number="02" title="Build your order" copy="Pick drinks, food, modifiers, notes, and pickup time." />
            <Step number="03" title="Pickup fresh" copy="Your order is organized for a smooth pickup-only visit." />
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-page">
          <SectionHeader eyebrow="Locations" title="Order from the Mister Q near you." actionHref="/locations" actionLabel="View all locations">
            Choose Charlestown, Revere, Cambridge, or Marblehead for pickup-only ordering.
          </SectionHeader>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} imageUrl={locationImages[location.slug]} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Drink of the week</p>
            <h2 className="mt-2 text-4xl font-black text-espresso md:text-5xl">Brown Sugar Shaken Espresso</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
              Espresso shaken over ice with brown sugar syrup, finished with oat milk and a cinnamon lift.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <strong className="text-3xl text-espresso">$6.50</strong>
              <Button asChild>
                <Link href="/order">Order this drink</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-latte shadow-soft">
            <Image src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1100&q=85" alt="Iced espresso drink" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-page">
          <SectionHeader eyebrow="Gallery" title="A look inside Mister Q.">
            Follow the cafe mood at <span className="font-bold text-mocha">@misterqcafe</span>.
          </SectionHeader>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-lg bg-latte">
                <Image src={image} alt={`Mister Q cafe gallery ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition duration-300 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Reviews</p>
              <h2 className="mt-2 text-3xl font-black text-espresso md:text-4xl">Local regulars, morning rituals.</h2>
            </div>
            <div className="text-right">
              <div className="flex gap-1 text-mocha" aria-label="Five star rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="mt-1 text-sm font-bold text-stone-600">4.8/5 from pickup regulars</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.name} className="overflow-hidden">
                <CardContent className="p-6">
                  <Quote className="mb-4 text-mocha" size={28} />
                  <div className="mb-4 flex gap-1 text-mocha">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="min-h-32 text-base leading-7 text-stone-700">{review.text}</p>
                  <div className="mt-6 border-t border-stone-100 pt-4">
                    <strong className="block text-espresso">{review.name}</strong>
                    <span className="text-sm font-semibold text-mocha">{review.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-page">
          <SectionHeader eyebrow="Why order ahead" title="Pickup that respects your morning." />
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

function SectionHeader({
  eyebrow,
  title,
  actionHref,
  actionLabel,
  children
}: {
  eyebrow: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black text-espresso md:text-4xl">{title}</h2>
        {children && <p className="mt-4 leading-7 text-stone-600">{children}</p>}
      </div>
      {actionHref && actionLabel && (
        <Button variant="secondary" asChild>
          <Link href={actionHref}>
            {actionLabel}
            <ArrowRight size={17} />
          </Link>
        </Button>
      )}
    </div>
  );
}

function Step({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <Card>
      <CardContent>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-3xl font-black text-mocha">{number}</span>
          <CheckCircle2 className="text-espresso" size={24} />
        </div>
        <h3 className="text-lg font-black text-espresso">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
      </CardContent>
    </Card>
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
