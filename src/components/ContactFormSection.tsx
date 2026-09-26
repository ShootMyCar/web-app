import React, { useState } from 'react';
import { BookingFormData } from '../types';
import { Send, CheckCircle2, Mail, MessageCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Standard-Empfänger-E-Mail für Anfragen
export const CONTACT_EMAIL = "enrique.gil.rft@gmail.com";

// Formspree-ID / Endpoint für direkte E-Mail-Zustellung
export const FORMSPREE_ENDPOINT = (import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/maendzgw').trim();

interface ExtendedBookingFormData extends BookingFormData {
  phoneOrInsta?: string;
}

export const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState<ExtendedBookingFormData>({
    fullName: '',
    email: '',
    phoneOrInsta: '',
    vehicleInfo: '',
    shootingType: 'Privat',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [useMailtoFallback, setUseMailtoFallback] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Erstellt den formatierten Mail-Text
  const generateMailBody = () => {
    return `Hallo Sol & Ilay,

ich habe eine Anfrage für ein Car-Shooting:

Name: ${formData.fullName}
E-Mail: ${formData.email}
Telefon / Instagram: ${formData.phoneOrInsta || 'Nicht angegeben'}
Fahrzeug: ${formData.vehicleInfo}
Art des Shootings: ${formData.shootingType}

Nachricht / Wünsche:
${formData.message}

Viele Grüße,
${formData.fullName}`;
  };

  // Mailto-Link zum direkten Öffnen im Mailprogramm (z.B. Gmail / Apple Mail / Outlook)
  const getMailtoLink = () => {
    const subject = encodeURIComponent(`Shooting-Anfrage: ${formData.vehicleInfo || 'Car Shooting'} von ${formData.fullName || 'Kunde'}`);
    const body = encodeURIComponent(generateMailBody());
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  // WhatsApp-Link für Direktanfragen
  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hallo Sol & Ilay, ich möchte ein Shooting für mein Fahrzeug anfragen! 🚗📸\n\n` +
      `*Name:* ${formData.fullName || 'Interessent'}\n` +
      `*Fahrzeug:* ${formData.vehicleInfo || 'Mein Auto'}\n` +
      `*Art:* ${formData.shootingType}\n` +
      (formData.message ? `*Nachricht:* ${formData.message}` : '')
    );
    return `https://wa.me/?text=${text}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    // 1. Optional als Backup in Supabase eintragen (Tabelle inquiries/messages falls vorhanden)
    if (supabase) {
      try {
        await supabase.from('inquiries').insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone_or_insta: formData.phoneOrInsta || null,
            vehicle_info: formData.vehicleInfo,
            shooting_type: formData.shootingType,
            message: formData.message,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        // Falls Tabelle in Supabase noch nicht existiert, still ignorieren
        console.info('Supabase-Inquiry Backup nicht aktiv oder Tabelle noch nicht angelegt:', err);
      }
    }

    // 2. Falls Formspree Endpoint eingerichtet ist, direkt per Formspree API absenden
    const endpoint = FORMSPREE_ENDPOINT || (import.meta.env.VITE_FORMSPREE_ENDPOINT as string);

    if (endpoint) {
      try {
        const response = await fetch(endpoint.startsWith('http') ? endpoint : `https://formspree.io/f/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone_or_insta: formData.phoneOrInsta,
            vehicle: formData.vehicleInfo,
            shooting_type: formData.shootingType,
            message: formData.message,
            _replyto: formData.email,
            _subject: `Neue Shooting-Anfrage von ${formData.fullName} (${formData.vehicleInfo})`,
          }),
        });

        if (response.ok) {
          setIsSubmitting(false);
          setSubmitted(true);
          return;
        } else {
          throw new Error('Formspree konnte die Anfrage nicht zustellen.');
        }
      } catch (err) {
        console.warn('Versand via Formspree fehlgeschlagen, öffne Mailto-Option:', err);
        setUseMailtoFallback(true);
      }
    } else {
      // Wenn noch kein Formspree-Key hinterlegt ist: Öffne automatisch den E-Mail-Client oder zeige Mailto-Option
      setUseMailtoFallback(true);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="kontakt" className="py-24 sm:py-32 bg-[#08090d] border-t border-white/5 relative">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-2">
            Buchung & Anfrage
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Kontakt & Shooting anfragen
          </h2>
          <p className="mt-3 text-sm text-neutral-400 font-light max-w-lg mx-auto">
            Schreib uns für ein individuelles Shooting deines Fahrzeugs. Jede Anfrage landet direkt bei uns im Postfach.
          </p>
        </div>

        {/* Direkt-Kontakt Box (Schnelloptionen) */}
        <div className="mb-8 p-4 rounded-sm bg-[#0e1017] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-neutral-300">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-white">Direkte E-Mail Adresse:</p>
              <a 
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-neutral-400 hover:text-[#d4af37] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Shooting-Anfrage`}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-sm border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Mail senden</span>
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-sm border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 rounded-sm bg-[#11131a] border border-white/10 text-center space-y-5 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
            <h3 className="font-display text-2xl font-bold text-white">
              {useMailtoFallback ? 'Anfrage vorbereitet!' : 'Anfrage erfolgreich gesendet!'}
            </h3>
            
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {useMailtoFallback ? (
                <>
                  Vielen Dank, <strong>{formData.fullName}</strong>! Wir haben deine Angaben zum{' '}
                  <strong>{formData.vehicleInfo}</strong> vorgemerkt.
                </>
              ) : (
                <>
                  Vielen Dank, <strong>{formData.fullName}</strong>! Deine Anfrage zum{' '}
                  <strong>{formData.vehicleInfo}</strong> wurde erfolgreich an unser Postfach übermittelt. Wir melden uns in Kürze bei dir!
                </>
              )}
            </p>

            {useMailtoFallback && (
              <div className="p-4 bg-[#181a24] border border-[#d4af37]/30 rounded-sm text-left text-xs space-y-3">
                <div className="flex items-start gap-2 text-[#d4af37]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-medium text-white">
                    Direkte E-Mail-Übertragung:
                  </p>
                </div>
                <p className="text-neutral-300">
                  Klicke unten, um die Anfrage direkt in deinem Mail-Programm (z. B. Gmail, Outlook, Apple Mail) an <strong>{CONTACT_EMAIL}</strong> abzusenden:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={getMailtoLink()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#e5be48] text-[#08090d] font-bold text-xs uppercase tracking-wider rounded-sm transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>In Mail-App öffnen & absenden</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Per WhatsApp senden</span>
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSubmitted(false);
                setUseMailtoFallback(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phoneOrInsta: '',
                  vehicleInfo: '',
                  shootingType: 'Privat',
                  message: '',
                });
              }}
              className="mt-4 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold bg-white/10 hover:bg-white/20 text-white rounded-sm transition-all"
            >
              Weiteres Fahrzeug / Neue Anfrage
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-[#11131a]/60 p-6 sm:p-8 rounded-sm border border-white/5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Dein Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="z. B. Alex Müller"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm bg-[#11131a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              {/* E-Mail */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Deine E-Mail *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="deine-email@beispiel.de"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm bg-[#11131a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Automarke / Modell */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Fahrzeug & Modell *
                </label>
                <input
                  type="text"
                  name="vehicleInfo"
                  required
                  placeholder="z. B. Porsche 911 GT3 RS, BMW M3..."
                  value={formData.vehicleInfo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm bg-[#11131a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              {/* Telefon / Instagram Handle (optional) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Telefon / Instagram (optional)
                </label>
                <input
                  type="text"
                  name="phoneOrInsta"
                  placeholder="z. B. @username oder WhatsApp"
                  value={formData.phoneOrInsta}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm bg-[#11131a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

            {/* Art des Shootings */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Art des Shootings
              </label>
              <select
                name="shootingType"
                value={formData.shootingType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm bg-[#11131a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer"
              >
                <option value="Privat">Privates Shooting (Stills & Rollershots)</option>
                <option value="Rollershots Only">Reine Rollershots (Rolling Rig & Chase Car)</option>
                <option value="Detailaufnahmen">Details & Interior (Makro & Lichtsetup)</option>
                <option value="Event">Event / Trackday / Car Meet</option>
                <option value="Commercial">Commercial / Händler / Verkaufsfotos</option>
              </select>
            </div>

            {/* Nachricht */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Deine Wünsche / Nachricht *
              </label>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="Wo soll das Shooting stattfinden? Besondere Location-Wünsche, Termine oder Details zum Auto..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-sm bg-[#11131a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-y"
              />
            </div>

            {/* Submit Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs uppercase tracking-widest font-bold bg-[#d4af37] hover:bg-[#e5be48] disabled:opacity-50 text-[#08090d] rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#d4af37]/10"
              >
                {isSubmitting ? (
                  <span>Wird übermittelt...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Anfrage per E-Mail absenden</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-1">
                <span>E-Mail geht direkt an: <strong className="text-white">{CONTACT_EMAIL}</strong></span>
                <a
                  href={getMailtoLink()}
                  className="text-[#d4af37] hover:underline flex items-center gap-1"
                >
                  <span>Mail-App öffnen</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
