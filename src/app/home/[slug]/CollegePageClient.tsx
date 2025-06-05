"use client";

import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/global.css";
import styles from "./styles/CollegePage.module.scss";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoritesSection from "./components/FavoritesSection";
import SpecialOffersSection from "./components/SpecialOffersSection";
import CategorySection from "./components/CategorySection";
import VendorModal from "./components/VendorModal";
import {
  FoodItem,
  FavoriteItem,
  CartItem,
  Vendor,
  College,
  ApiFavoritesResponse,
  ApiItem,
} from "./types";
import {
  checkItemAvailability,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  fetchCartItems,
} from "./utils/cartUtils";
import { checkFavoriteItemAvailability } from "./utils/favoriteCartUtils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const categories = {
  produce: [
    "combos-veg",
    "combos-nonveg",
    "veg",
    "shakes",
    "juices",
    "soups",
    "non-veg",
  ],
  retail: [
    "biscuits",
    "chips",
    "icecream",
    "drinks",
    "snacks",
    "sweets",
    "nescafe",
  ],
};

const CustomPrevArrow = (props: { onClick?: () => void }) => (
  <button
    onClick={props.onClick}
    className={`${styles.carouselButton} ${styles.prevButton}`}
  >
    <ChevronLeft size={20} />
  </button>
);

const CustomNextArrow = (props: { onClick?: () => void }) => (
  <button
    onClick={props.onClick}
    className={`${styles.carouselButton} ${styles.nextButton}`}
  >
    <ChevronRight size={20} />
  </button>
);

