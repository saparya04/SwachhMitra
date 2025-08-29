import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    title: 'Event Reminder',
    message: 'Juhu Beach Cleanup Drive starts tomorrow at 7:00 AM',
    read: false,
    timestamp: '2025-07-09T15:30:00Z',
    type: 'event',
    data: { eventId: 'e1' }
  },
  {
    id: 'n2',
    userId: '1',
    title: 'Badge Unlocked',
    message: 'Congratulations! You earned the "Waste Warrior" badge',
    read: true,
    timestamp: '2025-06-28T14:20:00Z',
    type: 'badge',
    data: { badgeId: 'b2' }
  },
  {
    id: 'n3',
    userId: '1',
    title: 'New Event Near You',
    message: 'Versova Beach Restoration has been scheduled near your location',
    read: false,
    timestamp: '2025-07-01T09:15:00Z',
    type: 'event',
    data: { eventId: 'e5' }
  },
  {
    id: 'n4',
    userId: '2',
    title: 'New Participant',
    message: 'Rahul Sharma has joined your Juhu Beach Cleanup Drive',
    read: false,
    timestamp: '2025-07-02T11:45:00Z',
    type: 'event',
    data: { eventId: 'e1', participantId: '1' }
  },
  {
    id: 'n5',
    userId: '3',
    title: 'Impact Report Ready',
    message: 'The impact report for Juhu Beach Cleanup Drive is now available',
    read: true,
    timestamp: '2025-06-25T16:20:00Z',
    type: 'system',
    data: { eventId: 'e1', reportId: 'r1' }
  },
];

export const getUserNotifications = (userId: string) => mockNotifications.filter(notification => notification.userId === userId);
export const getUnreadNotificationsCount = (userId: string) => mockNotifications.filter(notification => notification.userId === userId && !notification.read).length;