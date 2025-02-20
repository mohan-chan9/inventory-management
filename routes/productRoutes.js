const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.addProduct);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);

module.exports = router;
