export type GalleryCategory = 'best' | 'rollershots' | 'events' | 'details' | 'all';

export type PhotoCategory = 'rollershots' | 'events' | 'details' | 'hintergrund' | 'best';

export interface PhotoItem {
  id: string;
  title: string;
  vehicle: string;
  category: PhotoCategory | string;
  imageUrl: string;
  photographer: string;
  location?: string;
  specs?: string;
  isBest?: boolean;
  eventName?: string;
  eventDate?: string;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  vehicleInfo: string;
  shootingType: string;
  message: string;
}
