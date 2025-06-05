import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import Slider from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FavoriteItem, Vendor, CartItem, FoodItem } from "../types";
import { checkFavoriteItemAvailability, addFavoriteToCart } from "../utils/favoriteCartUtils";
import { toast } from "react-toastify";
import VendorModal from "./VendorModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface FavoritesSectionProps {
  favoriteItems: FavoriteItem[];
  cartItems: CartItem[];
  userFullName: string;
  handleIncreaseQuantity: (item: FoodItem) => Promise<void>;
  handleDecreaseQuantity: (item: FoodItem) => Promise<void>;
  convertFavoriteToFoodItem: (item: FavoriteItem) => FoodItem;
  setCartItems: (items: CartItem[]) => void;
}

const categories = {
  retail: ["biscuits", "chips", "icecream", "drinks", "snacks", "sweets", "nescafe"],
  produce: ["combos-veg", "combos-nonveg", "veg", "shakes", "juices", "soups", "non-veg"]
};

const FavoritesSection = ({
  favoriteItems,
  cartItems,
  userFullName,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  convertFavoriteToFoodItem,
  setCartItems,
}: FavoritesSectionProps) => {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [itemAvailability, setItemAvailability] = useState<{ [key: string]: { isAvailable: boolean, vendors: Vendor[] } }>({});

  useEffect(() => {
    const checkAllItemsAvailability = async () => {
      const availabilityMap: { [key: string]: { isAvailable: boolean, vendors: Vendor[] } } = {};

      for (const item of favoriteItems) {
        try {
          const { isAvailable, vendors } = await checkFavoriteItemAvailability(item, null, categories);
          availabilityMap[item._id] = { isAvailable, vendors: vendors || [] };
        } catch (error) {
          console.error(`Error checking availability for item ${item._id}:`, error);
          availabilityMap[item._id] = { isAvailable: false, vendors: [] };
        }
      }

      setItemAvailability(availabilityMap);
    };

    checkAllItemsAvailability();
  }, [favoriteItems]);

  if (favoriteItems.length === 0) return null;

  const handleFavoriteAddToCart = async (item: FavoriteItem) => {
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

        const success = await addFavoriteToCart(userId, item, currentVendorId, categories);
        if (success) {
          const updatedCartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (updatedCartResponse.ok) {
            const updatedCartData = await updatedCartResponse.json();
            setCartItems(updatedCartData);
          }
        }
        return;
      }

      const availability = itemAvailability[item._id];
      if (!availability || !availability.isAvailable || availability.vendors.length === 0) {
        toast.error("Item is not available at the moment");
        return;
      }

      setAvailableVendors(availability.vendors);
      setSelectedItem(item);
      setShowVendorModal(true);
    } catch (error) {
      console.error("Error adding favorite to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleVendorConfirm = async () => {
    if (!selectedItem || !selectedVendor) return;

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

      const success = await addFavoriteToCart(userId, selectedItem, selectedVendor._id, categories);
      if (success) {
        const updatedCartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (updatedCartResponse.ok) {
          const updatedCartData = await updatedCartResponse.json();
          setCartItems(updatedCartData);
        }
      }

      setShowVendorModal(false);
      setSelectedItem(null);
      setSelectedVendor(null);
      setAvailableVendors([]);
    } catch (error) {
      console.error("Error confirming vendor selection:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryTitle}>Your Favorites</h3>
      </div>
      <div className={styles.carouselContainer}>
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={4}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3000}
          pauseOnHover={true}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
          ]}
          className={styles.slider}
        >
          {favoriteItems.map((item) => {
            const cartItem = Array.isArray(cartItems) ? cartItems.find(
              (cartItem) => cartItem.itemId === item._id
            ) : null;
            const quantity = cartItem?.quantity || 0;

            return (
              <div key={item._id} className={styles.slideWrapper}>
                <div className={styles.foodCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.foodImage}
                    />
                  </div>
                  <h4 className={styles.foodTitle}>{item.name}</h4>
                  <p className={styles.foodPrice}>₹{item.price}</p>
                  {userFullName && (
                    <div className={styles.quantityControls}>
                      {quantity > 0 ? (
                        <>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleDecreaseQuantity(convertFavoriteToFoodItem(item))}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={styles.quantity}>{quantity}</span>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleIncreaseQuantity(convertFavoriteToFoodItem(item))}
                          >
                            <Plus size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          className={styles.addToCartButton}
                          onClick={() => handleFavoriteAddToCart(item)}
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
    </section>
  );
};

export default FavoritesSection;
