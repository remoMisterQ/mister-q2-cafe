import path from "node:path";
import { writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { getDb, ensureUploadsDir, insertItems } from "@/lib/db";
import { parseReceiptWithOpenAI } from "@/lib/ocr";
import { json, isAllowedImage, normalizeCategory, normalizeExpenseMonth } from "../helpers";

export const runtime = "nodejs";

export async function POST(request) {
  const form = await request.formData();
  const file = form.get("receipt");
  const expenseMonth = normalizeExpenseMonth(form.get("expense_month"));

  if (!isAllowedImage(file)) {
    return json({ error: "Only JPG and PNG receipts are supported." }, 400);
  }

  const uploadDir = ensureUploadsDir();
  const extension = file.type === "image/png" ? "png" : "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const savedPath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(savedPath, bytes);

  let parsed = null;
  try {
    parsed = await parseReceiptWithOpenAI(new File([bytes], file.name, { type: file.type }), file.type);
  } catch (error) {
    parsed = { ocr_status: "failed", ocr_error: error.message };
  }

  const items = Array.isArray(parsed?.line_items) ? parsed.line_items : [];
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO expenses (filename, vendor, total, date, expense_month, category, status, details_json)
       VALUES (?, ?, ?, ?, ?, ?, 'pending_approval', ?)`
    )
    .run(
      filename,
      parsed?.vendor || "",
      Number(parsed?.total || 0),
      parsed?.date || "",
      expenseMonth,
      normalizeCategory(parsed?.category),
      JSON.stringify(parsed || {})
    );

  insertItems(db, result.lastInsertRowid, items);
  return json(
    {
      id: result.lastInsertRowid,
      status: "pending_approval",
      ocr_status: parsed?.ocr_status || "unknown",
      ocr_reason: parsed?.ocr_reason || parsed?.ocr_error || ""
    },
    201
  );
}
