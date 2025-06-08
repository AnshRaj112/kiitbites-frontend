"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { SearchResult } from '../SearchBar';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface CartItemResponse {
  itemId: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
  kind: string;
  totalPrice: number;
}

interface SearchCartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  category: string;
  isSpecial: boolean;
  vendorId: string;
  quantity: number;
}

interface SearchCartContextType {
  searchCartItems: SearchCartItem[];
  addToSearchCart: (userId: string, item: SearchResult, vendorId: string) => Promise<void>;
  increaseSearchCartQuantity: (userId: string, itemId: string) => Promise<void>;
  decreaseSearchCartQuantity: (userId: string, itemId: string) => Promise<void>;
  refreshSearchCart: () => Promise<void>;
}

const SearchCartContext = createContext<SearchCartContextType | undefined>(undefined);

export const useSearchCart = () => {
  const context = useContext(SearchCartContext);
  if (!context) {
    throw new Error('useSearchCart must be used within a SearchCartProvider');
  }
  return context;
};

interface SearchCartProviderProps {
  children: React.ReactNode;
}

export const SearchCartProvider = ({ children }: SearchCartProviderProps) => {
  const [searchCartItems, setSearchCartItems] = useState<SearchCartItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getUserId = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      const user = await response.json();
      return user._id;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  const refreshSearchCart = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const userId = await getUserId();
      if (!userId) {
        throw new Error('Failed to get user ID');
      }

      const response = await fetch(`${BACKEND_URL}/cart/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      // Transform the cart items to match our search cart structure
      const transformedItems = data.cart.map((item: CartItemResponse) => ({
        id: item.itemId,
        name: item.name,
        price: item.price,
        image: item.image,
        type: item.kind.toLowerCase(),
        category: item.kind,
        isSpecial: false,
        vendorId: data.vendorId,
        quantity: item.quantity
      }));
      setSearchCartItems(transformedItems);
    } catch (error) {
      console.error('Error refreshing search cart:', error);
      toast.error('Failed to refresh cart');
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Only refresh cart on mount
  useEffect(() => {
    refreshSearchCart();
  }, []); // Empty dependency array means it only runs once on mount

  const addToSearchCart = async (userId: string, item: SearchResult, vendorId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      // Validate required fields
      if (!userId) {
        throw new Error('User ID is required');
      }
      if (!vendorId) {
        throw new Error('Vendor ID is required');
      }

      // Log the full item for debugging
      console.log('Full item data:', item);

      // Try to get the item ID in order of preference
      const itemId = item._id || item.id || item.itemId;
      if (!itemId) {
        console.error('Item missing all possible ID fields:', item);
        throw new Error('Item ID is missing');
      }

      // Determine the kind based on the item's type
      let kind;
      if (item.type === 'retail' || item.type === 'produce') {
        kind = item.type.charAt(0).toUpperCase() + item.type.slice(1);
      } else {
        // For other types like 'biscuits', treat them as retail items
        kind = 'Retail';
      }

      const requestData = {
        itemId: itemId,
        kind: kind,
        vendorId: vendorId,
        quantity: 1
      };

      console.log('Sending cart request:', {
        url: `${BACKEND_URL}/cart/add/${userId}`,
        data: requestData
      });

      const response = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cart addition failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      await refreshSearchCart();
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to search cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart');
      throw error;
    }
  };

  const increaseSearchCartQuantity = async (userId: string, itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Find the item in the cart to get its type
      const item = searchCartItems.find(item => item.id === itemId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      const response = await fetch(`${BACKEND_URL}/cart/add-one/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          itemId,
          kind: item.type === 'retail' ? 'Retail' : 'Produce'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes('maximum quantity')) {
          toast.info('Maximum quantity reached for this item');
          return;
        }
        throw new Error(errorData.message || 'Failed to increase quantity');
      }

      await refreshSearchCart();
      toast.success('Quantity increased');
    } catch (error) {
      console.error('Error increasing quantity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to increase quantity');
    }
  };

  const decreaseSearchCartQuantity = async (userId: string, itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Find the item in the cart to get its type
      const item = searchCartItems.find(item => item.id === itemId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      const response = await fetch(`${BACKEND_URL}/cart/remove-one/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          itemId,
          kind: item.type === 'retail' ? 'Retail' : 'Produce'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes('minimum quantity')) {
          toast.info('Minimum quantity reached');
          return;
        }
        throw new Error(errorData.message || 'Failed to decrease quantity');
      }

      await refreshSearchCart();
      toast.info('Quantity decreased');
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to decrease quantity');
    }
  };

  return (
    <SearchCartContext.Provider
      value={{
        searchCartItems,
        addToSearchCart,
        increaseSearchCartQuantity,
        decreaseSearchCartQuantity,
        refreshSearchCart,
      }}
    >
      {children}
    </SearchCartContext.Provider>
  );
}; 