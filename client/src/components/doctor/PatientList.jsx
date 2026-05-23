import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';

const PatientList = ({ user }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('https://vaakcare-patient-monitoring.onrender.com/api/doctor/patients', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();

    const socket = io('https://vaakcare-patient-monitoring.onrender.com');
    socket.emit('join-doctor-room', user._id);

    socket.on('new-health-log', (data) => {
      fetchPatients();
    });

    return () => socket.disconnect();
  }, [user]);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Your Patients</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor their health status and AI triage summaries.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-sm font-medium">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> High Risk</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium Risk</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Low Risk</div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient, idx) => {
            const latestLog = patient.latestLog;
            const risk = latestLog ? latestLog.risk : 'LOW';
            
            return (
              <motion.div
                key={patient._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/doctor/patient/${patient._id}`)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-700 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{patient.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ID: {patient._id.substring(18)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getRiskColor(risk)}`}>
                    {risk}
                  </span>
                </div>
                
                {latestLog ? (
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1">AI Summary:</p>
                      <p className="text-slate-800 dark:text-slate-200 line-clamp-2">{latestLog.summary}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
                      <span>Confidence: {latestLog.confidence}%</span>
                      <span>{new Date(latestLog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-sm border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 italic text-center h-[88px] flex items-center justify-center">
                    No logs available yet.
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition font-medium text-sm items-center gap-1">
                  View Details <ChevronRight size={16} />
                </div>
              </motion.div>
            );
          })}

          {filteredPatients.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No patients found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientList;
