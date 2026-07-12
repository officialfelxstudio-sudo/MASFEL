import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { db, AboutData, HomeText, GalleryItem, StoreItem, SponsorItem, HomeLink, CustomTexts } from '../utils/db';
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
  saveHomeLinks,
  subscribeToCustomTexts,
  saveCustomTexts
} from '../utils/firebase';

interface DataContextType {
  isLoading: boolean;
  lastSyncTime: number;
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

  customTexts: CustomTexts;
  setCustomTexts: (data: CustomTexts) => void;
  updateCustomTexts: (data: CustomTexts) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isOwner } = useAuth();
  
  // Loading state - starts true until Firebase data arrives
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const loadedCountRef = useRef(0);
  const TOTAL_LISTENERS = 8;
  const skipSnapshotRef = useRef<Record<string, boolean>>({});

  // Initialize with local DB fallbacks
  const [aboutData, setAboutDataState] = useState<AboutData>(db.getAbout());
  const [heroImage, setHeroImageState] = useState<string>(db.getHeroImage());
  const [homeText, setHomeTextState] = useState<HomeText>(db.getHomeText());
  const [galleryItems, setGalleryItemsState] = useState<GalleryItem[]>(db.getGallery());
  const [storeItems, setStoreItemsState] = useState<StoreItem[]>(db.getStore());
  const [sponsorItems, setSponsorItemsState] = useState<SponsorItem[]>(db.getSponsors());
  const [homeLinks, setHomeLinksState] = useState<HomeLink[]>(db.getHomeLinks());
  const [customTexts, setCustomTextsState] = useState<CustomTexts>(db.getCustomTexts());

  // Helper to mark a listener as loaded and hide loading when all done
  const markLoaded = () => {
    loadedCountRef.current += 1;
    setLastSyncTime(Date.now());
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
      if (skipSnapshotRef.current['about']) {
        skipSnapshotRef.current['about'] = false;
        return;
      }
      if (firebaseAbout) {
        setAboutDataState(firebaseAbout);
      } else if (!fromCache) {
        setAboutDataState(db.getAbout());
      }
    });

    const unsubHero = subscribeToHero((firebaseHero, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['hero']) {
        skipSnapshotRef.current['hero'] = false;
        return;
      }
      if (firebaseHero) {
        setHeroImageState(firebaseHero);
      } else if (!fromCache) {
        setHeroImageState(db.getHeroImage());
      }
    });

    const unsubHomeText = subscribeToHomeText((firebaseText, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['homeText']) {
        skipSnapshotRef.current['homeText'] = false;
        return;
      }
      if (firebaseText) {
        setHomeTextState(firebaseText);
      } else if (!fromCache) {
        setHomeTextState(db.getHomeText());
      }
    });

    const unsubGallery = subscribeToGallery((firebaseGallery, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['gallery']) {
        skipSnapshotRef.current['gallery'] = false;
        return;
      }
      if (firebaseGallery) {
        setGalleryItemsState(firebaseGallery);
      } else if (!fromCache) {
        setGalleryItemsState(db.getGallery());
      }
    });

    const unsubStore = subscribeToStore((firebaseStore, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['store']) {
        skipSnapshotRef.current['store'] = false;
        return;
      }
      if (firebaseStore) {
        setStoreItemsState(firebaseStore);
      } else if (!fromCache) {
        setStoreItemsState(db.getStore());
      }
    });

    const unsubSponsors = subscribeToSponsors((firebaseSponsors, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['sponsors']) {
        skipSnapshotRef.current['sponsors'] = false;
        return;
      }
      if (firebaseSponsors) {
        setSponsorItemsState(firebaseSponsors);
      } else if (!fromCache) {
        setSponsorItemsState(db.getSponsors());
      }
    });

    const unsubHomeLinks = subscribeToHomeLinks((firebaseLinks, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['homeLinks']) {
        skipSnapshotRef.current['homeLinks'] = false;
        return;
      }
      if (firebaseLinks) {
        setHomeLinksState(firebaseLinks);
      } else if (!fromCache) {
        setHomeLinksState(db.getHomeLinks());
      }
    });

    const unsubCustomTexts = subscribeToCustomTexts((firebaseTexts, fromCache) => {
      if (!fromCache) markLoaded();
      if (skipSnapshotRef.current['customTexts']) {
        skipSnapshotRef.current['customTexts'] = false;
        return;
      }
      if (firebaseTexts) {
        setCustomTextsState(firebaseTexts);
      } else if (!fromCache) {
        setCustomTextsState(db.getCustomTexts());
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
      unsubCustomTexts();
    };
  }, [isOwner]);

  // Saving wrappers
  const updateAboutData = async (data: AboutData) => {
    setAboutDataState(data);
    db.setAbout(data);
    skipSnapshotRef.current['about'] = true;
    if (!(await saveAbout(data))) alert('Gagal sync ke server. Data tersimpan di perangkat.');
  };

  const updateHeroImage = async (url: string) => {
    setHeroImageState(url);
    db.setHeroImage(url);
    skipSnapshotRef.current['hero'] = true;
    if (!(await saveHero(url))) alert('Gagal sync ke server. Data tersimpan di perangkat.');
  };

  const updateHomeText = async (data: HomeText) => {
    setHomeTextState(data);
    db.setHomeText(data);
    skipSnapshotRef.current['homeText'] = true;
    if (!(await saveHomeText(data))) alert('Gagal sync ke server. Data tersimpan di perangkat.');
  };

  const updateGalleryItems = async (items: GalleryItem[]) => {
    setGalleryItemsState(items);
    db.setGallery(items);
    skipSnapshotRef.current['gallery'] = true;
    if (!(await saveGallery(items))) alert('Gagal sync gallery ke server. Data tersimpan di perangkat.');
  };

  const updateStoreItems = async (items: StoreItem[]) => {
    setStoreItemsState(items);
    db.setStore(items);
    skipSnapshotRef.current['store'] = true;
    if (!(await saveStore(items))) alert('Gagal sync store ke server. Data tersimpan di perangkat.');
  };

  const updateSponsorItems = async (items: SponsorItem[]) => {
    setSponsorItemsState(items);
    db.setSponsors(items);
    skipSnapshotRef.current['sponsors'] = true;
    if (!(await saveSponsors(items))) alert('Gagal sync sponsor ke server. Data tersimpan di perangkat.');
  };

  const updateHomeLinks = async (links: HomeLink[]) => {
    setHomeLinksState(links);
    db.setHomeLinks(links);
    skipSnapshotRef.current['homeLinks'] = true;
    if (!(await saveHomeLinks(links))) alert('Gagal sync ke server. Data tersimpan di perangkat.');
  };

  const updateCustomTexts = async (data: CustomTexts) => {
    setCustomTextsState(data);
    db.setCustomTexts(data);
    skipSnapshotRef.current['customTexts'] = true;
    if (!(await saveCustomTexts(data))) alert('Gagal sync custom texts ke server. Data tersimpan di perangkat.');
  };

  return (
    <DataContext.Provider value={{
      isLoading,
      lastSyncTime,
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
      updateHomeLinks,

      customTexts,
      setCustomTexts: setCustomTextsState,
      updateCustomTexts
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
