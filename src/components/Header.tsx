import React from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useNeu } from '../contexts/NeuContext';
import { NeuContainer } from './NeuContainer';
import { Globe, Moon, Sun } from 'lucide-react';

export default function Header() {
  const { lang, toggleLang } = useLang();
  const { config, updateConfig } = useNeu();
  
  const toggleTheme = () => {
    updateConfig({ isDark: !config.isDark });
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-end items-center pointer-events-none gap-3">
      <div className="pointer-events-auto flex items-center gap-3">
        <NeuContainer shape="flat" className="p-1.5 sm:p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all" onClick={toggleTheme}>
          <div className="flex items-center justify-center p-0.5 text-[var(--text-color)]">
            {config.isDark ? <Sun size={14} /> : <Moon size={14} />}
          </div>
        </NeuContainer>
        
        <NeuContainer shape="flat" className="p-1.5 sm:p-2 cursor-pointer hover:scale-110 active:scale-95 transition-all" onClick={toggleLang}>
          <div className="flex items-center gap-1.5 px-1 font-bold text-xs sm:text-sm text-[var(--text-color)]">
            <Globe size={14} />
            {lang.toUpperCase()}
          </div>
        </NeuContainer>
      </div>
    </header>
  );
}
