export type UserRole = 'volunteer' | 'organizer' | 'csr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  xp?: number;
  badges?: Badge[];
  eventsJoined?: string[];
  eventsCreated?: string[];
  eventsSponsored?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  type: 'beach' | 'park' | 'campus' | 'street' | 'other';
  organizerId: string;
  organizer: string;
  sponsorId?: string;
  sponsor?: string;
  participants: string[];
  maxParticipants?: number;
  wasteCollected?: {
    wet: number;
    dry: number;
    hazardous: number;
  };
  status: 'upcoming' | 'ongoing' | 'completed';
  qrCode?: string;
}

export interface WasteClassification {
  id: string;
  eventId: string;
  userId: string;
  imageUrl: string;
  classification: {
    wet: number;
    dry: number;
    hazardous: number;
  };
  isWellSegregated: boolean;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'event' | 'badge' | 'system';
  data?: any;
}