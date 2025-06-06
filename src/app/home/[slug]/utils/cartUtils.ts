import { toast } from "react-toastify";
import { FoodItem, CartItem, Vendor } from "../types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const checkItemAvailability = async (
  item: FoodItem,
  currentVendorId: string | null,
  categories: { retail: string[]; produce: string[] }
): Promise<{ isAvailable: boolean; vendors: Vendor[] | undefined }> => {
  try {
    console.log('=== Starting Availability Check ===');
    console.log('Item:', {
      id: item.id,
      type: item.type,
      category: item.category,
      title: item.title
    });
    
    const response = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch vendors for item ${item.id}:`, await response.text());
      return { isAvailable: false, vendors: undefined };
    }

    const vendors = await response.json();
    console.log('Raw vendor response:', vendors);

    if (!vendors || vendors.length === 0) {
      console.log('❌ No vendors found in response');
      return { isAvailable: false, vendors: undefined };
    }

    // Filter out vendors where the item is not available
    const availableVendors = vendors.filter((vendor: Vendor) => {
      console.log(`\nChecking vendor ${vendor._id}:`, vendor);
      
      if (!vendor.inventoryValue) {
        console.log(`❌ Vendor ${vendor._id} has no inventoryValue`);
        return false;
      }

      // Check if the item is retail based on its category
      const isRetail = categories.retail.includes(item.category);
      console.log(`Item category: ${item.category}`);
      console.log(`Is retail item: ${isRetail}`);

      if (isRetail) {
        // For retail items, check quantity from inventoryValue
        const quantity = vendor.inventoryValue.quantity;
        console.log(`Retail item - Vendor ${vendor._id} quantity:`, quantity);
        // Check if quantity exists and is greater than 0
        const isAvailable = typeof quantity === "number" && quantity > 0;
        console.log(`Retail item - Vendor ${vendor._id} is available:`, isAvailable);
        return isAvailable;
      } else {
        // For produce items, check isAvailable from inventoryValue
        const isAvailable = vendor.inventoryValue.isAvailable === "Y";
        console.log(`Produce item - Vendor ${vendor._id} isAvailable:`, vendor.inventoryValue.isAvailable);
        console.log(`Produce item - Vendor ${vendor._id} is available:`, isAvailable);
        return isAvailable;
      }
    });

    console.log('\n=== Availability Check Results ===');
    console.log('Total vendors:', vendors.length);
    console.log('Available vendors:', availableVendors.length);
    console.log('Available vendors details:', availableVendors);

    // If currentVendorId is provided, check if that vendor is available
    if (currentVendorId) {
      const currentVendor = availableVendors.find(
        (v: Vendor) => v._id === currentVendorId
      );
      console.log('Current vendor check:', {
        currentVendorId,
        found: !!currentVendor,
        vendor: currentVendor
      });
      return {
        isAvailable: !!currentVendor,
        vendors: currentVendor ? [currentVendor] : undefined,
      };
    }

    // Return all available vendors if no currentVendorId is provided
    console.log('✅ Found available vendors');
    return { isAvailable: true, vendors: availableVendors };
  } catch (error) {
    console.error("Error checking item availability:", error);
    return { isAvailable: false, vendors: undefined };
  }
};

export const addToCart = async (
  userId: string,
  item: FoodItem,
  vendorId: string
): Promise<boolean> => {
  try {
    const kind = item.type === "retail" ? "Retail" : "Produce";
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

export const increaseQuantity = async (
  userId: string,
  item: FoodItem
): Promise<boolean> => {
  try {
    const kind = item.type === "retail" ? "Retail" : "Produce";
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

export const decreaseQuantity = async (
  userId: string,
  item: FoodItem
): Promise<boolean> => {
  try {
    const kind = item.type === "retail" ? "Retail" : "Produce";
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

export const fetchCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/${userId}`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    return data.cart || [];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}; 