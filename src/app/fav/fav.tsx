"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { ChevronRight, ChevronDown, Plus, Minus } from "lucide-react";
import styles from "./styles/FavouriteFoodPage.module.scss";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface FoodItem {
  _id: string;
  name: string;
  type: string;
  uniId: string;
  unit?: string;
  price: number;
  image: string;
  isSpecial: string;
  kind: string;
  vendorId: string;
  vendorName?: string;
}

interface College {
  _id: string;
  fullName: string;
  shortName: string;
}

interface Vendor {
  _id: string;
  fullName: string;
}

interface User {
  _id: string;
  name: string;
}

interface CartItem {
  _id: string;
  quantity: number;
  kind: string;
  vendorId: string;
  vendorName: string;
}

interface CartResponseItem {
  itemId: string;
  quantity: number;
  kind: string;
  vendorId: string;
  vendorName: string;
}

const FavouriteFoodPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [favorites, setFavorites] = useState<FoodItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<{ [key: string]: string }>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Configure axios with auth header
  const getAuthConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/api/user/auth/user`,
          getAuthConfig()
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        }
      }
    };
    fetchUserDetails();
  }, [router]);

  // Fetch colleges list
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/user/auth/list`,
          getAuthConfig()
        );
        setColleges(response.data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        }
      }
    };
    fetchColleges();
  }, [router]);

  // Fetch favorites based on selected college
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const url = selectedCollege
          ? `${BACKEND_URL}/fav/${user._id}/${selectedCollege._id}`
          : `${BACKEND_URL}/fav/${user._id}`;

        const response = await axios.get(url, getAuthConfig());
        setFavorites(response.data.favourites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?._id, selectedCollege, router]);

  // Fetch vendors list
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (selectedCollege) {
          const response = await axios.get(
            `${BACKEND_URL}/api/vendor/list/uni/${selectedCollege._id}`,
            getAuthConfig()
          );
          const vendorsMap = response.data.reduce(
            (acc: { [key: string]: string }, vendor: Vendor) => {
              acc[vendor._id] = vendor.fullName;
              return acc;
            },
            {}
          );
          setVendors(vendorsMap);
        } else {
          // Fetch all vendors for all colleges
          const vendorPromises = colleges.map((college) =>
            axios.get(
              `${BACKEND_URL}/api/vendor/list/uni/${college._id}`,
              getAuthConfig()
            )
          );

          const responses = await Promise.all(vendorPromises);
          const allVendors = responses.flatMap((response) => response.data);

          // Create a map of vendor IDs to names, ensuring no duplicates
          const vendorsMap = allVendors.reduce(
            (acc: { [key: string]: string }, vendor: Vendor) => {
              if (!acc[vendor._id]) {
                acc[vendor._id] = vendor.fullName;
              }
              return acc;
            },
            {}
          );

          setVendors(vendorsMap);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    if (colleges.length > 0) {
      fetchVendors();
    }
  }, [selectedCollege, colleges]);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `${BACKEND_URL}/cart/${user._id}`,
          getAuthConfig()
        );
        console.log("Cart API Response:", response.data); // Debug log
        const cartData = response.data.cart || [];
        const formattedCartItems = cartData.map((item: CartResponseItem) => ({
          _id: item.itemId,
          quantity: item.quantity,
          kind: item.kind,
          vendorId: response.data.vendorId, // Get vendorId from the response
          vendorName: response.data.vendorName // Get vendorName from the response
        }));
        
        console.log("Formatted Cart Items:", formattedCartItems); // Debug log
        setCartItems(formattedCartItems);
        
        // Set current vendor ID if there are items in cart
        if (formattedCartItems.length > 0) {
          setCurrentVendorId(formattedCartItems[0].vendorId);
        } else {
          setCurrentVendorId(null);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user?._id]);

  // Handle URL query parameter on initial load
  useEffect(() => {
    const collegeId = searchParams.get("college");
    if (collegeId && colleges.length > 0) {
      const college = colleges.find((c) => c._id === collegeId);
      if (college) {
        setSelectedCollege(college);
      }
    } else {
      setSelectedCollege(null);
      const params = new URLSearchParams(window.location.search);
      params.delete("college");
      window.history.pushState(null, "", `?${params.toString()}`);
    }
  }, [searchParams, colleges]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCollegeSelect = (college: College | null) => {
    setSelectedCollege(college);
    const params = new URLSearchParams(window.location.search);
    if (college) {
      params.set("college", college._id);
    } else {
      params.delete("college");
    }
    window.history.pushState(null, "", `?${params.toString()}`);
    setIsDropdownOpen(false);
  };

  const handleAddToCart = async (foodItem: FoodItem) => {
    if (!user?._id) {
      router.push("/login");
      return;
    }

    try {
      // Check if cart is empty or if item is from same vendor
      if (currentVendorId && currentVendorId !== foodItem.vendorId) {
        toast.error("You can only add items from the same vendor. Please clear your cart first.");
        return;
      }

      // Check if item is already in cart
      const existingItem = cartItems.find(item => 
        item._id === foodItem._id && 
        item.vendorId === foodItem.vendorId
      );
      
      if (existingItem) {
        // If item exists, increase quantity
        await axios.post(
          `${BACKEND_URL}/cart/add-one/${user._id}`,
          { 
            itemId: foodItem._id, 
            kind: foodItem.kind,
            vendorId: foodItem.vendorId 
          },
          getAuthConfig()
        );
      } else {
        // If item doesn't exist, add new item
        await axios.post(
          `${BACKEND_URL}/cart/add/${user._id}`,
          { 
            itemId: foodItem._id, 
            kind: foodItem.kind, 
            quantity: 1,
            vendorId: foodItem.vendorId 
          },
          getAuthConfig()
        );
      }

      // Fetch updated cart after adding item
      const response = await axios.get(
        `${BACKEND_URL}/cart/${user._id}`,
        getAuthConfig()
      );
      const cartData = response.data.cart || [];
      const formattedCartItems = cartData.map((item: CartResponseItem) => ({
        _id: item.itemId,
        quantity: item.quantity,
        kind: item.kind,
        vendorId: item.vendorId,
        vendorName: item.vendorName
      }));
      
      setCartItems(formattedCartItems);
      
      // Set current vendor if not set
      if (!currentVendorId) {
        setCurrentVendorId(foodItem.vendorId);
      }

      toast.success(`${foodItem.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errorMsg = error.response.data.message;
        if (errorMsg.includes("max quantity")) {
          toast.warning(`Maximum limit reached for ${foodItem.name}`);
        } else if (errorMsg.includes("Only")) {
          toast.warning(`Only ${errorMsg.split("Only ")[1]} available for ${foodItem.name}`);
        } else {
          toast.error(errorMsg);
        }
      } else {
        toast.error("Failed to add item to cart");
      }
    }
  };

  const handleIncreaseQuantity = async (foodItem: FoodItem) => {
    if (!user?._id) return;

    try {
      await axios.post(
        `${BACKEND_URL}/cart/add-one/${user._id}`,
        { 
          itemId: foodItem._id, 
          kind: foodItem.kind,
          vendorId: foodItem.vendorId 
        },
        getAuthConfig()
      );

      // Fetch updated cart after increasing quantity
      const response = await axios.get(
        `${BACKEND_URL}/cart/${user._id}`,
        getAuthConfig()
      );
      const cartData = response.data.cart || [];
      const formattedCartItems = cartData.map((item: CartResponseItem) => ({
        _id: item.itemId,
        quantity: item.quantity,
        kind: item.kind,
        vendorId: response.data.vendorId,
        vendorName: response.data.vendorName
      }));
      
      setCartItems(formattedCartItems);
      toast.success(`Increased quantity of ${foodItem.name}`);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errorMsg = error.response.data.message;
        if (errorMsg.includes("max quantity")) {
          toast.warning(`Maximum limit reached for ${foodItem.name}`);
        } else if (errorMsg.includes("Only")) {
          toast.warning(`Only ${errorMsg.split("Only ")[1]} available for ${foodItem.name}`);
        } else {
          toast.error(errorMsg);
        }
      } else {
        toast.error("Failed to increase quantity");
      }
    }
  };

  const handleDecreaseQuantity = async (foodItem: FoodItem) => {
    if (!user?._id) return;

    try {
      await axios.post(
        `${BACKEND_URL}/cart/remove-one/${user._id}`,
        { 
          itemId: foodItem._id, 
          kind: foodItem.kind,
          vendorId: foodItem.vendorId 
        },
        getAuthConfig()
      );

      // Fetch updated cart after decreasing quantity
      const response = await axios.get(
        `${BACKEND_URL}/cart/${user._id}`,
        getAuthConfig()
      );
      const cartData = response.data.cart || [];
      const formattedCartItems = cartData.map((item: CartResponseItem) => ({
        _id: item.itemId,
        quantity: item.quantity,
        kind: item.kind,
        vendorId: response.data.vendorId,
        vendorName: response.data.vendorName
      }));
      
      setCartItems(formattedCartItems);
      
      // If cart becomes empty, reset current vendor
      if (formattedCartItems.length === 0) {
        setCurrentVendorId(null);
      }

      toast.info(`Decreased quantity of ${foodItem.name}`);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to decrease quantity");
      }
    }
  };

  const getVendorName = (vendorId: string) => {
    if (!vendorId) {
      console.log("No vendorId provided");
      return "Unknown Vendor";
    }
    const vendorName = vendors[vendorId];
    if (!vendorName) {
      console.log(`No vendor name found for ID: ${vendorId}`);
      return "Unknown Vendor";
    }
    return vendorName;
  };

  // Add a function to clear cart
  const clearCart = async () => {
    if (!user?._id) return;

    try {
      console.log("Clearing cart and resetting vendor ID"); // Debug log
      await axios.post(
        `${BACKEND_URL}/cart/clear/${user._id}`,
        {},
        getAuthConfig()
      );
      setCartItems([]);
      setCurrentVendorId(null);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  // Add a function to check if cart is empty
  const isCartEmpty = () => {
    return cartItems.length === 0;
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={styles.header}>
        <h1>Your Favorites</h1>
        {!isCartEmpty() && (
          <button
            className={styles.clearCartButton}
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className={styles.dropdownContainer} ref={dropdownRef}>
        <button
          className={styles.dropdownButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <span>
            {selectedCollege ? selectedCollege.fullName : "Select your college"}
          </span>
          <ChevronDown
            size={20}
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button
              className={styles.dropdownItem}
              onClick={() => handleCollegeSelect(null)}
            >
              <span>All Colleges</span>
              <ChevronRight size={16} />
            </button>
            {colleges.map((college) => (
              <button
                key={college._id}
                className={styles.dropdownItem}
                onClick={() => handleCollegeSelect(college)}
              >
                <span>{college.fullName}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.contentSection}>
        <div className={styles.collegeHeader}>
          <h2 className={styles.collegeName}>
            {selectedCollege ? selectedCollege.fullName : "All Colleges"}
          </h2>
          <p className={styles.subTitle}>Your Favorites</p>
        </div>

        {loading ? (
          <div className={styles.header}>
            <h1>Loading...</h1>
          </div>
        ) : favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Oops! You have no favorites yet</h2>
            <p>Start adding your favorite items to see them here!</p>
            <button 
              className={styles.homeButton}
              onClick={() => router.push('/')}
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className={styles.foodGrid}>
            {favorites.map((food) => {
              // Find the cart item with matching itemId and vendorId
              console.log("Current cart items:", cartItems); // Debug log
              console.log("Current food item:", food); // Debug log

              const matchingCartItem = cartItems.find(item => {
                console.log("Comparing cart item:", item); // Debug log
                console.log("With food item:", food); // Debug log
                const isMatch = item._id === food._id && item.vendorId === food.vendorId;
                console.log("Match result:", isMatch, {
                  itemIdMatch: item._id === food._id,
                  vendorIdMatch: item.vendorId === food.vendorId,
                  cartItemId: item._id,
                  foodItemId: food._id,
                  cartVendorId: item.vendorId,
                  foodVendorId: food.vendorId
                }); // Debug log
                return isMatch;
              });

              console.log("Found matching cart item:", matchingCartItem); // Debug log
              const quantity = matchingCartItem?.quantity || 0;
              const isSameVendor = !currentVendorId || currentVendorId === food.vendorId;
              const isInCart = matchingCartItem !== undefined;
              
              console.log("Food item state:", {
                foodId: food._id,
                foodVendorId: food.vendorId,
                quantity,
                isSameVendor,
                isInCart,
                currentVendorId,
                matchingCartItem
              });
              
              return (
                <div key={`${food._id}-${food.vendorId}`} className={styles.foodCard}>
                  <img
                    src={food.image}
                    alt={food.name}
                    className={styles.foodImage}
                  />
                  {!selectedCollege && (
                    <div className={styles.collegeTag}>
                      {colleges.find((c) => c._id === food.uniId)?.fullName}
                    </div>
                  )}
                  <h3 className={styles.foodName}>{food.name}</h3>
                  <p className={styles.vendorName}>
                    {food.vendorName || getVendorName(food.vendorId)}
                  </p>
                  <p className={styles.foodPrice}>₹{food.price}</p>
                  {isInCart && isSameVendor ? (
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleDecreaseQuantity(food)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantity}>{quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleIncreaseQuantity(food)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleAddToCart(food)}
                      disabled={!isSameVendor}
                    >
                      {!isSameVendor ? "Different Vendor" : "Add to Cart"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const FavouriteFoodPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Loading...</h1>
          </div>
        </div>
      }
    >
      <FavouriteFoodPageContent />
    </Suspense>
  );
};

export default FavouriteFoodPage;