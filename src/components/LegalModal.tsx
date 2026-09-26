import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'impressum' | 'datenschutz' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#12141c] border border-white/10 rounded-sm p-6 sm:p-8 text-neutral-300 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'impressum' ? (
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] mb-2 text-xs uppercase tracking-widest font-bold">
              <FileText className="w-4 h-4" />
              <span>Rechtliche Angaben</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-6">
              Impressum
            </h3>

            <div className="space-y-4 text-xs sm:text-sm font-light leading-relaxed">
              <p>
                <strong className="text-white font-medium">Angaben gemäß § 5 TMG:</strong><br />
                Sol & Ilay Photography GbR<br />
                Shoot My Car — Automotive Visuals<br />
                Musterstraße 42<br />
                80331 München, Deutschland
              </p>

              <p>
                <strong className="text-white font-medium">Vertreten durch:</strong><br />
                Sol & Ilay
              </p>

              <p>
                <strong className="text-white font-medium">Kontakt:</strong><br />
                E-Mail: enrique.gil.rft@gmail.com<br />
                Instagram: @sol__krause & @nyanda_ilay
              </p>

              <p>
                <strong className="text-white font-medium">Umsatzsteuer-ID:</strong><br />
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE 999 888 777 (Platzhalter)
              </p>

              <p>
                <strong className="text-white font-medium">Urheberrecht:</strong><br />
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] mb-2 text-xs uppercase tracking-widest font-bold">
              <Shield className="w-4 h-4" />
              <span>Datenschutzhinweise</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-6">
              Datenschutzerklärung
            </h3>

            <div className="space-y-4 text-xs sm:text-sm font-light leading-relaxed">
              <p>
                <strong className="text-white font-medium">1. Datenschutz auf einen Blick:</strong><br />
                Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Wir behandeln deine personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO).
              </p>

              <p>
                <strong className="text-white font-medium">2. Datenerfassung auf dieser Website:</strong><br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Wenn du uns über das Kontaktformular Anfragen zukommen lässt, werden deine Angaben aus dem Anfrageformular inklusive der von dir dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              </p>

              <p>
                <strong className="text-white font-medium">3. Fotorechte & Kennzeichen:</strong><br />
                Bei privaten Shootings werden Kennzeichen auf Wunsch in der finalen Bildabgabe retuschiert oder unkenntlich gemacht. Eine Veröffentlichung auf unseren Social-Media-Kanälen erfolgt stets nur nach vorheriger Absprache mit dem Fahrzeughalter.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-[#d4af37] text-[#08090d] text-xs font-bold uppercase tracking-wider hover:bg-[#e5be48] transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
