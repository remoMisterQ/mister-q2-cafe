insert into locations (id, name, slug, address, city, state, zip, phone, hours, map_embed_url, active) values
('11111111-1111-1111-1111-111111111111', 'Charlestown', 'charlestown', '283 Main St', 'Charlestown', 'MA', '02129', '(617) 398-6228', '6:00 AM - 5:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.1477738754147!2d-71.0694122235211!3d42.37755803399542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e371525d9a1037%3A0x46893ffcbe162f7!2smister%20Q.%20cafe!5e1!3m2!1sen!2sus!4v1778612388621!5m2!1sen!2sus', true),
('22222222-2222-2222-2222-222222222222', 'Revere', 'revere', '791 Broadway', 'Revere', 'MA', '02151', '(781) 555-0122', '6:00 AM - 5:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.9300454714753!2d-71.00979852351945!3d42.41737673147808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e37181e433290b%3A0xb658c1599a6c036f!2sMister%20Q%20Cafe%20Revere!5e1!3m2!1sen!2sus!4v1778612344268!5m2!1sen!2sus', true),
('33333333-3333-3333-3333-333333333333', 'Cambridge', 'cambridge', '150 Western Ave', 'Cambridge', 'MA', '02139', '(617) 555-0133', '6:00 AM - 5:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.8588501642266!2d-71.1114037235216!3d42.364784434802445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e377888237b429%3A0xd2c87540396ce5fe!2sMister%20Q%20Cafe%20Cambridge!5e1!3m2!1sen!2sus!4v1778612441967!5m2!1sen!2sus', true),
('44444444-4444-4444-4444-444444444444', 'Marblehead', 'marblehead', '34 Atlantic Ave', 'Marblehead', 'MA', '01945', '(781) 309-6776', '6:00 AM - 5:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3489.3655433030017!2d-70.86033291014904!3d42.49923595199826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e315d49ba42793%3A0xe8f77463ef7493c3!2sPlus%20Cafe!5e1!3m2!1sen!2sus!4v1778612412960!5m2!1sen!2sus', true)
on conflict (id) do update set name = excluded.name, address = excluded.address, city = excluded.city, state = excluded.state, zip = excluded.zip, phone = excluded.phone, hours = excluded.hours, map_embed_url = excluded.map_embed_url;

