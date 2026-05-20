import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ discounts: data });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertDiscount(request);
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertDiscount(request);
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  const id = request.nextUrl.searchParams.get("id");
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!id) return NextResponse.json({ error: "Missing discount id." }, { status: 400 });

  const { error } = await supabase.from("discount_codes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

async function upsertDiscount(request: NextRequest) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const body = await request.json();
  const code = String(body.code || "").trim().toUpperCase();
  const type = String(body.type || "");
  const value = Number(body.value || 0);

  if (!code || !["percent", "fixed"].includes(type) || value <= 0) {
    return NextResponse.json({ error: "Code, type, and a positive value are required." }, { status: 400 });
  }

  const payload = {
    code,
    type,
    value,
    active: Boolean(body.active),
    starts_at: body.starts_at || null,
    expires_at: body.expires_at || null
  };

  const { error } = body.id
    ? await supabase.from("discount_codes").update(payload).eq("id", body.id)
    : await supabase.from("discount_codes").insert(payload);

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
