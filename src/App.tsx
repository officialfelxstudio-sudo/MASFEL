import React, { useEffect, useRef, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { NeuProvider } from './contexts/NeuContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import ParallaxBackground from './components/ParallaxBackground';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import StoreSection from './components/StoreSection';
import SponsorSection from './components/SponsorSection';
import HiddenLogin from './components/HiddenLogin';
import Header from './components/Header';
import { trackPageView } from './utils/db';
import { isMobile } from './utils/deviceOptimization';
import { setupAutoSync } from './utils/syncToFirebase';

// Lazy load heavy components
const AdminPanel = lazy(() => import('./components/AdminPanel'));

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPageView();
    
    // Auto-sync local data to Firebase on app startup
    setupAutoSync();
    
    // Load Firebase tracking immediately (no delay)
    import('./utils/firebase').then(module => {
      module.trackLivePageView();
    });
  }, []);

  useEffect(() => {
    // Skip Lenis on mobile devices (too heavy)
    if (isMobile()) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      syncTouch: true,
    });

    const content = contentRef.current;
    let initialScrolled = false;

    const scrollToMiddle = () => {
      if (content && content.offsetHeight > 100) {
        lenis.scrollTo(content.offsetHeight, { immediate: true });
        initialScrolled = true;
      }
    };

    scrollToMiddle();

    // Dynamically observe content height adjustments (e.g. when images load or components resize)
    let resizeObserver: ResizeObserver | null = null;
    if (content) {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
        if (!initialScrolled) {
          scrollToMiddle();
        }
      });
      resizeObserver.observe(content);
    }

    const handleLoad = () => {
      lenis.resize();
      scrollToMiddle();
    };
    window.addEventListener('load', handleLoad);

    lenis.on('scroll', (e: any) => {
      const currentContent = contentRef.current;
      if (!currentContent) return;

      const contentHeight = currentContent.offsetHeight;
      if (contentHeight <= 100) return;
      
      // If we reach the 3rd set, wrap back to the 2nd set
      if (lenis.scroll >= contentHeight * 2) {
        lenis.scrollTo(lenis.scroll - contentHeight, { immediate: true });
      } 
      // If we reach the 1st set top, wrap forward to the 2nd set top
      else if (lenis.scroll <= 0) {
        lenis.scrollTo(lenis.scroll + contentHeight, { immediate: true });
      }
    });

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('load', handleLoad);
      lenis.destroy();
    };
  }, []);

  return (
    <NeuProvider>
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <div className="relative w-full min-h-screen overflow-x-hidden text-[var(--text-color)]">
              {!isMobile() && (
                <Suspense fallback={null}>
                  <ParallaxBackground />
                </Suspense>
              )}
              <Header />
              
              <div id="scroll-wrapper" className="relative z-10">
                {/* Set 1: Top Clone (For scrolling up from initial position) */}
                <div id="clone-top" aria-hidden="true">
                  <HomeSection />
                  <AboutSection />
                  <GallerySection />
                  <StoreSection />
                  <SponsorSection />
                </div>

                {/* Set 2: Original (Where we start) */}
                <div ref={contentRef} id="real-content">
                  <HomeSection />
                  <AboutSection />
                  <GallerySection />
                  <StoreSection />
                  <SponsorSection />
                </div>
                
                {/* Set 3: Bottom Clone (For scrolling down) */}
                <div id="clone-bottom" aria-hidden="true">
                  <HomeSection />
                  <AboutSection />
                  <GallerySection />
                  <StoreSection />
                  <SponsorSection />
                </div>
              </div>
              
              <HiddenLogin />
              <Suspense fallback={null}>
                <AdminPanel />
              </Suspense>
            </div>
          </LanguageProvider>
        </DataProvider>
      </AuthProvider>
    </NeuProvider>
  );
}
