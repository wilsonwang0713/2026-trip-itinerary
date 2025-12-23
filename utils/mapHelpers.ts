import { Coordinates } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance for a route
 */
export function calculateTotalDistance(coordinates: Coordinates[]): number {
  if (coordinates.length < 2) return 0;
  
  let total = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    total += calculateDistance(coordinates[i], coordinates[i + 1]);
  }
  
  return total;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Get activity type color
 */
export function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    TRANSPORT: '#3b82f6',
    HOTEL: '#a855f7',
    FOOD: '#f97316',
    SIGHTSEEING: '#0d9488',
    TICKET: '#eab308',
    ACTIVITY: '#22c55e',
    MEETING: '#ec4899',
    NOTE: '#64748b'
  };
  return colors[type] || '#64748b';
}

/**
 * Get activity type label
 */
export function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    TRANSPORT: '交通',
    HOTEL: '住宿',
    FOOD: '美食',
    SIGHTSEEING: '景點',
    TICKET: '票券',
    ACTIVITY: '活動',
    MEETING: '集合',
    NOTE: '備註'
  };
  return labels[type] || type;
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
