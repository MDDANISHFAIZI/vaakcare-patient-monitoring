import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const PatientAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    guardianPhoneNumber: '',
    hospitalName: '',
    doctorId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/patient/login' : '/api/auth/patient/register';
      const res = await axios.post(`http://localhost:3001${endpoint}`, formData);
      setUser(res.data);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoPatient = () => {
    setIsLogin(true);
    setFormData({ ...formData, name: 'Ramesh Kumar', password: 'password123' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button onClick={() => navigate('/')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition">
          <ArrowLeft size={20} /> Back to Home
        </button>
        <div className="flex justify-center text-brand-600 mb-4">
          <User size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Patient Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'Sign in to report your status' : 'Create an account to connect with your doctor'}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  name="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Guardian Phone Number</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="guardianPhoneNumber"
                      required={!isLogin}
                      className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                      value={formData.guardianPhoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Hospital Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="hospitalName"
                      required={!isLogin}
                      className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Doctor's Object ID</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="doctorId"
                      required={!isLogin}
                      className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      placeholder="Ask your doctor for their ID"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-600 hover:text-slate-900 transition">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <button onClick={fillDemoPatient} className="text-sm text-brand-600 hover:text-brand-500 font-medium">
              Use Demo Patient (Ramesh Kumar)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientAuth;
