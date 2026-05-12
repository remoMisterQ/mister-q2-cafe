import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("orders").select("*, location:locations(*), order_items(*)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const { id, order_status } = await request.json();
  if (!id || !order_status) return NextResponse.json({ error: "Missing order id or status." }, { status: 400 });

  const { error } = await supabase.from("orders").update({ order_status }).eq("id", id);
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
