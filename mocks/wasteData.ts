import { WasteClassification } from '@/types';

export const mockWasteClassifications: WasteClassification[] = [
  {
    id: 'w1',
    eventId: 'e1',
    userId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a',
    classification: {
      wet: 25,
      dry: 65,
      hazardous: 10,
    },
    isWellSegregated: true,
    timestamp: '2025-06-15T09:30:00Z',
  },
  {
    id: 'w2',
    eventId: 'e3',
    userId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18',
    classification: {
      wet: 40,
      dry: 45,
      hazardous: 15,
    },
    isWellSegregated: true,
    timestamp: '2025-06-20T10:15:00Z',
  },
  {
    id: 'w3',
    eventId: 'e1',
    userId: '4',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9',
    classification: {
      wet: 30,
      dry: 30,
      hazardous: 40,
    },
    isWellSegregated: false,
    timestamp: '2025-06-15T08:45:00Z',
  },
];

export const getUserWasteClassifications = (userId: string) => 
  mockWasteClassifications.filter(classification => classification.userId === userId);

export const getEventWasteClassifications = (eventId: string) => 
  mockWasteClassifications.filter(classification => classification.eventId === eventId);