const CollegePageClient = ({ slug = "" }: { slug?: string }) => {
  const searchParams = useSearchParams();

  const [uniId, setUniId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [items, setItems] = useState<{ [key: string]: FoodItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFavorites, setUserFavorites] = useState<FavoriteItem[]>([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);

  const currentRequest = useRef<number>(0);

  // Normalize college name for matching
  const normalizeName = (name: string) =>
    name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") || "";

  // Update URL with college ID
  const updateUrlWithCollegeId = (collegeId: string) => {
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?cid=${collegeId}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Get college list and match collegeName to get actual college id
  const fetchCollegesAndSetUniId = async (collegeSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch colleges");
      const colleges = (await response.json()) as College[];

      // Normalize the input slug
      const normalizedSlug = normalizeName(collegeSlug);

      // Find the college that matches the normalized slug
      const matchedCollege = colleges.find((college) => {
        const normalizedCollegeName = normalizeName(college.name);
        return normalizedCollegeName === normalizedSlug;
      });

      if (matchedCollege) {
        setUniId(matchedCollege._id);
        localStorage.setItem("currentCollegeId", matchedCollege._id);
        updateUrlWithCollegeId(matchedCollege._id);
        setLoading(false);
        return true;
      } else {
        // Only set error if we've actually tried to load the data
        if (colleges.length > 0) {
          setError(`College not found: ${collegeSlug}`);
        }
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setError("Failed to load college information");
      setLoading(false);
      return false;
    }
  };

  // On load, determine uniId from multiple sources:
  useEffect(() => {
    let isMounted = true;

    const resolveCollegeId = async () => {
      const cid = searchParams.get("cid");
      const localCollegeId = localStorage.getItem("currentCollegeId");

      if (cid) {
        if (cid.length < 10) {
          try {
            const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, {
              credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch colleges");
            const colleges = (await response.json()) as College[];
            const found = colleges.find((c) => c._id.startsWith(cid));
            if (found && isMounted) {
              setUniId(found._id);
              localStorage.setItem("currentCollegeId", found._id);
              updateUrlWithCollegeId(found._id);
              return;
            }
          } catch {}
        } else {
          if (isMounted) {
            setUniId(cid);
            localStorage.setItem("currentCollegeId", cid);
            updateUrlWithCollegeId(cid);
          }
          return;
        }
      }

      if (slug) {
        const success = await fetchCollegesAndSetUniId(slug);
        if (success) return;
      }

      if (localCollegeId && isMounted) {
        setUniId(localCollegeId);
        updateUrlWithCollegeId(localCollegeId);
      }
    };

    resolveCollegeId();

    return () => {
      isMounted = false;
    };
  }, [slug, searchParams]);

  // Fetch user & favorites
  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !uniId) return;

        // Fetch user data
        const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) return;
        const userData = await userResponse.json();
        setUserFullName(userData.fullName);
        setUserId(userData._id);

        // Fetch favorites using the new API endpoint
        const favoritesResponse = await fetch(
          `${BACKEND_URL}/fav/${userData._id}/${uniId}`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!favoritesResponse.ok) return;
        const favoritesData =
          (await favoritesResponse.json()) as ApiFavoritesResponse;
        setUserFavorites(favoritesData.favourites);
      } catch (err) {
        console.error("Error fetching user or favorites:", err);
        setUserFavorites([]);
      }
    };
    fetchUserAndFavorites();
  }, [uniId]);

  // Fetch food items for given uniId and categories
  useEffect(() => {
    if (!uniId) return;

    const requestId = ++currentRequest.current;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const allItems: { [key: string]: FoodItem[] } = {};

      try {
        await Promise.all(
          Object.entries(categories).flatMap(([category, types]) =>
            types.map(async (type) => {
              const url = `${BACKEND_URL}/items/${category}/${type}/${uniId}`;
              const response = await fetch(url, { credentials: "include" });
              if (!response.ok) return;
              const data = (await response.json()) as ApiItem[];
              const key = `${category}-${type}`;
              allItems[key] = data.map((item) => ({
                id: item._id,
                title: item.name,
                image: item.image,
                category: type,
                type: category,
                isSpecial: item.isSpecial,
                collegeId: item.collegeId,
                price: item.price,
                vendorId: item.collegeId,
              }));
            })
          )
        );

        if (requestId === currentRequest.current) {
          console.log("Fetched items:", allItems);
          setItems(allItems);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        if (requestId === currentRequest.current) {
          setError("Failed to load items.");
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [uniId]);

  // Fetch cart items
  useEffect(() => {
    const loadCartItems = async () => {
      if (!userId) {
        setCartItems([]);
        return;
      }
      try {
        const cartData = await fetchCartItems(userId);
        setCartItems(cartData || []);

        // Set current vendor if cart is not empty
        if (cartData && cartData.length > 0) {
          const vendorId = cartData[0].vendorId;
          setCurrentVendorId(vendorId);
          // Store the vendor ID in localStorage for persistence
          localStorage.setItem("currentVendorId", vendorId);
        } else {
          setCurrentVendorId(null);
          localStorage.removeItem("currentVendorId");
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
        setCartItems([]);
      }
    };

    loadCartItems();
  }, [userId]);

  // Load current vendor ID from localStorage on initial load
  useEffect(() => {
    const savedVendorId = localStorage.getItem("currentVendorId");
    if (savedVendorId) {
      setCurrentVendorId(savedVendorId);
    }
  }, []);

  const convertFavoriteToFoodItem = (item: FavoriteItem): FoodItem => {
    console.log("Converting FavoriteItem to FoodItem:", item);

    // Determine if the item is retail based on its category
    const isRetail = categories.retail.includes(item.kind);
    console.log("Item kind:", item.kind);
    console.log("Is retail:", isRetail);

    const foodItem: FoodItem = {
      id: item._id,
      title: item.name,
      image: item.image,
      category: item.kind,
      type: isRetail ? "retail" : "produce",
      isSpecial: item.isSpecial,
      price: item.price,
      vendorId: item.vendorId,
    };

    console.log("Converted FoodItem:", foodItem);
    return foodItem;
  };

  const getFavoriteItems = () => {
    if (!userFavorites || !Array.isArray(userFavorites)) return [];

    // Create a Map to store unique items by their _id and vendorId combination
    const uniqueItemsMap = new Map();

    userFavorites.forEach((item) => {
      const key = `${item._id}-${item.vendorId}`;
      if (!uniqueItemsMap.has(key)) {
        uniqueItemsMap.set(key, item);
      }
    });

    return Array.from(uniqueItemsMap.values());
  };

  const favoriteItems = getFavoriteItems();

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  const displayName = userFullName ? userFullName.split(" ")[0] : "User";
  const collegeDisplayName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "College";

  // Filter items based on current vendor and availability
  const filterItemsByVendor = async (items: FoodItem[]) => {
    if (!currentVendorId) return items;

    try {
      // Get all vendors for each item
      const itemsWithVendors = await Promise.all(
        items.map(async (item) => {
          try {
            console.log(
              `Checking availability for item ${item.id} (type: ${item.type})`
            );
            const response = await fetch(
              `${BACKEND_URL}/items/vendors/${item.id}`,
              {
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (!response.ok) {
              console.error(
                `Failed to fetch vendors for item ${item.id}:`,
                await response.text()
              );
              return null;
            }

            const vendors = await response.json();
            console.log(`Vendors for item ${item.id}:`, vendors);

            // Filter out vendors where the item is not available
            const availableVendors = vendors.filter((vendor: Vendor) => {
              if (!vendor.inventoryValue) {
                console.log(`Vendor ${vendor._id} has no inventoryValue`);
                return false;
              }

              if (item.type === "retail") {
                // For retail items, check quantity from inventoryValue
                const quantity = vendor.inventoryValue.quantity;
                console.log(`Vendor ${vendor._id} quantity:`, quantity);
                // Check if quantity exists and is greater than 0
                return typeof quantity === "number" && quantity > 0;
              } else {
                // For produce items, check isAvailable from inventoryValue
                return vendor.inventoryValue.isAvailable === "Y";
              }
            });

            console.log(`Available vendors:`, availableVendors);

            if (availableVendors.length === 0) {
              console.log(`No vendors have this item available at the moment`);
              return null;
            }

            // Only store the vendor information, don't show the modal
            return item;
          } catch (error) {
            console.error("Error checking item availability:", error);
            return null;
          }
        })
      );

      // Filter out null values and return only available items
      const availableItems = itemsWithVendors.filter(
        (item): item is FoodItem => item !== null
      );
      console.log(`Available items after filtering:`, availableItems);
      return availableItems;
    } catch (error) {
      console.error("Error filtering items:", error);
      return [];
    }
  };

  // Add state for filtered items
  const [filteredItems, setFilteredItems] = useState<{
    [key: string]: FoodItem[];
  }>({});

  // Update filtered items when items or currentVendorId changes
  useEffect(() => {
    const updateFilteredItems = async () => {
      const newFilteredItems: { [key: string]: FoodItem[] } = {};

      for (const [key, categoryItems] of Object.entries(items)) {
        if (currentVendorId) {
          // If we have a current vendor, only show items from that vendor
          newFilteredItems[key] = await filterItemsByVendor(categoryItems);
        } else {
          // If no vendor is selected, show all items
          newFilteredItems[key] = categoryItems;
        }
      }

      setFilteredItems(newFilteredItems);
    };

    updateFilteredItems();
  }, [items, currentVendorId]);

  const handleAddToCart = async (item: FoodItem) => {
    console.log("\n=== Starting Add to Cart ===");
    console.log("Item:", {
      id: item.id,
      type: item.type,
      category: item.category,
      title: item.title,
    });

    // Get user details from API
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      toast.error("Please login to add items to cart");
      return;
    }

    const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      console.log("❌ Failed to fetch user details");
      toast.error("Please login to add items to cart");
      return;
    }

    const userData = await userResponse.json();
    const currentUserId = userData._id;

    // If cart has items, check if item is from same vendor
    if (cartItems.length > 0 && currentVendorId) {
      console.log("Cart has items, checking vendor match");
      if (item.vendorId !== currentVendorId) {
        console.log("❌ Vendor mismatch:", {
          itemVendorId: item.vendorId,
          currentVendorId,
        });
        toast.error("You can only add items from the same vendor");
        return;
      }

      // Check if this is a favorite item
      const isFavoriteItem = userFavorites.some((fav) => fav._id === item.id);
      const { isAvailable } = isFavoriteItem
        ? await checkFavoriteItemAvailability(
            {
              _id: item.id,
              type: item.type,
              kind: item.category,
              name: item.title,
              vendorId: item.vendorId,
            } as FavoriteItem,
            currentVendorId,
            categories
          )
        : await checkItemAvailability(item, currentVendorId, categories);

      if (!isAvailable) {
        console.log("❌ Item not available at current vendor");
        toast.error("Item is not available at the moment");
        return;
      }

      const success = await addToCart(currentUserId, item, currentVendorId);
      if (success) {
        console.log("✅ Item added to cart successfully");
        const cartData = await fetchCartItems(currentUserId);
        setCartItems(cartData);
        // Ensure vendor ID is persisted
        localStorage.setItem("currentVendorId", currentVendorId);
      }
      return;
    }

    // If cart is empty, show vendor selection
    console.log("Cart is empty, checking item availability");

    // Check if this is a favorite item
    const isFavoriteItem = userFavorites.some((fav) => fav._id === item.id);
    const { isAvailable, vendors } = isFavoriteItem
      ? await checkFavoriteItemAvailability(
          {
            _id: item.id,
            type: item.type,
            kind: item.category,
            name: item.title,
            vendorId: item.vendorId,
          } as FavoriteItem,
          null,
          categories
        )
      : await checkItemAvailability(item, null, categories);

    console.log("Availability check result:", {
      isAvailable,
      vendorsCount: vendors?.length,
    });

    if (!vendors || vendors.length === 0) {
      console.log("❌ No vendors found");
      toast.error("No vendors have this item available at the moment");
      return;
    }

    // Show all available vendors
    setAvailableVendors(vendors);
    setSelectedItem(item);
    setShowVendorModal(true);
    console.log(
      "✅ Vendor modal should be shown with",
      vendors.length,
      "vendors"
    );
  };

  const handleVendorSelect = async (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorConfirm = async () => {
    if (!selectedItem || !selectedVendor || !userId) return;

    const success = await addToCart(userId, selectedItem, selectedVendor._id);
    if (success) {
      const cartData = await fetchCartItems(userId);
      setCartItems(cartData);

      if (cartData.length > 0) {
        setCurrentVendorId(selectedVendor._id);
        // Store the vendor ID in localStorage for persistence
        localStorage.setItem("currentVendorId", selectedVendor._id);
      }

      // Close modal and reset state
      setShowVendorModal(false);
      setSelectedItem(null);
      setSelectedVendor(null);
      setAvailableVendors([]);
    }
  };

  const handleIncreaseQuantity = async (item: FoodItem) => {
    if (!userId) return;
    const success = await increaseQuantity(userId, item);
    if (success) {
      const cartData = await fetchCartItems(userId);
      setCartItems(cartData);
    }
  };

  const handleDecreaseQuantity = async (item: FoodItem) => {
    if (!userId) return;
    const success = await decreaseQuantity(userId, item);
    if (success) {
      const cartData = await fetchCartItems(userId);
      setCartItems(cartData);

      if (cartData.length === 0) {
        setCurrentVendorId(null);
        localStorage.removeItem("currentVendorId");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.greeting}>Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.greeting}>Error: {error}</h1>
        </div>
      </div>
    );
  }

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
      <div className={styles.content}>
        <h1 className={styles.greeting}>
          Hi {displayName}, what are you craving for at {collegeDisplayName}?
        </h1>

        {Object.entries(categories).map(([category, types]) =>
          types.map((type) => {
            const key = `${category}-${type}`;
            const categoryItems = filteredItems[key] || [];

            return (
              <CategorySection
                key={key}
                categoryItems={categoryItems}
                cartItems={cartItems}
                userFullName={userFullName}
                categoryTitle={type}
                sliderSettings={sliderSettings}
                handleAddToCart={handleAddToCart}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
              />
            );
          })
        )}

        <FavoritesSection
          favoriteItems={favoriteItems}
          cartItems={cartItems}
          userFullName={userFullName}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
          convertFavoriteToFoodItem={convertFavoriteToFoodItem}
          setCartItems={setCartItems}
        />

        <SpecialOffersSection items={items} sliderSettings={sliderSettings} />

        <VendorModal
          show={showVendorModal}
          availableVendors={availableVendors}
          selectedVendor={selectedVendor}
          onVendorSelect={handleVendorSelect}
          onConfirm={handleVendorConfirm}
          onCancel={() => {
            setShowVendorModal(false);
            setSelectedItem(null);
            setSelectedVendor(null);
            setAvailableVendors([]);
          }}
        />
      </div>
    </div>
  );
};

export default CollegePageClient;
