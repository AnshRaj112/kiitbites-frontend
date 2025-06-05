"use client";

import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/global.css";
import styles from "./styles/CollegePage.module.scss";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FoodItem {
  id: string;
  title: string;
  image: string;
  category: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
  price: number;
  vendorId?: string;
}

interface FavoriteItem {
  _id: string;
  name: string;
  type: string;
  uniId: string;
  price: number;
  image: string;
  isSpecial: string;
  kind: string;
}

interface ApiItem {
  _id: string;
  name: string;
  image: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
  category?: string;
  price: number;
}

interface College {
  _id: string;
  name: string;
}

interface ApiFavoritesResponse {
  favourites: FavoriteItem[];
}

interface Vendor {
  _id: string;
  name: string;
  price: number;
  quantity?: number;
  isAvailable?: string;
  inventoryValue?: {
    price: number;
    quantity?: number;
    isAvailable?: string;
  };
}

interface CartItem {
  _id: string;
  itemId: string;
  quantity: number;
  kind: string;
  vendorId: string;
  vendorName: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const categories = {
  produce: ["combos-veg", "combos-nonveg", "veg", "shakes", "juices", "soups", "non-veg"],
  retail: ["biscuits", "chips", "icecream", "drinks", "snacks", "sweets", "nescafe"],
};

const CustomPrevArrow = (props: { onClick?: () => void }) => (
  <button onClick={props.onClick} className={`${styles.carouselButton} ${styles.prevButton}`}>
    <ChevronLeft size={20} />
  </button>
);

const CustomNextArrow = (props: { onClick?: () => void }) => (
  <button onClick={props.onClick} className={`${styles.carouselButton} ${styles.nextButton}`}>
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
    name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-") || "";

  // Update URL with college ID
  const updateUrlWithCollegeId = (collegeId: string) => {
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?cid=${collegeId}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Get college list and match collegeName to get actual college id
  const fetchCollegesAndSetUniId = async (collegeSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, { credentials: "include" });
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
            const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, { credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch colleges");
            const colleges = (await response.json()) as College[];
            const found = colleges.find((c) => c._id.startsWith(cid));
            if (found && isMounted) {
              setUniId(found._id);
              localStorage.setItem("currentCollegeId", found._id);
              updateUrlWithCollegeId(found._id);
              return;
            }
          } catch {
          }
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
        const favoritesResponse = await fetch(`${BACKEND_URL}/fav/${userData._id}/${uniId}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favoritesResponse.ok) return;
        const favoritesData = await favoritesResponse.json() as ApiFavoritesResponse;
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
          console.log('Fetched items:', allItems);
          setItems(allItems);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
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
    const fetchCartItems = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${BACKEND_URL}/cart/${userId}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        const cartData = data.cart || [];
        setCartItems(cartData);
        
        // Set current vendor if cart is not empty
        if (cartData.length > 0) {
          setCurrentVendorId(cartData[0].vendorId);
        } else {
          setCurrentVendorId(null);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const getFavoriteItems = () => {
    if (!userFavorites || !Array.isArray(userFavorites)) return [];
    // Filter out duplicates by using a Map with _id as key
    const uniqueItems = Array.from(
      new Map(userFavorites.map(item => [item._id, item])).values()
    );
    return uniqueItems;
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

  const favoritesSliderSettings = {
    ...sliderSettings,
    slidesToShow: 5,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 2, arrows: false } },
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
            console.log(`Checking availability for item ${item.id} (type: ${item.type})`);
            const response = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
              credentials: "include",
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            
            if (!response.ok) {
              console.error(`Failed to fetch vendors for item ${item.id}:`, await response.text());
              return null;
            }
            
            const vendors = await response.json();
            console.log(`Vendors for item ${item.id}:`, vendors);
            
            // For retail items, only check quantity
            if (item.type === 'retail') {
              const vendor = vendors.find((v: Vendor) => v._id === currentVendorId);
              console.log(`Found vendor for retail item:`, vendor);
              
              if (!vendor || !vendor.inventoryValue) {
                console.log(`Vendor or inventoryValue not found for retail item`);
                return null;
              }
              
              // For retail items, check quantity from inventoryValue
              const quantity = vendor.inventoryValue.quantity;
              console.log(`Retail item quantity:`, quantity);
              
              const isAvailable = typeof quantity === 'number' && quantity > 0;
              console.log(`Retail item is available:`, isAvailable);
              
              return isAvailable ? item : null;
            } else {
              // For produce items, check isAvailable flag
              const vendor = vendors.find((v: Vendor) => v._id === currentVendorId);
              if (!vendor || !vendor.inventoryValue) {
                return null;
              }
              
              // For produce items, check isAvailable from inventoryValue
              return vendor.inventoryValue.isAvailable === 'Y' ? item : null;
            }
          } catch (error) {
            console.error("Error checking item availability:", error);
            return null;
          }
        })
      );
      
      // Filter out null values and return only available items
      const availableItems = itemsWithVendors.filter((item): item is FoodItem => item !== null);
      console.log(`Available items after filtering:`, availableItems);
      return availableItems;
    } catch (error) {
      console.error("Error filtering items:", error);
      return [];
    }
  };

  // Add state for filtered items
  const [filteredItems, setFilteredItems] = useState<{ [key: string]: FoodItem[] }>({});

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
    if (!userId) {
      toast.error("Please login to add items to cart");
      return;
    }

    console.log(`Adding item to cart:`, item);
    console.log(`Item type:`, item.type);

    // If cart has items, check if item is from same vendor
    if (cartItems.length > 0 && currentVendorId) {
      if (item.vendorId !== currentVendorId) {
        toast.error("You can only add items from the same vendor");
        return;
      }

      // For same vendor, check availability directly
      try {
        console.log(`Fetching vendors for item ${item.id}`);
        const response = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const vendors = await response.json();
        console.log(`Vendors for item:`, vendors);
        
        const currentVendor = vendors.find((v: Vendor) => v._id === currentVendorId);
        console.log(`Current vendor:`, currentVendor);
        
        if (!currentVendor || !currentVendor.inventoryValue) {
          toast.error("Item is not available from this vendor");
          return;
        }

        // Check availability based on item type
        let isAvailable = false;
        if (item.type === 'retail') {
          // For retail items, check quantity from inventoryValue
          const quantity = currentVendor.inventoryValue.quantity;
          console.log(`Retail item quantity:`, quantity);
          isAvailable = typeof quantity === 'number' && quantity > 0;
          console.log(`Retail item is available:`, isAvailable);
        } else {
          // For produce items, check isAvailable from inventoryValue
          isAvailable = currentVendor.inventoryValue.isAvailable === 'Y';
        }

        if (!isAvailable) {
          toast.error("Item is not available at the moment");
          return;
        }

        // If available, add directly to cart
        const kind = item.type === 'retail' ? 'Retail' : 'Produce';
        console.log(`Adding to cart with kind:`, kind);
        
        const addResponse = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            itemId: item.id,
            kind: kind,
            quantity: 1,
            vendorId: currentVendorId
          }),
        });

        if (!addResponse.ok) {
          const error = await addResponse.json();
          throw new Error(error.message);
        }

        // Refresh cart items
        const cartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const cartData = await cartResponse.json();
        setCartItems(cartData.cart || []);
        
        toast.success(`${item.title} added to cart!`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(error instanceof Error ? error.message : "Failed to add item to cart");
      }
      return;
    }

    // If cart is empty, show vendor selection
    try {
      console.log(`Fetching vendors for empty cart item ${item.id}`);
      const response = await fetch(`${BACKEND_URL}/items/vendors/${item.id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const vendors = await response.json();
      console.log(`All vendors for item:`, vendors);
      
      // Filter out vendors where the item is not available
      const availableVendors = vendors.filter((vendor: Vendor) => {
        if (!vendor.inventoryValue) {
          console.log(`Vendor ${vendor._id} has no inventoryValue`);
          return false;
        }

        if (item.type === 'retail') {
          // For retail items, check quantity from inventoryValue
          const quantity = vendor.inventoryValue.quantity;
          console.log(`Vendor ${vendor._id} quantity:`, quantity);
          const isAvailable = typeof quantity === 'number' && quantity > 0;
          console.log(`Vendor ${vendor._id} is available:`, isAvailable);
          return isAvailable;
        } else {
          // For produce items, check isAvailable from inventoryValue
          return vendor.inventoryValue.isAvailable === 'Y';
        }
      });
      
      console.log(`Available vendors:`, availableVendors);
      
      if (availableVendors.length === 0) {
        toast.error("No vendors have this item available at the moment");
        return;
      }

      setAvailableVendors(availableVendors);
      setSelectedItem(item);
      setShowVendorModal(true);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch available vendors");
    }
  };

  const handleVendorSelect = async (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorConfirm = async () => {
    if (!selectedItem || !selectedVendor || !userId) return;

    try {
      // Determine the kind based on the item's category
      const kind = selectedItem.type === 'retail' ? 'Retail' : 'Produce';

      const response = await fetch(`${BACKEND_URL}/cart/add/${userId}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          kind: kind,
          quantity: 1,
          vendorId: selectedVendor._id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Refresh cart items
      const cartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const cartData = await cartResponse.json();
      setCartItems(cartData.cart || []);
      
      if (cartData.cart.length > 0) {
        setCurrentVendorId(cartData.cart[0].vendorId);
      }

      toast.success(`${selectedItem.title} added to cart!`);
      
      // Close modal and reset state
      setShowVendorModal(false);
      setSelectedItem(null);
      setSelectedVendor(null);
      setAvailableVendors([]);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add item to cart");
    }
  };

  const handleIncreaseQuantity = async (item: FoodItem) => {
    try {
      // Determine the kind based on the item's category
      const kind = item.type === 'retail' ? 'Retail' : 'Produce';

      const response = await fetch(`${BACKEND_URL}/cart/add-one/${userId}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          itemId: item.id,
          kind: kind,
          vendorId: item.vendorId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Refresh cart items
      const cartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const cartData = await cartResponse.json();
      setCartItems(cartData.cart || []);
      
      toast.success(`Increased quantity of ${item.title}`);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error(error instanceof Error ? error.message : "Failed to increase quantity");
    }
  };

  const handleDecreaseQuantity = async (item: FoodItem) => {
    try {
      // Determine the kind based on the item's category
      const kind = item.type === 'retail' ? 'Retail' : 'Produce';

      const response = await fetch(`${BACKEND_URL}/cart/remove-one/${userId}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          itemId: item.id,
          kind: kind,
          vendorId: item.vendorId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Refresh cart items
      const cartResponse = await fetch(`${BACKEND_URL}/cart/${userId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const cartData = await cartResponse.json();
      setCartItems(cartData.cart || []);
      
      if (cartData.cart.length === 0) {
        setCurrentVendorId(null);
      }
      
      toast.info(`Decreased quantity of ${item.title}`);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.error(error instanceof Error ? error.message : "Failed to decrease quantity");
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

        {userFullName && favoriteItems.length > 0 && (
          <div className={styles.favoritesSection}>
            <h2 className={styles.favoritesTitle}>Your favourites</h2>
            {favoriteItems.length >= 5 ? (
              <div className={styles.carouselContainer}>
                <Slider {...favoritesSliderSettings} className={styles.slider}>
                  {favoriteItems.map((item) => (
                    <div key={item._id} className={styles.slideWrapper}>
                      <div className={styles.foodCard}>
                        <div className={styles.imageContainer}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.foodImage}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-image.png";
                            }}
                          />
                        </div>
                        <h4 className={styles.foodTitle}>{item.name}</h4>
                        <p className={styles.foodPrice}>₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className={styles.favoritesGrid}>
                {favoriteItems.map((item) => (
                  <div key={item._id} className={styles.foodCard}>
                    <div className={styles.imageContainer}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.foodImage}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                    <h4 className={styles.foodTitle}>{item.name}</h4>
                    <p className={styles.foodPrice}>₹{item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {Object.entries(categories).map(([category, types]) =>
          types.map((type) => {
            const key = `${category}-${type}`;
            const categoryItems = filteredItems[key] || [];
            
            // Don't render the section if there are no items
            if (categoryItems.length === 0) return null;

            return (
              <section key={key} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>
                    {type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h3>
                </div>
                <div className={styles.carouselContainer}>
                  <Slider {...sliderSettings} className={styles.slider}>
                    {categoryItems.map((item) => {
                      const cartItem = cartItems.find(cartItem => 
                        cartItem.itemId === item.id && 
                        cartItem.vendorId === item.vendorId
                      );
                      const quantity = cartItem?.quantity || 0;

                      return (
                        <div key={item.id} className={styles.slideWrapper}>
                          <div className={styles.foodCard}>
                            <div className={styles.imageContainer}>
                              <img src={item.image} alt={item.title} className={styles.foodImage} />
                            </div>
                            <h4 className={styles.foodTitle}>{item.title}</h4>
                            <p className={styles.foodPrice}>₹{item.price}</p>
                            {userFullName && (
                              quantity > 0 ? (
                                <div className={styles.quantityControls}>
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
                                </div>
                              ) : (
                                <button
                                  className={styles.addToCartButton}
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add to Cart
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </section>
            );
          })
        )}

        <div className={styles.specialSection}>
          <h2 className={styles.specialTitle}>Special Offers</h2>
          <div className={styles.carouselContainer}>
            <Slider {...sliderSettings} className={styles.slider}>
              {Object.values(items)
                .flat()
                .filter((item) => item.isSpecial === "Y")
                .map((item) => (
                  <div key={item.id} className={styles.slideWrapper}>
                    <div className={styles.foodCard}>
                      <div className={styles.imageContainer}>
                        <img src={item.image} alt={item.title} className={styles.foodImage} />
                      </div>
                      <h4 className={styles.foodTitle}>{item.title}</h4>
                      <p className={styles.foodPrice}>₹{item.price}</p>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>

        {/* Vendor Selection Modal */}
        {showVendorModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Select Vendor</h2>
              <div className={styles.vendorList}>
                {availableVendors.map((vendor) => (
                  <div
                    key={vendor._id}
                    className={`${styles.vendorItem} ${
                      selectedVendor?._id === vendor._id ? styles.selected : ""
                    }`}
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <h3>{vendor.name}</h3>
                    <p>₹{vendor.price}</p>
                  </div>
                ))}
              </div>
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowVendorModal(false);
                    setSelectedItem(null);
                    setSelectedVendor(null);
                    setAvailableVendors([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={handleVendorConfirm}
                  disabled={!selectedVendor}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegePageClient; 