import React from 'react';
import { DaySchedule } from '../types';
import { Search, Calendar, Map, MapPin, CloudSun, Home, List, Settings, Moon, ArrowRight } from 'lucide-react';

interface TravelDashboardProps {
  scheduleData: DaySchedule[];
  onNavigate: (view: 'itinerary' | 'map' | 'spots' | 'weather') => void;
}

export const TravelDashboard: React.FC<TravelDashboardProps> = ({ scheduleData, onNavigate }) => {
  // Extract destinations from schedule data
  const destinations = [
    { name: '台北', label: 'Taipei', active: false },
    { name: '台中', label: 'Taichung', active: true },
    { name: '屏東', label: 'Pingtung', active: false },
    { name: '左營', label: 'Zuoying', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0f] text-white flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/30 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Rounded screen corners effect */}
      <div className="relative z-10 min-h-screen flex flex-col" style={{ borderRadius: '40px' }}>
        
        {/* Header Section */}
        <header className="pt-16 pb-8 px-6 relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2 leading-tight">
              TAICHUNG<br />PINGTUNG TRIP
            </h1>
            <p className="text-gray-400 text-sm tracking-wide">2026/01/01 – 01/04</p>
          </div>
        </header>

        {/* Destination Points with Connecting Lines */}
        <div className="px-6 mb-8 relative">
          {/* Search Button - Floating on left */}
          <button className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 z-20 border border-white/10">
            <Search size={20} className="text-white" />
          </button>

          {/* Destination Points Container */}
          <div className="ml-16 relative">
            {/* SVG for connecting lines */}
            <svg 
              className="absolute top-6 left-0 w-full h-12 pointer-events-none" 
              style={{ zIndex: 0 }}
            >
              {/* Curved connecting lines between points */}
              {destinations.map((_, index) => {
                if (index === destinations.length - 1) return null;
                const startX = (index * 100 / (destinations.length - 1)) + '%';
                const endX = ((index + 1) * 100 / (destinations.length - 1)) + '%';
                return (
                  <path
                    key={index}
                    d={`M ${startX} 0 Q ${startX} 24, ${endX} 24`}
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    style={{ 
                      filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))',
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '3s'
                    }}
                  />
                );
              })}
            </svg>

            {/* Destination Points */}
            <div className="flex justify-between items-center relative z-10">
              {destinations.map((dest, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  {/* Circle with active ring */}
                  <div className="relative">
                    {dest.active && (
                      <div className="absolute inset-0 rounded-full border-2 border-[#10b981] animate-pulse" style={{ padding: '3px' }}></div>
                    )}
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        dest.active 
                          ? 'bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-[#10b981]/50' 
                          : 'bg-white/10 backdrop-blur-md border border-white/20'
                      }`}
                    >
                      <MapPin size={20} className={dest.active ? 'text-white' : 'text-gray-400'} />
                    </div>
                  </div>
                  {/* Label */}
                  <span className={`text-xs ${dest.active ? 'text-[#10b981] font-medium' : 'text-gray-500'}`}>
                    {dest.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Cards Grid */}
        <div className="px-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Itinerary Card */}
            <button 
              onClick={() => onNavigate('itinerary')}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between h-40 border border-white/5 hover:border-white/10 transition-all active:scale-95 group"
            >
              <Calendar size={24} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">ITINERARY</span>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-[#10b981] transition-colors" />
              </div>
            </button>

            {/* Map View Card */}
            <button 
              onClick={() => onNavigate('map')}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between h-40 border border-white/5 hover:border-white/10 transition-all active:scale-95 group"
            >
              <Map size={24} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">MAP VIEW</span>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-[#10b981] transition-colors" />
              </div>
            </button>

            {/* Spots Card */}
            <button 
              onClick={() => onNavigate('spots')}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between h-40 border border-white/5 hover:border-white/10 transition-all active:scale-95 group"
            >
              <MapPin size={24} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">SPOTS</span>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-[#10b981] transition-colors" />
              </div>
            </button>

            {/* Weather Card */}
            <button 
              onClick={() => onNavigate('weather')}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between h-40 border border-white/5 hover:border-white/10 transition-all active:scale-95 group"
            >
              <CloudSun size={24} className="text-gray-400 group-hover:text-white transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">WEATHER</span>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-[#10b981] transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="mt-auto pb-8 pt-6 px-6">
          <div className="flex justify-around items-center bg-white/5 backdrop-blur-md rounded-full py-4 px-6 border border-white/10">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
              <Home size={22} className="text-[#10b981]" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
              <List size={22} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
              <Moon size={22} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
              <Settings size={22} className="text-gray-400" />
            </button>
          </div>
        </nav>

      </div>
    </div>
  );
};
