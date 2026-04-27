import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { mkdirSync } from "node:fs";

const dbPath = path.join(process.cwd(), "expense-tracker.sqlite");
let db;

export function getDb() {
  if (!db) {
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA foreign_keys = ON");
    db.exec("PRAGMA journal_mode = WAL");
    migrate(db);
  }
  return db;
}

export function ensureUploadsDir() {
  const uploadDir = path.join(process.cwd(), "uploads");
  mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      vendor TEXT,
      total REAL DEFAULT 0,
      date TEXT,
      expense_month TEXT,
      category TEXT DEFAULT 'Uncategorized',
      status TEXT NOT NULL DEFAULT 'pending_approval',
      comment TEXT DEFAULT '',
      details_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expense_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expense_id INTEGER NOT NULL,
      description TEXT,
      qty REAL,
      unit_price REAL,
      line_total REAL,
      FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    CREATE INDEX IF NOT EXISTS idx_expense_items_expense_id ON expense_items(expense_id);
  `);

  const columns = database.prepare("PRAGMA table_info(expenses)").all().map((column) => column.name);
  if (!columns.includes("expense_month")) {
    database.exec("ALTER TABLE expenses ADD COLUMN expense_month TEXT");
  }
  database.exec(`
    UPDATE expenses
    SET expense_month = CASE
      WHEN filename IS NOT NULL AND filename != '' THEN substr(created_at, 1, 7)
      ELSE substr(COALESCE(NULLIF(date, ''), created_at), 1, 7)
    END
    WHERE expense_month IS NULL OR expense_month = ''
  `);
  database.exec("CREATE INDEX IF NOT EXISTS idx_expenses_month ON expenses(expense_month)");
}

export function normalizeExpense(row) {
  if (!row) return null;
  return {
    ...row,
    total: Number(row.total || 0),
    details_json: safeJson(row.details_json)
  };
}

export function safeJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function insertItems(database, expenseId, items = []) {
  const stmt = database.prepare(`
    INSERT INTO expense_items (expense_id, description, qty, unit_price, line_total)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const item of items) {
    stmt.run(
      expenseId,
      item.description || "",
      numberOrNull(item.qty),
      numberOrNull(item.unit_price),
      numberOrNull(item.line_total)
    );
  }
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
