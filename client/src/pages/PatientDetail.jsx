import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Activity, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import LiveChat from '../components/chat/LiveChat';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [patient, setPatient] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`https://vaakcare-patient-monitoring.onrender.com/api/doctor/patients/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPatient(res.data.patient);
        setLogs(res.data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, user.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-brand-400"></div>
      </div>
    );
  }

  if (!patient) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-xl">Patient not found</div>;

  // Chart data formatting
  const chartData = [...logs].reverse().map(log => {
    let riskVal = 1;
    if (log.risk === 'MEDIUM') riskVal = 2;
    if (log.risk === 'HIGH') riskVal = 3;
    
    return {
      date: new Date(log.createdAt).toLocaleDateString(),
      time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      riskVal,
      risk: log.risk,
      confidence: log.confidence
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center gap-6 sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => navigate('/doctor/dashboard')} 
          className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors bg-slate-100 dark:bg-slate-700 p-2 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/40 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-2xl shadow-inner">
            {patient.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">{patient.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1 font-medium"><Phone size={14} className="text-brand-500" /> {patient.guardianPhoneNumber}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Logs / Chat History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="text-brand-500" /> Interaction History
          </h2>
          
          <div className="space-y-6">
            {logs.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                <Activity size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-lg font-medium">No logs recorded yet.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  {log.risk === 'HIGH' && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>}
                  {log.risk === 'MEDIUM' && <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500"></div>}
                  {log.risk === 'LOW' && <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>}
                  
                  <div className="flex justify-between items-center mb-6 pl-4">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                      log.risk === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      log.risk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {log.risk} RISK
                    </span>
                  </div>

                  <div className="pl-4 space-y-6">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User size={14} /> Patient Said
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 text-lg border-l-4 border-slate-200 dark:border-slate-600 pl-4 py-1 font-medium bg-slate-50 dark:bg-slate-900/30 rounded-r-lg">
                        "{log.transcript}"
                      </p>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30 relative">
                      <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider mb-3">
                        AI Analysis
                      </p>
                      <p className="text-slate-800 dark:text-slate-200 mb-4 font-medium leading-relaxed">{log.summary}</p>
                      
                      {log.issues.length > 0 && (
                        <div className="mb-4 flex gap-2 flex-wrap">
                          {log.issues.map((iss, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
                              {iss}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm mt-4 border-t border-blue-100 dark:border-slate-700/50 pt-4 flex items-start gap-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Action:</span> 
                        <span className="text-slate-600 dark:text-slate-400">{log.recommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Analytics */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Risk Trend</h3>
            {chartData.length > 1 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis 
                      domain={[0, 4]} 
                      ticks={[1, 2, 3]} 
                      tickFormatter={(val) => val === 1 ? 'LOW' : val === 2 ? 'MED' : 'HIGH'}
                      axisLine={false} 
                      tickLine={false}
                      tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}}
                      width={50}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="riskVal" 
                      stroke="#0ea5e9" 
                      strokeWidth={4} 
                      dot={{r: 5, strokeWidth: 2, fill: '#fff'}} 
                      activeDot={{r: 8, stroke: '#0ea5e9', strokeWidth: 2}} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm italic text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                Not enough data to construct trend graph.
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Patient Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Hospital</span>
                <span className="font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 px-3 py-1 rounded-lg">{patient.hospitalName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Joined</span>
                <span className="font-bold text-slate-800 dark:text-white">{new Date(patient.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Guardian Contact</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1"><Phone size={14} /> {patient.guardianPhoneNumber}</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-2xl transition-transform hover:scale-110 z-50 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Floating Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col">
          <LiveChat 
            patientId={id}
            doctorId={user._id}
            currentUserType="Doctor"
            contactName={patient.name}
            token={user.token}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}

    </div>
  );
};

export default PatientDetail;
