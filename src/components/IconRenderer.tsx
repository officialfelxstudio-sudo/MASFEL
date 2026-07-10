import React from 'react';
import * as Icons from 'lucide-react';

export const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const renderIcon = (name: string, url: string = '', size = 24) => {
  // If the user pasted an image URL as the icon
  if (name.startsWith('http')) {
    return <img src={name} alt="icon" style={{ width: size, height: size, objectFit: 'contain', borderRadius: '50%' }} />;
  }

  if (name === 'TikTok') return <TikTokIcon size={size} />;
  
  // @ts-ignore
  const IconCmp = Icons[name];
  if (IconCmp) return <IconCmp size={size} />;
  
  // Auto-detect based on URL if icon name isn't perfectly matched
  if (url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('tiktok.com')) return <TikTokIcon size={size} />;
    
    // Fetch favicon automatically
    try {
      const domain = new URL(url).hostname;
      return <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="icon" style={{ width: size, height: size, objectFit: 'contain', borderRadius: '50%' }} />;
    } catch (e) {
      // fallback
    }
  }

  return <Icons.Link size={size} />;
};
