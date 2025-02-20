const pool = require('../config/db');

const createProduct = async (name, subcategoryId, description, price) => {
  const query = `
    INSERT INTO products (product_name, subcategory_id, description, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [name, subcategoryId, description, price]);
  return rows[0];
};

const getProductById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0];
};

const getAllProducts = async () => {
  const { rows } = await pool.query('SELECT * FROM products');
  return rows;
};

module.exports = { createProduct, getProductById, getAllProducts };
