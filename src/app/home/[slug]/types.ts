export interface FoodItem {
  id: string;
  title: string;
  image: string;
  category: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
  price: number;
  vendorId?: string;
}

export interface FavoriteItem {
  _id: string;
  name: string;
  type: string;
  uniId: string;
  price: number;
  image: string;
  isSpecial: string;
  kind: string;
  vendorId: string;
}

export interface CartItem {
  _id: string;
  itemId: string;
  quantity: number;
  kind: string;
  vendorId: string;
  vendorName: string;
}

export interface Vendor {
  _id: string;
  name: string;
  price: number;
  quantity?: number;
  isAvailable?: string;
  inventoryValue?: {
    price: number;
    quantity?: number;
    isAvailable?: string;
  };
}

export interface College {
  _id: string;
  name: string;
}

export interface ApiFavoritesResponse {
  favourites: FavoriteItem[];
}

export interface ApiItem {
  _id: string;
  name: string;
  image: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
  category?: string;
  price: number;
} 