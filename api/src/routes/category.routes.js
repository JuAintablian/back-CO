const router = require('express-promise-router')();
const categoryController = require('../controllers/category.controller');

router.get('/category', categoryController.getCategoryList);
router.get('/category/:id', categoryController.getCategoryById);
router.post('/category', categoryController.createCategory);
router.patch('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);

module.exports = router;