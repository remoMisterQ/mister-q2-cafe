import type { CartItem, SelectedModifier } from "@/types/menu";
import { roundMoney } from "@/lib/tax";

export function modifiersTotal(modifiers: SelectedModifier[] = []) {
  return roundMoney(modifiers.reduce((sum, modifier) => sum + Number(modifier.price_delta || 0), 0));
}

export function cartItemUnitPrice(item: CartItem) {
  return roundMoney(Number(item.price) + modifiersTotal(item.selected_modifiers));
}

export function cartItemTotal(item: CartItem) {
  return roundMoney(cartItemUnitPrice(item) * item.quantity);
}

export function cartItemKey(item: CartItem) {
  return item.cart_id || `${item.id}:${(item.selected_modifiers || []).map((modifier) => modifier.id).sort().join(",")}`;
}
