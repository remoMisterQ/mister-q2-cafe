import { getDb } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { json } from "../helpers";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const month = searchParams.get("month");
  const params = {};
  const where = ["status = 'approved'"];

  if (start) {
    where.push("date >= :start");
    params.start = start;
  }
  if (end) {
    where.push("date <= :end");
    params.end = end;
  }
  if (month) {
    where.push("expense_month = :month");
    params.month = month;
  }

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT category, SUM(total) AS total
       FROM expenses
       WHERE ${where.join(" AND ")}
       GROUP BY category`
    )
    .all(params);

  const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
  for (const row of rows) byCategory[row.category || "Uncategorized"] = Number(row.total || 0);
  const grandTotal = Object.values(byCategory).reduce((sum, value) => sum + value, 0);

  return json({ grandTotal, byCategory });
}
