import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("menu_items").select("*, category:categories(*), menu_item_locations(location_id, available)").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertMenuItem(request);
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertMenuItem(request);
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  const id = request.nextUrl.searchParams.get("id");
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!id) return NextResponse.json({ error: "Missing menu item id." }, { status: 400 });

  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

async function requireSignedInAdmin() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user ? null : NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

async function upsertMenuItem(request: NextRequest) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const formData = await request.formData();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const locationIds = formData.getAll("location_ids").map(String);
  let imageUrl = String(formData.get("image_url") || "");
  const image = formData.get("image");

  if (!name || !formData.get("price") || !formData.get("category_id")) {
    return NextResponse.json({ error: "Name, price, and category are required." }, { status: 400 });
  }

  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop() || "jpg";
    const path = `${slugify(name)}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("menu-images").upload(path, image, {
      cacheControl: "3600",
      upsert: true
    });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    imageUrl = data.publicUrl;
  }

  const payload = {
    name,
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price")),
    category_id: String(formData.get("category_id")),
    image_url: imageUrl,
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
    updated_at: new Date().toISOString()
  };

  const { data: saved, error } = id
    ? await supabase.from("menu_items").update(payload).eq("id", id).select("id").single()
    : await supabase.from("menu_items").insert(payload).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("menu_item_locations").delete().eq("menu_item_id", saved.id);
  if (locationIds.length) {
    const { error: locationError } = await supabase.from("menu_item_locations").insert(
      locationIds.map((location_id) => ({
        menu_item_id: saved.id,
        location_id,
        available: true
      }))
    );
    if (locationError) return NextResponse.json({ error: locationError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: saved.id });
}
