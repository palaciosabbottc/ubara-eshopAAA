-- Add display_order column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add display_order column to collections table
ALTER TABLE collections
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Update existing records with sequential display_order
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as rn
  FROM products
)
UPDATE products p
SET display_order = np.rn
FROM numbered_products np
WHERE p.id = np.id;

WITH numbered_collections AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as rn
  FROM collections
)
UPDATE collections c
SET display_order = nc.rn
FROM numbered_collections nc
WHERE c.id = nc.id; 