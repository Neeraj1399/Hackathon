import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateHackathon from './pages/CreateHackathon';
import SubmitProject from './pages/SubmitProject';
import UserManagement from './pages/UserManagement';
import EditHackathon from './pages/EditHackathon';
import EvaluationForm from './pages/EvaluationForm';
import JudgeSubmissions from './pages/JudgeSubmissions';
import ProjectBrowser from './pages/ProjectBrowser';

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            fontWeight: '900',
            fontSize: '12px',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }} 
      />
      <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Layout Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectBrowser />} />
            
            {/* Admin Routes */}
            <Route path="/admin/create-hackathon" element={<ProtectedRoute roles={['admin']}><CreateHackathon /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/edit-hackathon/:id" element={<ProtectedRoute roles={['admin']}><EditHackathon /></ProtectedRoute>} />
            
            {/* Shared/Role Specific Routes */}
            <Route path="/admin/submissions/:hackathonId" element={<ProtectedRoute roles={['admin', 'judge']}><JudgeSubmissions /></ProtectedRoute>} />
            <Route path="/evaluate/:submissionId" element={<ProtectedRoute roles={['admin', 'judge', 'participant']}><EvaluationForm /></ProtectedRoute>} />
            <Route path="/submit-project/:hackathonId" element={<ProtectedRoute roles={['participant']}><SubmitProject /></ProtectedRoute>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
