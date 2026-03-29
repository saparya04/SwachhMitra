import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: 'volunteer',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    xp: 450,
    badges: [
      {
        id: 'b1',
        name: 'First Cleanup',
        description: 'Participated in your first cleanup event',
        icon: '🌱',
        unlocked: true,
        unlockedAt: '2025-06-15T10:30:00Z',
      },
      {
        id: 'b2',
        name: 'Waste Warrior',
        description: 'Participated in 5 cleanup events',
        icon: '🛡️',
        unlocked: true,
        unlockedAt: '2025-06-28T14:20:00Z',
      },
      {
        id: 'b3',
        name: '90% Segregation Accuracy',
        description: 'Achieved 90% accuracy in waste segregation',
        icon: '🎯',
        unlocked: false,
      },
    ],
    eventsJoined: ['e1', 'e3', 'e4'],
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    role: 'organizer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    eventsCreated: ['e1', 'e2', 'e5'],
  },
  {
    id: '3',
    name: 'EcoTech Solutions',
    email: 'contact@ecotech.com',
    role: 'csr',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    eventsSponsored: ['e1', 'e4'],
  },
];

export const getCurrentUser = () => mockUsers[0];