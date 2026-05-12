import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertCategory(request);
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertCategory(request);
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  const id = request.nextUrl.searchParams.get("id");
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!id) return NextResponse.json({ error: "Missing category id." }, { status: 400 });

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

async function upsertCategory(request: NextRequest) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const formData = await request.formData();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  if (!name) return NextResponse.json({ error: "Category name is required." }, { status: 400 });

  const payload = {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    sort_order: Number(formData.get("sort_order") || 0),
    active: formData.get("active") === "on"
  };

  const { error } = id ? await supabase.from("categories").update(payload).eq("id", id) : await supabase.from("categories").insert(payload);
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
