const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.addCategory);
router.get('/:id', categoryController.getCategoryById);
router.get('/', categoryController.getAllCategories);

module.exports = router;
