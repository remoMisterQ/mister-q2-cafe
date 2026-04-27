import { getDb, normalizeExpense } from "@/lib/db";
import { json, parsePageParams } from "../helpers";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { page, limit, offset } = parsePageParams(searchParams);
  const status = searchParams.get("status");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const month = searchParams.get("month");

  const where = [];
  const params = {};
  if (status) {
    where.push("status = :status");
    params.status = status;
  }
  if (start) {
    where.push("date(created_at) >= :start");
    params.start = start;
  }
  if (end) {
    where.push("date(created_at) <= :end");
    params.end = end;
  }
  if (month) {
    where.push("expense_month = :month");
    params.month = month;
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const db = getDb();
  const total = db.prepare(`SELECT COUNT(*) AS count FROM expenses ${whereSql}`).get(params).count;
  const rows = db
    .prepare(
      `SELECT * FROM expenses ${whereSql}
       ORDER BY COALESCE(date, created_at) DESC, created_at DESC
       LIMIT :limit OFFSET :offset`
    )
    .all({ ...params, limit, offset })
    .map(normalizeExpense);

  return json({ rows, total, page, limit });
}
