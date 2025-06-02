"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import styles from "./styles/FavouriteFoodPage.module.scss";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        // Log each favorite item's vendorId
        response.data.favourites.forEach((fav: FoodItem) => {
          console.log(`Favorite item ${fav.name} has vendorId:`, fav.vendorId);
        });
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
          // Fetch vendors for selected college
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
          console.log("Created vendors map:", vendorsMap);
          setVendors(vendorsMap);
        } else {
          // Fetch vendors for all colleges
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
      // Remove college parameter from URL if no college is selected
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

  const handleAddToCart = (foodItem: FoodItem) => {
    console.log(`Added ${foodItem.name} to cart for ₹${foodItem.price}`);
    // Here you would typically add the item to a cart context or state
  };

  // const getCollegeName = (uniId: string) => {
  //   return colleges.find(college => college._id === uniId)?.fullName || 'Unknown College';
  // };

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
        ) : (
          <div className={styles.foodGrid}>
            {favorites.map((food) => (
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
                <button
                  className={styles.addToCartButton}
                  onClick={() => handleAddToCart(food)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
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
