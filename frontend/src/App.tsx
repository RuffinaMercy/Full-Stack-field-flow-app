// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// Import all the necessary pages and the Admin Layout component
import EmployeePage from './pages/EmployeePage';
import AdminLayout from './components/admin/layout';
import AdminDashboardPage from './pages/admin/page';
import AdminSettingsPage from './pages/admin/settings/page';

// This is our simple security check for admin pages.
// For now, it always allows access. We can add real logic later.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = true; // Placeholder for real authentication
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route 1: The Employee Page */}
          <Route path="/" element={<EmployeePage />} />

          {/* Route 2: The Admin Data Reports Page */}
          {/* This now uses the correct, final layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Route 3: The Admin Settings Page */}
          {/* This also uses the correct, final layout */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSettingsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route to redirect any unknown URL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;