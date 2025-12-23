import React, { useEffect, useRef, useState } from 'react';
import { DaySchedule, ActivityType, ItineraryItem } from '../types';
import { RefreshCw, Map as MapIcon, ChevronDown } from 'lucide-react';
import { getActivityColor } from '../utils/mapHelpers';

interface MapTrajectoryProps {
  scheduleData: DaySchedule[];
}

export const MapTrajectory: React.FC<MapTrajectoryProps> = ({ scheduleData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showRouteLines, setShowRouteLines] = useState(true);
  const [showDayFilter, setShowDayFilter] = useState(false);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    // Wait for Google Maps API to load
    const initMap = () => {
      if (!window.google) {
        setTimeout(initMap, 100);
        return;
      }

      setIsLoading(true);

      // Create map centered on Taiwan
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 23.5, lng: 120.8 },
        zoom: 8,
        minZoom: 6,
        maxZoom: 18,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        gestureHandling: 'greedy',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      googleMapRef.current = map;
      setIsLoading(false);
    };

    initMap();
  }, []);

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation || !googleMapRef.current) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };

        if (!userMarkerRef.current && googleMapRef.current) {
          userMarkerRef.current = new google.maps.Marker({
            position: userLocation,
            map: googleMapRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            title: '你在這裡',
            zIndex: 1000,
          });
        } else if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(userLocation);
        }
      },
      (error) => console.warn('Geolocation error:', error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update markers and routes when data or filters change
  useEffect(() => {
    if (!googleMapRef.current) return;

    // Clear existing markers and polylines
    markersRef.current.forEach(marker => marker.setMap(null));
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    const points: google.maps.LatLngLiteral[] = [];
    const bounds = new google.maps.LatLngBounds();
    let counter = 1;

    // Filter schedule data by selected day
    const filteredSchedule = selectedDay
      ? scheduleData.filter(day => day.date === selectedDay)
      : scheduleData;

    filteredSchedule.forEach(day => {
      day.items.forEach(item => {
        if (item.coordinates) {
          const position = {
            lat: item.coordinates.lat,
            lng: item.coordinates.lng,
          };
          points.push(position);
          bounds.extend(position);

          const color = getActivityColor(item.type);

          // Create custom marker with number
          const marker = new google.maps.Marker({
            position,
            map: googleMapRef.current!,
            label: {
              text: counter.toString(),
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 16,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            title: item.title,
            zIndex: counter,
          });

          // Create info window
          const infoContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 12px; min-width: 220px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); color: white; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 12px; text-transform: uppercase;">${day.date}</span>
                <span style="font-size: 12px; font-weight: bold; color: #475569; background: #f1f5f9; padding: 4px 12px; border-radius: 8px;">${item.time}</span>
              </div>
              <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 8px; line-height: 1.3;">${item.title}</div>
              ${item.location ? `<div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">📍 ${item.location}</div>` : ''}
              ${item.description ? `<div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px; line-height: 1.5;">${item.description}</div>` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}" 
                 target="_blank" 
                 style="display: block; text-align: center; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; font-size: 13px; font-weight: bold; padding: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                🚗 導航前往
              </a>
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
          });

          marker.addListener('click', () => {
            infoWindow.open(googleMapRef.current!, marker);
            googleMapRef.current!.panTo(position);
          });

          markersRef.current.push(marker);
          counter++;
        }
      });

      // Add recommendation markers (smaller, different style)
      if (day.recommendations) {
        day.recommendations.forEach(group => {
          group.items.forEach(rec => {
            if (rec.coordinates) {
              const position = {
                lat: rec.coordinates.lat,
                lng: rec.coordinates.lng,
              };

              const recMarker = new google.maps.Marker({
                position,
                map: googleMapRef.current!,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 6,
                  fillColor: '#fbbf24',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                },
                title: rec.name,
                zIndex: 0,
              });

              const recInfoContent = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 12px; min-width: 200px;">
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; display: inline-block; margin-bottom: 8px;">
                    ${group.category}
                  </div>
                  <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 12px;">${rec.name}</div>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}" 
                     target="_blank" 
                     style="display: block; text-align: center; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #0f172a; text-decoration: none; font-size: 12px; font-weight: bold; padding: 8px; border-radius: 10px;">
                    📍 導航
                  </a>
                </div>
              `;

              const recInfoWindow = new google.maps.InfoWindow({
                content: recInfoContent,
              });

              recMarker.addListener('click', () => {
                recInfoWindow.open(googleMapRef.current!, recMarker);
              });

              markersRef.current.push(recMarker);
            }
          });
        });
      }
    });

    // Draw route lines between main itinerary points
    if (points.length > 1 && showRouteLines) {
      // Background line (subtle)
      const backgroundLine = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#94a3b8',
        strokeOpacity: 0.4,
        strokeWeight: 4,
        map: googleMapRef.current,
        zIndex: 1,
      });
      polylinesRef.current.push(backgroundLine);

      // Foreground animated line
      const foregroundLine = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#fbbf24',
        strokeOpacity: 0.9,
        strokeWeight: 6,
        map: googleMapRef.current,
        zIndex: 2,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
              fillColor: '#ffffff',
              fillOpacity: 1,
              strokeWeight: 0,
            },
            offset: '0',
            repeat: '20px',
          },
        ],
      });
      polylinesRef.current.push(foregroundLine);

      // Animate the line
      let offset = 0;
      const animateLine = () => {
        offset = (offset + 1) % 20;
        const icons = foregroundLine.get('icons');
        icons[0].offset = offset + 'px';
        foregroundLine.set('icons', icons);
      };
      const animationInterval = setInterval(animateLine, 50);

      // Clean up animation on unmount
      return () => clearInterval(animationInterval);
    }

    // Add special transport route lines
    // Day 1: Taipei to Taichung HSR
    if (!selectedDay || selectedDay === '1/1') {
      const taipeiHSR = { lat: 25.0478, lng: 121.2166 }; // Taipei HSR
      const taichungHSR = { lat: 24.1120, lng: 120.6156 }; // Taichung HSR
      
      const day1TransportLine = new google.maps.Polyline({
        path: [taipeiHSR, taichungHSR],
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: googleMapRef.current,
        zIndex: 3,
        icons: [
          {
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 3,
            },
            offset: '0',
            repeat: '15px',
          },
        ],
      });
      polylinesRef.current.push(day1TransportLine);
    }

    // Day 4: Kaohsiung (Zuoying) to Taipei
    if (!selectedDay || selectedDay === '1/4') {
      const zuoyingHSR = { lat: 22.6874, lng: 120.3090 }; // Zuoying HSR
      const taoyuanHSR = { lat: 25.0136, lng: 121.2151 }; // Taoyuan HSR
      
      const day4TransportLine = new google.maps.Polyline({
        path: [zuoyingHSR, taoyuanHSR],
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: googleMapRef.current,
        zIndex: 3,
        icons: [
          {
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 3,
            },
            offset: '0',
            repeat: '15px',
          },
        ],
      });
      polylinesRef.current.push(day4TransportLine);
    }

    // Day 3: Taichung to Pingtung
    if (!selectedDay || selectedDay === '1/3') {
      const taichungHSR = { lat: 24.1120, lng: 120.6156 }; // Taichung HSR
      const pingtungArea = { lat: 22.6714, lng: 120.4870 }; // Pingtung meeting point
      
      const day3TransportLine = new google.maps.Polyline({
        path: [taichungHSR, pingtungArea],
        geodesic: true,
        strokeColor: '#a855f7',
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: googleMapRef.current,
        zIndex: 3,
        icons: [
          {
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 3,
            },
            offset: '0',
            repeat: '15px',
          },
        ],
      });
      polylinesRef.current.push(day3TransportLine);
    }

    // Fit map to show all markers
    if (points.length > 0) {
      googleMapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 150,
        left: 50,
      });
    } else {
      // Reset to Taiwan center if no points
      googleMapRef.current.setCenter({ lat: 23.5, lng: 120.8 });
      googleMapRef.current.setZoom(8);
    }
  }, [scheduleData, selectedDay, showRouteLines]);

  const handleRecenter = () => {
    if (!googleMapRef.current) return;

    const bounds = new google.maps.LatLngBounds();
    let hasPoints = false;

    markersRef.current.forEach(marker => {
      const position = marker.getPosition();
      if (position) {
        bounds.extend(position);
        hasPoints = true;
      }
    });

    if (hasPoints) {
      googleMapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 150,
        left: 50,
      });
    } else {
      googleMapRef.current.setCenter({ lat: 23.5, lng: 120.8 });
      googleMapRef.current.setZoom(8);
    }
  };

  const uniqueDays = Array.from(new Set(scheduleData.map(day => day.date)));

  return (
    <div className="w-full h-full relative bg-slate-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white z-[500] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">載入地圖中...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-[400]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Day Filter */}
          <div className="flex-1 relative">
            <button
              onClick={() => setShowDayFilter(!showDayFilter)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-between transition-colors"
            >
              <span>{selectedDay || '所有天數'}</span>
              <ChevronDown size={18} className={`transition-transform ${showDayFilter ? 'rotate-180' : ''}`} />
            </button>
            
            {showDayFilter && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    setShowDayFilter(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    !selectedDay ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  所有天數
                </button>
                {uniqueDays.map(day => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setShowDayFilter(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      selectedDay === day ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Route Lines */}
          <button
            onClick={() => setShowRouteLines(!showRouteLines)}
            className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              showRouteLines
                ? 'bg-amber-400 text-slate-900 hover:bg-amber-500'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
            title={showRouteLines ? '隱藏路線' : '顯示路線'}
          >
            路線
          </button>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg transition-all active:scale-95"
            title="重置視角"
          >
            <RefreshCw size={20} />
          </button>

          {/* Google Maps Link */}
          <a
            href="https://www.google.com/maps/@/data=!3m1!4b1!4m3!11m2!2s0GgFTRMWEFNkrNB-5FVVOQxuIi5HzQ!4sQ8sHbSBXEXc?g_ep=EgoyMDI1MTIwOS4wKgosMTAwNzkyMDY3SAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl shadow-lg transition-all active:scale-95"
            title="開啟 Google Maps"
          >
            <MapIcon size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};