-- Add volume_pricing JSONB column to products
-- Structure: { "volumeName": { "price": number, "discountPrice"?: number } }
alter table public.products 
add column volume_pricing jsonb not null default '{}'::jsonb;

-- Remove delivery_info column as delivery is handled externally
alter table public.products 
drop column if exists delivery_info;

-- Add comment to explain the volume_pricing structure
comment on column public.products.volume_pricing is 
'JSON structure storing volume-based pricing. 
Example: {"30ml": {"price": 25.50, "discountPrice": 20.00}, "50ml": {"price": 35.00}}';
