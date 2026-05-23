import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Stethoscope } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4 text-brand-600">
          <Activity size={48} strokeWidth={2.5} />
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">VaakCare</h1>
        </div>
        <p className="text-xl text-slate-600 max-w-lg mx-auto">
          AI-powered remote patient monitoring and intelligent triage platform.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/auth/patient')}
          className="glass-panel rounded-3xl p-8 cursor-pointer flex flex-col items-center text-center group hover:bg-white/90 transition-all duration-300"
        >
          <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Patient Portal</h2>
          <p className="text-slate-600">Log in to report symptoms and connect with your doctor.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/auth/doctor')}
          className="glass-panel rounded-3xl p-8 cursor-pointer flex flex-col items-center text-center group hover:bg-white/90 transition-all duration-300"
        >
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
            <Stethoscope size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Doctor Dashboard</h2>
          <p className="text-slate-600">Monitor patients, view AI summaries, and manage alerts.</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-sm text-slate-500 flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-slate-200"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Demo Mode Pre-loaded
      </motion.div>
    </div>
  );
};

export default LandingPage;
