import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  
  // Initialize with local DB fallbacks
  const [aboutData, setAboutDataState] = useState<AboutData>(db.getAbout());
  const [heroImage, setHeroImageState] = useState<string>(db.getHeroImage());
  const [homeText, setHomeTextState] = useState<HomeText>(db.getHomeText());
  const [galleryItems, setGalleryItemsState] = useState<GalleryItem[]>(db.getGallery());
  const [storeItems, setStoreItemsState] = useState<StoreItem[]>(db.getStore());
  const [sponsorItems, setSponsorItemsState] = useState<SponsorItem[]>(db.getSponsors());
  const [homeLinks, setHomeLinksState] = useState<HomeLink[]>(db.getHomeLinks());

  useEffect(() => {
    // 1. Subscribe to About
    const unsubAbout = subscribeToAbout((firebaseAbout) => {
      if (firebaseAbout) {
        setAboutDataState(firebaseAbout);
      } else {
        const local = db.getAbout();
        setAboutDataState(local);
        if (isOwner) saveAbout(local);
      }
    });

    // 2. Subscribe to Hero
    const unsubHero = subscribeToHero((firebaseHero) => {
      if (firebaseHero) {
        setHeroImageState(firebaseHero);
      } else {
        const local = db.getHeroImage();
        setHeroImageState(local);
        if (isOwner) saveHero(local);
      }
    });

    // 3. Subscribe to Home Text
    const unsubHomeText = subscribeToHomeText((firebaseText) => {
      if (firebaseText) {
        setHomeTextState(firebaseText);
      } else {
        const local = db.getHomeText();
        setHomeTextState(local);
        if (isOwner) saveHomeText(local);
      }
    });

    // 4. Subscribe to Gallery
    const unsubGallery = subscribeToGallery((firebaseGallery) => {
      if (firebaseGallery) {
        setGalleryItemsState(firebaseGallery);
      } else {
        const local = db.getGallery();
        setGalleryItemsState(local);
        if (isOwner) saveGallery(local);
      }
    });

    // 5. Subscribe to Store
    const unsubStore = subscribeToStore((firebaseStore) => {
      if (firebaseStore) {
        setStoreItemsState(firebaseStore);
      } else {
        const local = db.getStore();
        setStoreItemsState(local);
        if (isOwner) saveStore(local);
      }
    });

    // 6. Subscribe to Sponsors
    const unsubSponsors = subscribeToSponsors((firebaseSponsors) => {
      if (firebaseSponsors) {
        setSponsorItemsState(firebaseSponsors);
      } else {
        const local = db.getSponsors();
        setSponsorItemsState(local);
        if (isOwner) saveSponsors(local);
      }
    });

    // 7. Subscribe to Home Links
    const unsubHomeLinks = subscribeToHomeLinks((firebaseLinks) => {
      if (firebaseLinks) {
        setHomeLinksState(firebaseLinks);
      } else {
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
