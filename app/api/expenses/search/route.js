import { getDb, normalizeExpense } from "@/lib/db";
import { json, parsePageParams } from "../helpers";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { page, limit, offset } = parsePageParams(searchParams);
  const q = searchParams.get("q") || "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const month = searchParams.get("month");
  const status = searchParams.get("status") || "approved";

  const params = { q: `%${q}%`, status };
  const where = ["e.status = :status"];
  if (q) {
    where.push("(e.vendor LIKE :q OR date(e.created_at) LIKE :q OR EXISTS (SELECT 1 FROM expense_items i WHERE i.expense_id = e.id AND i.description LIKE :q))");
  }
  if (start) {
    where.push("date(e.created_at) >= :start");
    params.start = start;
  }
  if (end) {
    where.push("date(e.created_at) <= :end");
    params.end = end;
  }
  if (month) {
    where.push("e.expense_month = :month");
    params.month = month;
  }

  const whereSql = `WHERE ${where.join(" AND ")}`;
  const db = getDb();
  const total = db.prepare(`SELECT COUNT(*) AS count FROM expenses e ${whereSql}`).get(params).count;
  const rows = db
    .prepare(
      `SELECT e.* FROM expenses e ${whereSql}
       ORDER BY COALESCE(e.date, e.created_at) DESC, e.created_at DESC
       LIMIT :limit OFFSET :offset`
    )
    .all({ ...params, limit, offset })
    .map(normalizeExpense);

  return json({ rows, total, page, limit });
}
