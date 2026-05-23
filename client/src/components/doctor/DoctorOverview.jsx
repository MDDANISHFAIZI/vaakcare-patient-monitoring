import { motion } from 'framer-motion';
import { Users, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

const DoctorOverview = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back, Dr. {user?.name.split(' ')[0] || 'Doctor'}! 👋</h1>
            <p className="text-brand-100 max-w-lg leading-relaxed">
              You have <span className="font-bold text-white">4</span> critical patients and <span className="font-bold text-white">8</span> appointments scheduled for today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Patients</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">124</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Critical Alerts</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">4</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Today's Appts</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">8</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Recovery Rate</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">92%</h3>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Patient Updates</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold shrink-0">
                  P{i}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">Patient {i}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Uploaded new blood test results. AI analysis shows normal levels.</p>
                  <p className="text-xs text-slate-400 mt-2">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Today's Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="font-bold text-blue-600 dark:text-blue-400 w-16 text-sm shrink-0">10:00 AM</div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">General Checkup</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sarah Johnson</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <div className="font-bold text-red-600 dark:text-red-400 w-16 text-sm shrink-0">11:30 AM</div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Follow-up (High BP)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Michael Smith</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
              <div className="font-bold text-slate-500 dark:text-slate-400 w-16 text-sm shrink-0">02:00 PM</div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Video Consultation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Emma Davis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;
