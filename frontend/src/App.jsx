import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateHackathon from './pages/CreateHackathon';
import SubmitProject from './pages/SubmitProject';
import UserManagement from './pages/UserManagement';
import EditHackathon from './pages/EditHackathon';
import Leaderboard from './pages/Leaderboard';
import EvaluationForm from './pages/EvaluationForm';
import JudgeSubmissions from './pages/JudgeSubmissions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/leaderboard/:hackathonId" element={<Leaderboard />} />

          {/* Protected Layout Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/create-hackathon" element={<ProtectedRoute roles={['admin']}><CreateHackathon /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/edit-hackathon/:id" element={<ProtectedRoute roles={['admin']}><EditHackathon /></ProtectedRoute>} />
            
            {/* Shared/Role Specific Routes */}
            <Route path="/admin/submissions/:hackathonId" element={<ProtectedRoute roles={['admin', 'judge']}><JudgeSubmissions /></ProtectedRoute>} />
            <Route path="/evaluate/:submissionId" element={<ProtectedRoute roles={['judge']}><EvaluationForm /></ProtectedRoute>} />
            <Route path="/submit-project/:hackathonId" element={<ProtectedRoute roles={['participant']}><SubmitProject /></ProtectedRoute>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
