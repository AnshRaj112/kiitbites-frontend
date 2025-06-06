import { FavoriteItem, Vendor } from "../types";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const checkFavoriteItemAvailability = async (
  item: FavoriteItem,
  currentVendorId: string | null,
  categories: { retail: string[]; produce: string[] }
): Promise<{ isAvailable: boolean; vendors: Vendor[] | undefined }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return { isAvailable: false, vendors: undefined };
    }

    const userRes = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) {
      toast.error("Please login to add items to cart");
      return { isAvailable: false, vendors: undefined };
    }
    const userId = (await userRes.json())._id;

    const [vendorRes, favRes] = await Promise.all([
      fetch(`${BACKEND_URL}/items/vendors/${item._id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BACKEND_URL}/fav/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!vendorRes.ok || !favRes.ok) {
      return { isAvailable: false, vendors: undefined };
    }

    const allVendors: Vendor[] = await vendorRes.json();
    const userFavorites: FavoriteItem[] = (await favRes.json()).favourites || [];

    const favoriteVendorSet = new Set(
      userFavorites
        .filter((fav) => fav._id === item._id)
        .map((fav) => fav.vendorId)
    );

    const isRetail = item.kind.toLowerCase() === "retail" || categories.retail.includes(item.kind.toLowerCase());

    const availableVendors = allVendors.filter((vendor) => {
      if (!favoriteVendorSet.has(vendor._id) || !vendor.inventoryValue) return false;

      if (isRetail) {
        return typeof vendor.inventoryValue.quantity === "number" && vendor.inventoryValue.quantity > 0;
      } else {
        return vendor.inventoryValue.isAvailable === "Y";
      }
    });

    if (currentVendorId) {
      const currentVendor = availableVendors.find((v) => v._id === currentVendorId);
      return {
        isAvailable: !!currentVendor,
        vendors: currentVendor ? [currentVendor] : undefined,
      };
    }

    return {
      isAvailable: availableVendors.length > 0,
      vendors: availableVendors.length > 0 ? availableVendors : undefined,
    };
  } catch {
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return false;
    }

    if (!vendorId) {
      toast.error("Please select a vendor first");
      return false;
    }

    const isRetail = item.kind.toLowerCase() === "retail" || categories.retail.includes(item.kind.toLowerCase());

    const requestData = {
      itemId: item._id,
      kind: isRetail ? "Retail" : "Produce",
      quantity: 1,
      vendorId,
    };

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
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to add item to cart");
    }

    toast.success(`${item.name} added to cart!`);
    return true;
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to add item to cart"
    );
    return false;
  }
};
