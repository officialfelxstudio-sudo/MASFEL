import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  updateDoc,
  increment
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiPtDx5JE_TfwyTq0NmOTLCkr5cfXMkl0",
  authDomain: "masf33l-website.firebaseapp.com",
  projectId: "masf33l-website",
  storageBucket: "masf33l-website.firebasestorage.app",
  messagingSenderId: "549758015117",
  appId: "1:549758015117:web:30051eb446e936501034c4",
  measurementId: "G-9RZZEH2H47"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Types
import { GalleryItem, StoreItem, SponsorItem, HomeLink, AboutData, HomeText, CustomTexts } from './db';
import { NeuConfig } from '../contexts/NeuContext';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to listen to real-time changes of any doc
export const listenToDoc = (docName: string, callback: (data: any, fromCache: boolean) => void) => {
  const docRef = doc(db, 'app_data', docName);
  return onSnapshot(docRef, (snapshot) => {
    const fromCache = snapshot.metadata.fromCache;
    const hasPendingWrites = snapshot.metadata.hasPendingWrites;
    if (snapshot.exists()) {
      console.log(`[Sync] ${docName} updated (fromCache: ${fromCache}, pending: ${hasPendingWrites})`);
      callback(snapshot.data(), fromCache);
    } else {
      console.log(`[Sync] ${docName} empty (fromCache: ${fromCache})`);
      callback(null, fromCache);
    }
  }, (error) => {
    console.error(`[Sync] Error listening to doc ${docName}:`, error);
    try {
      callback(null, false);
    } catch (fallbackError) {
      console.error("Failed to execute fallback callback:", fallbackError);
    }
    console.warn(`[Sync] Firestore listener for "${docName}" lost. Reconnecting in 5s...`);
    setTimeout(() => {
      listenToDoc(docName, callback);
    }, 5000);
  });
};

// Helper to save data to any doc (with retry for transient connection errors)
export const saveDoc = async (docName: string, data: any, retries = 2): Promise<boolean> => {
  const docRef = doc(db, 'app_data', docName);
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await setDoc(docRef, data, { merge: true });
      console.log(`[Sync] ${docName} saved successfully`);
      return true;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const isSizeError = errMsg.includes('1048576') || errMsg.includes('too large') || errMsg.includes('MAX_DOCUMENT_SIZE');
      if (isSizeError) {
        console.error(`[Sync] Document "${docName}" is too large (exceeds 1 MiB). Try reducing image quality or removing some items.`);
        return false;
      }
      if (attempt < retries) {
        console.warn(`[Sync] Retry ${attempt + 1}/${retries} for doc "${docName}"...`);
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      console.error(`[Sync] Error saving doc ${docName} after ${retries + 1} attempts:`, error);
      return false;
    }
  }
  return false;
};

// Real-time operations
export const subscribeToAbout = (callback: (data: AboutData | null, fromCache: boolean) => void) => {
  return listenToDoc('about', (data, fromCache) => {
    callback(data ? (data as AboutData) : null, fromCache);
  });
};

export const saveAbout = async (data: AboutData): Promise<boolean> => {
  return await saveDoc('about', data);
};

export const subscribeToHero = (callback: (url: string | null, fromCache: boolean) => void) => {
  return listenToDoc('hero', (data, fromCache) => {
    callback(data && data.url ? data.url : null, fromCache);
  });
};

export const saveHero = async (url: string): Promise<boolean> => {
  return await saveDoc('hero', { url });
};

export const subscribeToGallery = (callback: (items: GalleryItem[] | null, fromCache: boolean) => void) => {
  return listenToDoc('gallery', (data, fromCache) => {
    callback(data && data.items ? data.items : null, fromCache);
  });
};

export const saveGallery = async (items: GalleryItem[]): Promise<boolean> => {
  return await saveDoc('gallery', { items });
};

export const subscribeToStore = (callback: (items: StoreItem[] | null, fromCache: boolean) => void) => {
  return listenToDoc('store', (data, fromCache) => {
    callback(data && data.items ? data.items : null, fromCache);
  });
};

export const saveStore = async (items: StoreItem[]): Promise<boolean> => {
  return await saveDoc('store', { items });
};

export const subscribeToSponsors = (callback: (items: SponsorItem[] | null, fromCache: boolean) => void) => {
  return listenToDoc('sponsors', (data, fromCache) => {
    callback(data && data.items ? data.items : null, fromCache);
  });
};

export const saveSponsors = async (items: SponsorItem[]): Promise<boolean> => {
  return await saveDoc('sponsors', { items });
};

export const subscribeToHomeLinks = (callback: (items: HomeLink[] | null, fromCache: boolean) => void) => {
  return listenToDoc('homeLinks', (data, fromCache) => {
    callback(data && data.links ? data.links : null, fromCache);
  });
};

export const saveHomeLinks = async (items: HomeLink[]): Promise<boolean> => {
  return await saveDoc('homeLinks', { links: items });
};

export const subscribeToNeuConfig = (callback: (config: Partial<NeuConfig> | null, fromCache: boolean) => void) => {
  return listenToDoc('neuConfig', (data, fromCache) => {
    callback(data ? (data as Partial<NeuConfig>) : null, fromCache);
  });
};

export const saveNeuConfig = async (config: Partial<NeuConfig>): Promise<boolean> => {
  return await saveDoc('neuConfig', config);
};

// Live Analytics
export const trackLivePageView = async () => {
  const docRef = doc(db, 'app_data', 'analytics');
  try {
    await setDoc(docRef, { pageViews: increment(1) }, { merge: true });
  } catch (error) {
    console.error('Error tracking live page view:', error);
    handleFirestoreError(error, OperationType.WRITE, 'app_data/analytics');
  }
};

export const subscribeToPageViews = (callback: (views: number | null, fromCache: boolean) => void) => {
  return listenToDoc('analytics', (data, fromCache) => {
    callback(data && typeof data.pageViews === 'number' ? data.pageViews : null, fromCache);
  });
};

export const subscribeToHomeText = (callback: (data: HomeText | null, fromCache: boolean) => void) => {
  return listenToDoc('homeText', (data, fromCache) => {
    callback(data ? (data as HomeText) : null, fromCache);
  });
};

export const saveHomeText = async (data: HomeText): Promise<boolean> => {
  return await saveDoc('homeText', data);
};

export const subscribeToCustomTexts = (callback: (data: CustomTexts | null, fromCache: boolean) => void) => {
  return listenToDoc('customTexts', (data, fromCache) => {
    callback(data ? (data as CustomTexts) : null, fromCache);
  });
};

export const saveCustomTexts = async (data: CustomTexts): Promise<boolean> => {
  return await saveDoc('customTexts', data);
};
