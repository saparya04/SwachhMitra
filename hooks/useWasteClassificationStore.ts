import { mockWasteClassifications } from '@/mocks/wasteData';
import { WasteClassification } from '@/types';
import { create } from 'zustand';

interface WasteClassificationState {
  classifications: WasteClassification[];
  currentClassification: WasteClassification | null;
  isLoading: boolean;
  error: string | null;
  fetchClassifications: () => Promise<void>;
  classifyWaste: (imageUrl: string, eventId: string, userId: string) => Promise<WasteClassification>;
  getCurrentClassification: () => WasteClassification | null;
}

export const useWasteClassificationStore = create<WasteClassificationState>((set, get) => ({
  classifications: [],
  currentClassification: null,
  isLoading: false,
  error: null,
  
  fetchClassifications: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ classifications: mockWasteClassifications, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch waste classifications', isLoading: false });
    }
  },
  
  classifyWaste: async (imageUrl, eventId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate AI classification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random classification for demo
      const wet = Math.floor(Math.random() * 40) + 10;
      const dry = Math.floor(Math.random() * 40) + 10;
      const hazardous = 100 - wet - dry;
      
      const isWellSegregated = wet < 40 && dry > 50; // Simple rule for demo
      
      const newClassification: WasteClassification = {
        id: `w${Date.now()}`,
        eventId,
        userId,
        imageUrl,
        classification: {
          wet,
          dry,
          hazardous,
        },
        isWellSegregated,
        timestamp: new Date().toISOString(),
      };
      
      const { classifications } = get();
      const updatedClassifications = [...classifications, newClassification];
      
      set({ 
        classifications: updatedClassifications, 
        currentClassification: newClassification,
        isLoading: false 
      });
      
      return newClassification;
    } catch (error) {
      set({ error: 'Failed to classify waste', isLoading: false });
      throw error;
    }
  },
  
  getCurrentClassification: () => {
    return get().currentClassification;
  },
}));