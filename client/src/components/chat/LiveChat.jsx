import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, CheckCheck, X, Paperclip, FileText, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';

const LiveChat = ({ patientId, doctorId, currentUserType, contactName, token, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typingStatus, setTypingStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isPatient = currentUserType === 'Patient';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/messages/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        
        // Mark unread messages as seen
        res.data.forEach(msg => {
          if (msg.sender !== currentUserType && msg.status !== 'Seen') {
            socket?.emit('message-seen', { messageId: msg._id, patientId });
          }
        });
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-chat', patientId);
      fetchMessages();
    });

    newSocket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender !== currentUserType) {
        newSocket.emit('message-seen', { messageId: msg._id, patientId });
      }
    });

    newSocket.on('user-typing', (data) => {
      if (data.sender !== currentUserType) {
        setTypingStatus(`${data.sender} is typing...`);
      }
    });

    newSocket.on('user-stop-typing', (data) => {
      if (data.sender !== currentUserType) {
        setTypingStatus('');
      }
    });

    newSocket.on('message-status-update', (data) => {
      setMessages(prev => prev.map(m => m._id === data.messageId ? { ...m, status: data.status } : m));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [patientId, token, currentUserType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingStatus]);

  const handleTyping = (e) => {
    setInput(e.target.value);
    
    if (socket) {
      socket.emit('typing', { patientId, sender: currentUserType });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', { patientId, sender: currentUserType });
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    let fileData = {};
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      try {
        const uploadRes = await axios.post('http://localhost:3001/api/messages/upload', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        fileData = uploadRes.data;
      } catch (err) {
        console.error('File upload failed', err);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
      setSelectedFile(null);
    }

    const newMsg = {
      patientId,
      doctorId,
      sender: currentUserType,
      text: input || '📎 File Attached',
      status: 'Sent',
      ...fileData
    };

    socket.emit('send-message', newMsg);
    socket.emit('stop-typing', { patientId, sender: currentUserType });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold">
              {contactName?.charAt(0) || 'C'}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{contactName}</h3>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
            <Phone size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
            <Video size={18} />
          </button>
          {onClose ? (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2">
              <X size={20} />
            </button>
          ) : (
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <MoreVertical size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUserType;
          
          return (
            <motion.div
              key={msg._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${
                  isMe 
                    ? 'bg-brand-500 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-600'
                }`}
              >
                {msg.fileUrl && (
                  <a href={`http://localhost:3001${msg.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 mb-2 p-2 bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 transition">
                    <FileText size={16} />
                    <span className="truncate">{msg.fileName || 'Attachment'}</span>
                  </a>
                )}
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && (
                  msg.status === 'Seen' ? <CheckCheck size={12} className="text-brand-500" /> : 
                  msg.status === 'Delivered' ? <CheckCheck size={12} className="text-slate-400" /> : 
                  <Check size={12} className="text-slate-400" />
                )}
              </div>
            </motion.div>
          );
        })}
        {typingStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex space-x-1">
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
            {typingStatus}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        {selectedFile && (
          <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between text-sm">
            <span className="truncate text-slate-700 dark:text-slate-300">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="text-red-500"><X size={16} /></button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-brand-500 transition-colors">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-brand-500 rounded-full px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={(!input.trim() && !selectedFile) || isUploading}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white p-3 rounded-full transition-colors shrink-0 shadow-md shadow-brand-500/20"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
