// src/routes/authRoutes.js

const express = require('express');
const router = express.Router(); // Initialize the router here
const authController = require('../controllers/authController');

// --- DEFINE YOUR ROUTES ---

// Route for POST /api/auth/login
router.post('/login', authController.employeeLogin);

// Route for POST /api/auth/delivery
router.post('/delivery', authController.submitDelivery);

// Route for POST /api/auth/expenses
router.post('/expenses', authController.submitExpenses);


// --- EXPORT THE ROUTER ---
module.exports = router;