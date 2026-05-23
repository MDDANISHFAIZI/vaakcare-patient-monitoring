import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, Navigation, Search } from 'lucide-react';

const NearbyHospitals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const hospitals = [
    {
      id: 1,
      name: 'VaakCare General Hospital',
      type: 'General',
      distance: '2.4 km',
      rating: 4.8,
      status: 'Open 24/7',
      address: '123 Health Ave, Medical District',
      phone: '+1 234-567-8900'
    },
    {
      id: 2,
      name: 'City Care Cardiology',
      type: 'Specialty',
      distance: '3.8 km',
      rating: 4.6,
      status: 'Closes at 8 PM',
      address: '45 Heart Boulevard',
      phone: '+1 234-567-8901'
    },
    {
      id: 3,
      name: 'Sunrise Children\'s Clinic',
      type: 'Pediatric',
      distance: '5.1 km',
      rating: 4.9,
      status: 'Closes at 6 PM',
      address: '78 Kids Street',
      phone: '+1 234-567-8902'
    },
    {
      id: 4,
      name: 'Metro Orthopedics',
      type: 'Specialty',
      distance: '6.2 km',
      rating: 4.5,
      status: 'Open',
      address: '90 Bone Road',
      phone: '+1 234-567-8903'
    },
    {
      id: 5,
      name: 'Westside Emergency Room',
      type: 'Emergency',
      distance: '1.5 km',
      rating: 4.7,
      status: 'Open 24/7',
      address: '55 Fast Track Way',
      phone: '+1 234-567-8904'
    }
  ];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || h.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Nearby Facilities</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Find the right medical care near you.</p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search hospitals, clinics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
        {['All', 'General', 'Emergency', 'Specialty', 'Pediatric'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === type
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital, idx) => (
          <motion.div
            key={hospital.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Map Placeholder Image */}
            <div className="h-32 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={48} className="text-slate-400 dark:text-slate-500 opacity-50" />
              </div>
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1 shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {hospital.rating}
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {hospital.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-xs font-medium">
                <span className={`px-2 py-1 rounded-md ${
                  hospital.type === 'Emergency' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                  hospital.type === 'Specialty' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                  'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                }`}>
                  {hospital.type}
                </span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Navigation size={12} /> {hospital.distance}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Clock size={16} className="text-slate-400 shrink-0" />
                  <span className={hospital.status.includes('Open') ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                    {hospital.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${hospital.phone}`} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  <Phone size={16} /> Call
                </a>
                <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  <Navigation size={16} /> Directions
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <MapPin size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No facilities found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default NearbyHospitals;
