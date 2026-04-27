import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export async function parseReceiptWithOpenAI(file, mimeType) {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    return {
      ocr_status: "skipped",
      ocr_reason: "OPENAI_API_KEY is not configured"
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${mimeType};base64,${bytes.toString("base64")}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Extract receipt data as strict JSON with keys vendor, date (YYYY-MM-DD if possible), total, line_items. line_items must be an array of {description, qty, unit_price, line_total}. Return JSON only."
            },
            {
              type: "input_image",
              image_url: dataUrl
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI OCR failed: ${response.status}`);
  }

  const payload = await response.json();
  const text = payload.output_text || payload.output?.flatMap((item) => item.content || []).find((part) => part.text)?.text;
  if (!text) return null;

  try {
    return {
      ocr_status: "parsed",
      ...JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim())
    };
  } catch {
    return { ocr_status: "unparsed", raw_text: text };
  }
}

function getOpenAIKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;

  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return "";

  const env = readFileSync(envPath, "utf8");
  const line = env
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith("OPENAI_API_KEY="));

  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "");
}
