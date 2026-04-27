import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function parsePageParams(searchParams) {
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const requestedLimit = Number(searchParams.get("limit") || 10);
  const limit = [10, 30, 50, 100].includes(requestedLimit) ? requestedLimit : 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function normalizeCategory(category) {
  return CATEGORIES.includes(category) ? category : "Uncategorized";
}

export function normalizeExpenseMonth(month) {
  return /^\d{4}-\d{2}$/.test(month || "") ? month : new Date().toISOString().slice(0, 7);
}

export function isAllowedImage(file) {
  return file && ["image/jpeg", "image/png"].includes(file.type);
}
