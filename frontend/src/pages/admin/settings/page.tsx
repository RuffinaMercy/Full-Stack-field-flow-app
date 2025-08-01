// // src/pages/admin/settings/page.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Typography, Box, Card, CardHeader, CardContent, Button,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, TextField, IconButton, CircularProgress, Alert,
//   Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// // Import all necessary API functions
// import { 
//     getEmployees, addEmployee, deleteEmployee, 
//     updateAdminPassword 
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

//   // --- State for Password Management ---
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
//   // --- State for User Feedback (Errors & Success Messages) ---
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
//     } catch (err: any) {
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

//   const handleUpdatePassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("1. Update Password button clicked. Attempting to update...");
//     setError(null);
//     setSuccess(null);
    
//     if (newPassword !== confirmPassword) {
//         setError("Passwords do not match.");
//         return;
//     }
//     if (newPassword.length < 6) {
//         setError("Password must be at least 6 characters.");
//         return;
//     }

//     setIsUpdatingPassword(true);
//     try {
//         const response = await updateAdminPassword(newPassword);
//         setSuccess(response.message);
//         setNewPassword('');
//         setConfirmPassword('');
//     } catch (err: any) {
//         setError(err.response?.data?.error || 'Failed to update password.');
//     } finally {
//         setIsUpdatingPassword(false);
//     }
//   };

//   // --- Render Logic ---
//   return (
//     <Box>
//       <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>
      
//       {/* Display a single Alert for either error or success */}
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
      
//       <Card>
//         <CardHeader title="Security Settings" />
//         <CardContent>
//           <Box component="form" onSubmit={handleUpdatePassword}>
//              <TextField margin="dense" fullWidth label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
//              <TextField margin="dense" fullWidth label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
//              <Button type="submit" sx={{ mt: 2 }} variant="contained" disabled={isUpdatingPassword}>
//                 {isUpdatingPassword ? <CircularProgress size={24}/> : "Update Password"}
//              </Button>
//           </Box>
//         </CardContent>
//       </Card>
      
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




















// src/pages/admin/settings/page.tsx
import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Card, CardHeader, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, IconButton, CircularProgress, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getEmployees, addEmployee, deleteEmployee } from '../../../services/apiService';
import { EmployeeUser } from '@/types';

const AdminSettingsPage = () => {
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<EmployeeUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    setError(null);
    setSuccess(null);
    if (!newName || !newEmpId) {
      setError('Name and ID cannot be empty.');
      return;
    }
    setIsAdding(true);
    try {
      await addEmployee(newName, newEmpId);
      setSuccess(`Employee '${newName}' added successfully.`);
      setNewName('');
      setNewEmpId('');
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add employee.');
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleDeleteEmployee = async () => {
    if (!deleteCandidate) return;
    setError(null);
    setSuccess(null);
    try {
        await deleteEmployee(deleteCandidate.id);
        setSuccess(`Employee '${deleteCandidate.name}' deleted successfully.`);
        setDeleteCandidate(null);
        fetchEmployees();
    } catch (err) {
        setError('Failed to delete employee.');
        setDeleteCandidate(null);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>
      
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{mb: 2}}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{mb: 2}}>{success}</Alert>}
      
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Employee Management" />
        <CardContent>
          {loading ? <CircularProgress /> : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.emp_id}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => setDeleteCandidate(emp)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell><TextField variant="standard" size="small" label="New Name" value={newName} onChange={e => setNewName(e.target.value)} /></TableCell>
                    <TableCell><TextField variant="standard" size="small" label="New ID" value={newEmpId} onChange={e => setNewEmpId(e.target.value)} /></TableCell>
                    <TableCell align="right">
                      <Button variant="contained" size="small" onClick={handleAddEmployee} disabled={isAdding}>
                        {isAdding ? <CircularProgress size={20}/> : "Add"}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!deleteCandidate} onClose={() => setDeleteCandidate(null)}>
        <DialogTitle>Delete Employee?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteCandidate?.name}</strong>? 
            This will also delete all of their associated deliveries and expenses. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCandidate(null)}>Cancel</Button>
          <Button onClick={handleDeleteEmployee} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettingsPage;