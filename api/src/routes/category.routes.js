const router = require('express-promise-router')();
const categoryController = require('../controllers/category.controller');

router.post('/category', categoryController.createCategory);
router.get('/category', categoryController.getCategoryList);
router.get('/category/:id', categoryController.getCategoryById);
router.delete('/category/:id', categoryController.deleteCategory);
router.patch('/category/:id', categoryController.updateCategory);

module.exports = router;