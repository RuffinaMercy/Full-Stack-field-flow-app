// src/types/index.ts

export interface EmployeeUser {
  id: string; // This is the unique database ID (cuid)
  emp_id: string; // This is the human-readable employee ID
  name: string;
}

export interface Expense {
  category: string;
  price: number;
}