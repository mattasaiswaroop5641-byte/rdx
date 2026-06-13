const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/orders', adminController.getOrders);
router.get('/tickets', adminController.getTickets);
router.get('/logs', adminController.getLogs);
router.get('/coupons', adminController.getCoupons);
router.get('/chart', adminController.getChartData);
router.post('/coupons', adminController.createCoupon);

module.exports = router;