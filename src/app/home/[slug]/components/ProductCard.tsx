import { useState, useEffect } from 'react';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from '../styles/CollegePage.module.scss';
import { FoodItem, Vendor } from '../types';
import { useCart } from '../context/CartContext';
import VendorModal from './VendorModal';
import { checkItemAvailability } from '../utils/cartUtils';

interface ProductCardProps {
  item: FoodItem;
  categories: { retail: string[]; produce: string[] };
}

const ProductCard = ({ item, categories }: ProductCardProps) => {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  const { cartItems, addItemToCart, increaseItemQuantity, decreaseItemQuantity, refreshCart } = useCart();

  // Find the cart item for this product
  const cartItem = cartItems.find(
    (cartItem) => cartItem.itemId === item.id && cartItem.vendorId === item.vendorId
  );
  const quantity = cartItem?.quantity || 0;

  // Refresh cart when component mounts
  useEffect(() => {
    refreshCart();
  }, []);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const { vendors } = await checkItemAvailability(item, null, categories);
      
      if (!vendors || vendors.length === 0) {
        toast.error('No vendors have this item available');
        return;
      }

      setAvailableVendors(vendors);
      setSelectedVendor(null);
      setShowVendorModal(true);
    } catch (error) {
      console.error('Error checking item availability:', error);
      toast.error('Failed to check item availability');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorConfirm = async () => {
    if (!selectedVendor) {
      toast.error('Please select a vendor');
      return;
    }

    try {
      setLoading(true);
      await addItemToCart(item, selectedVendor);
      await refreshCart(); // Ensure cart is refreshed after adding
      setShowVendorModal(false);
      setSelectedVendor(null);
      setAvailableVendors([]); // Clear available vendors
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowVendorModal(false);
    setSelectedVendor(null);
    setAvailableVendors([]); // Clear available vendors
  };

  const handleIncreaseQuantity = async () => {
    try {
      setLoading(true);
      await increaseItemQuantity(item);
      await refreshCart(); // Ensure cart is refreshed after increasing
    } catch (error) {
      console.error('Error increasing quantity:', error);
      toast.error('Failed to increase quantity');
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = async () => {
    try {
      setLoading(true);
      await decreaseItemQuantity(item);
      await refreshCart(); // Ensure cart is refreshed after decreasing
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      toast.error('Failed to decrease quantity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.slideWrapper}>
        <div className={styles.foodCard}>
          <div className={styles.imageContainer}>
            <img src={item.image} alt={item.title} className={styles.foodImage} />
          </div>
          <h4 className={styles.foodTitle}>{item.title}</h4>
          <p className={styles.foodPrice}>₹{item.price}</p>
          {quantity > 0 ? (
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityButton}
                onClick={handleDecreaseQuantity}
                disabled={loading}
              >
                <Minus size={16} />
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button
                className={styles.quantityButton}
                onClick={handleIncreaseQuantity}
                disabled={loading}
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              className={`${styles.addToCartButton} ${loading ? styles.loading : ''}`}
              onClick={handleAddToCart}
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
          )}
        </div>
      </div>

      <VendorModal
        show={showVendorModal}
        availableVendors={availableVendors}
        selectedVendor={selectedVendor}
        onVendorSelect={handleVendorSelect}
        onConfirm={handleVendorConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default ProductCard; 