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

// Configuration loaded from firebase-applet-config.json
const firebaseConfig = {
  projectId: "refreshing-equinox-szp7b",
  appId: "1:781262236602:web:78844afd6ea7aa992ccb83",
  apiKey: "AIzaSyDBnKkgIvKec1x1TMTXuT22u2B5FmJtjM8",
  authDomain: "refreshing-equinox-szp7b.firebaseapp.com",
  databaseId: "ai-studio-masfel-7de6eb16-f25c-437a-8e32-4bfa89b34a29",
  storageBucket: "refreshing-equinox-szp7b.firebasestorage.app",
  messagingSenderId: "781262236602"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.databaseId);

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
    if (snapshot.exists()) {
      callback(snapshot.data(), fromCache);
    } else {
      callback(null, fromCache);
    }
  }, (error) => {
    console.error(`Error listening to doc ${docName}:`, error);
    try {
      callback(null, false);
    } catch (fallbackError) {
      console.error("Failed to execute local fallback callback:", fallbackError);
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    const isPermissionError = errMsg.toLowerCase().includes('permission') || 
                              (error && (error as any).code === 'permission-denied');
    if (isPermissionError) {
      handleFirestoreError(error, OperationType.GET, `app_data/${docName}`);
    }
  });
};

// Helper to save data to any doc
export const saveDoc = async (docName: string, data: any): Promise<boolean> => {
  const docRef = doc(db, 'app_data', docName);
  try {
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const isSizeError = errMsg.includes('1048576') || errMsg.includes('too large') || errMsg.includes('MAX_DOCUMENT_SIZE');
    if (isSizeError) {
      console.error(`Firestore document "${docName}" is too large (exceeds 1 MiB). Try reducing image quality or removing some items.`);
    } else {
      console.error(`Error saving doc ${docName}:`, error);
    }
    return false;
  }
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
    callback(data && data.items ? data.items : null, fromCache);
  });
};

export const saveHomeLinks = async (items: HomeLink[]): Promise<boolean> => {
  return await saveDoc('homeLinks', { items });
};

export const subscribeToNeuConfig = (callback: (config: Partial<NeuConfig> | null, fromCache: boolean) => void) => {
  return listenToDoc('neuConfig', (data, fromCache) => {
    callback(data ? (data as Partial<NeuConfig>) : null, fromCache);
  });
};

export const saveNeuConfig = async (config: Partial<NeuConfig>) => {
  await saveDoc('neuConfig', config);
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

export const saveHomeText = async (data: HomeText) => {
  await saveDoc('homeText', data);
};

export const subscribeToCustomTexts = (callback: (data: CustomTexts | null, fromCache: boolean) => void) => {
  return listenToDoc('customTexts', (data, fromCache) => {
    callback(data ? (data as CustomTexts) : null, fromCache);
  });
};

export const saveCustomTexts = async (data: CustomTexts) => {
  await saveDoc('customTexts', data);
};
