export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  desc?: string;
}

export interface StoreItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  link: string;
}

export interface SponsorItem {
  id: string;
  name: string;
  url: string;
}

export interface HomeLink {
  id: string;
  label: string;
  icon: string;
  url: string;
  isPrimary: boolean;
}

export interface AboutData {
  text: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonIcon: string;
}

export interface HomeText {
  title: string;
  subtitle: string;
}

export interface CustomTexts {
  aboutTitle: string;
  galleryTitle: string;
  storeTitle: string;
  sponsorTitle: string;
  buyNowLabel: string;
}

// Initial Mock Data
const defaultGallery: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', title: 'Cosmic Vibes', desc: 'Amazing view of the night.' },
  { id: '2', url: 'https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', title: 'Mountain Peak', desc: 'Snowy mountain ranges.' },
  { id: '3', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', title: 'River Flow', desc: 'Calm and peaceful river.' },
];

const defaultStore: StoreItem[] = [
  { id: '1', title: 'Topup Diamond', desc: 'Fast & Secure Topup for your favorite games.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', link: 'https://example.com/topup' },
  { id: '2', title: 'Premium Account', desc: 'High level account with rare items.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', link: 'https://example.com/premium' },
];

const defaultSponsors: SponsorItem[] = [
  { id: '1', name: 'TechCorp', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop' },
  { id: '2', name: 'DevStudio', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop' },
];

const defaultHomeLinks: HomeLink[] = [
  { id: 'DONATE', label: 'Donate', icon: 'Coffee', url: 'https://sibagi.com/masfel', isPrimary: true },
  { id: 'TIKTOK', label: '', icon: 'TikTok', url: 'https://tiktok.com/@masfel.id', isPrimary: false },
  { id: 'INSTAGRAM', label: '', icon: 'Instagram', url: '#', isPrimary: false },
  { id: 'twitter', label: '', icon: 'Twitter', url: '#', isPrimary: false },
];

const defaultAbout: AboutData = {
  text: "Hello! I am a passionate creator focusing on Neumorphism UI designs and interactive web experiences. \n\nThis personal hub serves as a central point for all my digital endeavors, from showcasing my portfolio to offering exclusive digital products.\n\nI believe in the power of soft UI, smooth animations, and creating immersive experiences that blur the line between digital and physical textures.",
  buttonLabel: "JOIN DISCORD",
  buttonUrl: "https://discord.com",
  buttonIcon: "MessageSquare"
};

const defaultHomeText: HomeText = {
  title: "Masfel",
  subtitle: "Digital Creator & UI/UX Enthusiast. Welcome to my personal hub."
};

const defaultCustomTexts: CustomTexts = {
  aboutTitle: "About",
  galleryTitle: "Gallery",
  storeTitle: "Store",
  sponsorTitle: "Sponsors",
  buyNowLabel: "Click Now"
};

export const db = {
  getAbout: (): AboutData => JSON.parse(localStorage.getItem('db_about') || JSON.stringify(defaultAbout)),
  setAbout: (data: AboutData) => localStorage.setItem('db_about', JSON.stringify(data)),

  getHomeText: (): HomeText => JSON.parse(localStorage.getItem('db_home_text') || JSON.stringify(defaultHomeText)),
  setHomeText: (data: HomeText) => localStorage.setItem('db_home_text', JSON.stringify(data)),

  getCustomTexts: (): CustomTexts => JSON.parse(localStorage.getItem('db_custom_texts') || JSON.stringify(defaultCustomTexts)),
  setCustomTexts: (data: CustomTexts) => localStorage.setItem('db_custom_texts', JSON.stringify(data)),

  getHeroImage: (): string => localStorage.getItem('db_hero') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop',
  setHeroImage: (url: string) => localStorage.setItem('db_hero', url),

  getGallery: (): GalleryItem[] => JSON.parse(localStorage.getItem('db_gallery') || JSON.stringify(defaultGallery)),
  setGallery: (data: GalleryItem[]) => localStorage.setItem('db_gallery', JSON.stringify(data)),
  
  getStore: (): StoreItem[] => JSON.parse(localStorage.getItem('db_store') || JSON.stringify(defaultStore)),
  setStore: (data: StoreItem[]) => localStorage.setItem('db_store', JSON.stringify(data)),
  
  getSponsors: (): SponsorItem[] => JSON.parse(localStorage.getItem('db_sponsors') || JSON.stringify(defaultSponsors)),
  setSponsors: (data: SponsorItem[]) => localStorage.setItem('db_sponsors', JSON.stringify(data)),

  getHomeLinks: (): HomeLink[] => JSON.parse(localStorage.getItem('db_home_links') || JSON.stringify(defaultHomeLinks)),
  setHomeLinks: (data: HomeLink[]) => localStorage.setItem('db_home_links', JSON.stringify(data)),
};

// Analytics
export const trackPageView = () => {
  const views = parseInt(localStorage.getItem('page_views') || '0');
  localStorage.setItem('page_views', (views + 1).toString());
};

export const getPageViews = () => {
  return parseInt(localStorage.getItem('page_views') || '0');
};
