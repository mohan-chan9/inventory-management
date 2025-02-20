const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');

router.post('/', subcategoryController.addSubcategory);
router.get('/:id', subcategoryController.getSubcategoryById);
router.get('/', subcategoryController.getAllSubcategories);

module.exports = router;
