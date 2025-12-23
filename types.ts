import { LucideIcon } from 'lucide-react';

export enum ActivityType {
  TRANSPORT = 'TRANSPORT',
  FOOD = 'FOOD',
  HOTEL = 'HOTEL',
  ACTIVITY = 'ACTIVITY',
  MEETING = 'MEETING',
  NOTE = 'NOTE',
  SIGHTSEEING = 'SIGHTSEEING',
  TICKET = 'TICKET',
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  type: ActivityType;
  details?: string[];
  location?: string;
  isHighlight?: boolean;
  coordinates?: Coordinates; // For map plotting
  date?: string; // Added to track which day this item belongs to (e.g., "1/1")
}

export interface RecommendationItem {
  name: string;
  coordinates?: Coordinates;
}

export interface RecommendationGroup {
  category: string;
  icon: any;
  items: RecommendationItem[];
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  title: string;
  items: ItineraryItem[];
  recommendations?: RecommendationGroup[];
}