import type { Location } from "@/types/location";
import type { Category, MenuItem, ModifierGroup } from "@/types/menu";

export const locations: Location[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Charlestown",
    slug: "charlestown",
    address: "123 Main Street",
    city: "Charlestown",
    state: "MA",
    zip: "02129",
    phone: "(617) 555-0111",
    hours: "6:00 AM - 5:00 PM",
    map_embed_url: "",
    active: true
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Revere",
    slug: "revere",
    address: "45 Beach Street",
    city: "Revere",
    state: "MA",
    zip: "02151",
    phone: "(781) 555-0122",
    hours: "6:00 AM - 5:00 PM",
    map_embed_url: "",
    active: true
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Cambridge",
    slug: "cambridge",
    address: "88 River Avenue",
    city: "Cambridge",
    state: "MA",
    zip: "02139",
    phone: "(617) 555-0133",
    hours: "6:00 AM - 5:00 PM",
    map_embed_url: "",
    active: true
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Marblehead",
    slug: "marblehead",
    address: "7 Harbor Lane",
    city: "Marblehead",
    state: "MA",
    zip: "01945",
    phone: "(781) 555-0144",
    hours: "6:00 AM - 5:00 PM",
    map_embed_url: "",
    active: true
  }
];

export const categories: Category[] = [
  { id: "aaaaaaaa-0000-0000-0000-000000000001", name: "Coffee", slug: "coffee", sort_order: 1, active: true },
  { id: "aaaaaaaa-0000-0000-0000-000000000002", name: "Iced Drinks", slug: "iced-drinks", sort_order: 2, active: true },
  { id: "aaaaaaaa-0000-0000-0000-000000000003", name: "Pastries", slug: "pastries", sort_order: 3, active: true },
  { id: "aaaaaaaa-0000-0000-0000-000000000004", name: "Breakfast", slug: "breakfast", sort_order: 4, active: true },
  { id: "aaaaaaaa-0000-0000-0000-000000000005", name: "Sandwiches", slug: "sandwiches", sort_order: 5, active: true },
  { id: "aaaaaaaa-0000-0000-0000-000000000006", name: "Soups", slug: "soups", sort_order: 6, active: true },
  { id: "aaaaaaaa-0000-0000-0000-000000000007", name: "Ice Cream", slug: "ice-cream", sort_order: 7, active: true }
];

const img = {
  latte: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
  espresso: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80",
  iced: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
  pastry: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  muffin: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80",
  breakfast: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  toast: "https://images.unsplash.com/photo-1603046891744-76e6300f82ef?auto=format&fit=crop&w=900&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  soup: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  iceCream: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80"
};

function item(id: number, name: string, description: string, price: number, categoryIndex: number, image_url: string, featured = false): MenuItem {
  return {
    id: `bbbbbbbb-0000-0000-0000-${id.toString().padStart(12, "0")}`,
    name,
    description,
    price,
    category_id: categories[categoryIndex].id,
    category: categories[categoryIndex],
    image_url,
    available: true,
    featured,
    location_ids: locations.map((location) => location.id)
  };
}

