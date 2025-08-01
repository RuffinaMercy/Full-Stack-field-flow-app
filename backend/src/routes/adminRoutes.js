const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/reports', adminController.getReports);
router.get('/employees', adminController.getEmployees);
router.post('/employees', adminController.addEmployee);
router.delete('/employees/:id', adminController.deleteEmployee);

module.exports = router;