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
          const vendorPromises = colleges.map((college) =>
            axios.get(
              `${BACKEND_URL}/api/vendor/list/uni/${college._id}`,
              getAuthConfig()
            )
          );

          const responses = await Promise.all(vendorPromises);
          const allVendors = responses.flatMap((response) => response.data);

          const vendorsMap = allVendors.reduce(
            (acc: { [key: string]: string }, vendor: Vendor) => {
              acc[vendor._id] = vendor.fullName;
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
        const cartData = response.data.cart || [];
        setCartItems(cartData.map((item: CartResponseItem) => ({
          _id: item.itemId,
          quantity: item.quantity,
          kind: item.kind,
          vendorId: item.vendorId,
          vendorName: item.vendorName
        })));
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
      const existingItem = cartItems.find(item => item._id === foodItem._id);
      
      if (existingItem) {
        // If item exists, increase quantity
        await axios.post(
          `${BACKEND_URL}/cart/add-one/${user._id}`,
          { itemId: foodItem._id, kind: foodItem.kind },
          getAuthConfig()
        );
        toast.success(`Increased quantity of ${foodItem.name}`);
      } else {
        // If item doesn't exist, add new item
        await axios.post(
          `${BACKEND_URL}/cart/add/${user._id}`,
          { itemId: foodItem._id, kind: foodItem.kind, quantity: 1 },
          getAuthConfig()
        );
        toast.success(`${foodItem.name} added to cart!`);
      }

      // Update local cart state
      setCartItems(prev => {
        const existing = prev.find(item => item._id === foodItem._id);
        if (existing) {
          return prev.map(item =>
            item._id === foodItem._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { 
          _id: foodItem._id, 
          quantity: 1, 
          kind: foodItem.kind,
          vendorId: foodItem.vendorId,
          vendorName: getVendorName(foodItem.vendorId)
        }];
      });

      // Set current vendor if not set
      if (!currentVendorId) {
        setCurrentVendorId(foodItem.vendorId);
      }
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
        { itemId: foodItem._id, kind: foodItem.kind },
        getAuthConfig()
      );

      setCartItems(prev =>
        prev.map(item =>
          item._id === foodItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
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
        { itemId: foodItem._id, kind: foodItem.kind },
        getAuthConfig()
      );

      setCartItems(prev => {
        const updatedItems = prev.map(item =>
          item._id === foodItem._id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        ).filter(item => item.quantity > 0);

        // If cart becomes empty, reset current vendor
        if (updatedItems.length === 0) {
          setCurrentVendorId(null);
        }

        return updatedItems;
      });
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
    const vendorName = vendors[vendorId.toString()];
    return vendorName || "Unknown Vendor";
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
              const cartItem = cartItems.find(item => item._id === food._id);
              const quantity = cartItem?.quantity || 0;
              
              return (
                <div key={food._id} className={styles.foodCard}>
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
                    {getVendorName(food.vendorId)}
                  </p>
                  <p className={styles.foodPrice}>₹{food.price}</p>
                  {quantity === 0 ? (
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleAddToCart(food)}
                      disabled={currentVendorId !== null && currentVendorId !== food.vendorId}
                    >
                      {currentVendorId !== null && currentVendorId !== food.vendorId
                        ? "Different Vendor"
                        : "Add to Cart"}
                    </button>
                  ) : (
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
