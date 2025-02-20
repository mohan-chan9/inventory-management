-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Subcategories Table
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  subcategory_name VARCHAR(100) NOT NULL,
  category_id INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  subcategory_id INTEGER NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

-- Inventory Table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  location VARCHAR(255) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
