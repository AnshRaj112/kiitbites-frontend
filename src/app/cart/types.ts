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
  itemId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    kind: string;
  };
  quantity: number;
  kind: string;
  name: string;
  price: number;
  image: string;
  vendorName: string;
  vendorId: string;
  category: "Retail" | "Produce";
}

export type OrderType = "takeaway" | "delivery" | "dinein";

export interface OrderData {
  orderType: OrderType;
  collectorName: string;
  collectorPhone: string;
  address?: string;
}
