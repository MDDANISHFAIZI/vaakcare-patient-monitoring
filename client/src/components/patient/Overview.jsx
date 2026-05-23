import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Star, Award, TrendingUp, Clock } from 'lucide-react';

const Overview = ({ user }) => {
  // Dummy data for gamification and appointments
  const [points, setPoints] = useState(450);
  const [level, setLevel] = useState('Bronze Health Warrior');
  
  const nextLevelPoints = 500;
  const progress = (points / nextLevelPoints) * 100;

  const stats = [
    {
      title: 'Health Status',
      value: 'Good',
      icon: Activity,
      color: 'bg-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Upcoming Appointment',
      value: 'Tomorrow, 10:00 AM',
      subtext: 'Dr. Sharma (Cardiology)',
      icon: Calendar,
      color: 'bg-brand-500',
      bg: 'bg-brand-50 dark:bg-brand-900/20',
      text: 'text-brand-600 dark:text-brand-400'
    },
    {
      title: 'Last Appointment',
      value: 'Oct 15, 2023',
      subtext: 'General Checkup',
      icon: Clock,
      color: 'bg-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section with Gamification */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100 to-transparent dark:from-brand-900/30 opacity-50 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Hello, {user?.name || 'Guest'}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Great job staying on top of your health. Keep it up!
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700 w-full md:w-auto min-w-[250px]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-500" size={24} />
                <span className="font-bold text-slate-800 dark:text-white">{level}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400">
                <Star size={16} className="fill-current" /> {points} pt
              </div>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-1 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-brand-500 h-2.5 rounded-full"
              ></motion.div>
            </div>
            <p className="text-xs text-right text-slate-500 dark:text-slate-400">
              {nextLevelPoints - points} points to next level
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</h3>
              {stat.subtext && <p className="text-xs text-slate-400 dark:text-slate-500">{stat.subtext}</p>}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions (Optional, fits well with overview) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-brand-500" /> Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Logged Daily Symptoms</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Today, 09:30 AM • +10 points</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Appointment Scheduled</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Yesterday • with Dr. Sharma</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
