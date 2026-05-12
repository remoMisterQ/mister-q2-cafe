export const MA_TAX_RATE = 0.0625;

export function calculateTax(subtotal: number) {
  return roundMoney(subtotal * MA_TAX_RATE);
}

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
