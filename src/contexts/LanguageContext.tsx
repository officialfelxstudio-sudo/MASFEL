import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from './DataContext';

type Language = 'en' | 'id';

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', id: 'Beranda' },
  about: { en: 'About', id: 'Tentang' },
  gallery: { en: 'Gallery', id: 'Galeri' },
  store: { en: 'Store', id: 'Toko' },
  sponsor: { en: 'Sponsor', id: 'Sponsor' },
  donate: { en: 'Donate', id: 'Donasi' },
  socialMedia: { en: 'Social Media', id: 'Media Sosial' },
  topup: { en: 'Topup', id: 'Topup' },
  sellAccount: { en: 'Sell Account', id: 'Jual Akun' },
  uploadNewImage: { en: 'Upload New Image', id: 'Upload Gambar Baru' },
  delete: { en: 'Delete', id: 'Hapus' },
  addProduct: { en: 'Add Product', id: 'Tambah Produk' },
  edit: { en: 'Edit', id: 'Edit' },
  uploadLogo: { en: 'Upload Logo', id: 'Upload Logo' },
  buyNow: { en: 'Click Now', id: 'Klik Sekarang' },
};

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: keyof typeof translations) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { customTexts } = useData();
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLang(saved);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('id')) {
        setLang('id');
      } else {
        setLang('en');
      }
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: keyof typeof translations) => {
    if (key === 'about' && customTexts.aboutTitle) return customTexts.aboutTitle;
    if (key === 'gallery' && customTexts.galleryTitle) return customTexts.galleryTitle;
    if (key === 'store' && customTexts.storeTitle) return customTexts.storeTitle;
    if (key === 'sponsor' && customTexts.sponsorTitle) return customTexts.sponsorTitle;
    if (key === 'buyNow' && customTexts.buyNowLabel) return customTexts.buyNowLabel;

    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
};
