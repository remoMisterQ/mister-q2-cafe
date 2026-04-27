"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, FileImage, Search, Trash2, Upload } from "lucide-react";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/categories";

const PAGE_SIZES = [10, 30, 50, 100];

function createEmptyManual() {
  return { vendor: "", date: "", total: "", expense_month: currentMonth(), category: "Uncategorized", notes: "" };
}

export default function Home() {
  const defaultMonth = currentMonth();
  const [pending, setPending] = useState([]);
  const [finalDelete, setFinalDelete] = useState([]);
  const [approved, setApproved] = useState({ rows: [], total: 0, page: 1, limit: 10 });
  const [totals, setTotals] = useState({ grandTotal: 0, byCategory: {} });
  const [filters, setFilters] = useState({ month: defaultMonth, start: "", end: "", q: "", page: 1, limit: 10 });
  const [uploadMonth, setUploadMonth] = useState(defaultMonth);
  const [manual, setManual] = useState(createEmptyManual());
  const [selected, setSelected] = useState(null);
  const [modalDraft, setModalDraft] = useState({ category: "Uncategorized", comment: "", expense_month: defaultMonth });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const effectiveFilters = useMemo(() => ({
    month: filters.month,
    start: filters.start,
    end: filters.end
  }), [filters.month, filters.start, filters.end]);

  async function refresh() {
    const params = new URLSearchParams({
      page: String(filters.page),
      limit: String(filters.limit),
      status: "approved"
    });
    if (effectiveFilters.month) params.set("month", effectiveFilters.month);
    if (effectiveFilters.start) params.set("start", effectiveFilters.start);
    if (effectiveFilters.end) params.set("end", effectiveFilters.end);

    const approvedUrl = filters.q
      ? `/api/expenses/search?${new URLSearchParams({ ...Object.fromEntries(params), q: filters.q })}`
      : `/api/expenses/list?${params}`;

    const [pendingRes, finalRes, approvedRes, totalsRes] = await Promise.all([
      fetch("/api/expenses/list?status=pending_approval&limit=100&page=1"),
      fetch("/api/expenses/list?status=final_delete&limit=100&page=1"),
      fetch(approvedUrl),
      fetch(`/api/expenses/totals?${new URLSearchParams(effectiveFilters)}`)
    ]);

    setPending((await pendingRes.json()).rows || []);
    setFinalDelete((await finalRes.json()).rows || []);
    setApproved(await approvedRes.json());
    setTotals(await totalsRes.json());
  }

  useEffect(() => {
    refresh();
  }, [filters.page, filters.limit, filters.q, effectiveFilters.month, effectiveFilters.start, effectiveFilters.end]);

  async function uploadReceipt(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = form.elements.receipt.files[0];
    if (!file) return;
    setBusy(true);
    const data = new FormData();
    data.append("receipt", file);
    data.append("expense_month", uploadMonth);
    const result = await fetch("/api/expenses/upload", { method: "POST", body: data }).then((res) => res.json());
    form.reset();
    setNotice(
      result.ocr_status === "parsed"
        ? "Receipt uploaded and read by OCR. It is waiting for approval."
        : `Receipt uploaded and saved as pending. OCR was not completed${result.ocr_reason ? `: ${result.ocr_reason}` : "."}`
    );
    setBusy(false);
    await refresh();
  }

  async function submitManual(event) {
    event.preventDefault();
    setBusy(true);
    await fetch("/api/expenses/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manual)
    });
    setManual(createEmptyManual());
    setBusy(false);
    await refresh();
  }

  async function openExpense(id) {
    const payload = await fetch(`/api/expenses/${id}`).then((res) => res.json());
    setSelected(payload);
    setModalDraft({
      category: payload.expense.category || "Uncategorized",
      comment: payload.expense.comment || "",
      expense_month: payload.expense.expense_month || currentMonth()
    });
  }

  async function patchSelected(patch) {
    if (!selected) return;
    await fetch(`/api/expenses/${selected.expense.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...patch,
        category: modalDraft.category,
        comment: modalDraft.comment,
        expense_month: modalDraft.expense_month
      })
    });
    setSelected(null);
    await refresh();
  }

  async function deleteExpense(id) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    await refresh();
  }

  const grouped = CATEGORIES.map((category) => ({
    category,
    rows: (approved.rows || []).filter((row) => (row.category || "Uncategorized") === category)
  })).filter((group) => group.rows.length);
  const totalPages = Math.max(1, Math.ceil((approved.total || 0) / approved.limit));

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Coffee shop business</p>
          <h1>Expense Tracker</h1>
        </div>
        <div className="heroTotal">
          <span>Approved total</span>
          <strong>{money(totals.grandTotal)}</strong>
        </div>
      </header>

      <section className="grid topGrid">
        <article className="card">
          <div className="cardTitle">
            <Upload size={18} />
            <h2>Upload receipt</h2>
          </div>
          <form onSubmit={uploadReceipt} className="stack">
            <label className="field">
              <span>Expense month</span>
              <input type="month" value={uploadMonth} onChange={(e) => setUploadMonth(e.target.value)} />
            </label>
            <label className="fileBox">
              <FileImage size={22} />
              <span>JPG or PNG receipt</span>
              <input name="receipt" type="file" accept="image/png,image/jpeg" />
            </label>
            <button disabled={busy} className="primary">Upload</button>
            {notice && <p className="notice">{notice}</p>}
          </form>
        </article>

        <article className="card">
          <h2>Manual entry</h2>
          <form onSubmit={submitManual} className="manualGrid">
            <input required placeholder="Vendor" value={manual.vendor} onChange={(e) => setManual({ ...manual, vendor: e.target.value })} />
            <input required type="date" value={manual.date} onChange={(e) => setManual({ ...manual, date: e.target.value })} />
            <input required type="number" step="0.01" placeholder="Total" value={manual.total} onChange={(e) => setManual({ ...manual, total: e.target.value })} />
            <input required type="month" value={manual.expense_month} onChange={(e) => setManual({ ...manual, expense_month: e.target.value })} />
            <select value={manual.category} onChange={(e) => setManual({ ...manual, category: e.target.value })}>
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
            <textarea placeholder="Notes" value={manual.notes} onChange={(e) => setManual({ ...manual, notes: e.target.value })} />
            <button disabled={busy} className="primary">Add pending</button>
          </form>
        </article>
      </section>

      <section className="grid statusGrid">
        <QueueCard title="Pending Approval" rows={pending} onOpen={openExpense} />
        <article className="card dangerCard">
          <h2>APPROVAL FOR FINAL DELETE</h2>
          <div className="queueList">
            {finalDelete.map((row) => (
              <button key={row.id} className="queueRow" onClick={() => openExpense(row.id)}>
                <span>{row.vendor || "Unknown vendor"}</span>
                <strong>{money(row.total)}</strong>
                <Trash2 size={16} onClick={(event) => { event.stopPropagation(); deleteExpense(row.id); }} />
              </button>
            ))}
            {!finalDelete.length && <p className="muted">No expenses waiting for final delete.</p>}
          </div>
        </article>
      </section>

      <section className="grid midGrid">
        <article className="card">
          <div className="cardTitle">
            <Search size={18} />
            <h2>Search & filters</h2>
          </div>
          <div className="filterGrid">
            <label><span>Month</span><input type="month" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value, page: 1 })} /></label>
            <label><span>Uploaded start</span><input type="date" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value, page: 1 })} /></label>
            <label><span>Uploaded end</span><input type="date" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value, page: 1 })} /></label>
            <label className="wide"><span>Search vendor, upload date, or line items</span><input value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })} placeholder="2026-04-27, milk, espresso, supplier..." /></label>
          </div>
        </article>

        <article className="card totalsCard">
          <h2>Totals by category</h2>
          <div className="grand">{money(totals.grandTotal)}</div>
          <div className="totalsList">
            {CATEGORIES.map((category) => (
              <div key={category}>
                <Badge category={category} />
                <strong>{money(totals.byCategory?.[category] || 0)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="approvedSection">
        <div className="sectionHead">
          <h2>Approved expenses</h2>
          <select value={filters.limit} onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}>
            {PAGE_SIZES.map((size) => <option key={size} value={size}>{size} / page</option>)}
          </select>
        </div>
        {grouped.map((group) => (
          <article key={group.category} className="categoryBlock">
            <Badge category={group.category} />
            <div className="expenseList">
              {group.rows.map((row) => <ExpenseRow key={row.id} row={row} onClick={() => openExpense(row.id)} />)}
            </div>
          </article>
        ))}
        {!grouped.length && <div className="empty">No approved expenses found for these filters.</div>}
        <div className="pagination">
          <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}><ChevronLeft size={16} /> Prev</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} className={page === filters.page ? "activePage" : ""} onClick={() => setFilters({ ...filters, page })}>{page}</button>
          ))}
          <button disabled={filters.page >= totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next <ChevronRight size={16} /></button>
        </div>
      </section>

      {selected && (
        <div className="modalBackdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modalHead">
              <div>
                <p className="eyebrow">Expense details</p>
                <h2>{selected.expense.vendor || "Unknown vendor"}</h2>
              </div>
              <button className="ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="detailGrid">
              <Detail label="Receipt date" value={selected.expense.date || "Not detected"} />
              <Detail label="Expense month" value={selected.expense.expense_month || "Not set"} />
              <Detail label="Uploaded date" value={selected.expense.created_at} />
              <Detail label="Total" value={money(selected.expense.total)} />
              <Detail label="Status" value={selected.expense.status} />
            </div>
            <label className="field"><span>Expense month</span><input type="month" value={modalDraft.expense_month} onChange={(e) => setModalDraft({ ...modalDraft, expense_month: e.target.value })} /></label>
            <label className="field"><span>Category</span><select value={modalDraft.category} onChange={(e) => setModalDraft({ ...modalDraft, category: e.target.value })}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
            <div className="itemsTable">
              <div className="itemsHeader"><span>Description</span><span>Qty</span><span>Unit</span><span>Total</span></div>
              {selected.items.map((item) => (
                <div key={item.id}><span>{item.description || "Item"}</span><span>{item.qty ?? ""}</span><span>{money(item.unit_price)}</span><span>{money(item.line_total)}</span></div>
              ))}
              {!selected.items.length && <p className="muted">No line items saved.</p>}
            </div>
            <label className="field"><span>Comment</span><textarea value={modalDraft.comment} onChange={(e) => setModalDraft({ ...modalDraft, comment: e.target.value })} /></label>
            <div className="modalActions">
              <button className="secondary" onClick={() => patchSelected({})}>Save comment</button>
              {selected.expense.status === "pending_approval" && <button className="primary" onClick={() => patchSelected({ status: "approved" })}>Approve</button>}
              <button className="secondary" onClick={() => patchSelected({ status: "pending_approval" })}>Keep Pending</button>
              <button className="danger" onClick={() => patchSelected({ status: "final_delete" })}>Move to Final Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function QueueCard({ title, rows, onOpen }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <div className="queueList">
        {rows.map((row) => (
          <button key={row.id} className="queueRow" onClick={() => onOpen(row.id)}>
            <span>{row.vendor || "New receipt"}</span>
            <small>{row.date || row.created_at}</small>
            <strong>{money(row.total)}</strong>
          </button>
        ))}
        {!rows.length && <p className="muted">Nothing pending right now.</p>}
      </div>
    </article>
  );
}

function ExpenseRow({ row, onClick }) {
  return (
    <button className="expenseRow" onClick={onClick}>
      <span>{row.vendor || "Unknown vendor"}</span>
      <span><Calendar size={14} /> {row.date || "No date"}</span>
      <strong>{money(row.total)}</strong>
    </button>
  );
}

function Badge({ category }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Uncategorized;
  return <span className="badge" style={{ background: style.bg, color: style.text }}>{category}</span>;
}

function Detail({ label, value }) {
  return <div className="detail"><span>{label}</span><strong>{value}</strong></div>;
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}
