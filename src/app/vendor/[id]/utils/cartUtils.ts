import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface VendorItem {
  itemId: string;
  name: string;
  type?: string;
  price: number;
  image?: string;
  quantity?: number;
  isAvailable?: string;
}

const getItemKind = (item: VendorItem): "Retail" | "Produce" => {
  // Check if the item is from retailItems or produceItems
  if (item.type === "retail" || item.type === "Retail") {
    return "Retail";
  }
  return "Produce";
};

export const addToCart = async (
  userId: string,
  item: VendorItem,
  vendorId: string
): Promise<boolean> => {
  try {
    const kind = getItemKind(item);
    const response = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemId: item.itemId,
        kind: kind,
        quantity: 1,
        vendorId: vendorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    toast.success(`${item.name} added to cart!`);
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to add item to cart"
    );
    return false;
  }
};

export const increaseQuantity = async (
  userId: string,
  item: VendorItem,
  vendorId: string
): Promise<boolean> => {
  try {
    const kind = getItemKind(item);
    const response = await fetch(`${BACKEND_URL}/cart/add-one/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemId: item.itemId,
        kind: kind,
        vendorId: vendorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    toast.success(`Increased quantity of ${item.name}`);
    return true;
  } catch (error) {
    console.error("Error increasing quantity:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to increase quantity"
    );
    return false;
  }
};

export const decreaseQuantity = async (
  userId: string,
  item: VendorItem,
  vendorId: string
): Promise<boolean> => {
  try {
    const kind = getItemKind(item);
    const response = await fetch(`${BACKEND_URL}/cart/remove-one/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemId: item.itemId,
        kind: kind,
        vendorId: vendorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    toast.success(`Decreased quantity of ${item.name}`);
    return true;
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to decrease quantity"
    );
    return false;
  }
}; 