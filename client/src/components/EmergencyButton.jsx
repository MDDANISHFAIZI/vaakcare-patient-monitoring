import { useState } from 'react';
import { Phone, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-2xl shadow-red-500/50 hover:scale-105 transition-transform flex items-center justify-center animate-pulse"
        aria-label="Emergency"
      >
        <Phone size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-red-500/20"
            >
              <div className="bg-red-600 p-6 text-white flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={32} />
                  <div>
                    <h2 className="text-2xl font-bold">EMERGENCY</h2>
                    <p className="text-red-100 text-sm opacity-90">Immediate Action Required</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-red-200 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">National Emergency</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">112</p>
                    </div>
                    <a href="tel:112" className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200 transition">
                      <Phone size={20} />
                    </a>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Ambulance</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">108</p>
                    </div>
                    <a href="tel:108" className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200 transition">
                      <Phone size={20} />
                    </a>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
                  <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-2">First Aid Instructions</h3>
                  <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-2 list-disc list-inside">
                    <li>Stay calm and ensure the area is safe.</li>
                    <li>If the person is unresponsive, check breathing.</li>
                    <li>If not breathing, begin CPR immediately.</li>
                    <li>Do not move the person if spinal injury is suspected.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;
