import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic } from 'lucide-react';
import axios from 'axios';

const PatientAIChat = ({ user, isHindi }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your VaakCare assistant. How are you feeling today? Please tell me about any symptoms, pain, or medications you've taken.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicationTaken, setMedicationTaken] = useState(true);
  const [alertInfo, setAlertInfo] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'patient' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/patient/analyze', { text: userMessage.text, medicationTaken }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (res.data.risk === 'HIGH') {
        setAlertInfo(`🚨 HIGH RISK DETECTED! Emergency alert sent to guardian: ${user.guardianPhoneNumber || 'Unknown'}`);
      }

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: isHindi ? "धन्यवाद। मैंने आपके डॉक्टर को सूचित कर दिया है।" : "Thank you. I have analyzed your response and updated your doctor.",
          sender: 'ai'
        }]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, there was an error processing your message.", sender: 'ai' }]);
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = isHindi ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {alertInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-3 z-50"
          >
            {alertInfo}
            <button onClick={() => setAlertInfo(null)} className="ml-4 text-red-200 hover:text-white">✕</button>
          </motion.div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={msg.sender === 'patient' ? 'chat-bubble-patient' : 'chat-bubble-ai'}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="chat-bubble-ai flex gap-1 items-center h-10">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-4xl mx-auto mb-3 flex items-center gap-2">
          <input 
            type="checkbox" 
            id="medicationCheck"
            checked={medicationTaken} 
            onChange={(e) => setMedicationTaken(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-600 focus:ring-brand-500"
          />
          <label htmlFor="medicationCheck" className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            {isHindi ? "मैंने आज अपनी दवा ले ली है" : "I have taken my medication today"}
          </label>
        </div>
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
          <button
            type="button"
            className={`absolute left-4 transition ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-brand-500'}`}
            onClick={startListening}
          >
            <Mic size={24} />
          </button>
          <input
            type="text"
            className="w-full bg-slate-100 dark:bg-slate-700 rounded-full pl-14 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white transition placeholder-slate-400"
            placeholder={isHindi ? "अपना संदेश टाइप करें..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-4 text-white bg-brand-500 p-2 rounded-full hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition shadow-md"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default PatientAIChat;
