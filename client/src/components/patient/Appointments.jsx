import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import PaymentCheckout from './PaymentCheckout';

const Appointments = () => {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('All');
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('https://vaakcare-patient-monitoring.onrender.com/api/appointments', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctorInfo = async () => {
    try {
      const res = await axios.get(`https://vaakcare-patient-monitoring.onrender.com/api/doctor/${user.doctorId}/status`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDoctor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctorInfo();
  }, []);

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setBookingError('');

    if (!doctor || !doctor.availability) return;

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const schedule = doctor.availability[dayOfWeek];

    if (!schedule || schedule.isOff) {
      setAvailableSlots([]);
      setBookingError('Doctor is not available on this day.');
      return;
    }

    // Generate 30 min slots
    const slots = [];
    let current = new Date(`${date}T${schedule.start}`);
    const end = new Date(`${date}T${schedule.end}`);

    while (current < end) {
      const timeString = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Check if already booked
      const isBooked = appointments.some(app => app.date === date && app.time === timeString && app.status !== 'Cancelled');
      if (!isBooked) {
        slots.push(timeString);
      }
      current.setMinutes(current.getMinutes() + 30);
    }

    setAvailableSlots(slots);
    if (slots.length === 0) setBookingError('No slots available for this day.');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedType) {
      setBookingError('Please fill all fields');
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/appointments', {
        doctorId: user.doctorId,
        date: selectedDate,
        time: selectedTime,
        type: selectedType
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setIsModalOpen(false);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedType('');
      fetchAppointments();
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Appointments</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your upcoming and past consultations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 hidden md:flex">
            {['All', 'Pending', 'Confirmed', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === f 
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={doctor?.status === 'offline'}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-brand-500/20"
          >
            <Plus size={18} /> Book Slot
          </button>
        </div>
      </div>

      {doctor?.status === 'offline' && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
          Your doctor is currently Offline. Booking new appointments is temporarily disabled.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment, idx) => (
          <motion.div
            key={appointment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-xl ${
              appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
              appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
              appointment.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {appointment.status}
            </div>

            <div className="flex items-center gap-4 mb-6 mt-2">
              <div className="w-14 h-14 bg-brand-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-brand-500 dark:text-brand-400 text-xl font-bold">
                {appointment.doctorId?.name?.charAt(4) || 'D'}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{appointment.doctorId?.name}</h3>
                <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">{appointment.doctorId?.specialization}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Calendar size={18} className="text-slate-400" />
                {appointment.date}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Clock size={18} className="text-slate-400" />
                {appointment.time} <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 ml-2">{appointment.type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MapPin size={18} className="text-slate-400" />
                {appointment.doctorId?.hospital}
              </div>
            </div>

            {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <PaymentCheckout doctorId={appointment.doctorId?._id || appointment.doctorId} amount={500} buttonText="Pay Consultation Fee" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {filteredAppointments.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No appointments found</h3>
          <p className="text-slate-500 dark:text-slate-400">You don't have any {filter.toLowerCase()} appointments.</p>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Book Appointment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleBook} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {availableSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 text-sm rounded-lg font-medium transition-all ${
                          selectedTime === time 
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTime && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Consultation Type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={doctor?.status !== 'clinic'}
                      onClick={() => setSelectedType('In-person')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
                        selectedType === 'In-person' 
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed'
                      }`}
                    >
                      In-person
                    </button>
                    <button
                      type="button"
                      disabled={doctor?.status !== 'online'}
                      onClick={() => setSelectedType('Video Consult')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
                        selectedType === 'Video Consult' 
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed'
                      }`}
                    >
                      Video Consult
                    </button>
                  </div>
                  {!selectedType && (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      Note: Appointment types depend on your doctor's current status (Online vs In Clinic).
                    </p>
                  )}
                </div>
              )}

              {bookingError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-lg font-medium">
                  {bookingError}
                </div>
              )}

              <button
                type="submit"
                disabled={isBooking || !selectedDate || !selectedTime || !selectedType}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:shadow-none"
              >
                {isBooking ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
