"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, CartItem, MenuItem } from "@/types/menu";
import type { ModifierGroup } from "@/types/menu";
import type { Location } from "@/types/location";
import { CartSidebar } from "@/components/cart-sidebar";
import { CheckoutButton } from "@/components/checkout-button";
import { LocationSelector } from "@/components/location-selector";
import { MenuBrowser } from "@/components/menu-browser";
import { PickupTimeSelector } from "@/components/pickup-time-selector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function OrderFlow({
  locations,
  categories,
  items,
  modifierGroups,
  initialLocationSlug
}: {
  locations: Location[];
  categories: Category[];
  items: MenuItem[];
  modifierGroups: ModifierGroup[];
  initialLocationSlug?: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP - 15 min");
  const [tip, setTip] = useState(0);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", notes: "" });

  useEffect(() => {
    const initialLocation = locations.find((location) => location.slug === initialLocationSlug);
    if (initialLocation) setLocationId(initialLocation.id);
  }, [initialLocationSlug, locations]);

  useEffect(() => {
    const load = () => {
      setCart(JSON.parse(localStorage.getItem("mister-q-cart") || "[]"));
      setCartLoaded(true);
    };
    load();
    window.addEventListener("mister-q-cart-updated", load);
    return () => window.removeEventListener("mister-q-cart-updated", load);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem("mister-q-cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  const availableItems = useMemo(() => {
    if (!locationId) return items;
    return items.filter((item) => !item.location_ids?.length || item.location_ids.includes(locationId));
  }, [items, locationId]);

  const canCheckout = Boolean(locationId && pickupTime && cart.length && customer.name && customer.phone && customer.email);
  const validationErrors = [
    !locationId ? "Pickup location is missing." : "",
    !pickupTime ? "Pickup time is missing." : "",
    !cart.length ? "Cart is empty." : "",
    !customer.name ? "Customer name is missing." : "",
    !customer.phone ? "Customer phone is missing." : "",
    !customer.email ? "Customer email is missing." : ""
  ].filter(Boolean);

  function scrollToFirstMissingField() {
    const targetId = !locationId
      ? "pickup-location"
      : !pickupTime
        ? "pickup-time"
        : !cart.length
          ? "menu-items"
          : !customer.name
            ? "customer-name"
            : !customer.phone
              ? "customer-phone"
              : !customer.email
                ? "customer-email"
                : "customer-info";

    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
      window.setTimeout(() => target.focus(), 350);
    }
  }

  function addToCart(item: CartItem) {
    setCart((current) => [...current, item]);
  }

  function increment(id: string) {
    setCart((current) => current.map((item) => ((item.cart_id || item.id) === id ? { ...item, quantity: item.quantity + 1 } : item)));
  }

  function decrement(id: string) {
    setCart((current) => current.flatMap((item) => ((item.cart_id || item.id) === id ? (item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []) : [item])));
  }

  function remove(id: string) {
    setCart((current) => current.filter((item) => (item.cart_id || item.id) !== id));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-6">
        <section id="pickup-location-section" className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <LocationSelector locations={locations} value={locationId} onChange={setLocationId} />
          <div id="pickup-time">
            <PickupTimeSelector value={pickupTime} onChange={setPickupTime} />
          </div>
        </section>

        <div id="menu-items">
          <MenuBrowser categories={categories} items={availableItems} modifierGroups={modifierGroups} onAdd={addToCart} />
        </div>

        <section id="customer-info" className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-espresso">Customer info</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Input id="customer-name" placeholder="Name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} required />
            <Input id="customer-phone" placeholder="Phone" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} required />
            <Input id="customer-email" type="email" placeholder="Email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} required />
          </div>
          <Textarea placeholder="Pickup notes" value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} />
        </section>
      </div>

      <div id="cart" className="grid h-fit gap-4 lg:sticky lg:top-24">
        <CartSidebar cart={cart} tip={tip} onTipChange={setTip} onIncrement={increment} onDecrement={decrement} onRemove={remove} />
        <CheckoutButton payload={{ locationId, pickupTime, customer, cart, tip }} validationErrors={validationErrors} onValidationFail={scrollToFirstMissingField} />
        {!canCheckout && (
          <p className="text-sm leading-6 text-stone-600">
            Choose a location, pickup time, at least one available item, and customer info to continue.
          </p>
        )}
      </div>
    </div>
  );
}
