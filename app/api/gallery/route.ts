import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertGalleryImage(request);
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertGalleryImage(request);
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  const id = request.nextUrl.searchParams.get("id");
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!id) return NextResponse.json({ error: "Missing gallery image id." }, { status: 400 });

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

async function upsertGalleryImage(request: NextRequest) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const formData = await request.formData();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  let imageUrl = String(formData.get("image_url") || "");
  const image = formData.get("image");

  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop() || "jpg";
    const path = `gallery/${slugify(title)}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("menu-images").upload(path, image, {
      cacheControl: "3600",
      upsert: true
    });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    imageUrl = data.publicUrl;
  }

  if (!imageUrl) return NextResponse.json({ error: "Upload an image or paste an image URL." }, { status: 400 });

  const payload = {
    title,
    image_url: imageUrl,
    sort_order: Number(formData.get("sort_order") || 0),
    active: formData.get("active") === "on"
  };

  const { error } = id
    ? await supabase.from("gallery_images").update(payload).eq("id", id)
    : await supabase.from("gallery_images").insert(payload);

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
