"use client";
import { useState } from "react";
import { Plus, Minus, Loader2 } from 'lucide-react';
import { useSearchCart } from './context/SearchCartContext';
import styles from './styles/Search.module.scss';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

interface SearchQuantityControlsProps {
  item: {
    id: string;
    name: string;
    type: string;
    vendorId?: string;
  };
  quantity: number;
  onAddToCart: () => void;
}

const SearchQuantityControls: React.FC<SearchQuantityControlsProps> = ({
  item,
  quantity,
  onAddToCart,
}) => {
  const { increaseSearchCartQuantity, decreaseSearchCartQuantity } = useSearchCart();
  const [loading, setLoading] = useState(false);

  const getUserId = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  const handleIncrease = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.vendorId) {
      toast.error('Please select a vendor first');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Please login to modify cart');
        return;
      }
      const userId = await getUserId();
      if (!userId) {
        toast.error('Failed to get user ID');
        return;
      }
      await increaseSearchCartQuantity(userId._id, item.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.vendorId) {
      toast.error('Please select a vendor first');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Please login to modify cart');
        return;
      }
      const userId = await getUserId();
      if (!userId) {
        toast.error('Failed to get user ID');
        return;
      }
      await decreaseSearchCartQuantity(userId._id, item.id);
    } finally {
      setLoading(false);
    }
  };

  if (quantity > 0) {
    return (
      <div className={styles.quantityControls}>
        <button
          className={`${styles.quantityButton} ${quantity === 0 ? styles.disabled : ''}`}
          onClick={handleDecrease}
          disabled={loading || quantity === 0}
        >
          <Minus size={16} />
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          className={styles.quantityButton}
          onClick={handleIncrease}
          disabled={loading}
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${styles.addToCartButton} ${loading ? styles.loading : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onAddToCart();
      }}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className={styles.spinner} size={16} />
          Adding...
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
};

export default SearchQuantityControls; 