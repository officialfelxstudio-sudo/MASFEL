import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { NeuProvider } from './contexts/NeuContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider, useData } from './contexts/DataContext';
import ParallaxBackground from './components/ParallaxBackground';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import StoreSection from './components/StoreSection';
import SponsorSection from './components/SponsorSection';
import HiddenLogin from './components/HiddenLogin';
import Header from './components/Header';
import CursorTrail from './components/CursorTrail';
import { trackPageView } from './utils/db';
import { isMobile } from './utils/deviceOptimization';

// Lazy load heavy components
const AdminPanel = lazy(() => import('./components/AdminPanel'));

export default function App() {
  return (
    <NeuProvider>
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </DataProvider>
      </AuthProvider>
    </NeuProvider>
  );
}

function AppContent() {
  const { isLoading } = useData();
  const [showLoading, setShowLoading] = useState(true);
  const [fadeLoading, setFadeLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !fadeLoading) {
      setFadeLoading(true);
      const timer = setTimeout(() => setShowLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, fadeLoading]);

  useEffect(() => {
    trackPageView();
    import('./utils/firebase').then(module => {
      module.trackLivePageView();
    });
  }, []);

  useEffect(() => {
    if (isMobile()) return;

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

    let resizeObserver: ResizeObserver | null = null;
    let previousHeight = content ? content.offsetHeight : 0;

    if (content) {
      resizeObserver = new ResizeObserver(() => {
        const oldHeight = previousHeight;
        const newHeight = content.offsetHeight;
        previousHeight = newHeight;

        lenis.resize();

        if (oldHeight > 100) {
          const relativePos = lenis.scroll / oldHeight;
          lenis.scrollTo(newHeight * relativePos, { immediate: true });
        }

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

    lenis.on('scroll', () => {
      const currentContent = contentRef.current;
      if (!currentContent) return;

      const contentHeight = currentContent.offsetHeight;
      if (contentHeight <= 100) return;

      if (lenis.scroll >= contentHeight * 2) {
        lenis.scrollTo(lenis.scroll - contentHeight, { immediate: true });
      } else if (lenis.scroll <= 0) {
        lenis.scrollTo(lenis.scroll + contentHeight, { immediate: true });
      }
    });

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('load', handleLoad);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {showLoading && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${fadeLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ background: 'var(--bg-color)' }}
        >
          <div className="loading-spinner" />
        </div>
      )}

      <div className="relative w-full min-h-screen overflow-x-hidden text-[var(--text-color)]">
        {!isMobile() && (
          <Suspense fallback={null}>
            <ParallaxBackground />
          </Suspense>
        )}
        <Header />
        
        <div id="scroll-wrapper" className="relative z-10">
          <div id="clone-top" aria-hidden="true">
            <HomeSection />
            <AboutSection />
            <GallerySection />
            <StoreSection />
            <SponsorSection />
          </div>

          <div ref={contentRef} id="real-content">
            <HomeSection />
            <AboutSection />
            <GallerySection />
            <StoreSection />
            <SponsorSection />
          </div>
          
          <div id="clone-bottom" aria-hidden="true">
            <HomeSection />
            <AboutSection />
            <GallerySection />
            <StoreSection />
            <SponsorSection />
          </div>
        </div>
        
        <HiddenLogin />
        <CursorTrail />
        <Suspense fallback={null}>
          <AdminPanel />
        </Suspense>
      </div>
    </>
  );
}
