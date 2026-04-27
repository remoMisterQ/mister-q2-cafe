import { getDb } from "@/lib/db";
import { json, normalizeCategory, normalizeExpenseMonth } from "../helpers";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json();
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO expenses (filename, vendor, total, date, expense_month, category, status, comment, details_json)
       VALUES (NULL, ?, ?, ?, ?, ?, 'pending_approval', ?, ?)`
    )
    .run(
      body.vendor || "",
      Number(body.total || 0),
      body.date || "",
      normalizeExpenseMonth(body.expense_month || (body.date || "").slice(0, 7)),
      normalizeCategory(body.category),
      body.notes || "",
      JSON.stringify({ source: "manual" })
    );

  return json({ id: result.lastInsertRowid, status: "pending_approval" }, 201);
}
