export interface Ad {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  imageUrl: string;
  galleryImages?: string[];
  category: string;
  subcategory?: string;
  categoryId?: string;
  subcategoryId?: string;
  userId: number;
  date: string;
  views?: number;
  isFavorite?: boolean;
}

export interface ApiAd {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  isActive: boolean;
  imagesIds: string[];
  cost: number;
  userId: number; 
}

export interface ApiAdDetail {
  id: string;
  name: string;
  description: string;
  cost: number;
  location: string;
  created: string;
  imagesIds: string[];
  category: {
    id: string;
    name: string;
  };
  userId: number; 
}

export interface ImageResponse {
  id: string;
  url?: string; 
  fileName?: string;
}

export interface GalleryImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
}
 
export interface CreateAdRequest {
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[]; 
  imageUrl?: string; 
  category: string;
  subcategory?: string;
  userId: number;
}
export interface CategoryItem {
  id: number;
  name: string;
  children?: CategoryItem[];
}

export interface AdFormData {
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  categoryPath: string[];
}

export interface DropdownState {
  category: boolean;
  subcategory: boolean;
}
