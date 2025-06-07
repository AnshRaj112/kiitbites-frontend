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

      console.log('Adding to cart:', { userId, item, vendorId });

      const response = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          kind: item.type === 'retail' ? 'Retail' : 'Produce',
          vendorId: vendorId,
          quantity: 1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
        throw new Error('Failed to increase quantity');
      }

      await refreshSearchCart();
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
        throw new Error('Failed to decrease quantity');
      }

      await refreshSearchCart();
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