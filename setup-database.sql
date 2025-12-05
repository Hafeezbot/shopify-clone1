-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS admin_panel;

-- Use the database
USE admin_panel;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password is 'admin123' hashed with SHA-256)
-- In a real application, use a proper password hashing algorithm like bcrypt
INSERT INTO admins (username, password)
SELECT 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

-- Insert sample products
INSERT INTO products (name, description, price, stock)
SELECT 'Laptop', 'High-performance laptop with 16GB RAM', 999.99, 10
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop');

INSERT INTO products (name, description, price, stock)
SELECT 'Smartphone', 'Latest model with 128GB storage', 699.99, 15
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smartphone');

INSERT INTO products (name, description, price, stock)
SELECT 'Headphones', 'Noise-cancelling wireless headphones', 199.99, 20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Headphones');

-- Show tables
SHOW TABLES;

-- Show admin users
SELECT id, username, created_at FROM admins;

-- Show products
SELECT * FROM products;