insert into categories (id, name, slug, sort_order, active) values
('aaaaaaaa-0000-0000-0000-000000000000', 'Specials', 'specials', 0, true),
('aaaaaaaa-0000-0000-0000-000000000001', 'Coffee', 'coffee', 1, true),
('aaaaaaaa-0000-0000-0000-000000000002', 'Iced Drinks', 'iced-drinks', 2, true),
('aaaaaaaa-0000-0000-0000-000000000003', 'Pastries', 'pastries', 3, true),
('aaaaaaaa-0000-0000-0000-000000000004', 'Breakfast', 'breakfast', 4, true),
('aaaaaaaa-0000-0000-0000-000000000005', 'Sandwiches', 'sandwiches', 5, true),
('aaaaaaaa-0000-0000-0000-000000000006', 'Soups', 'soups', 6, true),
('aaaaaaaa-0000-0000-0000-000000000007', 'Ice Cream', 'ice-cream', 7, true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order, active = excluded.active;

insert into menu_items (id, name, description, price, category_id, image_url, available, featured) values
('bbbbbbbb-0000-0000-0000-000000000001', 'Signature Latte', 'Velvety espresso, steamed milk, and Mister Q vanilla-brown sugar syrup.', 5.75, 'aaaaaaaa-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80', true, true),
('bbbbbbbb-0000-0000-0000-000000000002', 'Cappuccino', 'Double espresso with airy microfoam and cocoa dust.', 4.75, 'aaaaaaaa-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000003', 'Americano', 'Espresso stretched with hot water for a clean, bold finish.', 3.95, 'aaaaaaaa-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000004', 'Espresso', 'A concentrated double shot with a caramel crema.', 3.25, 'aaaaaaaa-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000005', 'Iced Caramel Latte', 'Chilled espresso, milk, caramel, and ice.', 6.25, 'aaaaaaaa-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', true, true),
('bbbbbbbb-0000-0000-0000-000000000006', 'Butter Croissant', 'Flaky, golden, and baked fresh each morning.', 4.25, 'aaaaaaaa-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', true, true),
('bbbbbbbb-0000-0000-0000-000000000007', 'Chocolate Croissant', 'Buttery pastry wrapped around rich chocolate batons.', 4.75, 'aaaaaaaa-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000008', 'Blueberry Muffin', 'Tender muffin packed with blueberries and sugar crumble.', 3.95, 'aaaaaaaa-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000009', 'Chocolate Muffin', 'Deep chocolate crumb with a soft center.', 3.95, 'aaaaaaaa-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000010', 'Egg & Cheese Sandwich', 'Folded egg and cheddar on a toasted brioche roll.', 6.95, 'aaaaaaaa-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000011', 'Bacon Egg & Cheese', 'Crisp bacon, folded egg, and cheddar on brioche.', 7.95, 'aaaaaaaa-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', true, true),
('bbbbbbbb-0000-0000-0000-000000000012', 'Avocado Toast', 'Smashed avocado, lemon, herbs, and chili flakes on sourdough.', 8.95, 'aaaaaaaa-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1603046891744-76e6300f82ef?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000013', 'Turkey Avocado Sandwich', 'Roasted turkey, avocado, greens, and aioli on ciabatta.', 10.95, 'aaaaaaaa-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000014', 'Chicken Pesto Sandwich', 'Grilled chicken, basil pesto, mozzarella, and tomato.', 11.25, 'aaaaaaaa-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000015', 'Caprese Sandwich', 'Mozzarella, tomato, basil, and balsamic on focaccia.', 9.95, 'aaaaaaaa-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000016', 'Tomato Soup', 'Slow-simmered tomato soup finished with cream and basil.', 6.95, 'aaaaaaaa-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000017', 'Chicken Noodle Soup', 'Classic chicken broth, noodles, herbs, and vegetables.', 7.45, 'aaaaaaaa-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000018', 'Vanilla Ice Cream Cup', 'Creamy vanilla bean ice cream in a pickup-ready cup.', 4.95, 'aaaaaaaa-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80', true, false),
('bbbbbbbb-0000-0000-0000-000000000019', 'Chocolate Ice Cream Cup', 'Rich chocolate ice cream with a silky finish.', 4.95, 'aaaaaaaa-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80', true, false)
on conflict (id) do update set name = excluded.name, description = excluded.description, price = excluded.price, category_id = excluded.category_id, image_url = excluded.image_url, available = excluded.available, featured = excluded.featured, updated_at = now();

insert into menu_item_locations (menu_item_id, location_id, available)
select menu_items.id, locations.id, true
from menu_items
cross join locations
on conflict (menu_item_id, location_id) do update set available = excluded.available;

insert into modifier_groups (id, menu_item_id, name, slug, min_select, max_select, active) values
('cccccccc-0000-0000-0000-000000000001', null, 'Size', 'size', 1, 1, true),
('cccccccc-0000-0000-0000-000000000002', null, 'Milk', 'milk', 0, 1, true),
('cccccccc-0000-0000-0000-000000000003', null, 'Extras', 'extras', 0, 3, true)
on conflict (id) do update set menu_item_id = excluded.menu_item_id, name = excluded.name, slug = excluded.slug, min_select = excluded.min_select, max_select = excluded.max_select, active = excluded.active;

insert into modifier_options (id, group_id, name, price_delta, active) values
('dddddddd-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', 'Small', 0, true),
('dddddddd-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000001', 'Medium', 0.75, true),
('dddddddd-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000001', 'Large', 1.25, true),
('dddddddd-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-000000000002', 'Whole milk', 0, true),
('dddddddd-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000002', 'Oat milk', 0.75, true),
('dddddddd-0000-0000-0000-000000000006', 'cccccccc-0000-0000-0000-000000000002', 'Almond milk', 0.75, true),
('dddddddd-0000-0000-0000-000000000007', 'cccccccc-0000-0000-0000-000000000003', 'Extra espresso shot', 1, true),
('dddddddd-0000-0000-0000-000000000008', 'cccccccc-0000-0000-0000-000000000003', 'Vanilla syrup', 0.50, true),
('dddddddd-0000-0000-0000-000000000009', 'cccccccc-0000-0000-0000-000000000003', 'Caramel syrup', 0.50, true)
on conflict (id) do update set group_id = excluded.group_id, name = excluded.name, price_delta = excluded.price_delta, active = excluded.active;
