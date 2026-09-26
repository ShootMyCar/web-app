import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { GalleryCategory, PhotoItem } from '../types';

interface GallerySectionProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  isSyncing?: boolean;
  onRefresh?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  onSelectPhoto,
  isSyncing = false,
  onRefresh,
}) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  // Filter out any broken images dynamically
  const validPhotos = photos.filter((p) => !failedImageIds.has(p.id));

  // Count by category
  const countAll = validPhotos.length;
  const countRollershots = validPhotos.filter((p) => p.category === 'rollershots').length;
  const countEvents = validPhotos.filter((p) => p.category === 'events').length;
  const countDetails = validPhotos.filter((p) => p.category === 'details').length;

  const filterTabs: { id: GalleryCategory; label: string; count: number }[] = [
    { id: 'all', label: 'Alle', count: countAll },
    { id: 'rollershots', label: 'Rollershots', count: countRollershots },
    { id: 'events', label: 'Events', count: countEvents },
    { id: 'details', label: 'Detailaufnahmen', count: countDetails },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? validPhotos
    : validPhotos.filter((photo) => photo.category === activeCategory);

  const handleImageError = (id: string, url: string) => {
    console.warn('Bild konnte nicht geladen werden, wird ausgeblendet:', url);
    setFailedImageIds((prev) => new Set(prev).add(id));
  };

  return (
    <section id="galerie" className="py-20 sm:py-28 bg-[#08090d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-2">
            Portfolio
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Galerie
          </h2>

          {/* Live Sync Status indicator */}
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live mit Supabase synchronisiert</span>
            </span>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isSyncing}
                title="Jetzt manuell mit Supabase synchronisieren"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-[11px]"
              >
                <RefreshCw className={`w-3 h-3 text-[#d4af37] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronisiert...' : 'Aktualisieren'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#d4af37] text-[#08090d]'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#08090d]/20 text-[#08090d]' : 'bg-white/10 text-neutral-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-sm bg-white/[0.01] max-w-lg mx-auto">
            <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-300 font-medium text-sm mb-1">
              Keine Aufnahmen in dieser Kategorie
            </p>
            <p className="text-neutral-500 text-xs mb-4">
              {countAll > 0
                ? `Es gibt aktuell ${countAll} Aufnahme(n) in einer anderen Kategorie.`
                : 'Lade neue Bilder über deine Admin-App oder Supabase hoch – sie erscheinen automatisch hier.'}
            </p>
            {countAll > 0 && activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white rounded-sm transition-all"
              >
                Alle Fotos anzeigen ({countAll})
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#11131a] cursor-pointer border border-white/5 hover:border-[#d4af37]/30 transition-all duration-300"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  onError={() => handleImageError(photo.id, photo.imageUrl)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                    {photo.category} • Foto von {photo.photographer}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mt-0.5">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-light mt-0.5">
                    {photo.vehicle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
