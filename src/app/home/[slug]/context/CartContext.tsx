import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, FoodItem, Vendor } from '../types';
import { fetchCartItems, addToCart, increaseQuantity, decreaseQuantity } from '../utils/cartUtils';
import { toast } from 'react-toastify';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addItemToCart: (item: FoodItem, vendor: Vendor) => Promise<void>;
  increaseItemQuantity: (item: FoodItem) => Promise<void>;
  decreaseItemQuantity: (item: FoodItem) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const items = await fetchCartItems(userId);
      setCartItems(items);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      toast.error('Failed to refresh cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshCart();
    }
  }, [userId]);

  const addItemToCart = async (item: FoodItem, vendor: Vendor) => {
    if (!userId) return;

    try {
      setLoading(true);
      const success = await addToCart(userId, item, vendor._id);
      if (success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const increaseItemQuantity = async (item: FoodItem) => {
    if (!userId || !item.vendorId) return;

    try {
      setLoading(true);
      const success = await increaseQuantity(userId, item);
      if (success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      toast.error('Failed to increase quantity');
    } finally {
      setLoading(false);
    }
  };

  const decreaseItemQuantity = async (item: FoodItem) => {
    if (!userId || !item.vendorId) return;

    try {
      setLoading(true);
      const success = await decreaseQuantity(userId, item);
      if (success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      toast.error('Failed to decrease quantity');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    loading,
    addItemToCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 