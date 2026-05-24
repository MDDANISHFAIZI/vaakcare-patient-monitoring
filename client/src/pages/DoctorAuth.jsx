import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowLeft, CheckCircle, Copy, Check } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const DoctorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupSuccessDocId, setSignupSuccessDocId] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Login fields
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup fields
  const [name, setName] = useState('');
  const [hospital, setHospital] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/auth/doctor/login', {
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/auth/doctor/register', {
        name,
        hospital,
        specialization,
        password: signupPassword
      });
      setSignupSuccessDocId(res.data.doctorId);
      // Reset signup fields
      setName('');
      setHospital('');
      setSpecialization('');
      setSignupPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(signupSuccessDocId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToLogin = () => {
    setDoctorId(signupSuccessDocId);
    setSignupSuccessDocId(null);
    setIsLogin(true);
  };

  // Demo helper
  const fillDemoDoc = () => {
    setIsLogin(true);
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
          {signupSuccessDocId 
            ? 'Account created successfully' 
            : (isLogin ? 'Sign in to your dashboard' : 'Create a new doctor account')}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          <AnimatePresence mode="wait">
            {signupSuccessDocId ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center text-emerald-500">
                  <CheckCircle size={56} className="animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Registration Complete</h3>
                <p className="text-sm text-slate-600">
                  Welcome to Vaakcare! Below is your automatically generated **Doctor ID**. You will need this ID along with your password to log in.
                </p>
                
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center gap-2 relative">
                  <span className="text-xs text-emerald-800 uppercase tracking-wider font-semibold">Your Doctor ID</span>
                  <span className="text-3xl font-mono font-bold text-emerald-600 select-all tracking-wider">
                    {signupSuccessDocId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-3 p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="text-xs text-slate-500 italic">
                  Please copy or write down this ID before proceeding.
                </div>

                <button
                  onClick={handleGoToLogin}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition"
                >
                  Proceed to Login
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                transition={{ duration: 0.2 }}
              >
                <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  {isLogin ? (
                    // Login view
                    <>
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
                    </>
                  ) : (
                    // Signup view
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Dr. Ramesh Kumar"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">Hospital Name</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            placeholder="e.g. City Hospital"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">Specialization</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            placeholder="e.g. Cardiologist"
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
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition"
                    >
                      {loading ? (isLogin ? 'Signing in...' : 'Registering...') : (isLogin ? 'Sign in' : 'Create Account')}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }} 
                    className="text-sm text-slate-600 hover:text-slate-900 transition font-medium"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>

                {isLogin && (
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
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorAuth;
