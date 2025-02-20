const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Add a new inventory item
router.post('/', inventoryController.addInventoryItem);

// Add multiple inventory items in bulk
router.post('/bulk', inventoryController.addInventoryItemsBulk);

// List inventory items with filters
router.get('/', inventoryController.listInventoryItems);

// Update inventory details
router.put('/:id', inventoryController.updateInventory);

// Stock Check-in (increase stock quantity)
router.patch('/:id/checkin', inventoryController.stockCheckin);

// Stock Check-out (decrease stock quantity)
router.patch('/:id/checkout', inventoryController.stockCheckout);

// Generate inventory report
router.get('/reports', inventoryController.generateInventoryReport);

// Generate stock report
router.get('/stock/reports', inventoryController.generateStockReport);

module.exports = router;
