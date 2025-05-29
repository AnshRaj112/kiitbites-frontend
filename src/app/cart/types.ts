export interface FoodItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}
