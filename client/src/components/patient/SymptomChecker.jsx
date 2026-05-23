import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const SymptomChecker = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  const commonSymptoms = [
    'Fever', 'Cough', 'Shortness of breath', 'Fatigue', 
    'Muscle aches', 'Headache', 'Loss of taste/smell', 
    'Sore throat', 'Congestion', 'Nausea', 'Chest pain', 'Dizziness'
  ];

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeRisk = (e) => {
    e.preventDefault();
    if (!age || selectedSymptoms.length === 0) return;

    let riskLevel = 'LOW';
    let possibleConditions = ['Common Cold', 'Mild Allergy'];
    let recommendations = ['Rest and hydrate', 'Monitor symptoms'];

    const ageNum = parseInt(age);
    const weightNum = parseInt(weight) || 70;
    
    // Static logic for demonstration
    const highRiskSymptoms = ['Shortness of breath', 'Chest pain', 'Dizziness'];
    const hasHighRiskSymptom = selectedSymptoms.some(s => highRiskSymptoms.includes(s));
    
    if (hasHighRiskSymptom || (ageNum > 65 && selectedSymptoms.length > 3)) {
      riskLevel = 'HIGH';
      possibleConditions = ['Severe Respiratory Infection', 'Cardiac Issue', 'COVID-19'];
      recommendations = ['Seek immediate medical attention', 'Go to the nearest emergency room'];
    } else if (selectedSymptoms.length >= 3 || ageNum > 50) {
      riskLevel = 'MEDIUM';
      possibleConditions = ['Influenza', 'Bronchitis', 'Moderate Viral Infection'];
      recommendations = ['Schedule a doctor appointment', 'Rest and take over-the-counter medication if advised'];
    }

    setResult({
      risk: riskLevel,
      conditions: possibleConditions,
      recommendations
    });
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'HIGH': return 'bg-red-500 text-white border-red-600 shadow-red-500/30';
      case 'MEDIUM': return 'bg-yellow-500 text-white border-yellow-600 shadow-yellow-500/30';
      default: return 'bg-green-500 text-white border-green-600 shadow-green-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-blue-800 dark:text-blue-300">Disclaimer</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="text-brand-500" /> Assessment Details
          </h2>
          
          <form onSubmit={analyzeRisk} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 dark:text-white"
                  placeholder="e.g., 34"
                  required
                  min="0"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 dark:text-white"
                  placeholder="e.g., 70"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-300'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={!age || selectedSymptoms.length === 0}
              className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Symptoms
            </button>
          </form>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-full"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Analysis Result</h3>
                
                <div className={`p-6 rounded-2xl border shadow-lg mb-6 flex flex-col items-center justify-center text-center ${getRiskColor(result.risk)}`}>
                  {result.risk === 'HIGH' ? <AlertTriangle size={48} className="mb-2" /> : <ShieldAlert size={48} className="mb-2" />}
                  <div className="text-3xl font-black tracking-wider">{result.risk} RISK</div>
                  <p className="opacity-90 mt-1">Based on your provided symptoms</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                      <ShieldAlert className="text-brand-500" size={18} /> Possible Conditions
                    </h4>
                    <ul className="space-y-2">
                      {result.conditions.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                      <CheckCircle2 className="text-green-500" size={18} /> Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-green-50 dark:bg-green-900/10 p-2 rounded-lg text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => setResult(null)}
                  className="mt-8 w-full py-2 text-brand-600 dark:text-brand-400 font-medium hover:underline"
                >
                  Start New Assessment
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600"
              >
                <ShieldAlert className="text-slate-300 dark:text-slate-600 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Awaiting Assessment</h3>
                <p className="text-slate-500 dark:text-slate-400">Fill out the details and select your symptoms to see a preliminary risk analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
