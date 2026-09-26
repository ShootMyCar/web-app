import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ContactFormSection } from './components/ContactFormSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { LegalModal } from './components/LegalModal';
import { GALLERY_PHOTOS } from './data/photos';
import { PhotoItem } from './types';
import { fetchAllGalleryPhotos } from './lib/supabasePhotos';
import { supabase } from './lib/supabase';
import defaultHeroImage from './assets/hero-lamborghini.jpg';

export default function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>(GALLERY_PHOTOS);
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [showImpressum, setShowImpressum] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const isFetchingRef = useRef(false);

  const loadPhotos = useCallback(async (showIndicator = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (showIndicator) setIsSyncing(true);

    try {
      const loaded = await fetchAllGalleryPhotos();
      setPhotos(loaded);
    } catch (err) {
      console.error('Fehler beim Synchronisieren mit Supabase:', err);
    } finally {
      isFetchingRef.current = false;
      if (showIndicator) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  }, []);

  useEffect(() => {
    // Initial load
    loadPhotos(true);

    // 1. Live Realtime Channel mit Supabase
    let channel: any = null;
    if (supabase) {
      try {
        channel = supabase
          .channel('photos-realtime-feed')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'photos' },
            () => {
              loadPhotos(true);
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Realtime subscription error:', e);
      }
    }

    // 2. Automatischer Polling-Intervall alle 3.5 Sekunden
    // Dadurch werden Uploads aus der App in maximal 3-4 Sekunden ohne Neuladen der Seite sichtbar!
    const interval = setInterval(() => {
      loadPhotos(false);
    }, 3500);

    // 3. Tab-Focus Reload
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadPhotos(true);
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadPhotos]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e2e4eb] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-white">
      {/* Navbar */}
      <Navbar onScrollTo={scrollToSection} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* 1. Hero */}
        <Hero
          onExploreGallery={() => scrollToSection('galerie')}
          onOpenBooking={() => scrollToSection('kontakt')}
          backgroundImage={defaultHeroImage}
        />

        {/* 2. Über uns / Intro */}
        <AboutSection />

        {/* 3. Galerie (Live aus Supabase) */}
        <GallerySection
          photos={photos}
          isSyncing={isSyncing}
          onRefresh={() => loadPhotos(true)}
          onSelectPhoto={(photo) => setActivePhoto(photo)}
        />

        {/* 4. Kontakt / Buchungsformular */}
        <ContactFormSection />
      </main>

      {/* 5. Footer */}
      <Footer onOpenImpressum={() => setShowImpressum(true)} />

      {/* Fullscreen Lightbox */}
      <LightboxModal
        photo={activePhoto}
        photos={photos}
        isOpen={Boolean(activePhoto)}
        onClose={() => setActivePhoto(null)}
        onSelectPhoto={(photo) => setActivePhoto(photo)}
      />

      {/* Impressum Modal */}
      <LegalModal
        type={showImpressum ? 'impressum' : null}
        onClose={() => setShowImpressum(false)}
      />
    </div>
  );
}
