export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
  created_at?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category?: Category;
  image_url: string;
  available: boolean;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
  location_ids?: string[];
};

export type ModifierOption = {
  id: string;
  group_id: string;
  name: string;
  price_delta: number;
  active: boolean;
};

export type ModifierGroup = {
  id: string;
  menu_item_id?: string | null;
  name: string;
  slug: string;
  min_select: number;
  max_select: number;
  active: boolean;
  options: ModifierOption[];
};

export type SelectedModifier = ModifierOption & {
  group_name: string;
};

export type CartItem = MenuItem & {
  cart_id?: string;
  quantity: number;
  selected_modifiers?: SelectedModifier[];
};
