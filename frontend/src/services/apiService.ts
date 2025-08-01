// src/services/apiService.ts
import axios from 'axios';

// The Expense type can be defined here as it's just for the payload shape
interface Expense {
  category: string;
  price: number;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const login = async (emp_name: string, emp_id: string) => {
  const response = await apiClient.post('/auth/login', { emp_name, emp_id });
  return response.data;
};

interface DeliveryPayload {
  employeeId: string;
  cust_id: string;
  gas_price: number;
}

export const submitDelivery = async (payload: DeliveryPayload) => {
  const response = await apiClient.post('/auth/delivery', payload);
  return response.data;
};

// src/services/apiService.ts
//...

interface ExpensesPayload {
  // deliveryId: string; // REMOVE THIS
  employeeId: string; // ADD THIS
  expenses: Expense[];
}
//...

export const submitExpenses = async (payload: ExpensesPayload) => {
  const response = await apiClient.post('/auth/expenses', payload);
  return response.data;
};

// Add this to frontend/src/services/apiService.ts















// Add these to frontend/src/services/apiService.ts

export const getEmployees = async () => {
  const response = await apiClient.get('/admin/employees');
  return response.data;
};

export const addEmployee = async (name: string, emp_id: string) => {
  const response = await apiClient.post('/admin/employees', { name, emp_id });
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await apiClient.delete(`/admin/employees/${id}`);
  return response.data;
};


// Add this to frontend/src/services/apiService.ts

export const getAdminReports = async () => {
  const response = await apiClient.get('/admin/reports');
  return response.data;
};






// Add this to frontend/src/services/apiService.ts
export const updateAdminPassword = async (newPassword: string) => {
  const response = await apiClient.post('/admin/update-password', { newPassword });
  return response.data;
};