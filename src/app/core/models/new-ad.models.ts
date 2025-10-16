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