export const menuItems: MenuItem[] = [
  item(1, "Signature Latte", "Velvety espresso, steamed milk, and Mister Q vanilla-brown sugar syrup.", 5.75, 0, img.latte, true),
  item(2, "Cappuccino", "Double espresso with airy microfoam and cocoa dust.", 4.75, 0, img.latte),
  item(3, "Americano", "Espresso stretched with hot water for a clean, bold finish.", 3.95, 0, img.espresso),
  item(4, "Espresso", "A concentrated double shot with a caramel crema.", 3.25, 0, img.espresso),
  item(5, "Iced Caramel Latte", "Chilled espresso, milk, caramel, and ice.", 6.25, 1, img.iced, true),
  item(6, "Butter Croissant", "Flaky, golden, and baked fresh each morning.", 4.25, 2, img.pastry, true),
  item(7, "Chocolate Croissant", "Buttery pastry wrapped around rich chocolate batons.", 4.75, 2, img.pastry),
  item(8, "Blueberry Muffin", "Tender muffin packed with blueberries and sugar crumble.", 3.95, 2, img.muffin),
  item(9, "Chocolate Muffin", "Deep chocolate crumb with a soft center.", 3.95, 2, img.muffin),
  item(10, "Egg & Cheese Sandwich", "Folded egg and cheddar on a toasted brioche roll.", 6.95, 3, img.breakfast),
  item(11, "Bacon Egg & Cheese", "Crisp bacon, folded egg, and cheddar on brioche.", 7.95, 3, img.breakfast, true),
  item(12, "Avocado Toast", "Smashed avocado, lemon, herbs, and chili flakes on sourdough.", 8.95, 3, img.toast),
  item(13, "Turkey Avocado Sandwich", "Roasted turkey, avocado, greens, and aioli on ciabatta.", 10.95, 4, img.sandwich),
  item(14, "Chicken Pesto Sandwich", "Grilled chicken, basil pesto, mozzarella, and tomato.", 11.25, 4, img.sandwich),
  item(15, "Caprese Sandwich", "Mozzarella, tomato, basil, and balsamic on focaccia.", 9.95, 4, img.sandwich),
  item(16, "Tomato Soup", "Slow-simmered tomato soup finished with cream and basil.", 6.95, 5, img.soup),
  item(17, "Chicken Noodle Soup", "Classic chicken broth, noodles, herbs, and vegetables.", 7.45, 5, img.soup),
  item(18, "Vanilla Ice Cream Cup", "Creamy vanilla bean ice cream in a pickup-ready cup.", 4.95, 6, img.iceCream),
  item(19, "Chocolate Ice Cream Cup", "Rich chocolate ice cream with a silky finish.", 4.95, 6, img.iceCream)
];

export const modifierGroups: ModifierGroup[] = [
  {
    id: "cccccccc-0000-0000-0000-000000000001",
    name: "Size",
    slug: "size",
    min_select: 1,
    max_select: 1,
    active: true,
    options: [
      { id: "dddddddd-0000-0000-0000-000000000001", group_id: "cccccccc-0000-0000-0000-000000000001", name: "Small", price_delta: 0, active: true },
      { id: "dddddddd-0000-0000-0000-000000000002", group_id: "cccccccc-0000-0000-0000-000000000001", name: "Medium", price_delta: 0.75, active: true },
      { id: "dddddddd-0000-0000-0000-000000000003", group_id: "cccccccc-0000-0000-0000-000000000001", name: "Large", price_delta: 1.25, active: true }
    ]
  },
  {
    id: "cccccccc-0000-0000-0000-000000000002",
    name: "Milk",
    slug: "milk",
    min_select: 0,
    max_select: 1,
    active: true,
    options: [
      { id: "dddddddd-0000-0000-0000-000000000004", group_id: "cccccccc-0000-0000-0000-000000000002", name: "Whole milk", price_delta: 0, active: true },
      { id: "dddddddd-0000-0000-0000-000000000005", group_id: "cccccccc-0000-0000-0000-000000000002", name: "Oat milk", price_delta: 0.75, active: true },
      { id: "dddddddd-0000-0000-0000-000000000006", group_id: "cccccccc-0000-0000-0000-000000000002", name: "Almond milk", price_delta: 0.75, active: true }
    ]
  },
  {
    id: "cccccccc-0000-0000-0000-000000000003",
    name: "Extras",
    slug: "extras",
    min_select: 0,
    max_select: 3,
    active: true,
    options: [
      { id: "dddddddd-0000-0000-0000-000000000007", group_id: "cccccccc-0000-0000-0000-000000000003", name: "Extra espresso shot", price_delta: 1, active: true },
      { id: "dddddddd-0000-0000-0000-000000000008", group_id: "cccccccc-0000-0000-0000-000000000003", name: "Vanilla syrup", price_delta: 0.5, active: true },
      { id: "dddddddd-0000-0000-0000-000000000009", group_id: "cccccccc-0000-0000-0000-000000000003", name: "Caramel syrup", price_delta: 0.5, active: true }
    ]
  }
];
