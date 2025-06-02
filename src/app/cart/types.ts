export interface FoodItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  kind?: string;
}

export interface CartItem extends FoodItem {
  _id: string; // cart item ID
  userId: string;
  foodcourtId: string;
  itemId: FoodItem; // food item details nested
  quantity: number;
  kind?: string;
}
