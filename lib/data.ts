import { categories as fallbackCategories, locations as fallbackLocations, menuItems as fallbackMenuItems, modifierGroups as fallbackModifierGroups } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem } from "@/types/menu";

const fallbackGalleryImages = [
  { id: "gallery-1", title: "Cafe counter", image_url: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=900&q=85", sort_order: 1, active: true },
  { id: "gallery-2", title: "Fresh bakery", image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85", sort_order: 2, active: true },
  { id: "gallery-3", title: "Coffee service", image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85", sort_order: 3, active: true },
  { id: "gallery-4", title: "Latte pour", image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85", sort_order: 4, active: true },
  { id: "gallery-5", title: "Iced coffee", image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85", sort_order: 5, active: true },
  { id: "gallery-6", title: "Breakfast plate", image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85", sort_order: 6, active: true }
];

export async function getLocations() {
  const supabase = await createClient();
  if (!supabase) return fallbackLocations;

  const { data, error } = await supabase.from("locations").select("*").eq("active", true).order("name");
  return error || !data?.length ? fallbackLocations : data;
}

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return fallbackCategories;

  const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("sort_order");
  return error || !data?.length ? fallbackCategories : data;
}

export async function getMenuItems() {
  const supabase = await createClient();
  if (!supabase) return fallbackMenuItems;

  const { data, error } = await supabase
    .from("menu_items")
    .select("*, category:categories(*), menu_item_locations(location_id, available)")
    .order("name");

  if (error || !data?.length) return fallbackMenuItems;

  return data.map((item) => ({
    ...item,
    price: Number(item.price),
    location_ids: item.menu_item_locations?.filter((row: { available: boolean }) => row.available).map((row: { location_id: string }) => row.location_id) || []
  })) as MenuItem[];
}

export async function getFeaturedMenuItems() {
  const items = await getMenuItems();
  return items.filter((item) => item.featured).slice(0, 4);
}

export async function getModifierGroups() {
  const supabase = await createClient();
  if (!supabase) return fallbackModifierGroups;

  const { data, error } = await supabase
    .from("modifier_groups")
    .select("*, options:modifier_options(*)")
    .eq("active", true)
    .order("name");

  if (error || !data?.length) return fallbackModifierGroups;
  return data.map((group) => ({
    ...group,
    options: (group.options || []).filter((option: { active: boolean }) => option.active).map((option: { price_delta: string | number }) => ({
      ...option,
      price_delta: Number(option.price_delta)
    }))
  }));
}

export async function getGalleryImages() {
  const supabase = await createClient();
  if (!supabase) return fallbackGalleryImages;

  const { data, error } = await supabase.from("gallery_images").select("*").eq("active", true).order("sort_order");
  return error || !data?.length ? fallbackGalleryImages : data;
}
