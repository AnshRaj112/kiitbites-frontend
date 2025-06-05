import { Plus, Minus, Loader2 } from "lucide-react";
import Slider, { Settings } from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem, CartItem, Vendor } from "../types";
import { useState } from "react";
import { toast } from "react-toastify";
import VendorModal from "./VendorModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface CategorySectionProps {
  categoryItems: FoodItem[];
  cartItems: CartItem[];
  userFullName: string;
  categoryTitle: string;
  sliderSettings: Settings;
  handleAddToCart: (item: FoodItem) => Promise<void>;
  handleIncreaseQuantity: (item: FoodItem) => void;
  handleDecreaseQuantity: (item: FoodItem) => void;
}

const CategorySection = ({
  categoryItems,
  cartItems = [],
  userFullName,
  categoryTitle,
  sliderSettings,
  handleAddToCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}: CategorySectionProps) => {
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);

  if (!categoryItems || categoryItems.length === 0) return null;

  const handleCategoryAddToCart = async (item: FoodItem) => {
    try {
      setLoadingItems(prev => ({ ...prev, [item.id]: true }));
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        toast.error("Please login to add items to cart");
        return;
      }

      const userData = await userResponse.json();
      const userId = userData._id;

      const cartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartResponse.ok) {
        console.error('Failed to fetch cart items');
        return;
      }

      const cartData = await cartResponse.json();
      
      // If cart is empty or invalid, show vendor selection
      if (!Array.isArray(cartData) || cartData.length === 0) {
        // Fetch vendors for this item
        const vendorsResponse = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!vendorsResponse.ok) {
          toast.error("Failed to fetch available vendors");
          return;
        }

        const vendors = await vendorsResponse.json();
        const availableVendors = vendors.filter((vendor: Vendor) => {
          if (!vendor.inventoryValue) {
            return false;
          }
          return vendor.inventoryValue.isAvailable === "Y" || (vendor.inventoryValue.quantity !== undefined && vendor.inventoryValue.quantity > 0);
        });

        if (availableVendors.length === 0) {
          toast.error("No vendors have this item available");
          return;
        }

        setAvailableVendors(availableVendors);
        setSelectedItem(item);
        setShowVendorModal(true);
        return;
      }

      // If cart has items, check if the new item is from the same vendor
      const firstCartItem = cartData[0];
      if (!firstCartItem || !firstCartItem.vendorId) {
        console.error('Invalid cart item structure:', firstCartItem);
        toast.error("Error processing cart item");
        return;
      }

      const currentVendorId = firstCartItem.vendorId;
      
      // If item doesn't have a vendorId, show vendor selection
      if (!item.vendorId) {
        const vendorsResponse = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!vendorsResponse.ok) {
          toast.error("Failed to fetch available vendors");
          return;
        }

        const vendors = await vendorsResponse.json();
        const availableVendors = vendors.filter((vendor: Vendor) => {
          if (!vendor.inventoryValue) {
            return false;
          }
          return vendor.inventoryValue.isAvailable === "Y" || (vendor.inventoryValue.quantity !== undefined && vendor.inventoryValue.quantity > 0);
        });

        if (availableVendors.length === 0) {
          toast.error("No vendors have this item available");
          return;
        }

        setAvailableVendors(availableVendors);
        setSelectedItem(item);
        setShowVendorModal(true);
        return;
      }

      // Now check if the vendor IDs match
      if (item.vendorId === currentVendorId) {
        await handleAddToCart(item);
        return;
      }

      // If items are from different vendors, show error
      toast.error("You can only add items from the same vendor");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleVendorConfirm = async () => {
    if (!selectedItem || !selectedVendor) return;
    try {
      setLoadingItems(prev => ({ ...prev, [selectedItem.id]: true }));
      // Set the vendor ID on the item before adding to cart
      const itemWithVendor = {
        ...selectedItem,
        vendorId: selectedVendor._id
      };
      await handleAddToCart(itemWithVendor);
      setShowVendorModal(false);
      setSelectedItem(null);
      setSelectedVendor(null);
      setAvailableVendors([]);
    } catch (error) {
      console.error("Error confirming vendor selection:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoadingItems(prev => ({ ...prev, [selectedItem.id]: false }));
    }
  };

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryTitle}>
          {categoryTitle
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </h3>
      </div>
      <div className={styles.carouselContainer}>
        <Slider {...sliderSettings} className={styles.slider}>
          {categoryItems.map((item) => {
            const cartItem = Array.isArray(cartItems) ? cartItems.find(
              (cartItem) =>
                cartItem.itemId === item.id &&
                cartItem.vendorId === item.vendorId
            ) : null;
            const quantity = cartItem?.quantity || 0;
            const isLoading = loadingItems[item.id];

            return (
              <div key={item.id} className={styles.slideWrapper}>
                <div className={styles.foodCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.foodImage}
                    />
                  </div>
                  <h4 className={styles.foodTitle}>{item.title}</h4>
                  <p className={styles.foodPrice}>₹{item.price}</p>
                  {userFullName &&
                    (quantity > 0 ? (
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleDecreaseQuantity(item)}
                          disabled={isLoading}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.quantity}>{quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={isLoading}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`${styles.addToCartButton} ${isLoading ? styles.loading : ''}`}
                        onClick={() => handleCategoryAddToCart(item)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className={styles.spinner} size={16} />
                            Adding...
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>

      <VendorModal
        show={showVendorModal}
        availableVendors={availableVendors}
        selectedVendor={selectedVendor}
        onVendorSelect={setSelectedVendor}
        onConfirm={handleVendorConfirm}
        onCancel={() => {
          setShowVendorModal(false);
          setSelectedItem(null);
          setSelectedVendor(null);
          setAvailableVendors([]);
        }}
      />
    </section>
  );
};

export default CategorySection; 