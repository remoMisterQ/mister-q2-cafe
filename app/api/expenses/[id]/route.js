import path from "node:path";
import { unlink } from "node:fs/promises";
import { getDb, normalizeExpense, ensureUploadsDir } from "@/lib/db";
import { json, normalizeCategory, normalizeExpenseMonth } from "../helpers";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  const db = getDb();
  const expense = normalizeExpense(db.prepare("SELECT * FROM expenses WHERE id = ?").get(id));
  if (!expense) return json({ error: "Expense not found." }, 404);
  const items = db.prepare("SELECT * FROM expense_items WHERE expense_id = ? ORDER BY id").all(id);
  return json({ expense, items });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const allowedStatuses = new Set(["pending_approval", "approved", "final_delete"]);
  const fields = [];
  const values = {};

  if (body.status !== undefined) {
    if (!allowedStatuses.has(body.status)) return json({ error: "Invalid status." }, 400);
    fields.push("status = :status");
    values.status = body.status;
  }
  if (body.category !== undefined) {
    fields.push("category = :category");
    values.category = normalizeCategory(body.category);
  }
  if (body.comment !== undefined) {
    fields.push("comment = :comment");
    values.comment = body.comment || "";
  }
  if (body.expense_month !== undefined) {
    fields.push("expense_month = :expense_month");
    values.expense_month = normalizeExpenseMonth(body.expense_month);
  }

  if (!fields.length) return json({ error: "No supported fields provided." }, 400);
  values.id = id;

  const db = getDb();
  db.prepare(`UPDATE expenses SET ${fields.join(", ")} WHERE id = :id`).run(values);
  return json({ ok: true });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const db = getDb();
  const expense = db.prepare("SELECT filename FROM expenses WHERE id = ?").get(id);
  if (!expense) return json({ error: "Expense not found." }, 404);

  db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
  if (expense.filename) {
    try {
      await unlink(path.join(ensureUploadsDir(), expense.filename));
    } catch {}
  }
  return json({ ok: true });
}
