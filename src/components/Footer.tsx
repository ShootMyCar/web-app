import React from 'react';
import { Instagram, Mail } from 'lucide-react';

interface FooterProps {
  onOpenImpressum: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenImpressum }) => {
  return (
    <footer className="bg-[#050608] border-t border-white/5 py-12 text-neutral-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Copyright */}
        <div className="text-center sm:text-left">
          <p className="font-display font-bold text-sm text-white tracking-wider">
            SOL <span className="text-[#d4af37] font-light">&</span> ILAY
          </p>
          <p className="mt-1 text-neutral-500">
            © {new Date().getFullYear()} Shoot my Car. Alle Rechte vorbehalten.
          </p>
        </div>

        {/* Links & Socials */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="https://www.instagram.com/sol__krause/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>@sol__krause</span>
          </a>

          <a
            href="https://www.instagram.com/nyanda_ilay/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>@nyanda_ilay</span>
          </a>

          <a
            href="mailto:enrique.gil.rft@gmail.com"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>E-Mail</span>
          </a>

          <button
            onClick={onOpenImpressum}
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Impressum
          </button>
        </div>

      </div>
    </footer>
  );
};
