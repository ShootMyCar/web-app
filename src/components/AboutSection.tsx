import React from 'react';
import { Instagram } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="ueber-uns" className="py-24 sm:py-32 bg-[#08090d] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-3">
          Über uns
        </span>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase mb-8">
          Wer wir sind
        </h2>

        <div className="space-y-6 text-neutral-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
          <p>
            Wir sind <strong className="text-white font-medium">Sol</strong> und <strong className="text-white font-medium">Ilay</strong> — zwei Fotografen mit Benzin im Blut. Für uns ist ein Auto kein reines Fortbewegungsmittel, sondern eine Skulptur aus Aerodynamik, Kraft und Emotion.
          </p>
          <p>
            Während <strong className="text-white font-medium">Sol</strong> die pure Dynamik in synchronen Car-to-Car Rollershots auf Asphalt bannt, perfektioniert <strong className="text-white font-medium">Ilay</strong> die Lichtführung auf Kanten, Carbon-Texturen und im Studio. Gemeinsam liefern wir Bilder, die den wahren Charakter deines Fahrzeugs festhalten.
          </p>
        </div>

        {/* Instagram Profiles */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-4">
          <a
            href="https://www.instagram.com/sol__krause/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#11131a] border border-white/10 hover:border-[#d4af37]/60 text-neutral-300 hover:text-white transition-all text-xs"
          >
            <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Sol: <strong className="text-white font-medium">@sol__krause</strong></span>
          </a>
          <a
            href="https://www.instagram.com/nyanda_ilay/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#11131a] border border-white/10 hover:border-[#d4af37]/60 text-neutral-300 hover:text-white transition-all text-xs"
          >
            <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Ilay: <strong className="text-white font-medium">@nyanda_ilay</strong></span>
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-xs uppercase tracking-widest text-neutral-400">
          <span>Rollershots</span>
          <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
          <span>Events & Trackdays</span>
          <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
          <span>Detailaufnahmen</span>
        </div>

      </div>
    </section>
  );
};
