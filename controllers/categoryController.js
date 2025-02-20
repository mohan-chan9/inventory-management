const categoryModel = require('../models/categoryModel');

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error('Category name is required');

    const category = await categoryModel.createCategory(name);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.getCategoryById(id);
    if (!category) throw new Error('Category not found');

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addCategory,
  getCategoryById,
  getAllCategories,
};
