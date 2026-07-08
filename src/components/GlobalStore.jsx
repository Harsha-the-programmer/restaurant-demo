import { create } from 'zustand';

export const useStore = create((set) => ({
  currentSection: 'home',
  scrollProgress: 0,
  setCurrentSection: (section) => set({ currentSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  timeOfDay: 'sunset',
  setTimeOfDay: (tod) => set({ timeOfDay: tod }),
  reducedMotion: false,
  setReducedMotion: (val) => set({ reducedMotion: val }),
}));