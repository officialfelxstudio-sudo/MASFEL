/**
 * Sync all localStorage data to Firebase Firestore
 * Run this once to migrate local data to Firebase
 */

import { db as firebaseDb } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function syncLocalDataToFirebase() {
  console.log('🔄 Starting sync of local data to Firebase...');

  try {
    // Get all data from localStorage
    const aboutData = JSON.parse(localStorage.getItem('db_about') || '{}');
    const homeText = JSON.parse(localStorage.getItem('db_home_text') || '{}');
    const gallery = JSON.parse(localStorage.getItem('db_gallery') || '{"items":[]}');
    const store = JSON.parse(localStorage.getItem('db_store') || '{"items":[]}');
    const sponsors = JSON.parse(localStorage.getItem('db_sponsors') || '{"items":[]}');
    const homeLinks = JSON.parse(localStorage.getItem('db_home_links') || '[]');
    const heroImage = JSON.parse(localStorage.getItem('db_hero') || '{}');
    const customTexts = JSON.parse(localStorage.getItem('db_custom_texts') || '{}');
    const neuConfig = JSON.parse(localStorage.getItem('neu_config') || '{}');

    // Save to Firebase
    const updates = [
      setDoc(doc(firebaseDb, 'app_data', 'about'), aboutData || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'hero'), heroImage || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'home_text'), homeText || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'gallery'), gallery || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'store'), store || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'sponsors'), sponsors || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'home_links'), { links: Array.isArray(homeLinks) ? homeLinks : [] }, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'custom_texts'), customTexts || {}, { merge: true }),
      setDoc(doc(firebaseDb, 'app_data', 'neu_config'), neuConfig || {}, { merge: true }),
    ];

    await Promise.all(updates);
    console.log('✅ Sync completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return false;
  }
}

// Auto-sync on app load if data exists in localStorage
export function setupAutoSync() {
  // Only run once per session
  if (sessionStorage.getItem('sync_completed')) {
    return;
  }

  const hasLocalData = localStorage.getItem('db_about') || 
                       localStorage.getItem('db_gallery') || 
                       localStorage.getItem('db_store');

  if (hasLocalData) {
    console.log('📲 Local data detected, syncing to Firebase...');
    syncLocalDataToFirebase().then(success => {
      if (success) {
        sessionStorage.setItem('sync_completed', 'true');
      }
    });
  }
}
