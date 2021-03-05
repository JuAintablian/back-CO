const router = require('express-promise-router')();
const orderController = require('../controllers/order.controller');

router.get('/order', orderController.getOrdersList);
router.get('/order/:id', orderController.getOrderById);
router.get('/order/period/:start/:end', orderController.getOrdersListByPeriod);
router.post('/order', orderController.createOrder);

module.exports = router;