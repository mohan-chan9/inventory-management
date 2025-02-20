const subcategoryModel = require('../models/subcategoryModel');
const categoryModel = require('../models/categoryModel');

const addSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) throw new Error('Subcategory name and category ID are required');

    const category = await categoryModel.getCategoryById(categoryId);
    if (!category) throw new Error('Invalid category ID');

    const subcategory = await subcategoryModel.createSubcategory(name, categoryId);
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subcategoryModel.getSubcategoryById(id);
    if (!subcategory) throw new Error('Subcategory not found');

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await subcategoryModel.getAllSubcategories();
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addSubcategory,
  getSubcategoryById,
  getAllSubcategories,
};
