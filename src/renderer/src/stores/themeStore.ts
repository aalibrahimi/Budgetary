import { create } from "zustand";

// Dark Mode Store
interface darkModeState {
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
}
export const useDarkModeStore = create<darkModeState>()((set) => ({
  isDarkMode: JSON.parse(localStorage.getItem('isDarkMode') || 'false'), // Initialize from localStorage
  setIsDarkMode: (isDarkMode: boolean) => {
    set({ isDarkMode })
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode)) // Save to localStorage
  }
}))


interface ThemeState {
  activeTheme: string;
  setActiveTheme: (activeTheme: string) => void
}
export const useThemeStore = create<ThemeState>()((set) => ({
  activeTheme: "default",
  setActiveTheme: (activeTheme: string) => set({ activeTheme })
}))