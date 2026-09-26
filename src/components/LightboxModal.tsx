import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { PhotoItem } from '../types';

interface LightboxModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  isOpen,
  onClose,
  onSelectPhoto,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!isOpen || !photo) return;
    setIsZoomed(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'z' || e.key === 'Z') setIsZoomed((prev) => !prev);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, photo]);

  if (!isOpen || !photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const total = photos.length;

  const handleNext = () => {
    if (currentIndex < total - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[total - 1]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
        <span className="text-xs uppercase tracking-widest text-neutral-400">
          {currentIndex + 1} / {total} — {photo.title}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 text-neutral-300 hover:text-white"
            title="Zoom (Z)"
            aria-label="Zoom"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-neutral-300 hover:text-white"
            aria-label="Schließen (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Prev */}
      <button
        onClick={handlePrev}
        className="absolute left-4 z-20 p-2 text-neutral-400 hover:text-white transition-colors"
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Center Image */}
      <div
        className={`w-full h-full flex items-center justify-center p-6 sm:p-14 ${
          isZoomed ? 'cursor-zoom-out overflow-auto' : 'cursor-zoom-in'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className={`max-w-full max-h-[85vh] object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
        />
      </div>

      {/* Next */}
      <button
        onClick={handleNext}
        className="absolute right-4 z-20 p-2 text-neutral-400 hover:text-white transition-colors"
        aria-label="Nächstes Bild"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Bottom label */}
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center text-xs text-neutral-400">
        <span>{photo.vehicle}</span> • <span>Foto: {photo.photographer}</span>
      </div>
    </div>
  );
};
