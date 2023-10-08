const express = require('express');
const router = express.Router();


// Import controllers
const stockController = require('../controllers/stockController');
const customerController = require('../controllers/customerController');
const authController = require('../controllers/authController');

// Stock routes
router.get('/stocks', authController.authenticateToken, stockController.getStocks);
router.post('/stocks', authController.authenticateToken, stockController.addStock);
router.put('/stocks/:id', authController.authenticateToken, stockController.updateStock);
router.delete('/stocks/:id', authController.authenticateToken, stockController.deleteStock);

// Customer routes
router.post('/customer/onboarding', authController.authenticateToken, customerController.createCustomer);
router.post('/customer/requests', authController.authenticateToken, customerController.createRequest);
router.get('/customer/requests/:id', authController.authenticateToken, customerController.getRequest);
// router.put('/customer/requests/:id', authController.authenticateToken, customerController.updateRequest);

// Customer Report routes
router.get('/customer/reports', customerController.getCustomerReports);
router.get('/customer/reports/export', customerController.exportCustomerReports);

// Service Status route
router.put('/service/status/:id', authController.authenticateToken, customerController.updateServiceStatus);

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
// router.get('/logout', authController.logout);

module.exports = router;
 