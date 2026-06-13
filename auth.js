const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/admin-login', authController.adminLogin);

module.exports = router;