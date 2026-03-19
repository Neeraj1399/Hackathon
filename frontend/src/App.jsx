import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateHackathon from './pages/CreateHackathon';
import SubmitProject from './pages/SubmitProject';
import UserManagement from './pages/UserManagement';
import EditHackathon from './pages/EditHackathon';
import JudgeJoin from './pages/JudgeJoin';
import JudgeRequests from './pages/JudgeRequests';
import Leaderboard from './pages/Leaderboard';
import EvaluationForm from './pages/EvaluationForm';
import JudgeSubmissions from './pages/JudgeSubmissions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-hackathon"
            element={
              <ProtectedRoute roles={['admin']}>
                <CreateHackathon />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit-project/:hackathonId"
            element={
              <ProtectedRoute roles={['participant']}>
                <SubmitProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit-hackathon/:id"
            element={
              <ProtectedRoute roles={['admin']}>
                <EditHackathon />
              </ProtectedRoute>
            }
          />

          <Route
            path="/judge/join"
            element={
              <ProtectedRoute roles={['judge']}>
                <JudgeJoin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/judge-requests"
            element={
              <ProtectedRoute roles={['admin']}>
                <JudgeRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/judge/evaluations/:hackathonId"
            element={
              <ProtectedRoute roles={['judge']}>
                <JudgeSubmissions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/evaluate/:submissionId"
            element={
              <ProtectedRoute roles={['judge']}>
                <EvaluationForm />
              </ProtectedRoute>
            }
          />

          <Route path="/leaderboard/:hackathonId" element={<Leaderboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
