import React, { useState } from 'react';
import { DaySchedule, ActivityType, ItineraryItem } from '../types';
import { debounce } from '../utils/mapHelpers';
import { Search, Filter, Map as MapIconLucide, X, ChevronDown } from 'lucide-react';

interface MapControlsProps {
  scheduleData: DaySchedule[];
  activeFilters: Set<ActivityType>;
  onToggleFilter: (type: ActivityType) => void;
  selectedDay: string | null;
  onSelectDay: (day: string | null) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
  onSearchResult: (item: ItineraryItem | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const MAP_STYLES = [
  { id: 'standard', name: '標準', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' },
  { id: 'satellite', name: '衛星', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  { id: 'terrain', name: '地形', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
  { id: 'dark', name: '深色', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' }
];

export const MapControls: React.FC<MapControlsProps> = ({
  scheduleData,
  activeFilters,
  onToggleFilter,
  selectedDay,
  onSelectDay,
  mapStyle,
  onMapStyleChange,
  onSearchResult,
  isCollapsed,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  // Search handler with debounce
  const handleSearch = debounce((query: string) => {
    if (!query.trim()) {
      onSearchResult(null);
      return;
    }

    // Search through all items
    for (const day of scheduleData) {
      for (const item of day.items) {
        if (
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.location?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        ) {
          onSearchResult(item);
          return;
        }
      }
    }
    onSearchResult(null);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  if (isCollapsed) {
    return (
      <div className="absolute top-4 left-4 z-[400]">
        <button
          onClick={onToggleCollapse}
          className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-white transition-all hover:scale-105"
        >
          控制 🎛️
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-[400] w-[320px]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span className="text-lg">🎛️</span>
            地圖控制
          </h3>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Controls Content */}
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜尋地點、活動..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none text-sm font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearchResult(null);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Day Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDaySelector(!showDaySelector)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all bg-white"
            >
              <span className="text-sm font-semibold text-slate-700">
                {selectedDay ? `${selectedDay}` : '所有天數'}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDaySelector ? 'rotate-180' : ''}`} />
            </button>

            {showDaySelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10">
                <button
                  onClick={() => {
                    onSelectDay(null);
                    setShowDaySelector(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                    !selectedDay ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  所有天數
                </button>
                {scheduleData.map(day => (
                  <button
                    key={day.date}
                    onClick={() => {
                      onSelectDay(day.date);
                      setShowDaySelector(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors border-t border-slate-100 ${
                      selectedDay === day.date ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {day.date} - {day.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Style Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStyleSelector(!showStyleSelector)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all bg-white"
            >
              <div className="flex items-center gap-2">
                <MapIconLucide size={16} className="text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">
                  {MAP_STYLES.find(s => s.id === mapStyle)?.name || '標準'}
                </span>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${showStyleSelector ? 'rotate-180' : ''}`} />
            </button>

            {showStyleSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10">
                {MAP_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => {
                      onMapStyleChange(style.id);
                      setShowStyleSelector(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                      mapStyle === style.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-700 hover:bg-slate-50'
                    } ${style.id !== MAP_STYLES[0].id ? 'border-t border-slate-100' : ''}`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Info */}
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-medium text-slate-500">
              已選擇 {activeFilters.size} 個類型
            </span>
            {activeFilters.size < Object.keys(ActivityType).length && (
              <button
                onClick={() => {
                  Object.values(ActivityType).forEach(type => {
                    if (!activeFilters.has(type)) {
                      onToggleFilter(type);
                    }
                  });
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                全選
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MAP_STYLES };
