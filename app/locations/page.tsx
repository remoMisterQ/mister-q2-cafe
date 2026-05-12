import { LocationCard } from "@/components/location-card";
import { getLocations } from "@/lib/data";

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <main className="section-pad">
      <div className="container-page">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-mocha">Locations</p>
          <h1 className="mt-2 text-4xl font-black text-espresso md:text-5xl">Four cafes, one smooth pickup flow.</h1>
          <p className="mt-4 leading-7 text-stone-600">Address and Google Maps embeds are placeholders until you add final store details in Supabase.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} showMap />
          ))}
        </div>
      </div>
    </main>
  );
}
