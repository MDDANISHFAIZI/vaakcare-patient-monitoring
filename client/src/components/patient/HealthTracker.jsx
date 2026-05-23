import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Droplet, Weight } from 'lucide-react';

const HealthTracker = () => {
  const [timeRange, setTimeRange] = useState('6M');

  // Dummy Data
  const bpData = [
    { name: 'Jan', systolic: 120, diastolic: 80 },
    { name: 'Feb', systolic: 118, diastolic: 79 },
    { name: 'Mar', systolic: 122, diastolic: 82 },
    { name: 'Apr', systolic: 115, diastolic: 78 },
    { name: 'May', systolic: 125, diastolic: 85 },
    { name: 'Jun', systolic: 119, diastolic: 80 },
  ];

  const sugarData = [
    { name: 'Jan', level: 95 },
    { name: 'Feb', level: 92 },
    { name: 'Mar', level: 105 },
    { name: 'Apr', level: 98 },
    { name: 'May', level: 110 },
    { name: 'Jun', level: 96 },
  ];

  const weightData = [
    { name: 'Jan', weight: 75.5 },
    { name: 'Feb', weight: 75.2 },
    { name: 'Mar', weight: 74.8 },
    { name: 'Apr', weight: 74.5 },
    { name: 'May', weight: 74.0 },
    { name: 'Jun', weight: 73.5 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="font-bold text-slate-800 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Health Tracker</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor your vital signs over time</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          {['1M', '3M', '6M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-white dark:bg-slate-600 text-brand-600 dark:text-brand-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Blood Pressure</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Systolic / Diastolic (mmHg)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-800 dark:text-white">119<span className="text-lg text-slate-400 font-medium">/80</span></p>
              <p className="text-xs text-green-500 font-medium">Normal Range</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 160]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Sugar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                <Droplet size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Blood Sugar</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fasting (mg/dL)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-800 dark:text-white">96</p>
              <p className="text-xs text-green-500 font-medium">Normal Range</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sugarData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[70, 130]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="level" name="Blood Sugar" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                <Weight size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Body Weight</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kilograms (kg)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-800 dark:text-white">73.5</p>
              <p className="text-xs text-brand-500 font-medium">-2.0 kg from Jan</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[70, 80]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="weight" name="Weight" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
