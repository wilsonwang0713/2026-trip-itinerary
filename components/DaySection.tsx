import React, { useState } from 'react';
import { DaySchedule } from '../types';
import { TimelineItem } from './TimelineItem';
import { RecommendationCard } from './RecommendationCard';
import { ChevronDown } from 'lucide-react';

interface DaySectionProps {
  day: DaySchedule;
  isLastDay: boolean;
}

export const DaySection: React.FC<DaySectionProps> = ({ day, isLastDay }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 last:mb-24">
      {/* Sticky Date Header - Washi Tape Style */}
      <div className="sticky top-0 z-20 -mx-4 pt-2 pb-1 pointer-events-none">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            pointer-events-auto
            relative mx-2
            cursor-pointer 
            transition-transform active:scale-[0.99] duration-150
          `}
        >
            {/* Visual Background (Tape) */}
            <div className={`
                absolute inset-0
                bg-[#fffbeb]/95 backdrop-blur-sm
                border-y-2 border-dashed border-[#fcd34d]
                shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                transform -rotate-[0.5deg]
            `}>
                {/* Texture/Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }}>
                </div>
            </div>

            {/* Left/Right Tape Edge Details */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f59e0b]/20 border-r border-dotted border-[#f59e0b]/40 z-0"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#f59e0b]/20 border-l border-dotted border-[#f59e0b]/40 z-0"></div>

            {/* Content */}
            <div className="relative z-10 py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`
                        rounded-lg px-2.5 py-1 text-center min-w-[3.5rem] transition-colors border-2 shadow-sm
                        ${isOpen ? 'bg-slate-700 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-400'}
                    `}>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Day</div>
                        <div className="text-xl font-black leading-none font-sans">{day.date.split('/')[1]}</div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                            {day.date} <span className="text-slate-400 font-medium text-sm">({day.dayOfWeek})</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">{day.title}</p>
                    </div>
                </div>
                
                <div className={`
                    text-slate-400 transition-transform duration-300
                    ${isOpen ? 'rotate-180' : 'rotate-0'}
                `}>
                    <ChevronDown size={20} />
                </div>
            </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-1 py-2">
              {day.items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <TimelineItem 
                        item={item} 
                        isLast={index === day.items.length - 1 && !day.recommendations}
                    />
                    
                    {day.recommendations && item.type === 'ACTIVITY' && (
                        <RecommendationCard groups={day.recommendations} />
                    )}
                </React.Fragment>
              ))}
          </div>
          {/* Spacer if section is open */}
          <div className="h-4"></div>
      </div>
    </div>
  );
};