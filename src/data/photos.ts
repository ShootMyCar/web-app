import { PhotoItem } from '../types';

// Reale Aufnahmen von Sol & Ilay (wird live durch Supabase synchronisiert)
export const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'lambo-hero',
    title: 'Lamborghini Murciélago',
    vehicle: 'Lamborghini Murciélago',
    category: 'details',
    imageUrl: '/assets/hero-lamborghini.jpg',
    photographer: 'Sol & Ilay',
    location: 'Industriegelände',
    specs: 'Scissor Doors Open • Raw Automotive Art',
  },
];
