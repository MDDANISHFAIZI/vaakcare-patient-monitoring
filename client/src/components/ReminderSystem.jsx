import { useState, useEffect } from 'react';
import { Bell, Clock, Plus, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReminderSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('vaakcare_reminders');
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('vaakcare_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.completed) {
          const reminderTime = new Date(reminder.time);
          if (
            now.getHours() === reminderTime.getHours() &&
            now.getMinutes() === reminderTime.getMinutes() &&
            now.getDate() === reminderTime.getDate() &&
            now.getMonth() === reminderTime.getMonth()
          ) {
            setActiveAlert(reminder);
            // Mark as completed so it doesn't alert again today
            setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, completed: true } : r));
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const addReminder = (e) => {
    e.preventDefault();
    if (!title || !time) return;
    
    const newReminder = {
      id: Date.now(),
      title,
      time,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setReminders([...reminders, newReminder].sort((a, b) => new Date(a.time) - new Date(b.time)));
    setTitle('');
    setTime('');
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const isUpcoming = (reminderTime) => {
    const now = new Date();
    const time = new Date(reminderTime);
    return time > now && (time - now) < 24 * 60 * 60 * 1000; // within 24 hours
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        aria-label="Reminders"
      >
        <div className="relative">
          <Bell size={24} />
          {reminders.filter(r => !r.completed && isUpcoming(r.time)).length > 0 && (
            <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-brand-600"></span>
          )}
        </div>
      </button>

      {/* Reminder Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-36 right-6 z-40 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-brand-500" /> My Reminders
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto space-y-3">
              {reminders.length === 0 ? (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">No reminders set.</p>
              ) : (
                reminders.map(reminder => {
                  const upcoming = !reminder.completed && isUpcoming(reminder.time);
                  return (
                    <div key={reminder.id} className={`p-3 rounded-xl border ${upcoming ? 'border-brand-300 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50'} relative group`}>
                      <div className="flex justify-between items-start pr-6">
                        <h4 className={`font-medium text-sm ${reminder.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                          {reminder.title}
                        </h4>
                        {upcoming && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1"></span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <CalendarIcon size={12} /> {new Date(reminder.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <button 
                        onClick={() => deleteReminder(reminder.id)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={addReminder} className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="space-y-2 mb-3">
                <input 
                  type="text" 
                  placeholder="Remind me to..." 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white placeholder-slate-400"
                  required
                />
                <input 
                  type="datetime-local" 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                <Plus size={16} /> Add Reminder
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Alert Toast */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[100] bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border-l-4 border-brand-500 flex items-center gap-4 min-w-[300px]"
          >
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Bell className="animate-bounce" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-white">Reminder</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{activeAlert.title}</p>
            </div>
            <button onClick={() => setActiveAlert(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReminderSystem;
