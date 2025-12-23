import React from 'react';
import { ItineraryItem, ActivityType } from '../types';
import { Train, Utensils, Hotel, MapPin, Users, Clock, Camera, Ticket, Backpack, Navigation } from 'lucide-react';

interface TimelineItemProps {
  item: ItineraryItem;
  isLast: boolean;
}

const getIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.TRANSPORT: return <Train size={20} strokeWidth={2.5} />;
    case ActivityType.FOOD: return <Utensils size={20} strokeWidth={2.5} />;
    case ActivityType.HOTEL: return <Hotel size={20} strokeWidth={2.5} />;
    case ActivityType.MEETING: return <Users size={20} strokeWidth={2.5} />;
    case ActivityType.SIGHTSEEING: return <Camera size={20} strokeWidth={2.5} />;
    case ActivityType.TICKET: return <Ticket size={20} strokeWidth={2.5} />;
    case ActivityType.ACTIVITY: return <Backpack size={20} strokeWidth={2.5} />;
    default: return <Clock size={20} strokeWidth={2.5} />;
  }
};

// Japanese Pastel Palette (Macaron Colors)
const getStyles = (type: ActivityType) => {
  switch (type) {
    case ActivityType.TRANSPORT: 
      return { 
        bg: 'bg-[#E0F7FA]', // Pastel Blue
        border: 'border-[#B2EBF2]',
        text: 'text-[#00BCD4]',
        rotate: '-rotate-3'
      };
    case ActivityType.FOOD: 
      return { 
        bg: 'bg-[#FFF3E0]', // Pastel Orange
        border: 'border-[#FFE0B2]',
        text: 'text-[#FF9800]',
        rotate: 'rotate-2'
      };
    case ActivityType.HOTEL: 
      return { 
        bg: 'bg-[#F3E5F5]', // Pastel Purple
        border: 'border-[#E1BEE7]',
        text: 'text-[#9C27B0]',
        rotate: '-rotate-2'
      };
    case ActivityType.MEETING: 
      return { 
        bg: 'bg-[#FFEBEE]', // Pastel Red/Pink
        border: 'border-[#FFCDD2]',
        text: 'text-[#E91E63]',
        rotate: 'rotate-3'
      };
    case ActivityType.SIGHTSEEING: 
      return { 
        bg: 'bg-[#E0F2F1]', // Pastel Teal
        border: 'border-[#80CBC4]',
        text: 'text-[#009688]',
        rotate: '-rotate-1'
      };
    case ActivityType.TICKET: 
      return { 
        bg: 'bg-[#FFF8E1]', // Pastel Amber
        border: 'border-[#FFE082]',
        text: 'text-[#FFC107]',
        rotate: 'rotate-2'
      };
    case ActivityType.ACTIVITY: 
      return { 
        bg: 'bg-[#E8F5E9]', // Pastel Green
        border: 'border-[#C8E6C9]',
        text: 'text-[#4CAF50]',
        rotate: 'rotate-1'
      };
    default: 
      return { 
        bg: 'bg-[#F5F5F5]', 
        border: 'border-[#E0E0E0]',
        text: 'text-[#9E9E9E]',
        rotate: 'rotate-1'
      };
  }
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast }) => {
  const styles = getStyles(item.type);

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.coordinates) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}`, '_blank');
    }
  };

  return (
    <div className="flex gap-4 relative group transition-all duration-300 mb-2">
      {/* Timeline Line (Dashed for hand-drawn feel) */}
      {!isLast && (
        <div className="absolute left-[1.65rem] top-12 bottom-[-1rem] w-0.5 border-l-2 border-dashed border-gray-300 -z-10" />
      )}

      {/* Icon Column (Sticker Style) */}
      <div className="flex-shrink-0 flex flex-col items-center pt-2">
         <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center 
            bg-white shadow-md border-2 border-white
            transform transition-transform duration-300
            z-10
            ${styles.text} ${styles.rotate}
         `}>
            {/* Inner colored shape */}
            <div className={`w-10 h-10 rounded-xl ${styles.bg} flex items-center justify-center`}>
                {getIcon(item.type)}
            </div>
         </div>
      </div>

      {/* Content Column */}
      <div className="flex-grow pb-6 pt-2 pl-1">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-slate-700">
                {item.time}
            </span>
            {item.endTime && (
                <span className="text-slate-400 text-sm font-medium bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {item.endTime}
                </span>
            )}
          </div>
          
          {/* Navigation Button */}
          {item.coordinates && (
              <button 
                onClick={handleNavigate}
                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors active:scale-95"
                title="導航"
              >
                  <Navigation size={20} />
              </button>
          )}
        </div>
        
        <div className={`
            p-5 rounded-2xl border-2 transition-all duration-300 relative
            ${item.isHighlight ? 'bg-[#fffbeb] border-[#fcd34d] border-dashed shadow-sm' : 'bg-white border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]'}
        `}>
          {/* Highlight decorative tape if needed */}
          {item.isHighlight && (
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-200 opacity-50 rounded-full blur-md"></div>
          )}

          <h3 className="font-bold text-[1.05rem] mb-1.5 transition-colors text-slate-800">
            {item.title}
          </h3>
          
          {item.description && (
            <p className="text-sm text-slate-500 mb-3 font-medium leading-relaxed">{item.description}</p>
          )}

          {item.location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 bg-slate-50 w-fit px-2 py-1 rounded-full">
              <MapPin size={12} />
              <span>{item.location}</span>
            </div>
          )}

          {item.details && item.details.length > 0 && (
            <div className="mt-3 pt-3 border-t border-dashed border-slate-100">
                <ul className="space-y-1.5">
                {item.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 bg-slate-300" />
                    <span className="leading-relaxed font-light tracking-wide">{detail}</span>
                    </li>
                ))}
                </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};