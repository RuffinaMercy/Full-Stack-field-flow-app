// // src/pages/admin/page.tsx
// import React, { useState, useEffect } from 'react';
// import { Typography, Box, Paper, Button, CircularProgress, Alert } from '@mui/material';
// import ReportTable from '../../components/admin/data-reports/ReportTable';
// import { getAdminReports } from '../../services/apiService';

// const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

// const AdminDashboardPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [reportData, setReportData] = useState<any>({ deliveries: [], expenses: [], finalReport: [] });

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         setLoading(true);
//         const data = await getAdminReports();
//         setReportData(data);
//       } catch (err) {
//         setError('Failed to load reports.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, []);

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   const deliveryRows = reportData.deliveries.map((d: any) => [
//     formatDate(d.date), d.employee.name, d.employee.emp_id, d.cust_id, `$${d.gas_price.toFixed(2)}`
//   ]);

//   const expenseRows = reportData.expenses.map((e: any) => [
//     formatDate(e.date), e.employee.name, e.employee.emp_id, e.category, `$${e.price.toFixed(2)}`
//   ]);

//   const finalReportRows = reportData.finalReport.map((r: any) => [
//       formatDate(r.date),
//       r.employeeName,
//       r.employeeEmpId,
//       `$${r.totalGas.toFixed(2)}`,
//       `$${r.totalExpense.toFixed(2)}`,
//       `$${(r.totalGas - r.totalExpense).toFixed(2)}`
//   ]);

//   return (
//     <Box>
//       <Paper sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h5">Data Reports</Typography>
//       </Paper>
      
//       <ReportTable
//         title="Final Report"
//         headers={['Date', 'Employee Name', 'Emp ID', 'Total Gas', 'Total Expense', 'Net Total']}
//         rows={finalReportRows}
//       />
//       <ReportTable
//         title="Delivery Details"
//         headers={['Date', 'Employee Name', 'Emp ID', 'Customer ID', 'Gas Price']}
//         rows={deliveryRows}
//       />
//       <ReportTable
//         title="Expense Details"
//         headers={['Date', 'Employee Name', 'Emp ID', 'Category', 'Price']}
//         rows={expenseRows}
//       />
//     </Box>
//   );
// };

// export default AdminDashboardPage;





















// src/pages/admin/page.tsx
import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, CircularProgress, Alert } from '@mui/material';
import ReportTable from '../../components/admin/data-reports/ReportTable';
import { getAdminReports } from '../../services/apiService';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<any>({ deliveries: [], expenses: [], finalReport: [] });
  const [filterDate, setFilterDate] = useState<Value>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getAdminReports();
        setAllData(data);
      } catch (err) {
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const filteredData = filterDate
    ? {
        deliveries: allData.deliveries.filter((d: any) => new Date(d.date).toDateString() === (filterDate as Date).toDateString()),
        expenses: allData.expenses.filter((e: any) => new Date(e.date).toDateString() === (filterDate as Date).toDateString()),
        finalReport: allData.finalReport.filter((r: any) => new Date(r.date).toDateString() === (filterDate as Date).toDateString()),
      }
    : allData;

  const deliveryRows = filteredData.deliveries.map((d: any) => [
    formatDate(d.date), d.employee.name, d.employee.emp_id, d.cust_id, `$${d.gas_price.toFixed(2)}`
  ]);
  
  // THIS IS THE CORRECTED MAPPING
  const expenseRows = filteredData.expenses.map((e: any) => [
    formatDate(e.date), e.employee.name, e.employee.emp_id, e.category, `$${e.price.toFixed(2)}`
  ]);

  const finalReportRows = filteredData.finalReport.map((r: any) => [
    formatDate(r.date),
    r.employeeName,
    r.employeeEmpId,
    `$${r.totalGas.toFixed(2)}`,
    `$${r.totalExpense.toFixed(2)}`,
    `$${(r.totalGas - r.totalExpense).toFixed(2)}`
  ]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">Data Reports</Typography>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <DatePicker onChange={setFilterDate} value={filterDate} />
          <Button onClick={() => setFilterDate(null)}>Clear Filter</Button>
        </Box>
      </Paper>
      
      <ReportTable title="Final Report" headers={['Date', 'Employee Name', 'Emp ID', 'Total Gas', 'Total Expense', 'Net Total']} rows={finalReportRows} />
      <ReportTable title="Delivery Details" headers={['Date', 'Employee Name', 'Emp ID', 'Customer ID', 'Gas Price']} rows={deliveryRows} />
      <ReportTable title="Expense Details" headers={['Date', 'Employee Name', 'Emp ID', 'Category', 'Price']} rows={expenseRows} />
    </Box>
  );
};

export default AdminDashboardPage;