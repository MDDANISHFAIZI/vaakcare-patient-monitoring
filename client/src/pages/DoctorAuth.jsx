import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const DoctorAuth = () => {
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:3001/api/auth/doctor/login', {
        doctorId, password
      });
      setUser(res.data);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo helper
  const fillDemoDoc = () => {
    setDoctorId('DOC001');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button onClick={() => navigate('/')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition">
          <ArrowLeft size={20} /> Back to Home
        </button>
        <div className="flex justify-center text-brand-600 mb-4">
          <Activity size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Doctor Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your dashboard
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Doctor ID</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. DOC001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Demo Account Available</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button onClick={fillDemoDoc} className="text-sm text-brand-600 hover:text-brand-500 font-medium">
                Use Demo Doctor (DOC001)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorAuth;
