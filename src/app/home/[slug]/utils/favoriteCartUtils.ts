import { FavoriteItem, Vendor } from "../types";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const checkFavoriteItemAvailability = async (
  item: FavoriteItem,
  currentVendorId: string | null,
  categories: { retail: string[]; produce: string[] }
): Promise<{ isAvailable: boolean; vendors: Vendor[] | undefined }> => {
  try {
    console.log('=== Starting Favorite Item Availability Check ===');
    console.log('Favorite Item:', {
      id: item._id,
      type: item.type,
      kind: item.kind,
      name: item.name
    });

    // Get user details from API
    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No token found');
      toast.error("Please login to add items to cart");
      return { isAvailable: false, vendors: undefined };
    }

    const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user details');
      toast.error("Please login to add items to cart");
      return { isAvailable: false, vendors: undefined };
    }

    const userData = await userResponse.json();
    const userId = userData._id;

    // Get all vendors for the item first
    const response = await fetch(`${BACKEND_URL}/items/vendors/${item._id}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch vendors for favorite item ${item._id}:`, await response.text());
      return { isAvailable: false, vendors: undefined };
    }

    const allVendors = await response.json();
    console.log('Raw vendor response:', allVendors);

    if (!allVendors || allVendors.length === 0) {
      console.log('❌ No vendors found in response');
      return { isAvailable: false, vendors: undefined };
    }

    // Then get user's favorites
    const favoritesResponse = await fetch(`${BACKEND_URL}/fav/${userId}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!favoritesResponse.ok) {
      console.error('Failed to fetch user favorites');
      return { isAvailable: false, vendors: undefined };
    }

    const favoritesData = await favoritesResponse.json();
    const userFavorites = favoritesData.favourites || [];

    console.log('User favorites:', userFavorites);

    // Filter vendors to only include those where the item is favorited
    const favoriteVendors = allVendors.filter((vendor: Vendor) => {
      // Check if this vendor has the item in favorites
      const isFavoriteVendor = userFavorites.some((fav: FavoriteItem) => {
        const isMatch = fav._id === item._id && fav.vendorId === vendor._id;
        console.log(`Checking favorite match:`, {
          favoriteId: fav._id,
          itemId: item._id,
          favoriteVendorId: fav.vendorId,
          vendorId: vendor._id,
          isMatch
        });
        return isMatch;
      });

      console.log(`Vendor ${vendor._id} is favorite:`, isFavoriteVendor);
      return isFavoriteVendor;
    });

    console.log('Favorite vendors:', favoriteVendors);

    if (favoriteVendors.length === 0) {
      console.log('❌ No favorite vendors found for this item');
      return { isAvailable: false, vendors: undefined };
    }

    // Filter out vendors where the item is not available
    const availableVendors = favoriteVendors.filter((vendor: Vendor) => {
      console.log(`\nChecking vendor ${vendor._id}:`, vendor);
      
      if (!vendor.inventoryValue) {
        console.log(`❌ Vendor ${vendor._id} has no inventoryValue`);
        return false;
      }

      // Check if the item is retail based on its category
      const isRetail = item.kind.toLowerCase() === "retail" || categories.retail.includes(item.kind.toLowerCase());
      console.log(`Item kind: ${item.kind}`);
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
    console.log('Total favorite vendors:', favoriteVendors.length);
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
    return { 
      isAvailable: availableVendors.length > 0, 
      vendors: availableVendors.length > 0 ? availableVendors : undefined 
    };
  } catch (error) {
    console.error("Error checking favorite item availability:", error);
    return { isAvailable: false, vendors: undefined };
  }
};

export const addFavoriteToCart = async (
  userId: string,
  item: FavoriteItem,
  vendorId: string,
  categories: { retail: string[]; produce: string[] }
): Promise<boolean> => {
  try {
    console.log('=== Adding Favorite Item to Cart ===');
    console.log('Item:', {
      id: item._id,
      name: item.name,
      vendorId: vendorId
    });

    if (!vendorId) {
      console.error('No vendor ID provided');
      toast.error("Please select a vendor first");
      return false;
    }

    // Determine if the item is retail based on its kind
    const isRetail = item.kind.toLowerCase() === "retail" || categories.retail.includes(item.kind.toLowerCase());
    const kind = isRetail ? "Retail" : "Produce";
    
    const requestData = {
      itemId: item._id,
      kind: kind,
      quantity: 1,
      vendorId: vendorId,
    };
    
    console.log('Cart request data:', requestData);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No token found');
      toast.error("Please login to add items to cart");
      return false;
    }

    const response = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    console.log('Cart add response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to add item to cart");
    }

    console.log('✅ Item added to cart successfully');
    toast.success(`${item.name} added to cart!`);
    return true;
  } catch (error) {
    console.error("Error adding favorite to cart:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to add item to cart"
    );
    return false;
  }
}; 