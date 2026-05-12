import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const formData = await request.formData();
  const id = String(formData.get("id") || "");
  if (!id) return NextResponse.json({ error: "Missing location id." }, { status: 400 });

  const { error } = await supabase
    .from("locations")
    .update({
      name: String(formData.get("name") || ""),
      slug: String(formData.get("slug") || ""),
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      zip: String(formData.get("zip") || ""),
      phone: String(formData.get("phone") || ""),
      hours: String(formData.get("hours") || ""),
      map_embed_url: String(formData.get("map_embed_url") || ""),
      active: formData.get("active") === "on"
    })
    .eq("id", id);

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
