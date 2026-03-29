import { mockEvents } from '@/mocks/events';
import { Event } from '@/types';
import { create } from 'zustand';

interface EventsState {
  events: Event[];
  filteredEvents: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  filterEvents: (filters: { distance?: number; date?: string; type?: string }) => void;
  joinEvent: (eventId: string, userId: string) => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'qrCode'>) => Promise<Event>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<Event>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  filteredEvents: [],
  isLoading: false,
  error: null,
  
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ events: mockEvents, filteredEvents: mockEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },
  
  filterEvents: (filters) => {
    const { events } = get();
    let filtered = [...events];
    
    if (filters.type) {
      filtered = filtered.filter(event => event.type === filters.type);
    }
    
    if (filters.date) {
      filtered = filtered.filter(event => event.date === filters.date);
    }
    
    // Distance filtering would require user location and calculation
    // This is a simplified version
    if (filters.distance) {
      // In a real app, you would calculate distance from user location
      // For now, we'll just take a subset as an example
      filtered = filtered.slice(0, filters.distance === 5 ? 2 : filters.distance === 10 ? 3 : 5);
    }
    
    set({ filteredEvents: filtered });
  },
  
  joinEvent: async (eventId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { events } = get();
      const updatedEvents = events.map(event => {
        if (event.id === eventId && !event.participants.includes(userId)) {
          return {
            ...event,
            participants: [...event.participants, userId]
          };
        }
        return event;
      });
      
      set({ events: updatedEvents, filteredEvents: updatedEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to join event', isLoading: false });
    }
  },
  
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newEvent: Event = {
        ...eventData,
        id: `e${Date.now()}`,
        participants: [],
        status: 'upcoming',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-e${Date.now()}`,
      };
      
      const { events } = get();
      const updatedEvents = [...events, newEvent];
      
      set({ events: updatedEvents, filteredEvents: updatedEvents, isLoading: false });
      return newEvent;
    } catch (error) {
      set({ error: 'Failed to create event', isLoading: false });
      throw error;
    }
  },
  
  updateEvent: async (eventId, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { events } = get();
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const updatedEvent = { ...events[eventIndex], ...updates };
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      
      set({ events: updatedEvents, filteredEvents: updatedEvents, isLoading: false });
      return updatedEvent;
    } catch (error) {
      set({ error: 'Failed to update event', isLoading: false });
      throw error;
    }
  },
}));