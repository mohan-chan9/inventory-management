const pool = require('../config/db');

const createSubcategory = async (name, categoryId) => {
  const query = 'INSERT INTO subcategories (subcategory_name, category_id) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, [name, categoryId]);
  return rows[0];
};

const getSubcategoryById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM subcategories WHERE id = $1', [id]);
  return rows[0];
};

const getAllSubcategories = async () => {
  const { rows } = await pool.query('SELECT * FROM subcategories');
  return rows;
};

module.exports = { createSubcategory, getSubcategoryById, getAllSubcategories };
