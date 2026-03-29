import { mockNotifications } from '@/mocks/notifications';
import { Notification } from '@/types';
import { create } from 'zustand';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  fetchNotifications: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userNotifications = mockNotifications.filter(n => n.userId === userId);
      const unreadCount = userNotifications.filter(n => !n.read).length;
      
      set({ 
        notifications: userNotifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch notifications', isLoading: false });
    }
  },
  
  markAsRead: async (notificationId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      
      set({ 
        notifications: updatedNotifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to mark notification as read', isLoading: false });
    }
  },
  
  markAllAsRead: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => {
        if (notification.userId === userId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      set({ 
        notifications: updatedNotifications, 
        unreadCount: 0,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to mark all notifications as read', isLoading: false });
    }
  },
}));