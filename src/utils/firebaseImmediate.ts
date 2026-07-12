/**
 * Immediate Firebase data fetch (not real-time)
 * Used for fast initial page load
 */

import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AboutData, HomeText, GalleryItem, StoreItem, SponsorItem, HomeLink } from './db';

export async function getAboutFromFirebase(): Promise<AboutData | null> {
  try {
    const docRef = doc(db, 'app_data', 'about');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as AboutData) : null;
  } catch (error) {
    console.error('Error fetching about:', error);
    return null;
  }
}

export async function getHeroFromFirebase(): Promise<string | null> {
  try {
    const docRef = doc(db, 'app_data', 'hero');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() && snapshot.data().url ? snapshot.data().url : null;
  } catch (error) {
    console.error('Error fetching hero:', error);
    return null;
  }
}

export async function getHomeTextFromFirebase(): Promise<HomeText | null> {
  try {
    const docRef = doc(db, 'app_data', 'homeText');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as HomeText) : null;
  } catch (error) {
    console.error('Error fetching home text:', error);
    return null;
  }
}

export async function getGalleryFromFirebase(): Promise<GalleryItem[] | null> {
  try {
    const docRef = doc(db, 'app_data', 'gallery');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() && snapshot.data().items ? snapshot.data().items : null;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return null;
  }
}

export async function getStoreFromFirebase(): Promise<StoreItem[] | null> {
  try {
    const docRef = doc(db, 'app_data', 'store');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() && snapshot.data().items ? snapshot.data().items : null;
  } catch (error) {
    console.error('Error fetching store:', error);
    return null;
  }
}

export async function getSponsorsFromFirebase(): Promise<SponsorItem[] | null> {
  try {
    const docRef = doc(db, 'app_data', 'sponsors');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() && snapshot.data().items ? snapshot.data().items : null;
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return null;
  }
}

export async function getHomeLinksFromFirebase(): Promise<HomeLink[] | null> {
  try {
    const docRef = doc(db, 'app_data', 'homeLinks');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() && snapshot.data().links ? snapshot.data().links : null;
  } catch (error) {
    console.error('Error fetching home links:', error);
    return null;
  }
}

/**
 * Fetch all app data from Firebase in parallel for fast initial load
 */
export async function fetchAllAppDataFromFirebase() {
  try {
    const [about, hero, homeText, gallery, store, sponsors, homeLinks] = await Promise.all([
      getAboutFromFirebase(),
      getHeroFromFirebase(),
      getHomeTextFromFirebase(),
      getGalleryFromFirebase(),
      getStoreFromFirebase(),
      getSponsorsFromFirebase(),
      getHomeLinksFromFirebase(),
    ]);

    return {
      about,
      hero,
      homeText,
      gallery,
      store,
      sponsors,
      homeLinks,
    };
  } catch (error) {
    console.error('Error fetching all app data:', error);
    return null;
  }
}
