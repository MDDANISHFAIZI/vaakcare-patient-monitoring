import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  LayoutDashboard, 
  Calendar, 
  Activity, 
  LineChart, 
  FileText, 
  MessageSquare, 
  Heart, 
  MapPin, 
  LogOut, 
  Languages,
  Menu,
  X
} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';

// Components (We will import these as we build them)
import DoctorLiveStatus from '../components/patient/DoctorLiveStatus';
import PatientAIChat from '../components/patient/PatientAIChat';
import Overview from '../components/patient/Overview';
import Appointments from '../components/patient/Appointments';
import SymptomChecker from '../components/patient/SymptomChecker';
import HealthTracker from '../components/patient/HealthTracker';
import MedicalHistory from '../components/patient/MedicalHistory';
import HealthTips from '../components/patient/HealthTips';
import NearbyHospitals from '../components/patient/NearbyHospitals';
import axios from 'axios';

import ChatInterface from '../components/patient/ChatInterface';
import NotificationDropdown from '../components/doctor/NotificationDropdown';

const PatientDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isHindi, setIsHindi] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Listen for open-chat event from NotificationDropdown
  useEffect(() => {
    const handleOpenChat = () => setActiveTab('doctor-chat');
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  // Handle payment redirects
  // Removed Stripe webhook logic, Razorpay will handle it directly in the checkout component

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'symptom-checker', label: 'Symptom Checker', icon: Activity },
    { id: 'tracker', label: 'Health Tracker', icon: LineChart },
    { id: 'history', label: 'Medical History', icon: FileText },
    { id: 'doctor-chat', label: 'Consult Doctor', icon: MessageSquare },
    { id: 'ai-chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'tips', label: 'Health Tips', icon: Heart },
    { id: 'hospitals', label: 'Nearby Hospitals', icon: MapPin },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview user={user} />;
      case 'appointments':
        return <Appointments />;
      case 'symptom-checker':
        return <SymptomChecker />;
      case 'tracker':
        return <HealthTracker />;
      case 'history':
        return <MedicalHistory />;
      case 'tips':
        return <HealthTips />;
      case 'hospitals':
        return <NearbyHospitals />;
      case 'doctor-chat':
        return <ChatInterface />;
      case 'ai-chat':
        return <PatientAIChat user={user} isHindi={isHindi} />;
      default:
        return (
          <div className="flex items-center justify-center h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Component Under Construction</h2>
              <p className="text-slate-500 dark:text-slate-400">The {activeTab} section is currently being built.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-brand-600 text-white p-3 rounded-full shadow-xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
            V
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">VaakCare</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.hospitalName}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium text-sm"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DoctorLiveStatus doctorId={user?.doctorId} token={user?.token} />
            <NotificationDropdown user={user} userType="patient" />
            <DarkModeToggle />
            <button 
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              <Languages size={18} />
              {isHindi ? 'EN' : 'HI'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
