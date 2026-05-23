import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const DoctorLiveStatus = ({ doctorId, token }) => {
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    // Fetch initial status
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/doctor/${doctorId}/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data.status);
      } catch (err) {
        console.error('Failed to fetch doctor status', err);
      }
    };
    fetchStatus();

    // Listen for real-time updates
    const socket = io('http://localhost:3001');
    socket.on('doctor-status-changed', (data) => {
      if (data.doctorId === doctorId) {
        setStatus(data.status);
      }
    });

    return () => socket.disconnect();
  }, [doctorId, token]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online' };
      case 'clinic':
        return { color: 'bg-yellow-500', text: 'In Clinic' };
      default:
        return { color: 'bg-red-500', text: 'Offline' };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Doctor:</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${display.color} ${status !== 'offline' ? 'animate-pulse' : ''}`}></span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{display.text}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorLiveStatus;
