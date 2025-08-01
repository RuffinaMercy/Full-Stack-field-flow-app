// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Function 1
exports.employeeLogin = async (req, res) => {
  // ... your existing, working login code ...
  const { emp_name, emp_id } = req.body;

  if (!emp_name || !emp_id) {
    return res.status(400).json({ error: 'Name and ID are required.' });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { emp_id: emp_id },
    });

    if (!employee || employee.name !== emp_name) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    const token = jwt.sign(
      { id: employee.id, emp_id: employee.emp_id, name: employee.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: 'Login successful',
      token,
      employee: { id: employee.id, name: employee.name, emp_id: employee.emp_id }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};


// Function 2 - MAKE SURE IT STARTS WITH 'exports.'
exports.submitDelivery = async (req, res) => {
  const { employeeId, cust_id, gas_price } = req.body;

  if (!employeeId || !cust_id || !gas_price) {
    return res.status(400).json({ error: 'Missing required delivery information.' });
  }

  try {
    const newDelivery = await prisma.delivery.create({
      data: {
        cust_id: cust_id,
        gas_price: parseFloat(gas_price),
        employeeId: employeeId,
      },
    });

    res.status(201).json({ message: 'Delivery logged successfully', delivery: newDelivery });

  } catch (error) {
    console.error("Submit Delivery Error:", error);
    if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Invalid Employee ID.' });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// Add this to backend/src/controllers/authController.js

// src/controllers/authController.js

exports.submitExpenses = async (req, res) => {
  // The employeeId will link these expenses to an employee
  const { employeeId, expenses } = req.body;

  if (!employeeId || !Array.isArray(expenses) || expenses.length === 0) {
    return res.status(400).json({ error: 'Missing employee ID or expenses array.' });
  }

  try {
    const expensesData = expenses.map(expense => ({
      category: expense.category,
      price: parseFloat(expense.price),
      employeeId: employeeId, // Link to the employee
    }));

    const result = await prisma.expense.createMany({
      data: expensesData,
    });

    res.status(201).json({ message: `${result.count} expenses logged successfully.` });

  } catch (error) {
    console.error("Submit Expenses Error:", error);
    res.status(500).json({ error: 'An internal server error occurred while saving expenses.' });
  }
};