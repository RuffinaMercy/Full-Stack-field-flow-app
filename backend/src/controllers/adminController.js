// // src/controllers/adminController.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { format } = require('date-fns'); // We'll use date-fns for reliable date formatting

// exports.getReports = async (req, res) => {
//   try {
//     const [deliveries, expenses] = await Promise.all([
//       prisma.delivery.findMany({
//         include: { employee: { select: { name: true, emp_id: true } } },
//         orderBy: { date: 'desc' }
//       }),
//       prisma.expense.findMany({
//         include: { employee: { select: { name: true, emp_id: true } } },
//         orderBy: { date: 'desc' }
//       })
//     ]);

//     // --- Calculate Final Report ---
//     const dailySummaries = {};

//     // Process deliveries
//     deliveries.forEach(delivery => {
//       const date = format(new Date(delivery.date), 'yyyy-MM-dd');
//       const key = `${date}|${delivery.employeeId}`;
//       if (!dailySummaries[key]) {
//         dailySummaries[key] = {
//           date: date,
//           employeeName: delivery.employee.name,
//           employeeEmpId: delivery.employee.emp_id,
//           totalGas: 0,
//           totalExpense: 0,
//         };
//       }
//       dailySummaries[key].totalGas += delivery.gas_price;
//     });

//     // Process expenses
//     expenses.forEach(expense => {
//       const date = format(new Date(expense.date), 'yyyy-MM-dd');
//       const key = `${date}|${expense.employeeId}`;
//       if (!dailySummaries[key]) {
//         dailySummaries[key] = {
//           date: date,
//           employeeName: expense.employee.name,
//           employeeEmpId: expense.employee.emp_id,
//           totalGas: 0,
//           totalExpense: 0,
//         };
//       }
//       dailySummaries[key].totalExpense += expense.price;
//     });

//     // Convert the summaries object to an array
//     const finalReport = Object.values(dailySummaries).sort((a, b) => new Date(b.date) - new Date(a.date));

//     const reportData = {
//       deliveries: deliveries,
//       expenses: expenses,
//       finalReport: finalReport,
//     };

//     res.status(200).json(reportData);

//   } catch (error) {
//     console.error("Error fetching reports:", error);
//     res.status(500).json({ error: 'Failed to fetch report data.' });
//   }
// };


// // Add these to backend/src/controllers/adminController.js

// // GET /api/admin/employees
// exports.getEmployees = async (req, res) => {
//   try {
//     const employees = await prisma.employee.findMany({
//       orderBy: { name: 'asc' },
//     });
//     res.status(200).json(employees);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch employees.' });
//   }
// };

// // POST /api/admin/employees
// exports.addEmployee = async (req, res) => {
//   const { name, emp_id } = req.body;
//   if (!name || !emp_id) {
//     return res.status(400).json({ error: 'Name and Employee ID are required.' });
//   }
//   try {
//     const newEmployee = await prisma.employee.create({
//       data: { name, emp_id },
//     });
//     res.status(201).json(newEmployee);
//   } catch (error) {
//     // P2002 is the Prisma code for a unique constraint violation
//     if (error.code === 'P2002') {
//       return res.status(409).json({ error: 'An employee with this ID already exists.' });
//     }
//     res.status(500).json({ error: 'Failed to add employee.' });
//   }
// };

// // DELETE /api/admin/employees/:id
// exports.deleteEmployee = async (req, res) => {
//   const { id } = req.params; // Get the database ID from the URL
//   try {
//     // First, delete related expenses and deliveries to avoid foreign key errors
//     await prisma.expense.deleteMany({ where: { employeeId: id } });
//     await prisma.delivery.deleteMany({ where: { employeeId: id } });

//     // Then, delete the employee
//     await prisma.employee.delete({
//       where: { id: id },
//     });
//     res.status(200).json({ message: 'Employee deleted successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete employee.' });
//   }
// };






// // Add this to backend/src/controllers/adminController.js
// const bcrypt = require('bcryptjs');

// // POST /api/admin/update-password
// exports.updatePassword = async (req, res) => {
//   const { newPassword } = req.body;
//   if (!newPassword || newPassword.length < 6) {
//     return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     // We assume there's only one admin user with the username 'admin'
//     await prisma.adminUser.upsert({
//         where: { username: 'admin' },
//         update: { password: hashedPassword },
//         create: { username: 'admin', password: hashedPassword }
//     });
//     res.status(200).json({ message: 'Admin password updated successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update password.' });
//   }
// };

















// backend/src/controllers/adminController.js

const { PrismaClient } = require('@prisma/client');
const { format } = require('date-fns');
const prisma = new PrismaClient();

// --- FUNCTION 1: Get Reports ---
exports.getReports = async (req, res) => {
  try {
    const [deliveries, expenses] = await Promise.all([
      prisma.delivery.findMany({
        include: { employee: { select: { name: true, emp_id: true } } },
        orderBy: { date: 'desc' }
      }),
      prisma.expense.findMany({
        include: { employee: { select: { name: true, emp_id: true } } },
        orderBy: { date: 'desc' }
      })
    ]);

    const dailySummaries = {};

    deliveries.forEach(delivery => {
      const date = format(new Date(delivery.date), 'yyyy-MM-dd');
      const key = `${date}|${delivery.employeeId}`;
      if (!dailySummaries[key]) {
        dailySummaries[key] = {
          date: date,
          employeeName: delivery.employee.name,
          employeeEmpId: delivery.employee.emp_id,
          totalGas: 0,
          totalExpense: 0,
        };
      }
      dailySummaries[key].totalGas += delivery.gas_price;
    });

    expenses.forEach(expense => {
      const date = format(new Date(expense.date), 'yyyy-MM-dd');
      const key = `${date}|${expense.employeeId}`;
      if (!dailySummaries[key]) {
        dailySummaries[key] = {
          date: date,
          employeeName: expense.employee.name,
          employeeEmpId: expense.employee.emp_id,
          totalGas: 0,
          totalExpense: 0,
        };
      }
      dailySummaries[key].totalExpense += expense.price;
    });

    const finalReport = Object.values(dailySummaries).sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      deliveries: deliveries,
      expenses: expenses,
      finalReport: finalReport,
    });

  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: 'Failed to fetch report data.' });
  }
};

// --- FUNCTION 2: Get Employees ---
exports.getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
};

// --- FUNCTION 3: Add Employee ---
exports.addEmployee = async (req, res) => {
  const { name, emp_id } = req.body;
  if (!name || !emp_id) {
    return res.status(400).json({ error: 'Name and Employee ID are required.' });
  }
  try {
    const newEmployee = await prisma.employee.create({
      data: { name, emp_id },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'An employee with this ID already exists.' });
    }
    res.status(500).json({ error: 'Failed to add employee.' });
  }
};

// --- FUNCTION 4: Delete Employee ---
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.expense.deleteMany({ where: { employeeId: id } });
    await prisma.delivery.deleteMany({ where: { employeeId: id } });
    await prisma.employee.delete({ where: { id: id } });
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
};