const pool = require('../config/db');

const createCategory = async (name) => {
  const query = 'INSERT INTO categories (category_name) VALUES ($1) RETURNING *';
  const { rows } = await pool.query(query, [name]);
  return rows[0];
};

const getCategoryById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0];
};

const getAllCategories = async () => {
  const { rows } = await pool.query('SELECT * FROM categories');
  return rows;
};

module.exports = { createCategory, getCategoryById, getAllCategories };
