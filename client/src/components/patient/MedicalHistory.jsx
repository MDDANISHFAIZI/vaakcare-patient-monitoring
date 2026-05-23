import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FileText, Calendar, Activity, Upload, Download, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const MedicalHistory = () => {
  const { user } = useAuthStore();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`https://vaakcare-patient-monitoring.onrender.com/api/records/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRecords(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch medical history', err);
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/messages/upload', formData, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const fileData = uploadRes.data;

      const recordRes = await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/records', {
        patientId: user._id,
        doctorId: user.doctorId,
        type: 'Report',
        title: fileData.fileName || 'Uploaded Report',
        description: 'Patient uploaded medical report',
        fileUrl: fileData.fileUrl,
        date: new Date()
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setRecords([recordRes.data, ...records]);
    } catch (err) {
      console.error('Failed to upload report', err);
      alert('Failed to upload report');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Consultation': return <Calendar size={20} className="text-blue-500" />;
      case 'Prescription': return <FileText size={20} className="text-brand-500" />;
      case 'Report': return <Upload size={20} className="text-purple-500" />;
      case 'Diagnosis': return <Activity size={20} className="text-red-500" />;
      default: return <FileText size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Medical History</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">View your past consultations, prescriptions, and reports.</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Upload Report'}</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading history...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Records Found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your medical history, including past consultations and uploaded reports, will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record._id} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600">
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 dark:text-white">{record.title}</h3>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{record.description}</p>
                  
                  {record.fileUrl && (
                    <a href={`https://vaakcare-patient-monitoring.onrender.com${record.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/50 transition">
                      <Download size={14} /> Download {record.type}
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

export default MedicalHistory;
