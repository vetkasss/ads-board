export interface Ad {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  galleryImages?: string[]; 
  location: string;
  date: string;
  description?: string;
}