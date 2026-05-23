import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu,
  X,
  Activity
} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';

// Components
import PatientList from '../components/doctor/PatientList';
import DoctorOverview from '../components/doctor/DoctorOverview';
import DoctorSettings from '../components/doctor/DoctorSettings';
import NotificationDropdown from '../components/doctor/NotificationDropdown';
import axios from 'axios';

const DoctorDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [status, setStatus] = useState('offline');

  // Fetch initial status if we wanted to... assuming user context might not have it updated
  // For simplicity, we just use a local state that synchronizes via API
  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put('https://vaakcare-patient-monitoring.onrender.com/api/doctor/status', { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Listen for open-chat event from NotificationDropdown
  useEffect(() => {
    const handleOpenChat = () => setActiveTab('patients');
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'settings', label: 'Settings & Schedule', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DoctorOverview user={user} />;
      case 'patients':
        return <PatientList user={user} />;
      case 'settings':
        return <DoctorSettings user={user} />;
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
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">VaakCare</h1>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">Doctor Portal</p>
          </div>
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
              {user?.name.charAt(4)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.hospital}</p>
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
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mr-4">
              <button onClick={() => handleStatusChange('clinic')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'clinic' ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-sm' : 'text-slate-500'}`}>In Clinic</button>
              <button onClick={() => handleStatusChange('online')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'online' ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Online</button>
              <button onClick={() => handleStatusChange('offline')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'offline' ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Out</button>
            </div>
            <NotificationDropdown user={user} />
            <DarkModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
