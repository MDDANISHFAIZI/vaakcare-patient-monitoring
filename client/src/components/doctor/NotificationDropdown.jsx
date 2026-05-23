import { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ user, userType = 'doctor' }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    const socket = io('http://localhost:3001');
    // Using the same room logic for both doctor and patient
    socket.emit('join-doctor-room', user._id);

    socket.on('new-notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Simple popup toast or sound logic
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        audio.play().catch(e => console.log('Audio play blocked'));
      } catch (e) {}
    });

    return () => socket.disconnect();
  }, [user._id]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/notifications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsReadAndRedirect = async (notif) => {
    if (!notif.isRead) {
      try {
        await axios.put(`http://localhost:3001/api/notifications/${notif._id}/read`, {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    
    setIsOpen(false);
    if (notif.type === 'Message') {
      // Assuming parent component can handle it, or we just navigate
      // In this app structure, chat is handled via activeTab in Dashboard.
      // We will trigger a custom event or navigate.
      window.dispatchEvent(new CustomEvent('open-chat', { detail: { type: userType } }));
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:3001/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex gap-3 cursor-pointer ${!notif.isRead ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                  onClick={() => markAsReadAndRedirect(notif)}
                >
                  <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!notif.isRead ? 'bg-brand-500' : 'bg-transparent'}`} />
                  <div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {notif.senderName ? <span className="font-bold">{notif.senderName}: </span> : null}
                      {notif.content}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
