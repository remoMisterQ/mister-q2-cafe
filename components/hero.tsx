import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso text-white">
      <Image
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=85"
        alt="Clean modern cafe counter with coffee and pastries"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-68"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/58 to-black/28" />
      <div className="container-page relative min-h-[620px] py-14 md:min-h-[calc(100vh-8rem)] md:max-h-[820px] md:py-20">
        <div className="mx-auto w-fit rounded-lg border border-white/20 bg-white/12 px-3 py-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur md:absolute md:left-0 md:right-0 md:top-4 md:px-4 md:text-xs">
          Now accepting pickup orders at all locations
        </div>
        <div className="flex min-h-[470px] max-w-2xl flex-col justify-center md:min-h-[520px]">
          <p className="mb-4 flex w-fit items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
            <MapPin size={16} />
            Four pickup cafes across Massachusetts
          </p>
          <h1 className="text-4xl font-black leading-none tracking-normal md:text-7xl">Mister Q Cafe</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/88 md:text-lg md:leading-8">
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
