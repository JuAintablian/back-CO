const router = require('express-promise-router')();
const paymentForm = require('../controllers/paymentForm.controller');

router.get('/paymentForm', paymentForm.getPaymentFormList);
router.get('/paymentForm/:id', paymentForm.getPaymentFormById);
router.post('/paymentForm', paymentForm.createPaymentForm);
router.patch('/paymentForm/:id', paymentForm.updatePaymentForm);
router.delete('/paymentForm/:id', paymentForm.deletePaymentForm);

module.exports = router;