const productModel = require('../models/productModel');
const subcategoryModel = require('../models/subcategoryModel');

const addProduct = async (req, res) => {
  try {
    const { name, subcategoryId, description, price } = req.body;
    if (!name || !subcategoryId || !description || !price) {
      throw new Error('All fields are required');
    }

    const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId);
    if (!subcategory) throw new Error('Invalid subcategory ID');

    const product = await productModel.createProduct(name, subcategoryId, description, price);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) throw new Error('Product not found');

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getProductById,
  getAllProducts,
};
