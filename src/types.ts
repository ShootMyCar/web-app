export type GalleryCategory = 'all' | 'rollershots' | 'events' | 'details';

export type PhotoCategory = 'rollershots' | 'events' | 'details' | 'hintergrund';

export interface PhotoItem {
  id: string;
  title: string;
  vehicle: string;
  category: PhotoCategory | string;
  imageUrl: string;
  photographer: string;
  location?: string;
  specs?: string;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  vehicleInfo: string;
  shootingType: string;
  message: string;
}
