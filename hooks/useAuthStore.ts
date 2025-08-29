import { mockUsers } from '@/mocks/users';
import { User, UserRole } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'en' | 'hi' | 'mr';
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  setLanguage: (language: 'en' | 'hi' | 'mr') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      language: 'en',
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email);
          
          if (!user) {
            throw new Error('Invalid credentials');
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo, just use the first user
          const user = mockUsers[0];
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Clear all user data
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          // Clear AsyncStorage to ensure complete logout
          await AsyncStorage.removeItem('auth-storage');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      signup: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role,
            xp: role === 'volunteer' ? 0 : undefined,
            badges: role === 'volunteer' ? [] : undefined,
            eventsJoined: role === 'volunteer' ? [] : undefined,
            eventsCreated: role === 'organizer' ? [] : undefined,
            eventsSponsored: role === 'csr' ? [] : undefined,
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      setLanguage: (language) => {
        set({ language });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist language, not authentication state
      partialize: (state) => ({ language: state.language }),
    }
  )
);