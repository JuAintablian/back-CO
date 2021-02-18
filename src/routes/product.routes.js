const router = require('express-promise-router')();
const productController = require('../controllers/product.controller');

router.get('/product', productController.getProductList);
router.get('/product/:id', productController.getProductById);
router.get('/product/repo/:qtt', productController.getProductRepo);
router.post('/product', productController.createProduct);
router.post('/product/add', productController.addMoreQttProduct);
router.patch('/product/:id', productController.updateProduct);
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;