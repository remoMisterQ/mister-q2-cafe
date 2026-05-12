import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import type { Location } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LocationCard({ location, showMap = false }: { location: Location; showMap?: boolean }) {
  return (
    <Card className="overflow-hidden">
      {showMap && (
        <div className="grid aspect-[16/9] place-items-center bg-latte/45 text-center text-sm font-semibold text-stone-700">
          {location.map_embed_url ? (
            <iframe src={location.map_embed_url} className="h-full w-full border-0" loading="lazy" title={`${location.name} map`} />
          ) : (
            <span>Google Maps embed placeholder</span>
          )}
        </div>
      )}
      <CardContent className="grid gap-4">
        <div>
          <h3 className="text-xl font-black text-espresso">{location.name}</h3>
          <p className="mt-1 text-sm text-stone-600">{location.address}</p>
          <p className="text-sm text-stone-600">
            {location.city}, {location.state} {location.zip}
          </p>
        </div>
        <div className="grid gap-2 text-sm text-stone-700">
          <span className="flex items-center gap-2">
            <Clock size={16} /> {location.hours}
          </span>
          <span className="flex items-center gap-2">
            <Phone size={16} /> {location.phone}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} /> Pickup only
          </span>
        </div>
        <Button asChild>
          <Link href={`/order?location=${location.slug}`}>Order from this location</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
