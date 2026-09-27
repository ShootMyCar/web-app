import React, { useState, useMemo } from 'react';
import { RefreshCw, Image as ImageIcon, Sparkles, Calendar, ChevronLeft, ZoomIn, ArrowRight } from 'lucide-react';
import { GalleryCategory, PhotoItem } from '../types';

interface GallerySectionProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem, currentList?: PhotoItem[]) => void;
  isSyncing?: boolean;
  onRefresh?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  onSelectPhoto,
  isSyncing = false,
  onRefresh,
}) => {
  // 'best' replaces 'all' as the primary default filter
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('best');
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  // Filter out any broken images dynamically
  const validPhotos = useMemo(
    () => photos.filter((p) => !failedImageIds.has(p.id)),
    [photos, failedImageIds]
  );

  // Best of photos: explicitly marked isBest, or fallback to all if none explicitly flagged
  const bestPhotos = useMemo(
    () => validPhotos.filter((p) => p.isBest),
    [validPhotos]
  );
  const effectiveBestPhotos = bestPhotos.length > 0 ? bestPhotos : validPhotos;

  const rollershotsPhotos = useMemo(
    () => validPhotos.filter((p) => p.category === 'rollershots'),
    [validPhotos]
  );
  const eventPhotos = useMemo(
    () => validPhotos.filter((p) => p.category === 'events'),
    [validPhotos]
  );
  const detailsPhotos = useMemo(
    () => validPhotos.filter((p) => p.category === 'details'),
    [validPhotos]
  );

  // Group events by eventName or location
  const eventGroups = useMemo(() => {
    const map = new Map<string, PhotoItem[]>();
    for (const photo of eventPhotos) {
      const key = (photo.eventName && photo.eventName.trim()) || photo.location?.trim() || 'Allgemeine Events';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(photo);
    }
    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      count: items.length,
      coverPhoto: items[0],
      date: items.find((i) => i.eventDate)?.eventDate,
      photos: items,
    }));
  }, [eventPhotos]);

  // Tab definitions: "Beste" replaces "Alle"
  const filterTabs: { id: GalleryCategory; label: string; count: number; icon?: React.ReactNode }[] = [
    {
      id: 'best',
      label: 'Beste',
      count: effectiveBestPhotos.length,
      icon: <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />,
    },
    { id: 'rollershots', label: 'Rollershots', count: rollershotsPhotos.length },
    { id: 'events', label: 'Events', count: eventPhotos.length },
    { id: 'details', label: 'Detailaufnahmen', count: detailsPhotos.length },
  ];

  // Active photos depending on filter
  const currentFilteredPhotos = useMemo(() => {
    if (activeCategory === 'best') return effectiveBestPhotos;
    if (activeCategory === 'rollershots') return rollershotsPhotos;
    if (activeCategory === 'details') return detailsPhotos;
    if (activeCategory === 'events') {
      if (!selectedEventName || selectedEventName === '__ALL__') return eventPhotos;
      return eventPhotos.filter((p) => {
        const key = (p.eventName && p.eventName.trim()) || p.location?.trim() || 'Allgemeine Events';
        return key === selectedEventName;
      });
    }
    return validPhotos;
  }, [
    activeCategory,
    effectiveBestPhotos,
    rollershotsPhotos,
    detailsPhotos,
    eventPhotos,
    selectedEventName,
    validPhotos,
  ]);

  const handleImageError = (id: string, url: string) => {
    console.warn('Bild konnte nicht geladen werden, wird ausgeblendet:', url);
    setFailedImageIds((prev) => new Set(prev).add(id));
  };

  const handleTabClick = (tabId: GalleryCategory) => {
    setActiveCategory(tabId);
    if (tabId === 'events') {
      // Reset event selection so event picker is shown first
      setSelectedEventName(null);
    }
  };

  return (
    <section id="galerie" className="py-16 sm:py-24 bg-[#08090d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
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

        {/* Filter Buttons (Beste replaces Alle) */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-8">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#d4af37] text-[#08090d] shadow-lg shadow-[#d4af37]/20 font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#08090d]/20 text-[#08090d]' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---------------- EVENTS SELECTION VIEW ---------------- */}
        {activeCategory === 'events' && selectedEventName === null && (
          <div className="mb-10 animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-medium flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Event-Auswahl
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Wähle ein Event</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Klicke auf ein Event, um die dazugehörigen Aufnahmen anzusehen.
              </p>
            </div>

            {eventPhotos.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-sm bg-white/[0.01] max-w-md mx-auto">
                <Calendar className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-neutral-300 font-medium text-xs mb-1">Noch keine Events eingetragen</p>
                <p className="text-neutral-500 text-[11px]">
                  Füge in Supabase in der Spalte <code>category</code> den Wert <code>events</code> und optional einen <code>event_name</code> hinzu.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {eventGroups.map((group) => (
                  <div
                    key={group.name}
                    onClick={() => setSelectedEventName(group.name)}
                    className="group relative bg-[#11131a] border border-white/10 hover:border-[#d4af37] rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-[#d4af37]/10"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-900 relative">
                      {group.coverPhoto ? (
                        <img
                          src={group.coverPhoto.imageUrl}
                          alt={group.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-[#d4af37]">
                        {group.count} {group.count === 1 ? 'Foto' : 'Fotos'}
                      </div>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <h4 className="font-display text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">
                          {group.name}
                        </h4>
                        {group.date && (
                          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono">
                            {group.date}
                          </span>
                        )}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#d4af37] flex items-center justify-center text-neutral-400 group-hover:text-[#08090d] transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Card to show all event photos at once */}
                {eventGroups.length > 1 && (
                  <div
                    onClick={() => setSelectedEventName('__ALL__')}
                    className="group bg-white/[0.02] border border-dashed border-white/15 hover:border-white/40 rounded-sm p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/[0.04]"
                  >
                    <Calendar className="w-6 h-6 text-neutral-400 group-hover:text-white mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                      Alle Event-Fotos anzeigen
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      Insgesamt {eventPhotos.length} Aufnahmen
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Header when inside an active Event */}
        {activeCategory === 'events' && selectedEventName !== null && (
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-white/10 max-w-6xl mx-auto">
            <button
              onClick={() => setSelectedEventName(null)}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-[#d4af37] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Zurück zur Event-Auswahl</span>
            </button>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] block font-mono">
                Event-Album
              </span>
              <h3 className="text-sm font-bold text-white">
                {selectedEventName === '__ALL__' ? 'Alle Events' : selectedEventName} ({currentFilteredPhotos.length})
              </h3>
            </div>
          </div>
        )}

        {/* ---------------- COMPACT PHOTO GRID ---------------- */}
        {/* Bilder sind kleiner, kompakt, gestochen scharf und öffnen sich groß bei Klick */}
        {currentFilteredPhotos.length === 0 ? (
          <div className="text-center py-14 px-4 border border-dashed border-white/10 rounded-sm bg-white/[0.01] max-w-lg mx-auto">
            <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-neutral-300 font-medium text-xs mb-1">
              Keine Aufnahmen in dieser Auswahl
            </p>
            <p className="text-neutral-500 text-[11px] mb-3">
              {activeCategory === 'best'
                ? 'Markiere in Supabase Fotos mit "is_best = true", damit sie unter "Beste" erscheinen.'
                : 'Lade neue Bilder über deine App oder Supabase hoch.'}
            </p>
            {activeCategory !== 'best' && (
              <button
                onClick={() => handleTabClick('best')}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white rounded-sm transition-all"
              >
                Zu den besten Aufnahmen
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Hint bar: Bilder durch Anklicken vergrößern */}
            <div className="flex items-center justify-between mb-3 text-[11px] text-neutral-400 px-1">
              <span>{currentFilteredPhotos.length} {currentFilteredPhotos.length === 1 ? 'Aufnahme' : 'Aufnahmen'}</span>
              <span className="flex items-center gap-1 text-neutral-400">
                <ZoomIn className="w-3 h-3 text-[#d4af37]" /> Bild anklicken zum Vergrößern
              </span>
            </div>

            {/* Smaller, high-density photo grid (2-6 cols) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
              {currentFilteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo, currentFilteredPhotos)}
                  className="group relative aspect-square sm:aspect-[4/3] rounded-sm overflow-hidden bg-[#11131a] cursor-pointer border border-white/10 hover:border-[#d4af37] transition-all duration-200 hover:shadow-lg hover:shadow-black/60"
                  title={`${photo.title} — Zum Vergrößern klicken`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    loading="lazy"
                    onError={() => handleImageError(photo.id, photo.imageUrl)}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-300 brightness-90 group-hover:brightness-105"
                  />

                  {/* Best-Badge if marked */}
                  {photo.isBest && (
                    <div className="absolute top-1.5 left-1.5 z-10 bg-black/70 backdrop-blur-sm border border-[#d4af37]/40 px-1.5 py-0.5 rounded text-[9px] font-semibold text-[#d4af37] flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Beste
                    </div>
                  )}

                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5">
                    <div className="flex justify-end">
                      <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                        <ZoomIn className="w-3.5 h-3.5 text-[#d4af37]" />
                      </span>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#d4af37] font-mono truncate">
                        {photo.category}
                      </p>
                      <h4 className="font-display text-xs font-bold text-white truncate leading-tight mt-0.5">
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-neutral-300 font-light truncate">
                        {photo.vehicle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
