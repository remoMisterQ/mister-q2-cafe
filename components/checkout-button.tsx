"use client";

import { useState } from "react";
import { AlertCircle, CreditCard } from "lucide-react";
import type { CheckoutPayload } from "@/types/order";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  payload,
  validationErrors = [],
  onValidationFail
}: {
  payload: CheckoutPayload;
  validationErrors?: string[];
  onValidationFail?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function checkout() {
    setErrors([]);
    if (validationErrors.length) {
      setErrors(validationErrors);
      onValidationFail?.();
      return;
    }

    setLoading(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setErrors([data.error || "Unable to place order."]);
      return;
    }

    localStorage.removeItem("mister-q-cart");
    window.dispatchEvent(new Event("mister-q-cart-updated"));
    window.location.href = data.url;
  }

  return (
    <div className="grid gap-2">
      <Button type="button" onClick={checkout} disabled={loading} className="h-12 w-full text-base">
        <CreditCard size={17} />
        {loading ? "Placing order..." : "Continue"}
      </Button>
      {!!errors.length && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="mb-2 flex items-center gap-2 font-black">
            <AlertCircle size={16} />
            Please complete:
          </p>
          <ul className="grid gap-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
