import React from 'react';
import { ActivityType } from '../types';
import { getActivityColor, getActivityLabel } from '../utils/mapHelpers';
import { X } from 'lucide-react';

interface MapLegendProps {
  activeFilters: Set<ActivityType>;
  onToggleFilter: (type: ActivityType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  activeFilters,
  onToggleFilter,
  isCollapsed,
  onToggleCollapse
}) => {
  const activityTypes = Object.values(ActivityType);

  if (isCollapsed) {
    return (
      <div className="absolute bottom-24 left-4 z-[400]">
        <button
          onClick={onToggleCollapse}
          className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-white transition-all hover:scale-105"
        >
          圖例 📍
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-24 left-4 z-[400] max-w-[280px]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span className="text-lg">📍</span>
            活動類型
          </h3>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Legend Items */}
        <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
          {activityTypes.map((type) => {
            const isActive = activeFilters.has(type);
            const color = getActivityColor(type);
            const label = getActivityLabel(type);

            return (
              <button
                key={type}
                onClick={() => onToggleFilter(type)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-slate-50 shadow-sm border-2 border-slate-200'
                    : 'bg-white border-2 border-transparent opacity-50 hover:opacity-75'
                }`}
              >
                {/* Color Indicator */}
                <div
                  className="w-5 h-5 rounded-full border-3 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                
                {/* Label */}
                <span className="text-sm font-semibold text-slate-700 flex-1 text-left">
                  {label}
                </span>

                {/* Toggle Indicator */}
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'bg-white border-slate-300'
                }`}>
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}

          {/* Recommendation Indicator */}
          <div className="pt-2 mt-2 border-t border-slate-200">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-sm flex-shrink-0" />
              <span className="text-xs font-medium text-slate-600">推薦景點</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
