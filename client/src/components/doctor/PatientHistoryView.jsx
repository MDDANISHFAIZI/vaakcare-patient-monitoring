import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar, Activity, Upload, Download } from 'lucide-react';

const PatientHistoryView = ({ patientId, token }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/records/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch patient history', err);
        setLoading(false);
      }
    };
    if (patientId) {
      fetchRecords();
    }
  }, [patientId, token]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Consultation': return <Calendar size={18} className="text-blue-500" />;
      case 'Prescription': return <FileText size={18} className="text-brand-500" />;
      case 'Report': return <Upload size={18} className="text-purple-500" />;
      case 'Diagnosis': return <Activity size={18} className="text-red-500" />;
      default: return <FileText size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-bold text-slate-800 dark:text-white">Patient Medical History</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Past consultations and records.</p>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-slate-500 text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-500">
            No previous records found for this patient.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record._id} className="flex gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600">
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{record.title}</h4>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{record.description}</p>
                  
                  {record.fileUrl && (
                    <a href={`http://localhost:3001${record.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded hover:bg-brand-100 dark:hover:bg-brand-900/50 transition">
                      <Download size={12} /> Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistoryView;
