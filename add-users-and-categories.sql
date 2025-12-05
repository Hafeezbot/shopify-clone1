-- Add users table for customer registration/login
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add category column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General';

-- Update existing products with categories
UPDATE products SET category = 'Electronics' WHERE name IN ('Laptop', 'Smartphone', 'Headphones');
UPDATE products SET category = 'General' WHERE category IS NULL;

-- Insert sample user (password is 'user123' hashed with SHA-256)
INSERT INTO users (email, password, first_name, last_name)
SELECT 'user@example.com', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'John', 'Doe'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com');

-- Add more sample products with categories
INSERT INTO products (name, description, price, stock, category)
SELECT 'Gaming Mouse', 'High-precision gaming mouse with RGB lighting', 79.99, 25, 'Electronics'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gaming Mouse');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 8, 'Furniture'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Office Chair');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Coffee Mug', 'Premium ceramic coffee mug', 19.99, 50, 'Home & Kitchen'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coffee Mug');

INSERT INTO products (name, description, price, stock, category)
SELECT 'Bluetooth Speaker', 'Portable wireless speaker with deep bass', 149.99, 12, 'Electronics'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bluetooth Speaker');

-- Show updated tables
SELECT 'Users:' as table_name;
SELECT id, email, first_name, last_name, created_at FROM users;

SELECT 'Products with Categories:' as table_name;
SELECT id, name, category, price, stock FROM products ORDER BY category, name;
