import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './context/ToastContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import UserManagement from './pages/UserManagement';

/**
 * Main Layout wrapper for authenticated users, including navigation.
 */
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar toggleSidebar={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
      
      {/* Main Content Area */}
      <main 
        style={{
          paddingTop: '96px',
          paddingBottom: '32px',
          paddingLeft: '16px',
          paddingRight: '16px',
          minHeight: '100vh',
          transition: 'padding var(--transition-normal)'
        }}
        className="main-content-layout"
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .main-content-layout {
            padding-left: 292px !important; /* 260px sidebar + 32px spacing */
            padding-right: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />

      {/* Protected Main Layout Pages */}
      <Route path="/" element={<MainLayout />}>
        {/* Fallback to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard: Available to all authenticated users (Viewer, Analyst, Admin) */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Records: Available to Analyst and Admin only */}
        <Route 
          path="records" 
          element={
            <ProtectedRoute allowedRoles={['Analyst', 'Admin']}>
              <Records />
            </ProtectedRoute>
          } 
        />
        
        {/* User Management: Available to Admin only */}
        <Route 
          path="users" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch-all route redirects to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
