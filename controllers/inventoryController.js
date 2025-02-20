const inventoryModel = require('../models/inventoryModel');
const productModel = require('../models/productModel');

const addInventoryItem = async (req, res) => {
  try {
    const { productId, quantity, location } = req.body;
    if (!productId || quantity === undefined || !location) {
      throw new Error('Product ID, quantity, and location are required');
    }

    // Verify product exists
    const product = await productModel.getProductById(productId);
    if (!product) throw new Error('Invalid product ID');

    // Check if the subcategory exists
    const subcategory = await subcategoryModel.getSubcategoryById(product.subcategory_id);
    if (!subcategory) throw new Error('Invalid subcategory ID');

    // Check if the category exists
    const category = await categoryModel.getCategoryById(subcategory.category_id);
    if (!category) throw new Error('Invalid category ID');

    // Check if an inventory item already exists for the given product and location
    const existingInventoryItem = await inventoryModel.getInventoryItemByProductAndLocation(productId, location);
    let inventoryItem;

    if (existingInventoryItem) {
      // Update the existing inventory item
      const newQuantity = existingInventoryItem.quantity + quantity;
      inventoryItem = await inventoryModel.updateInventoryQuantity(existingInventoryItem.id, newQuantity);
    } else {
      // Create a new inventory item
      inventoryItem = await inventoryModel.addInventoryItem(productId, quantity, location);
    }
    res.status(201).json(inventoryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addInventoryItemsBulk = async (req, res) => {
  try {
    const items = req.body; // Expecting an array of inventory items
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('An array of inventory items is required');
    }

    const processedItems = [];

    for (const item of items) {
      const { productId, quantity, location } = item;

      if (!productId || quantity === undefined || !location) {
        throw new Error('Product ID, quantity, and location are required for each item');
      }

      // Check if the product exists
      const product = await productModel.getProductById(productId);
      if (!product) throw new Error(`Invalid product ID: ${productId}`);

      // Check if the subcategory exists
      const subcategory = await subcategoryModel.getSubcategoryById(product.subcategory_id);
      if (!subcategory) throw new Error(`Invalid subcategory ID for product ID: ${productId}`);

      // Check if the category exists
      const category = await categoryModel.getCategoryById(subcategory.category_id);
      if (!category) throw new Error(`Invalid category ID for subcategory ID: ${subcategory.id}`);

      // Check if an inventory item already exists for the given product and location
      const existingInventoryItem = await inventoryModel.getInventoryItemByProductAndLocation(productId, location);
      let inventoryItem;

      if (existingInventoryItem) {
        // Update the existing inventory item
        const newQuantity = existingInventoryItem.quantity + quantity;
        inventoryItem = await inventoryModel.updateInventoryQuantity(existingInventoryItem.id, newQuantity);
      } else {
        // Create a new inventory item
        inventoryItem = await inventoryModel.addInventoryItem(productId, quantity, location);
      }

      processedItems.push(inventoryItem);
    }

    res.status(201).json(processedItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listInventoryItems = async (req, res) => {
  try {
    const filters = req.query; // category, subcategory, productName, location
    const items = await inventoryModel.getInventoryItems(filters);
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || Object.keys(updates).length === 0) {
      throw new Error('Inventory ID and updates are required');
    }

    const inventoryItem = await inventoryModel.updateInventory(id, updates);
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const stockCheckin = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) throw new Error('Quantity must be minimum 1 Unit');

    const inventoryItem = await inventoryModel.adjustInventory(id, quantity);
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const stockCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) throw new Error('Quantity must be minimum 1 Unit');

    const inventoryItem = await inventoryModel.adjustInventory(id, -quantity);
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const generateInventoryReport = async (req, res) => {
  try {
    const filters = req.query;
    const report = await inventoryModel.generateInventoryReport(filters);
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const generateStockReport = async (req, res) => {
  try {
    const filters = {
      threshold: req.query.threshold || null,
      category: req.query.category || null,
      subcategory: req.query.subcategory || null,
    };
    const report = await inventoryModel.generateStockReport(filters);
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  addInventoryItem,
  addInventoryItemsBulk,
  listInventoryItems,
  updateInventory,
  stockCheckin,
  stockCheckout,
  generateInventoryReport,
  generateStockReport,
};
