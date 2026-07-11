import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { db, AboutData, HomeText, GalleryItem, StoreItem, SponsorItem, HomeLink } from '../utils/db';
import { useAuth } from './AuthContext';
import {
  subscribeToAbout,
  saveAbout,
  subscribeToHero,
  saveHero,
  subscribeToHomeText,
  saveHomeText,
  subscribeToGallery,
  saveGallery,
  subscribeToStore,
  saveStore,
  subscribeToSponsors,
  saveSponsors,
  subscribeToHomeLinks,
  saveHomeLinks
} from '../utils/firebase';

interface DataContextType {
  isLoading: boolean;
  aboutData: AboutData;
  setAboutData: (data: AboutData) => void;
  updateAboutData: (data: AboutData) => Promise<void>;
  
  heroImage: string;
  setHeroImage: (url: string) => void;
  updateHeroImage: (url: string) => Promise<void>;
  
  homeText: HomeText;
  setHomeText: (data: HomeText) => void;
  updateHomeText: (data: HomeText) => Promise<void>;
  
  galleryItems: GalleryItem[];
  setGalleryItems: (items: GalleryItem[]) => void;
  updateGalleryItems: (items: GalleryItem[]) => Promise<void>;
  
  storeItems: StoreItem[];
  setStoreItems: (items: StoreItem[]) => void;
  updateStoreItems: (items: StoreItem[]) => Promise<void>;
  
  sponsorItems: SponsorItem[];
  setSponsorItems: (items: SponsorItem[]) => void;
  updateSponsorItems: (items: SponsorItem[]) => Promise<void>;
  
  homeLinks: HomeLink[];
  setHomeLinks: (links: HomeLink[]) => void;
  updateHomeLinks: (links: HomeLink[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isOwner } = useAuth();
  
  // Loading state - starts true until Firebase data arrives
  const [isLoading, setIsLoading] = useState(true);
  const loadedCountRef = useRef(0);
  const TOTAL_LISTENERS = 7;

  // Initialize with local DB fallbacks
  const [aboutData, setAboutDataState] = useState<AboutData>(db.getAbout());
  const [heroImage, setHeroImageState] = useState<string>(db.getHeroImage());
  const [homeText, setHomeTextState] = useState<HomeText>(db.getHomeText());
  const [galleryItems, setGalleryItemsState] = useState<GalleryItem[]>(db.getGallery());
  const [storeItems, setStoreItemsState] = useState<StoreItem[]>(db.getStore());
  const [sponsorItems, setSponsorItemsState] = useState<SponsorItem[]>(db.getSponsors());
  const [homeLinks, setHomeLinksState] = useState<HomeLink[]>(db.getHomeLinks());

  // Helper to mark a listener as loaded and hide loading when all done
  const markLoaded = () => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= TOTAL_LISTENERS) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadedCountRef.current = 0;
    setIsLoading(true);

    // Single source of truth: real-time listeners only
    // onSnapshot fires with cached data first, then server data
    // Only mark loaded when data comes from the server (not cache)
    const unsubAbout = subscribeToAbout((firebaseAbout, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseAbout) {
        setAboutDataState(firebaseAbout);
      } else if (!fromCache) {
        const local = db.getAbout();
        setAboutDataState(local);
        if (isOwner) saveAbout(local);
      }
    });

    const unsubHero = subscribeToHero((firebaseHero, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseHero) {
        setHeroImageState(firebaseHero);
      } else if (!fromCache) {
        const local = db.getHeroImage();
        setHeroImageState(local);
        if (isOwner) saveHero(local);
      }
    });

    const unsubHomeText = subscribeToHomeText((firebaseText, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseText) {
        setHomeTextState(firebaseText);
      } else if (!fromCache) {
        const local = db.getHomeText();
        setHomeTextState(local);
        if (isOwner) saveHomeText(local);
      }
    });

    const unsubGallery = subscribeToGallery((firebaseGallery, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseGallery) {
        setGalleryItemsState(firebaseGallery);
      } else if (!fromCache) {
        const local = db.getGallery();
        setGalleryItemsState(local);
        if (isOwner) saveGallery(local);
      }
    });

    const unsubStore = subscribeToStore((firebaseStore, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseStore) {
        setStoreItemsState(firebaseStore);
      } else if (!fromCache) {
        const local = db.getStore();
        setStoreItemsState(local);
        if (isOwner) saveStore(local);
      }
    });

    const unsubSponsors = subscribeToSponsors((firebaseSponsors, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseSponsors) {
        setSponsorItemsState(firebaseSponsors);
      } else if (!fromCache) {
        const local = db.getSponsors();
        setSponsorItemsState(local);
        if (isOwner) saveSponsors(local);
      }
    });

    const unsubHomeLinks = subscribeToHomeLinks((firebaseLinks, fromCache) => {
      if (!fromCache) markLoaded();
      if (firebaseLinks) {
        setHomeLinksState(firebaseLinks);
      } else if (!fromCache) {
        const local = db.getHomeLinks();
        setHomeLinksState(local);
        if (isOwner) saveHomeLinks(local);
      }
    });

    return () => {
      unsubAbout();
      unsubHero();
      unsubHomeText();
      unsubGallery();
      unsubStore();
      unsubSponsors();
      unsubHomeLinks();
    };
  }, [isOwner]);

  // Saving wrappers
  const updateAboutData = async (data: AboutData) => {
    setAboutDataState(data);
    db.setAbout(data);
    await saveAbout(data);
  };

  const updateHeroImage = async (url: string) => {
    setHeroImageState(url);
    db.setHeroImage(url);
    await saveHero(url);
  };

  const updateHomeText = async (data: HomeText) => {
    setHomeTextState(data);
    db.setHomeText(data);
    await saveHomeText(data);
  };

  const updateGalleryItems = async (items: GalleryItem[]) => {
    setGalleryItemsState(items);
    db.setGallery(items);
    await saveGallery(items);
  };

  const updateStoreItems = async (items: StoreItem[]) => {
    setStoreItemsState(items);
    db.setStore(items);
    await saveStore(items);
  };

  const updateSponsorItems = async (items: SponsorItem[]) => {
    setSponsorItemsState(items);
    db.setSponsors(items);
    await saveSponsors(items);
  };

  const updateHomeLinks = async (links: HomeLink[]) => {
    setHomeLinksState(links);
    db.setHomeLinks(links);
    await saveHomeLinks(links);
  };

  return (
    <DataContext.Provider value={{
      isLoading,
      aboutData,
      setAboutData: setAboutDataState,
      updateAboutData,
      
      heroImage,
      setHeroImage: setHeroImageState,
      updateHeroImage,
      
      homeText,
      setHomeText: setHomeTextState,
      updateHomeText,
      
      galleryItems,
      setGalleryItems: setGalleryItemsState,
      updateGalleryItems,
      
      storeItems,
      setStoreItems: setStoreItemsState,
      updateStoreItems,
      
      sponsorItems,
      setSponsorItems: setSponsorItemsState,
      updateSponsorItems,
      
      homeLinks,
      setHomeLinks: setHomeLinksState,
      updateHomeLinks
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
