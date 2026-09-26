import React from 'react';
import { ChevronDown } from 'lucide-react';
import defaultHeroImage from '../assets/hero-lamborghini.jpg';

interface HeroProps {
  onExploreGallery: () => void;
  onOpenBooking: () => void;
  backgroundImage?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreGallery, 
  onOpenBooking, 
  backgroundImage = defaultHeroImage 
}) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [backgroundImage]);

  const activeImage = (!imgError && backgroundImage) ? backgroundImage : defaultHeroImage;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#08090d] text-center px-4 overflow-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeImage}
          alt="Sol & Ilay Photography Lamborghini Murciélago"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_55%] brightness-[0.46] contrast-[1.08] saturate-[1.05] transition-all duration-700 scale-[1.01]"
        />
        {/* Subtle radial vignette & dark contrast gradients so text stays razor sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/75 via-transparent to-[#08090d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/45 to-[#08090d]/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold mb-4">
          Automotive Photography
        </p>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-none">
          SOL <span className="text-[#d4af37] font-light">&</span> ILAY
          <span className="block text-xl sm:text-2xl md:text-3xl font-light tracking-[0.35em] text-neutral-300 mt-3 sm:mt-4">
            PHOTOGRAPHY
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 font-light tracking-wide mt-6 max-w-xl">
          Shoot my Car — High-End Automobilfotografie. Dynamische Rollershots, Rennstrecke und skulpturale Details.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 sm:mt-10 w-full sm:w-auto">
          <button
            onClick={onExploreGallery}
            className="w-full sm:w-auto px-7 py-3 text-xs uppercase tracking-widest font-bold bg-[#d4af37] hover:bg-[#e5be48] text-[#08090d] rounded-sm transition-all"
          >
            Galerie ansehen
          </button>
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-7 py-3 text-xs uppercase tracking-widest font-semibold border border-white/20 hover:border-white/50 text-white rounded-sm transition-all"
          >
            Anfragen
          </button>
        </div>
      </div>

      {/* Down indicator */}
      <button
        onClick={onExploreGallery}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-neutral-400 hover:text-white transition-colors"
        aria-label="Nach unten scrollen"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>
    </section>
  );
};
