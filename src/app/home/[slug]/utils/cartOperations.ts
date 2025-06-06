import { FoodItem, CartItem } from "../types";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const addItemToCart = async (
  userId: string,
  item: FoodItem,
  vendorId: string,
  categories: { retail: string[]; produce: string[] }
): Promise<boolean> => {
  try {
    const kind = categories.retail.includes(item.category) ? "Retail" : "Produce";
    
    const response = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemId: item.id,
        kind: kind,
        quantity: 1,
        vendorId: vendorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    toast.success(`${item.title} added to cart!`);
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to add item to cart"
    );
    return false;
  }
};

export const increaseItemQuantity = async (
  userId: string,
  item: FoodItem,
  categories: { retail: string[]; produce: string[] }
): Promise<boolean> => {
  try {
    const kind = categories.retail.includes(item.category) ? "Retail" : "Produce";
    
    const response = await fetch(`${BACKEND_URL}/cart/add-one/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemId: item.id,
        kind: kind,
        vendorId: item.vendorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    toast.success(`Increased quantity of ${item.title}`);
    return true;
  } catch (error) {
    console.error("Error increasing quantity:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to increase quantity"
    );
    return false;
  }
};

export const decreaseItemQuantity = async (
  userId: string,
  item: FoodItem,
  categories: { retail: string[]; produce: string[] }
): Promise<boolean> => {
  try {
    const kind = categories.retail.includes(item.category) ? "Retail" : "Produce";
    
    const response = await fetch(`${BACKEND_URL}/cart/remove-one/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemId: item.id,
        kind: kind,
        vendorId: item.vendorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    toast.info(`Decreased quantity of ${item.title}`);
    return true;
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to decrease quantity"
    );
    return false;
  }
};

export const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/${userId}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return data.cart || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}; 