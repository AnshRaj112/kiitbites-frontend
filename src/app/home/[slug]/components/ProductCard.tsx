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
  userId?: string | null;
}

const ProductCard = ({ item, categories, userId }: ProductCardProps) => {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  const { cartItems, addItemToCart, increaseItemQuantity, decreaseItemQuantity } = useCart();

  // Find the cart item for this product
  const cartItem = cartItems.find(
    (cartItem) => cartItem.itemId === item.id
  );
  const quantity = cartItem?.quantity || 0;

  // Debug log for cart state
  useEffect(() => {
    console.log('Cart state updated:', {
      itemId: item.id,
      cartItems,
      foundItem: cartItem,
      quantity
    });
  }, [cartItems, item.id, cartItem, quantity]);

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error('Please login to add items to cart');
      return;
    }

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
      // Create a new item object with the selected vendor ID
      const itemWithVendor = {
        ...item,
        vendorId: selectedVendor._id
      };
      console.log('Adding item with vendor:', itemWithVendor);
      await addItemToCart(itemWithVendor, selectedVendor);
      setShowVendorModal(false);
      setSelectedVendor(null);
      setAvailableVendors([]);
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
    setAvailableVendors([]);
  };

  const handleIncreaseQuantity = async () => {
    if (!userId) {
      toast.error('Please login to modify cart');
      return;
    }

    if (!cartItem) {
      // If no item in cart, show vendor modal first
      handleAddToCart();
      return;
    }
    
    try {
      setLoading(true);
      // Create a new item object with the existing vendor ID
      const itemWithVendor = {
        ...item,
        vendorId: cartItem.vendorId
      };
      console.log('Increasing quantity for item:', itemWithVendor);
      await increaseItemQuantity(itemWithVendor);
    } catch (error) {
      console.error('Error increasing quantity:', error);
      if (error instanceof Error) {
        if (error.message.includes("max quantity")) {
          toast.warning(`Maximum limit reached for ${item.title}`);
        } else if (error.message.includes("Only")) {
          toast.warning(`Only ${error.message.split("Only ")[1]} available for ${item.title}`);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to increase quantity');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (!userId) {
      toast.error('Please login to modify cart');
      return;
    }

    if (!cartItem) return;
    
    try {
      setLoading(true);
      // Create a new item object with the existing vendor ID
      const itemWithVendor = {
        ...item,
        vendorId: cartItem.vendorId
      };
      console.log('Decreasing quantity for item:', itemWithVendor);
      await decreaseItemQuantity(itemWithVendor);
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to decrease quantity');
      }
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
          {userId && (
            <>
              <div className={styles.quantityControls}>
                <button
                  className={`${styles.quantityButton} ${quantity === 0 ? styles.disabled : ''}`}
                  onClick={handleDecreaseQuantity}
                  disabled={loading || quantity === 0}
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
              {quantity === 0 && (
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
            </>
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