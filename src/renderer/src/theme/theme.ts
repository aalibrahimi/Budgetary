// src/renderer/src/theme/themes.ts
export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: {
      primary: string;
      secondary: string;
    };
    border: string;
    // Add more color tokens as needed
  }
  
  export interface ThemeConfig {
    name: string;
    colors: ThemeColors;
    borderRadius: string;
    fontFamily: string;
    boxShadow: string;
    // Add more design tokens
  }
  
  export const themes: Record<string, ThemeConfig> = {
    default: {
      name: 'default',
      colors: {
        primary: '#40E0D0',
        secondary: '#2F4F4F',
        background: '#F0F8FF',
        card: '#FFFFFF',
        text: {
          primary: '#333333',
          secondary: '#666666'
        },
        border: '#e0e0e0'
      },
      borderRadius: '12px',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    },
    
    cyberpunk: {
      name: 'cyberpunk',
      colors: {
        primary: '#ff3b3b',
        secondary: '#40E0D0',
        background: '#000000',
        card: '#141414',
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.6)'
        },
        border: 'rgba(255, 59, 59, 0.3)'
      },
      borderRadius: '2px',
      fontFamily: '"Rajdhani", "Courier New", monospace',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
    }

    // Add more themes as needed
  };