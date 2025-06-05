import Slider, { Settings } from "react-slick";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem, CartItem, Vendor } from "../types";
import { toast } from "react-toastify";
import VendorModal from "./VendorModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface SpecialOffersSectionProps {
  items: { [key: string]: FoodItem[] };
  sliderSettings: Settings;
  cartItems: CartItem[];
  userFullName: string;
  handleAddToCart: (item: FoodItem) => Promise<void>;
  handleIncreaseQuantity: (item: FoodItem) => Promise<void>;
  handleDecreaseQuantity: (item: FoodItem) => Promise<void>;
}

const SpecialOffersSection = ({ 
  items, 
  sliderSettings, 
  cartItems = [],
  userFullName,
  handleAddToCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity
}: SpecialOffersSectionProps) => {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);

  const specialItems = Object.values(items)
    .flat()
    .filter((item) => item.isSpecial === "Y");

  if (specialItems.length === 0) return null;

  const handleSpecialAddToCart = async (item: FoodItem) => {
    try {
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
      const currentVendorId = cartData.length > 0 ? cartData[0].vendorId : null;

      if (cartData.length > 0 && currentVendorId) {
        if (item.vendorId !== currentVendorId) {
          toast.error("You can only add items from the same vendor");
          return;
        }
        await handleAddToCart(item);
        return;
      }

      // Fetch vendors for this special item
      const vendorsResponse = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!vendorsResponse.ok) {
        toast.error("Failed to fetch available vendors");
        return;
      }

      const vendors = await vendorsResponse.json();
      const specialVendors = vendors.filter((vendor: Vendor) => {
        if (!vendor.inventoryValue) {
          return false;
        }
        return vendor.inventoryValue.isAvailable === "Y" || (vendor.inventoryValue.quantity !== undefined && vendor.inventoryValue.quantity > 0);
      });

      if (specialVendors.length === 0) {
        toast.error("No vendors have this special item available");
        return;
      }

      setAvailableVendors(specialVendors);
      setSelectedItem(item);
      setShowVendorModal(true);
    } catch (error) {
      console.error("Error adding special item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleVendorConfirm = async () => {
    if (!selectedItem || !selectedVendor) return;
    await handleAddToCart(selectedItem);
    setShowVendorModal(false);
    setSelectedItem(null);
    setSelectedVendor(null);
    setAvailableVendors([]);
  };

  return (
    <div className={styles.specialSection}>
      <h2 className={styles.specialTitle}>Special Offers</h2>
      <div className={styles.carouselContainer}>
        <Slider {...sliderSettings} className={styles.slider}>
          {specialItems.map((item) => {
            const cartItem = cartItems.find(
              (cartItem) => cartItem.itemId === item.id && cartItem.vendorId === item.vendorId
            );
            const quantity = cartItem?.quantity || 0;

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
                  {userFullName && (
                    <div className={styles.quantityControls}>
                      {quantity > 0 ? (
                        <>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleDecreaseQuantity(item)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={styles.quantity}>{quantity}</span>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleIncreaseQuantity(item)}
                          >
                            <Plus size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          className={styles.addToCartButton}
                          onClick={() => handleSpecialAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  )}
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
    </div>
  );
};

export default SpecialOffersSection; 