import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Pages
import LandingPage from './pages/LandingPage';
import PatientAuth from './pages/PatientAuth';
import DoctorAuth from './pages/DoctorAuth';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetail from './pages/PatientDetail';

// Global Components
import AlertPopup from './components/AlertPopup';
import ReminderSystem from './components/ReminderSystem';
import EmergencyButton from './components/EmergencyButton';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        {user && user.role === 'doctor' && <AlertPopup />}
        {user && <ReminderSystem />}
        {user && <EmergencyButton />}
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/patient" element={<PatientAuth />} />
          <Route path="/auth/doctor" element={<DoctorAuth />} />
          
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor/patient/:id" element={
            <ProtectedRoute allowedRole="doctor">
              <PatientDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
