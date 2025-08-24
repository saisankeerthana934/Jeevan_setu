import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DonorRegistration from './pages/DonorRegistration';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import NGORegistration from './pages/NGORegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import NGODashboard from './pages/NGODashboard';
import DonorDashboard from './pages/DonorDashboard';
import Education from './pages/Education';
import CampaignReport from './pages/CampaignReport';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import HackathonDashboard from './pages/HackathonDashboard'; // Make sure this import is correct
import AdminDashboard from './pages/AdminDashboard';

// This component protects routes for LOGGED-IN users
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// This component protects routes for GUESTS (logged-out users)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (user) {
    switch (user.role) {
      case 'patient': return <Navigate to="/patient-dashboard" replace />;
      case 'donor': return <Navigate to="/donor-dashboard" replace />;
      case 'doctor': return <Navigate to="/doctor-dashboard" replace />;
      case 'ngo': return <Navigate to="/ngo-dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/education" element={<Education />} />
                
                {/* --- 🔽 THIS IS THE FIX 🔽 --- */}
                {/* Add the new route for your hackathon page */}
                <Route path="/hackathon-dashboard" element={<HackathonDashboard />} />
                {/* --- 🔼 END OF FIX 🔼 --- */}


                {/* Guest-Only Routes */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/register-donor" element={<PublicRoute><DonorRegistration /></PublicRoute>} />
                <Route path="/register-patient" element={<PublicRoute><PatientRegistration /></PublicRoute>} />
                <Route path="/register-doctor" element={<PublicRoute><DoctorRegistration /></PublicRoute>} />
                <Route path="/register-ngo" element={<PublicRoute><NGORegistration /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                {/* Protected Routes */}
                <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
                <Route path="/donor-dashboard" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} />
                <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
                <Route path="/ngo-dashboard" element={<ProtectedRoute allowedRoles={['ngo']}><NGODashboard /></ProtectedRoute>} />
                <Route path="/campaign-report/:campaignId" element={<ProtectedRoute allowedRoles={['ngo']}><CampaignReport /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;