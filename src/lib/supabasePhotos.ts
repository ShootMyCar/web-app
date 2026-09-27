import { PhotoItem } from '../types';
import { supabase, SUPABASE_URL, SUPABASE_KEY } from './supabase';

export { SUPABASE_URL, SUPABASE_KEY };

// Toleranter Kategorie-Parser für Rollershots, Details und Events
export function parseCategory(rawCat: any): 'rollershots' | 'events' | 'details' {
  if (!rawCat) return 'rollershots';
  const c = String(rawCat).toLowerCase().trim();
  if (c.includes('detail') || c.includes('macro') || c.includes('innen') || c.includes('motor')) return 'details';
  if (c.includes('event') || c.includes('treff') || c.includes('meet') || c.includes('track') || c.includes('messe')) return 'events';
  if (c.includes('roll') || c.includes('drive') || c.includes('action')) return 'rollershots';
  return 'rollershots';
}

/**
 * Normalisiert Bild-URLs für Supabase Storage und externe URLs
 */
export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const clean = String(rawUrl).trim().replace(/(NFÜGEN|EINFÜGEN)$/i, '');
  if (!clean) return '';

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    try {
      return encodeURI(decodeURI(clean));
    } catch {
      return clean;
    }
  }

  if (clean.startsWith('/storage/')) {
    return `${SUPABASE_URL}${clean}`;
  }
  if (clean.startsWith('storage/')) {
    return `${SUPABASE_URL}/${clean}`;
  }

  // Falls nur der Dateiname (z.B. car_123.jpg) gespeichert wurde
  return `${SUPABASE_URL}/storage/v1/object/public/Car/${encodeURIComponent(clean)}`;
}

/**
 * Reines Read-Only Frontend: Lädt live die Fotos aus der Supabase-Datenbank
 * UND gleicht optional mit dem Car-Storage-Bucket ab, damit kein hochgeladenes Bild verloren geht.
 */
export async function fetchAllGalleryPhotos(): Promise<PhotoItem[]> {
  const photos: PhotoItem[] = [];
  const knownImageUrls = new Set<string>();

  // 1. Primär: Tabelle `photos` aus Supabase abrufen
  let dbData: any[] | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        dbData = data;
      }
    } catch (err) {
      console.warn('Supabase-Client Abruf fehlgeschlagen, versuche REST-Fallback:', err);
    }
  }

  // REST-Fallback falls Supabase-Client fehlschlug
  if (!dbData) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/photos?select=*&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          dbData = json;
        }
      }
    } catch (restErr) {
      console.error('REST photos fetch error:', restErr);
    }
  }

  // Verarbeite Datenbankzeilen
  if (dbData && Array.isArray(dbData)) {
    for (const item of dbData) {
      const rawUrl = item.image_url || item.imageUrl || item.url || item.image || item.photo_url || '';
      const finalUrl = normalizeImageUrl(rawUrl);
      if (!finalUrl) continue;

      // Duplicate-Tracking
      const urlLower = finalUrl.toLowerCase();
      knownImageUrls.add(urlLower);
      const filename = finalUrl.split('/').pop()?.toLowerCase();
      if (filename) knownImageUrls.add(filename);

      const category = parseCategory(item.category);
      const isBest = Boolean(
        item.is_best === true ||
        item.best === true ||
        item.is_featured === true ||
        item.featured === true ||
        item.highlight === true ||
        String(item.category).toLowerCase().includes('best')
      );
      const eventName = item.event_name || item.event || item.eventName || item.event_title || item.meet || undefined;
      const eventDate = item.event_date || item.eventDate || item.date || undefined;

      photos.push({
        id: String(item.id || `photo-${Math.random()}`),
        title: item.title || item.name || 'Automotive Shot',
        vehicle: item.vehicle || item.car || item.model || 'Sol & Ilay Feature',
        category,
        imageUrl: finalUrl,
        photographer: item.photographer || 'Sol & Ilay',
        location: item.location || '',
        specs: item.specs || '',
        isBest,
        eventName,
        eventDate,
      });
    }
  }

  // 2. Sekundär: Car-Storage-Bucket scannen für etwaige Uploads, die noch nicht in der Tabelle sind
  try {
    let bucketFiles: any[] | null = null;
    if (supabase) {
      const { data } = await supabase.storage.from('Car').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      bucketFiles = data;
    } else {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/Car`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prefix: '', limit: 100, sortBy: { column: 'created_at', order: 'desc' } }),
      });
      if (res.ok) {
        bucketFiles = await res.json();
      }
    }

    if (bucketFiles && Array.isArray(bucketFiles)) {
      for (const file of bucketFiles) {
        if (!file.name || file.name.startsWith('.')) continue;
        const lower = file.name.toLowerCase();
        // Überspringe, wenn bereits in DB vorhanden
        if (knownImageUrls.has(lower)) continue;

        const isImage = /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name);
        if (!isImage) continue;

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/Car/${encodeURIComponent(file.name)}`;
        knownImageUrls.add(lower);

        // Sauberen Titel aus dem Dateinamen erzeugen
        const cleanTitle = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/^car_\d+_?/, '')
          .replace(/[-_]/g, ' ')
          .trim() || 'Automotive Feature';

        photos.push({
          id: `storage-${file.id || file.name}`,
          title: cleanTitle,
          vehicle: 'Sol & Ilay Car',
          category: 'rollershots',
          imageUrl: publicUrl,
          photographer: 'Sol & Ilay',
          location: 'Spot',
          specs: 'High-Res',
        });
      }
    }
  } catch (bucketErr) {
    console.warn('Storage Bucket Scan fehlgeschlagen:', bucketErr);
  }

  return photos;
}
