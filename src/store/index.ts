import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Theme, Language, Notification, Resume } from '@/types';

interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // Theme & Language
  theme: Theme;
  language: Language;
  isRTL: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // UI State
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      theme: 'light',
      language: 'ar',
      isRTL: true,
      notifications: [],
      unreadCount: 0,
      sidebarOpen: true,
      mobileMenuOpen: false,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        language: user?.language_preference || 'ar',
        isRTL: (user?.language_preference || 'ar') === 'ar'
      }),
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (lang) => set({ 
        language: lang, 
        isRTL: lang === 'ar' 
      }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      
      addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          read: false,
        };
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'moahel-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        isRTL: state.isRTL,
      }),
    }
  )
);

// Resume Builder Store
interface ResumeBuilderState {
  currentResume: Resume | null;
  currentStep: number;
  isDirty: boolean;
  
  setResume: (resume: Resume | null) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markDirty: () => void;
  markClean: () => void;
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  currentResume: null,
  currentStep: 1,
  isDirty: false,
  
  setResume: (resume) => set({ currentResume: resume, isDirty: false }),
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));

// Admin Store
interface AdminState {
  selectedUserId: string | null;
  activeTab: string;
  
  setSelectedUser: (userId: string | null) => void;
  setActiveTab: (tab: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedUserId: null,
  activeTab: 'overview',
  
  setSelectedUser: (userId) => set({ selectedUserId: userId }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
