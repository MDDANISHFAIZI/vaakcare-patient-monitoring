import { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Dumbbell, Brain, HeartPulse, Sparkles } from 'lucide-react';

const HealthTips = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', icon: Sparkles, label: 'All Tips' },
    { id: 'Diet', icon: Apple, label: 'Diet & Nutrition' },
    { id: 'Exercise', icon: Dumbbell, label: 'Exercise' },
    { id: 'Mental Health', icon: Brain, label: 'Mental Health' },
    { id: 'General', icon: HeartPulse, label: 'General Health' },
  ];

  const tips = [
    {
      id: 1,
      category: 'Diet',
      title: 'Hydration is Key',
      content: 'Aim to drink at least 8 glasses (about 2 liters) of water a day. Staying hydrated helps maintain energy levels and brain function.',
      icon: Apple,
      color: 'bg-green-500'
    },
    {
      id: 2,
      category: 'Exercise',
      title: 'The 30-Minute Rule',
      content: 'Try to get at least 30 minutes of moderate-intensity physical activity every day. A brisk walk counts!',
      icon: Dumbbell,
      color: 'bg-orange-500'
    },
    {
      id: 3,
      category: 'Mental Health',
      title: 'Practice Mindfulness',
      content: 'Take 5 minutes each day to focus on your breathing. This simple practice can significantly reduce stress and anxiety.',
      icon: Brain,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      category: 'Diet',
      title: 'Eat the Rainbow',
      content: 'Incorporate fruits and vegetables of varying colors into your meals to ensure you are getting a wide spectrum of vitamins and minerals.',
      icon: Apple,
      color: 'bg-green-500'
    },
    {
      id: 5,
      category: 'General',
      title: 'Prioritize Sleep',
      content: 'Adults need 7-9 hours of sleep per night for optimal health. Establish a regular sleep schedule to improve sleep quality.',
      icon: HeartPulse,
      color: 'bg-brand-500'
    },
    {
      id: 6,
      category: 'Exercise',
      title: 'Take the Stairs',
      content: 'Incorporate small bursts of activity into your day by taking the stairs instead of the elevator whenever possible.',
      icon: Dumbbell,
      color: 'bg-orange-500'
    }
  ];

  const filteredTips = activeCategory === 'All' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daily Health Tips</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Expert advice for a healthier lifestyle.</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all shadow-sm ${
                isActive 
                  ? 'bg-brand-500 text-white font-bold' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 font-medium'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-full ${tip.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                {tip.category}
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">
                {tip.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tip.content}
              </p>
            </motion.div>
          );
        })}
      </div>
      
      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No tips found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default HealthTips;
