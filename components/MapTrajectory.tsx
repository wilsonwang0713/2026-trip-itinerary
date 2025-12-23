import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DaySchedule, ActivityType } from '../types';
import { Navigation, RefreshCw, Map as MapIcon } from 'lucide-react';

interface MapTrajectoryProps {
  scheduleData: DaySchedule[];
}

export const MapTrajectory: React.FC<MapTrajectoryProps> = ({ scheduleData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markerGroupRef = useRef<L.FeatureGroup | null>(null);

  // Track User Location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latLng: L.LatLngExpression = [latitude, longitude];

        if (leafletMapRef.current) {
          if (!userMarkerRef.current) {
            const pulseIcon = L.divIcon({
                className: 'user-pulse-icon',
                html: `<div class="pulse-ring"></div><div class="user-dot"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            userMarkerRef.current = L.marker(latLng, { icon: pulseIcon }).addTo(leafletMapRef.current);
            userMarkerRef.current.bindPopup("You are here");
          } else {
            userMarkerRef.current.setLatLng(latLng);
          }
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    // Initialize map centered on Taiwan with appropriate zoom
    const map = L.map(mapRef.current, {
       zoomControl: true,
       attributionControl: true,
       preferCanvas: true,
       minZoom: 6,
       maxZoom: 18,
       maxBounds: [[21.5, 119.0], [25.5, 122.5]], // Restrict to Taiwan area
       maxBoundsViscosity: 0.5
    }).setView([23.5, 120.8], 7.5); // Taiwan center, better initial zoom

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    leafletMapRef.current = map;

    const points: L.LatLngExpression[] = [];
    const markers: L.Marker[] = [];

    // Helper: Create Main Schedule Icon
    const createScheduleIcon = (color: string, number: number) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div style="
                    background-color: ${color};
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                    font-family: sans-serif;
                    font-size: 14px;
                ">${number}</div>
                <div style="
                    width: 2px;
                    height: 10px;
                    background-color: ${color};
                    margin: 0 auto;
                "></div>
            `,
            iconSize: [28, 40],
            iconAnchor: [14, 40],
            popupAnchor: [0, -36]
        });
    };

    // Helper: Create Recommendation Icon (Small Dot)
    const createRecIcon = () => {
        return L.divIcon({
            className: 'custom-rec-icon',
            html: `<div style="width: 12px; height: 12px; background-color: #fbbf24; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6]
        });
    };

    let counter = 1;
    const addedRecCoords = new Set<string>();

    scheduleData.forEach(day => {
      // 1. Plot Main Itinerary Items
      day.items.forEach(item => {
        if (item.coordinates) {
          const { lat, lng } = item.coordinates;
          points.push([lat, lng]);

          let color = '#64748b'; 
          switch (item.type) {
            case ActivityType.TRANSPORT: color = '#3b82f6'; break;
            case ActivityType.HOTEL: color = '#a855f7'; break;
            case ActivityType.FOOD: color = '#f97316'; break;
            case ActivityType.SIGHTSEEING: color = '#0d9488'; break;
            case ActivityType.TICKET: color = '#eab308'; break;
            case ActivityType.ACTIVITY: color = '#22c55e'; break;
            case ActivityType.MEETING: color = '#ec4899'; break;
          }

          const marker = L.marker([lat, lng], {
            icon: createScheduleIcon(color, counter++)
          }).addTo(map);
          
          const popupContent = `
            <div class="font-sans p-1 min-w-[200px]">
                <div class="flex items-center justify-between mb-2">
                    <span class="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">${day.date}</span>
                    <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">${item.time}</span>
                </div>
                <div class="text-[15px] font-black text-slate-800 leading-tight mb-2">${item.title}</div>
                ${item.location ? `<div class="flex items-start gap-1.5 text-xs text-slate-500 mb-2 font-medium">📍 ${item.location}</div>` : ''}
                <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" 
                   class="block w-full text-center bg-blue-600 !text-white text-xs font-bold py-2 rounded-lg mt-3 shadow-md hover:bg-blue-700 transition-colors" 
                   style="text-decoration: none; color: white !important;">
                   🚗 導航前往
                </a>
            </div>
          `;
          
          marker.bindPopup(popupContent, { closeButton: false, className: 'custom-popup', minWidth: 220 });
          marker.on('click', () => map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 }));
          markers.push(marker);
        }
      });

      // 2. Plot Recommendations (Coffee/Spots)
      if (day.recommendations) {
        day.recommendations.forEach(group => {
            group.items.forEach(rec => {
                if (rec.coordinates) {
                    const coordKey = `${rec.coordinates.lat},${rec.coordinates.lng}`;
                    if (!addedRecCoords.has(coordKey)) {
                        addedRecCoords.add(coordKey);
                        
                        const recMarker = L.marker([rec.coordinates.lat, rec.coordinates.lng], {
                            icon: createRecIcon()
                        }).addTo(map);

                        const popupContent = `
                            <div class="font-sans p-1 min-w-[180px]">
                                <div class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider w-fit mb-2">
                                    ${group.category}
                                </div>
                                <div class="text-sm font-bold text-slate-800 leading-tight mb-2">${rec.name}</div>
                                <a href="https://www.google.com/maps/dir/?api=1&destination=${rec.coordinates.lat},${rec.coordinates.lng}" target="_blank" 
                                class="block w-full text-center bg-amber-400 text-slate-900 text-xs font-bold py-2 rounded-lg mt-2 shadow-sm hover:bg-amber-500 transition-colors" 
                                style="text-decoration: none; color: #0f172a !important;">
                                📍 導航
                                </a>
                            </div>
                        `;
                        recMarker.bindPopup(popupContent, { closeButton: false, className: 'custom-popup' });
                        markers.push(recMarker);
                    }
                }
            });
        });
      }
    });

    // Draw Line and fit bounds
    if (points.length > 1) {
      L.polyline(points, {
        color: '#fbbf24',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(map);

      const group = new L.FeatureGroup(markers);
      markerGroupRef.current = group;
      // Fit bounds with better padding for mobile visibility
      map.fitBounds(group.getBounds().pad(0.25), {
        animate: true,
        duration: 1
      });
    } else if (points.length === 1) {
      // If only one point, center on it with zoom 12
      map.setView(points[0], 12);
    }
    // If no points, keep default Taiwan view

  }, [scheduleData]);

  const handleRefresh = () => {
    if (leafletMapRef.current && markerGroupRef.current) {
        leafletMapRef.current.fitBounds(markerGroupRef.current.getBounds().pad(0.25), {
            animate: true,
            duration: 1
        });
    } else if (leafletMapRef.current) {
        // If no markers, reset to Taiwan center
        leafletMapRef.current.setView([23.5, 120.8], 7.5, {
            animate: true,
            duration: 1
        });
    }
  };

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner relative">
        <div ref={mapRef} className="w-full h-full bg-slate-100" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
           {/* Refresh Button */}
           <button
             onClick={handleRefresh}
             className="bg-white/95 backdrop-blur p-3 rounded-full shadow-xl border border-slate-100 text-slate-600 font-bold flex items-center justify-center hover:scale-105 transition-transform hover:bg-slate-50"
             title="重置視角"
           >
              <RefreshCw size={20} />
           </button>

           {/* Google Maps List Button */}
           <a href="https://www.google.com/maps/@24.1440561,120.6380966,7202m/data=!3m1!1e3!4m2!11m1!2s0GgFTRMWEFNkrNB-5FVVOQxuIi5HzQ!5m1!1e2?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/95 backdrop-blur p-3 rounded-full shadow-xl border border-slate-100 text-blue-500 font-bold flex items-center justify-center hover:scale-105 transition-transform"
              title="開啟 Google Maps"
           >
              <MapIcon size={20} />
           </a>
        </div>
        
        <style>{`
            /* Map container styles */
            .leaflet-container {
                width: 100%;
                height: 100%;
                background: #f1f5f9;
            }
            
            /* Move zoom control to bottom right */
            .leaflet-top.leaflet-left {
                top: auto;
                bottom: 20px;
                left: auto;
                right: 20px;
            }
            
            /* Popup styles */
            .leaflet-popup-content-wrapper { 
                border-radius: 1rem; 
                padding: 0; 
                overflow: hidden; 
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            }
            .leaflet-popup-content { 
                margin: 0.75rem; 
                line-height: 1.5; 
            }
            .leaflet-popup-tip { 
                background: white; 
            }
            
            /* User location marker */
            .user-pulse-icon { 
                position: relative; 
            }
            .user-dot { 
                width: 12px; 
                height: 12px; 
                background-color: #3b82f6; 
                border: 2px solid white; 
                border-radius: 50%; 
                position: absolute; 
                top: 6px; 
                left: 6px; 
                z-index: 2; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
            }
            .pulse-ring { 
                position: absolute; 
                top: 0; 
                left: 0; 
                width: 24px; 
                height: 24px; 
                background-color: rgba(59, 130, 246, 0.4); 
                border-radius: 50%; 
                animation: pulse 2s infinite; 
            }
            @keyframes pulse { 
                0% { transform: scale(0.5); opacity: 1; } 
                100% { transform: scale(2); opacity: 0; } 
            }
        `}</style>
    </div>
  );
};