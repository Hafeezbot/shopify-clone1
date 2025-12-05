-- Ensure users table exists with correct structure
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear any existing test users and recreate
DELETE FROM users WHERE email = 'user@example.com';

-- Insert test user with correct password hash for 'user123'
INSERT INTO users (email, password, first_name, last_name)
VALUES ('user@example.com', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'John', 'Doe');

-- Insert another test user for testing
INSERT INTO users (email, password, first_name, last_name)
VALUES ('jane@example.com', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'Jane', 'Smith');

-- Show all users
SELECT id, email, first_name, last_name, created_at FROM users;

-- Verify admin table is separate
SELECT 'Admin users:' as info;
SELECT id, username, created_at FROM admins;
