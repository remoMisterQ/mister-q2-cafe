import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso text-white">
      <Image
        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1800&q=80"
        alt="Warm modern coffee shop interior"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-58"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/42 to-black/18" />
      <div className="container-page relative min-h-[calc(100vh-8rem)] max-h-[820px] py-20">
        <div className="flex min-h-[520px] max-w-2xl flex-col justify-center">
          <p className="mb-4 flex w-fit items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
            <MapPin size={16} />
            Four pickup cafes across Massachusetts
          </p>
          <h1 className="text-5xl font-black leading-none tracking-normal md:text-7xl">Mister Q Cafe</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/88">
            Modern boutique coffee, breakfast, sandwiches, soups, and ice cream made for easy online pickup.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="bg-white text-espresso hover:bg-cream" asChild>
              <Link href="/order">
                Order Pickup
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
