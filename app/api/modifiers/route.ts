import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertModifierGroup(request);
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  return upsertModifierGroup(request);
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireSignedInAdmin();
  if (unauthorized) return unauthorized;
  const supabase = createServiceClient();
  const id = request.nextUrl.searchParams.get("id");
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  if (!id) return NextResponse.json({ error: "Missing modifier group id." }, { status: 400 });

  const { error } = await supabase.from("modifier_groups").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

async function upsertModifierGroup(request: NextRequest) {
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });

  const formData = await request.formData();
  const id = String(formData.get("id") || "");
  const menuItemId = String(formData.get("menu_item_id") || "");
  const name = String(formData.get("name") || "");
  if (!menuItemId || !name) return NextResponse.json({ error: "Product and customization name are required." }, { status: 400 });

  const groupPayload = {
    menu_item_id: menuItemId,
    name,
    slug: slugify(`${menuItemId}-${name}`),
    min_select: Number(formData.get("min_select") || 0),
    max_select: Number(formData.get("max_select") || 1),
    active: formData.get("active") === "on"
  };

  const { data: group, error: groupError } = id
    ? await supabase.from("modifier_groups").update(groupPayload).eq("id", id).select("id").single()
    : await supabase.from("modifier_groups").insert(groupPayload).select("id").single();
  if (groupError) return NextResponse.json({ error: groupError.message }, { status: 500 });

  await supabase.from("modifier_options").delete().eq("group_id", group.id);
  const optionNames = formData.getAll("option_name").map(String);
  const optionPrices = formData.getAll("option_price").map(String);
  const options = optionNames
    .map((optionName, index) => ({
      group_id: group.id,
      name: optionName.trim(),
      price_delta: Number(optionPrices[index] || 0),
      active: true
    }))
    .filter((option) => option.name);

  if (options.length) {
    const { error: optionsError } = await supabase.from("modifier_options").insert(options);
    if (optionsError) return NextResponse.json({ error: optionsError.message }, { status: 500 });
  }

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
