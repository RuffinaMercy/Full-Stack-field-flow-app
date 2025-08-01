// src/pages/EmployeePage.tsx

import { useState } from 'react';
import {
  Box, Container, Typography, Button, Card, CardContent, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TableFooter
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login, submitDelivery, submitExpenses } from '../services/apiService';

// --- Type Definitions ---
interface EmployeeUser {
  id: string;
  name: string;
  emp_id: string;
}
interface Expense {
  category: string;
  price: number;
}

// ======================================================================================
// MAIN EMPLOYEE PAGE COMPONENT
// ======================================================================================
const EmployeePage: React.FC = () => {
  // --- Main State ---
  const [currentUser, setCurrentUser] = useState<EmployeeUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // --- Login State & Logic ---
  const [loginEmpId, setLoginEmpId] = useState('');
  const [loginEmpName, setLoginEmpName] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);
    try {
      const response = await login(loginEmpName, loginEmpId);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.employee));
      setCurrentUser(response.employee);
    } catch (err: any) {
      setLoginError(err.response?.data?.error || 'Login failed.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // --- Customer Details Logic ---
  const [custId, setCustId] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [isDeliverySubmitting, setIsDeliverySubmitting] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [deliverySuccess, setDeliverySuccess] = useState<string | null>(null);
  const [isCustomerConfirmOpen, setIsCustomerConfirmOpen] = useState(false);

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custId || !gasPrice) {
      setDeliveryError("Please fill out both Customer ID and Gas Price.");
      return;
    }
    setDeliveryError(null);
    setIsCustomerConfirmOpen(true);
  };
  
  const handleConfirmAndSubmitDelivery = async () => {
    setIsCustomerConfirmOpen(false);
    setIsDeliverySubmitting(true);
    setDeliveryError(null);
    setDeliverySuccess(null);
    try {
      if (!currentUser) throw new Error("User not logged in.");
      const payload = { employeeId: currentUser.id, cust_id: custId, gas_price: parseFloat(gasPrice) };
      const response = await submitDelivery(payload);
      setDeliverySuccess(response.message);
      setCustId('');
      setGasPrice('');
    } catch (err: any) {
      setDeliveryError(err.response?.data?.error || 'Delivery submission failed.');
    } finally {
      setIsDeliverySubmitting(false);
    }
  };

  // --- Expense Entry Logic ---
  const [expenses, setExpenses] = useState<Expense[]>([]); // This will be used for the UI list
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expensePrice, setExpensePrice] = useState('');
  const [isExpenseAdding, setIsExpenseAdding] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [expenseSuccess, setExpenseSuccess] = useState<string | null>(null);

  const handleAddExpense = async () => {
    setExpenseError(null);
    setExpenseSuccess(null);
    if (!expenseCategory || !expensePrice) {
      setExpenseError("Please provide a valid category and price.");
      return;
    }

    setIsExpenseAdding(true);
    try {
      if (!currentUser) throw new Error("User not logged in.");
      const newExpense = { category: expenseCategory, price: parseFloat(expensePrice) };
      
      // Submit the single expense immediately
      await submitExpenses({ employeeId: currentUser.id, expenses: [newExpense] });
      
      // Update the UI list
      setExpenses(prev => [...prev, newExpense]);
      
      setExpenseSuccess(`Expense '${newExpense.category}' added!`);
      setExpenseCategory('');
      setExpensePrice('');
    } catch (err: any) {
      setExpenseError(err.response?.data?.error || 'Failed to add expense.');
    } finally {
      setIsExpenseAdding(false);
    }
  };
  
  const expensesTotal = expenses.reduce((total, expense) => total + expense.price, 0);

  // --- Admin Dialog Logic ---
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();
  
  const handleAdminLoginAttempt = () => {
      // For now, we simulate a password check and navigate
      if (adminPassword === 'password') {
          navigate('/admin');
      } else {
          alert('Incorrect admin password');
      }
  }

  // ======================================================================================
  // RENDER LOGIC
  // ======================================================================================
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {currentUser ? (
          <>
            <Typography variant="h4" gutterBottom>Welcome, {currentUser.name}!</Typography>
            
            <Card sx={{ mt: 3, width: '100%', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Log Customer Delivery</Typography>
                <Box component="form" onSubmit={handleDeliverySubmit} noValidate>
                  <TextField margin="normal" required fullWidth label="Customer ID" value={custId} onChange={(e) => setCustId(e.target.value)} disabled={isDeliverySubmitting} />
                  <TextField margin="normal" required fullWidth label="Gas Price" type="number" value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} disabled={isDeliverySubmitting} />
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isDeliverySubmitting}>
                    {isDeliverySubmitting ? <CircularProgress size={24} /> : 'Submit Delivery'}
                  </Button>
                  {deliveryError && <Alert severity="error" sx={{ mt: 2 }}>{deliveryError}</Alert>}
                  {deliverySuccess && <Alert severity="success" sx={{ mt: 2 }}>{deliverySuccess}</Alert>}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3, width: '100%', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Add Expense</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField label="Expense Category" size="small" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} sx={{ flexGrow: 1 }} />
                  <TextField label="Price" type="number" size="small" value={expensePrice} onChange={(e) => setExpensePrice(e.target.value)} sx={{ width: '100px' }} />
                  <Button variant="contained" color="secondary" onClick={handleAddExpense} disabled={isExpenseAdding}>
                    {isExpenseAdding ? <CircularProgress size={20} color="inherit" /> : 'Add'}
                  </Button>
                </Box>
                {expenseError && <Alert severity="error" sx={{mt: 2}}>{expenseError}</Alert>}
                {expenseSuccess && <Alert severity="success" sx={{mt: 2}}>{expenseSuccess}</Alert>}
                
                {/* THIS IS THE TABLE THAT DISPLAYS THE LIST */}
                {expenses.length > 0 && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead><TableRow><TableCell>Category</TableCell><TableCell align="right">Price</TableCell></TableRow></TableHead>
                      <TableBody>
                        {expenses.map((exp, i) => (<TableRow key={i}><TableCell>{exp.category}</TableCell><TableCell align="right">${exp.price.toFixed(2)}</TableCell></TableRow>))}
                      </TableBody>
                      <TableFooter>
                          <TableRow>
                            <TableCell><Typography sx={{ fontWeight: 'bold' }}>Total</Typography></TableCell>
                            <TableCell align="right"><Typography sx={{ fontWeight: 'bold' }}>${expensesTotal.toFixed(2)}</Typography></TableCell>
                          </TableRow>
                        </TableFooter>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 4, mb: 4 }}>Logout</Button>
          </>
        ) : (
          <Card sx={{ minWidth: 350, maxWidth: 400 }}>
             <CardContent>
              <Typography variant="h5" component="div" gutterBottom align="center">Employee Login</Typography>
              <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                <TextField margin="normal" required fullWidth label="Employee Name" value={loginEmpName} onChange={(e) => setLoginEmpName(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Employee ID" value={loginEmpId} onChange={(e) => setLoginEmpId(e.target.value)} />
                {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoginLoading}>
                  {isLoginLoading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
                <Button fullWidth variant="text" onClick={() => setIsAdminDialogOpen(true)}>Admin's View</Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* --- DIALOGS --- */}
        <Dialog open={isCustomerConfirmOpen} onClose={() => setIsCustomerConfirmOpen(false)}>
            <DialogTitle>Confirm Customer Delivery</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Submit delivery for Customer ID: <strong>{custId}</strong> with Gas Price: <strong>${gasPrice}</strong>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsCustomerConfirmOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmAndSubmitDelivery} autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
        
        <Dialog open={isAdminDialogOpen} onClose={() => setIsAdminDialogOpen(false)}>
            <DialogTitle>Admin Login</DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus 
                    margin="dense" 
                    label="Admin Password" 
                    type="password" 
                    fullWidth 
                    variant="standard"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleAdminLoginAttempt() }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsAdminDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAdminLoginAttempt}>Login</Button>
            </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default EmployeePage;