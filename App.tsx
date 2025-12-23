import React, { useState, useEffect } from 'react';
import { ITINERARY_DATA, TRIP_TITLE, TRIP_SUBTITLE, MAP_LINK } from './constants';
import { DaySchedule } from './types';
import { DaySection } from './components/DaySection';
import { ThreeWeather } from './components/ThreeWeather';
import { LoginGate } from './components/LoginGate';
import { MapTrajectory } from './components/MapTrajectory';
import { HealingMessage } from './components/HealingMessage';
import { Map, Plane, List, CloudSun, Heart } from 'lucide-react';
import { subscribeToItinerary, isConfigured } from './firebaseUtils';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(ITINERARY_DATA);
  const [showWeather, setShowWeather] = useState(false);
  const [showHealingMessage, setShowHealingMessage] = useState(false);

  // Subscribe to Firebase updates if configured
  useEffect(() => {
    if (isAuthenticated && isConfigured) {
        const unsubscribe = subscribeToItinerary((newItems) => {
            console.log("🔥 [App] Received Firestore items:", newItems.length);
            
            // Merge logic
            const baseSchedule: DaySchedule[] = ITINERARY_DATA.map(day => ({
                ...day,
                items: [...day.items] 
            }));

            newItems.forEach(item => {
                const targetDate = item.date || "1/1"; 
                const dayIndex = baseSchedule.findIndex(day => day.date === targetDate);
                if (dayIndex !== -1) {
                    const day = baseSchedule[dayIndex];
                    const existingItemIndex = day.items.findIndex(existing => existing.id === item.id);
                    if (existingItemIndex === -1) {
                        day.items.push(item);
                    } else {
                        day.items[existingItemIndex] = item;
                    }
                }
            });

            // Re-sort all days by time
            baseSchedule.forEach(day => {
                day.items.sort((a, b) => a.time.localeCompare(b.time));
            });

            setScheduleData(baseSchedule);
        });
        return () => unsubscribe();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
      return <LoginGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex justify-center font-sans text-gray-900 selection:bg-pink-200">
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen flex flex-col relative">
        
        {/* Main Header with Texture */}
        <header className="bg-[#2d3748] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-lg mb-0 relative overflow-hidden flex-shrink-0">
           {/* Grainy texture overlay */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
           
           <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12">
                <Plane size={120} />
           </div>
           
           <div className="relative z-10">
              <div className="flex justify-between items-start">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium tracking-wider mb-3 shadow-sm">
                    TRAVEL LOG
                  </div>
                  
                  <div className="flex gap-2 items-center">
                      <div className="flex flex-col items-center relative">
                        {/* Heart Trigger Icon */}
                        <button 
                          onDoubleClick={() => setShowHealingMessage(true)}
                          className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer active:scale-90 relative z-10"
                          title="Double tap to open"
                        >
                            <Heart size={20} className="text-pink-300 fill-pink-300/50" />
                        </button>
                        {/* Hint Text */}
                        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[9px] text-white/50 tracking-wider whitespace-nowrap opacity-80 pointer-events-none">
                            click x2
                        </span>
                      </div>

                      {/* Weather Trigger Icon */}
                      <button 
                        onClick={() => setShowWeather(true)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors"
                      >
                          <CloudSun size={24} className="text-yellow-300" />
                      </button>
                  </div>
              </div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight drop-shadow-md">{TRIP_TITLE}</h1>
              <p className="text-gray-400 text-lg font-light tracking-wide">{TRIP_SUBTITLE}</p>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 mt-[-20px] bg-contain relative z-20 pb-32" style={{ backgroundImage: viewMode === 'LIST' ? 'radial-gradient(#e5e7eb 1px, transparent 1px)' : 'none', backgroundSize: '20px 20px' }}>
          
          {viewMode === 'LIST' ? (
              <div className="mt-8">
                  {scheduleData.map((day, index) => (
                      <div key={day.date}>
                          <DaySection 
                              day={day} 
                              isLastDay={index === scheduleData.length - 1} 
                          />
                      </div>
                  ))}
              </div>
          ) : (
              <div className="w-full mt-8" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
                  <MapTrajectory scheduleData={scheduleData} />
                  <div className="text-center mt-4 text-xs text-slate-400 font-medium">
                      點擊標記可查看導航
                  </div>
              </div>
          )}

        </main>

        {/* Footer / Floating Action */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4 z-40 pointer-events-none px-6 w-full max-w-md mx-auto">
            {/* View Toggle Button (Map / List) */}
            <button 
                onClick={() => setViewMode(viewMode === 'LIST' ? 'MAP' : 'LIST')}
                className="pointer-events-auto flex-1 bg-slate-800 text-white py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 font-bold transform transition active:scale-95 hover:bg-slate-700 border-2 border-slate-700"
            >
                {viewMode === 'LIST' ? (
                    <>
                        <Map size={18} />
                        <span>Map View</span>
                    </>
                ) : (
                    <>
                        <List size={18} />
                        <span>List View</span>
                    </>
                )}
            </button>
        </div>

        {/* 3D Weather Modal */}
        {showWeather && (
            <ThreeWeather 
                day="Today" 
                onClose={() => setShowWeather(false)} 
            />
        )}

        {/* Hidden Healing Message (Triggered via Heart Icon) */}
        {showHealingMessage && (
            <HealingMessage onClose={() => setShowHealingMessage(false)} />
        )}

      </div>
    </div>
  );
};

export default App;