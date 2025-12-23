import React, { useState } from 'react';
import { CloudSun, Sun, Cloud, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const WEATHER_DATA = [
  { day: '1/1', icon: Sun, temp: '18°', status: '晴朗' },
  { day: '1/2', icon: CloudSun, temp: '20°', status: '多雲' },
  { day: '1/3', icon: Sun, temp: '22°', status: '暖陽' },
  { day: '1/4', icon: Cloud, temp: '19°', status: '陰天' },
];

export const WeatherWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 -mt-8 relative z-30 mb-2">
      <div className="flex flex-col items-center">
        
        {/* Washi Tape Toggle Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="group transform -rotate-1 transition-transform hover:-rotate-2 hover:scale-105 active:scale-95 focus:outline-none"
        >
            <div className={`
                relative px-8 py-2 
                bg-[#ffddaa] 
                bg-opacity-95 backdrop-blur-sm
                text-[#8a6d3b] font-bold tracking-widest text-sm
                shadow-md
                border-dashed border-white/40
                flex items-center gap-3 whitespace-nowrap
            `}
            style={{
                // More gentle tape shape that doesn't cut text
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                paddingLeft: '2rem',
                paddingRight: '2rem'
            }}
            >
                {/* Texture overlay */}
                <div className="absolute inset-0 bg-white opacity-10 pointer-events-none"></div>
                
                <Sparkles size={14} className="text-yellow-600 flex-shrink-0" />
                <span>台中天氣預報</span>
                {isOpen ? <ChevronUp size={16} className="flex-shrink-0" /> : <ChevronDown size={16} className="flex-shrink-0" />}
            </div>
        </button>

        {/* Collapsible Content */}
        <div 
            className={`
                w-full transition-all duration-500 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}
            `}
        >
            <div className="bg-[#fffdf7] border-2 border-dashed border-[#e0d6c5] rounded-xl p-4 shadow-sm relative mx-1">
                {/* Decorative Sticker */}
                <div className="absolute -top-2 -right-2 transform rotate-12 bg-pink-200 text-pink-700 text-[10px] px-2 py-0.5 rounded-full shadow-sm font-bold border border-white z-10">
                    Taichung
                </div>

                <div className="flex justify-between items-center text-center">
                    {WEATHER_DATA.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 group cursor-default">
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 rounded-md">{item.day}</span>
                            <div className="bg-orange-50 p-2 rounded-full border border-orange-100 mt-1 transform group-hover:scale-110 transition-transform duration-300">
                                <item.icon size={20} className="text-orange-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-600 mt-1">{item.temp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};