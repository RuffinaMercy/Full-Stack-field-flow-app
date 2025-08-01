// // src/pages/admin/settings/page.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Typography, Box, Card, CardHeader, CardContent, Button,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, TextField, IconButton, CircularProgress, Alert,
//   Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// // The 'updateAdminPassword' function is no longer imported
// import { 
//     getEmployees, addEmployee, deleteEmployee 
// } from '../../../services/apiService';
// import { EmployeeUser } from '@/types';

// const AdminSettingsPage = () => {
//   // --- State for Employee Management ---
//   const [employees, setEmployees] = useState<EmployeeUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newName, setNewName] = useState('');
//   const [newEmpId, setNewEmpId] = useState('');
//   const [isAdding, setIsAdding] = useState(false);
//   const [deleteCandidate, setDeleteCandidate] = useState<EmployeeUser | null>(null);

//   // --- State for User Feedback ---
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // --- Data Fetching ---
//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const data = await getEmployees();
//       setEmployees(data);
//     } catch (err) {
//       setError('Failed to fetch employees.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // --- Event Handlers ---
//   const handleAddEmployee = async () => {
//     setError(null);
//     setSuccess(null);
//     if (!newName || !newEmpId) {
//       setError('Name and ID cannot be empty.');
//       return;
//     }
//     setIsAdding(true);
//     try {
//       await addEmployee(newName, newEmpId);
//       setSuccess(`Employee '${newName}' added successfully.`);
//       setNewName('');
//       setNewEmpId('');
//       fetchEmployees();
//     } catch (err: any)      {
//       setError(err.response?.data?.error || 'Failed to add employee.');
//     } finally {
//       setIsAdding(false);
//     }
//   };
  
//   const handleDeleteEmployee = async () => {
//     if (!deleteCandidate) return;
//     setError(null);
//     setSuccess(null);
//     try {
//         await deleteEmployee(deleteCandidate.id);
//         setSuccess(`Employee '${deleteCandidate.name}' deleted successfully.`);
//         setDeleteCandidate(null);
//         fetchEmployees();
//     } catch (err) {
//         setError('Failed to delete employee.');
//         setDeleteCandidate(null);
//     }
//   };

//   // --- Render Logic ---
//   return (
//     <Box>
//       <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>
      
//       {error && <Alert severity="error" onClose={() => setError(null)} sx={{mb: 2}}>{error}</Alert>}
//       {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{mb: 2}}>{success}</Alert>}
      
//       <Card sx={{ mb: 3 }}>
//         <CardHeader title="Employee Management" />
//         <CardContent>
//           {loading ? <CircularProgress /> : (
//             <TableContainer component={Paper}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Employee ID</TableCell>
//                     <TableCell align="right">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {employees.map((emp) => (
//                     <TableRow key={emp.id}>
//                       <TableCell>{emp.name}</TableCell>
//                       <TableCell>{emp.emp_id}</TableCell>
//                       <TableCell align="right">
//                         <IconButton size="small" color="error" onClick={() => setDeleteCandidate(emp)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   <TableRow>
//                     <TableCell><TextField variant="standard" size="small" label="New Name" value={newName} onChange={e => setNewName(e.target.value)} /></TableCell>
//                     <TableCell><TextField variant="standard" size="small" label="New ID" value={newEmpId} onChange={e => setNewEmpId(e.target.value)} /></TableCell>
//                     <TableCell align="right">
//                       <Button variant="contained" size="small" onClick={handleAddEmployee} disabled={isAdding}>
//                         {isAdding ? <CircularProgress size={20}/> : "Add"}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </CardContent>
//       </Card>
      
//       {/* The Security Settings Card has been completely removed. */}
      
//       <Dialog open={!!deleteCandidate} onClose={() => setDeleteCandidate(null)}>
//         <DialogTitle>Delete Employee?</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete <strong>{deleteCandidate?.name}</strong>? 
//             This will also delete all of their associated deliveries and expenses. This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteCandidate(null)}>Cancel</Button>
//           <Button onClick={handleDeleteEmployee} color="error">Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AdminSettingsPage;
















// src/components/admin/data-reports/ReportTable.tsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Card, CardHeader, CardContent, Button, Box, Typography
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Papa from 'papaparse';

interface ReportTableProps {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

const ReportTable: React.FC<ReportTableProps> = ({ title, headers, rows }) => {
  const handleDownloadCSV = () => {
    const csv = Papa.unparse([headers, ...rows]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={title}
        action={
          <Box>
            <Button size="small" startIcon={<DownloadIcon />} onClick={handleDownloadCSV}>
              CSV
            </Button>
          </Box>
        }
      />
      <CardContent>
        {rows.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (<TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {row.map((cell, cellIndex) => (<TableCell key={cellIndex}>{cell}</TableCell>))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No data available for this period.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportTable;