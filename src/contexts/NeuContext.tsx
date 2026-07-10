import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscribeToNeuConfig } from '../utils/firebase';

export type NeuShape = 'flat' | 'concave' | 'convex' | 'pressed';

export interface NeuConfig {
  radius: number;
  distance: number;
  intensity: number;
  blur: number;
  shape: NeuShape;
  isDark: boolean;
}

const defaultConfig: NeuConfig = {
  radius: 6,
  distance: 2,
  intensity: 0.15,
  blur: 4,
  shape: 'flat',
  isDark: true,
};

interface NeuContextType {
  config: NeuConfig;
  updateConfig: (newConfig: Partial<NeuConfig>) => void;
}

export const NeuContext = createContext<NeuContextType | undefined>(undefined);

export const NeuProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<NeuConfig>(() => {
    const saved = localStorage.getItem('neuConfig_v4');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  // Subscribe to real-time changes in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToNeuConfig((firebaseConfig) => {
      if (firebaseConfig) {
        setConfig(prev => ({
          ...prev,
          ...firebaseConfig
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('neuConfig_v4', JSON.stringify(config));
    
    // Apply global CSS variables for Neumorphism
    const root = document.documentElement;
    const baseColor = config.isDark ? '#1a1b1e' : '#e0e5ec';
    const textColor = config.isDark ? '#e0e5ec' : '#1a1b1e';
    
    // CALCULATION LOGIC FOR NEUMORPHISM:
    // 1. Dark Shadow: Uses black (0,0,0) with opacity adjusted by 'intensity'.
    // 2. Light Shadow: Uses white (255,255,255) with opacity adjusted by 'intensity'.
    // 3. Distance, Blur, and Radius are mapped directly to standard CSS Box Shadow and Border Radius properties.
    const shadowDark = config.isDark ? 'rgba(0,0,0,0.6)' : `rgba(130,145,165,${config.intensity + 0.4})`;
    const shadowLight = config.isDark ? 'rgba(255,255,255,0.05)' : `rgba(255,255,255,${config.intensity + 0.5})`;
    
    root.style.setProperty('--bg-color', baseColor);
    root.style.setProperty('--text-color', textColor);
    root.style.setProperty('--neu-radius', `${config.radius}px`);
    root.style.setProperty('--neu-distance', `${config.distance}px`);
    root.style.setProperty('--neu-blur', `${config.blur}px`);
    root.style.setProperty('--neu-shadow-dark', shadowDark);
    root.style.setProperty('--neu-shadow-light', shadowLight);
    root.style.setProperty('--neu-intensity', config.intensity.toString());
    
    // CALCULATION FOR SHAPES (Concave / Convex):
    // Neumorphism creates depth via linear gradients. 
    // We calculate a darker and lighter variation of the base color.
    const adjustColor = (color: string, amount: number) => {
        let usePound = false;
        if (color[0] == "#") {
            color = color.slice(1);
            usePound = true;
        }
        let num = parseInt(color, 16);
        let r = (num >> 16) + amount;
        if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amount;
        if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amount;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    };

    const gradientDarker = config.isDark ? adjustColor(baseColor, -5) : adjustColor(baseColor, -10);
    const gradientLighter = config.isDark ? adjustColor(baseColor, 5) : adjustColor(baseColor, 10);
    
    root.style.setProperty('--neu-gradient-darker', gradientDarker);
    root.style.setProperty('--neu-gradient-lighter', gradientLighter);

  }, [config]);

  const updateConfig = (newConfig: Partial<NeuConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <NeuContext.Provider value={{ config, updateConfig }}>
      {children}
    </NeuContext.Provider>
  );
};

export const useNeu = () => {
  const context = useContext(NeuContext);
  if (context === undefined) {
    throw new Error('useNeu must be used within a NeuProvider');
  }
  return context;
};
