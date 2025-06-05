import { Plus, Minus, Loader2 } from "lucide-react";
import Slider, { Settings } from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem, CartItem, Vendor } from "../types";
import { useState } from "react";
import { toast } from "react-toastify";
import VendorModal from "./VendorModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface SpecialOffersSectionProps {
  items: { [key: string]: FoodItem[] };
  sliderSettings: Settings;
  cartItems: CartItem[];
  userFullName: string;
  handleAddToCart: (item: FoodItem) => Promise<void>;
  handleIncreaseQuantity: (item: FoodItem) => void;
  handleDecreaseQuantity: (item: FoodItem) => void;
}

const SpecialOffersSection = ({
  items,
  sliderSettings,
  cartItems = [],
  userFullName,
  handleAddToCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}: SpecialOffersSectionProps) => {
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);

  // Flatten all special items from items object
  const specialItems = Object.values(items)
    .flat()
    .filter(item => item.isSpecial === "Y");

  if (specialItems.length === 0) return null;

  const handleSpecialAddToCart = async (item: FoodItem) => {
    try {
      setLoadingItems(prev => ({ ...prev, [item.id]: true }));

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      // Fetch user info
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

      // Fetch cart data
      const cartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartResponse.ok) {
        toast.error("Failed to fetch cart data");
        return;
      }

      const cartData = await cartResponse.json();

      // Cart empty or invalid? Show vendor modal after fetching vendors
      if (!Array.isArray(cartData) || cartData.length === 0) {
        const vendorsResponse = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!vendorsResponse.ok) {
          toast.error("Failed to fetch available vendors");
          return;
        }

        const vendors = await vendorsResponse.json();
        const available = vendors.filter((vendor: Vendor) => {
          if (!vendor.inventoryValue) return false;
          return (
            vendor.inventoryValue.isAvailable === "Y" ||
            (vendor.inventoryValue.quantity !== undefined && vendor.inventoryValue.quantity > 0)
          );
        });

        if (available.length === 0) {
          toast.error("No vendors have this item available");
          return;
        }

        setAvailableVendors(available);
        setSelectedItem(item);
        setShowVendorModal(true);
        return;
      }

      // Get vendorId from first cart item to check for vendor consistency
      const currentVendorId = cartData[0].vendorId;
      if (!currentVendorId) {
        toast.error("Error processing your cart");
        return;
      }

      // If the item has no vendorId, show vendor modal
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
        const available = vendors.filter((vendor: Vendor) => {
          if (!vendor.inventoryValue) return false;
          return (
            vendor.inventoryValue.isAvailable === "Y" ||
            (vendor.inventoryValue.quantity !== undefined && vendor.inventoryValue.quantity > 0)
          );
        });

        if (available.length === 0) {
          toast.error("No vendors have this item available");
          return;
        }

        // Filter vendors to only show those matching the current cart vendor
        const matchingVendors = available.filter((vendor: Vendor) => vendor._id === currentVendorId);
        if (matchingVendors.length === 0) {
          toast.error("This item is not available from your current cart's vendor");
          return;
        }

        setAvailableVendors(matchingVendors);
        setSelectedItem(item);
        setShowVendorModal(true);
        return;
      }

      // If vendorId matches cart vendorId, add directly
      if (item.vendorId === currentVendorId) {
        await handleAddToCart(item);
        return;
      }

      // Vendor mismatch, show error
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
      const itemWithVendor = { ...selectedItem, vendorId: selectedVendor._id };
      await handleAddToCart(itemWithVendor);
      setShowVendorModal(false);
      setSelectedItem(null);
      setSelectedVendor(null);
      setAvailableVendors([]);
    } catch (error) {
      console.error("Error confirming vendor selection:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoadingItems(prev => ({ ...prev, [selectedItem!.id]: false }));
    }
  };

  return (
    <section className={styles.specialSection}>
      <h2 className={styles.specialTitle}>Special Offers</h2>
      <div className={styles.carouselContainer}>
        <Slider {...sliderSettings} className={styles.slider}>
          {specialItems.map(item => {
            const cartItem = Array.isArray(cartItems) ? cartItems.find(
              cItem => cItem.itemId === item.id && cItem.vendorId === item.vendorId
            ) : null;
            const quantity = cartItem?.quantity || 0;
            const isLoading = loadingItems[item.id];

            return (
              <div key={item.id} className={styles.slideWrapper}>
                <div className={styles.foodCard}>
                  <div className={styles.imageContainer}>
                    <img src={item.image} alt={item.title} className={styles.foodImage} />
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
                        className={`${styles.addToCartButton} ${isLoading ? styles.loading : ""}`}
                        onClick={() => handleSpecialAddToCart(item)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className={styles.spinner} size={16} />
                            Adding...
                          </>
                        ) : (
                          "Add to Cart"
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

export default SpecialOffersSection;
