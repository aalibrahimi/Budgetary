import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Hook for managing cyberpunk theme effects 
 */
export const useCyberpunkEffects = () => {
  const { theme } = useTheme();
  const [countdown, setCountdown] = useState(60);
  const [animateGlitch, setAnimateGlitch] = useState(false);
  
  // Countdown timer effect
  useEffect(() => {
    if (theme !== 'cyberpunk') return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [theme]);
  
  // Randomly trigger glitch animations
  useEffect(() => {
    if (theme !== 'cyberpunk') return;
    
    // Trigger glitch effect randomly
    const glitchInterval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.7; // 30% chance to glitch
      
      if (shouldGlitch) {
        setAnimateGlitch(true);
        
        // Turn off glitch after a short duration
        setTimeout(() => {
          setAnimateGlitch(false);
        }, 500);
      }
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, [theme]);
  
  // Format countdown with leading zeros
  const formattedCountdown = countdown.toString().padStart(2, '0');
  
  return {
    countdown: formattedCountdown,
    animateGlitch,
    isCyberpunk: theme === 'cyberpunk'
  };
};

export default useCyberpunkEffects;