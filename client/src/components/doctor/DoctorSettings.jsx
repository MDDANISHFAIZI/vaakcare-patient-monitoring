import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Clock } from 'lucide-react';

const DoctorSettings = ({ user }) => {
  const [schedule, setSchedule] = useState({
    monday: { start: '10:00', end: '18:00', isOff: false },
    tuesday: { start: '10:00', end: '18:00', isOff: false },
    wednesday: { start: '10:00', end: '18:00', isOff: false },
    thursday: { start: '10:00', end: '18:00', isOff: false },
    friday: { start: '10:00', end: '18:00', isOff: false },
    saturday: { start: '10:00', end: '14:00', isOff: true },
    sunday: { start: '10:00', end: '14:00', isOff: true },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current schedule from doctor profile
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/doctor/${user._id}/status`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.data.availability) {
          setSchedule(res.data.availability);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:3001/api/doctor/schedule', { availability: schedule }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessage('Schedule updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update schedule.');
    } finally {
      setSaving(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings & Schedule</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your weekly availability for appointments.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Weekly Availability</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set your working hours for each day.</p>
          </div>
        </div>

        <div className="space-y-4">
          {days.map(day => (
            <div key={day} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="w-32 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={!schedule[day].isOff} 
                  onChange={(e) => handleChange(day, 'isOff', !e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{day}</span>
              </div>

              <div className="flex items-center gap-4 flex-1 justify-end">
                {!schedule[day].isOff ? (
                  <>
                    <input 
                      type="time" 
                      value={schedule[day].start}
                      onChange={(e) => handleChange(day, 'start', e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-slate-400 font-medium">to</span>
                    <input 
                      type="time" 
                      value={schedule[day].end}
                      onChange={(e) => handleChange(day, 'end', e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                    />
                  </>
                ) : (
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 px-12 italic">Day Off</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
          {message && <span className={`text-sm font-medium ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</span>}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-brand-500/20 disabled:opacity-70"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
