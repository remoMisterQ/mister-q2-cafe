import { categories as fallbackCategories, locations as fallbackLocations, menuItems as fallbackMenuItems, modifierGroups as fallbackModifierGroups } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem } from "@/types/menu";

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
