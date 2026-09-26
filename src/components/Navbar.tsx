import React, { useState } from 'react';
import { Menu, X, Instagram } from 'lucide-react';

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Galerie', id: 'galerie' },
    { label: 'Über uns', id: 'ueber-uns' },
    { label: 'Kontakt', id: 'kontakt' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08090d]/85 backdrop-blur-md border-b border-white/5 py-4 sm:py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-left group focus:outline-none"
        >
          <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-white">
            SOL <span className="text-[#d4af37] font-light">&</span> ILAY
          </span>
          <span className="block text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Shoot my Car
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className="text-xs uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}

          {/* Insta Links */}
          <div className="flex items-center space-x-3 text-xs text-neutral-400 pl-2 border-l border-white/10">
            <a
              href="https://www.instagram.com/sol__krause/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              title="Sol auf Instagram"
            >
              <Instagram className="w-3 h-3 text-[#d4af37]" />
              <span>@sol__krause</span>
            </a>
            <span className="text-neutral-600">•</span>
            <a
              href="https://www.instagram.com/nyanda_ilay/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              title="Ilay auf Instagram"
            >
              <Instagram className="w-3 h-3 text-[#d4af37]" />
              <span>@nyanda_ilay</span>
            </a>
          </div>

          <button
            onClick={() => onScrollTo('kontakt')}
            className="px-4 py-2 text-xs uppercase tracking-widest font-semibold bg-[#d4af37] hover:bg-[#e5be48] text-[#08090d] rounded-sm transition-all"
          >
            Anfragen
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-neutral-300 hover:text-white p-1"
          aria-label="Menü"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#08090d] border-b border-white/10 px-6 py-5 flex flex-col space-y-4 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileOpen(false);
                onScrollTo(item.id);
              }}
              className="text-left text-sm uppercase tracking-wider text-neutral-200 hover:text-[#d4af37]"
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2 text-xs text-neutral-400">
            <a
              href="https://www.instagram.com/sol__krause/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2"
            >
              <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sol: @sol__krause</span>
            </a>
            <a
              href="https://www.instagram.com/nyanda_ilay/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2"
            >
              <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ilay: @nyanda_ilay</span>
            </a>
          </div>

          <button
            onClick={() => {
              setMobileOpen(false);
              onScrollTo('kontakt');
            }}
            className="w-full text-center py-2.5 text-xs uppercase tracking-widest font-bold bg-[#d4af37] text-[#08090d] rounded-sm"
          >
            Anfragen
          </button>
        </div>
      )}
    </header>
  );
};
