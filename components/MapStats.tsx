import React, { useState, useEffect } from 'react';
import { DaySchedule, ActivityType } from '../types';
import { calculateTotalDistance, formatDistance, getActivityColor, getActivityLabel } from '../utils/mapHelpers';
import { X, TrendingUp, MapPin, Calendar } from 'lucide-react';

interface MapStatsProps {
  scheduleData: DaySchedule[];
  activeFilters: Set<ActivityType>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const MapStats: React.FC<MapStatsProps> = ({
  scheduleData,
  activeFilters,
  isCollapsed,
  onToggleCollapse
}) => {
  const [animatedCounts, setAnimatedCounts] = useState<Record<string, number>>({});

  // Calculate statistics
  const stats = React.useMemo(() => {
    let totalLocations = 0;
    const typeCounts: Record<string, number> = {};
    const coordinates: { lat: number; lng: number }[] = [];

    scheduleData.forEach(day => {
      day.items.forEach(item => {
        if (item.coordinates && activeFilters.has(item.type)) {
          totalLocations++;
          typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
          coordinates.push(item.coordinates);
        }
      });

      // Count recommendations
      if (day.recommendations) {
        day.recommendations.forEach(group => {
          group.items.forEach(rec => {
            if (rec.coordinates) {
              totalLocations++;
            }
          });
        });
      }
    });

    const totalDistance = calculateTotalDistance(coordinates);

    return {
      totalLocations,
      totalDistance,
      typeCounts,
      days: scheduleData.length
    };
  }, [scheduleData, activeFilters]);

  // Animate counters
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedCounts({
        totalLocations: Math.round(stats.totalLocations * progress),
        totalDistance: stats.totalDistance * progress
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  if (isCollapsed) {
    return (
      <div className="absolute top-4 right-4 z-[400]">
        <button
          onClick={onToggleCollapse}
          className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-white transition-all hover:scale-105"
        >
          統計 📊
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-[400] w-[280px]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span className="text-lg">📊</span>
            行程統計
          </h3>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stats Content */}
        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-blue-700">地點</span>
              </div>
              <div className="text-2xl font-black text-blue-900">
                {animatedCounts.totalLocations || 0}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">距離</span>
              </div>
              <div className="text-2xl font-black text-green-900">
                {formatDistance(animatedCounts.totalDistance || 0)}
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-700">行程天數</span>
            </div>
            <div className="text-2xl font-black text-purple-900">
              {stats.days} 天
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">活動分佈</h4>
            {Object.entries(stats.typeCounts).map(([type, count]) => {
              const color = getActivityColor(type);
              const label = getActivityLabel(type);
              const percentage = (count / stats.totalLocations) * 100;

              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-semibold text-slate-700">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
