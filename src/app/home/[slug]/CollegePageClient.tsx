"use client";

import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [filteredItems, setFilteredItems] = useState<{
    [key: string]: FoodItem[];
  }>({});

  const currentRequest = useRef<number>(0);

  /** Helper: Normalize a college name into a slug-like form */
  const normalizeName = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") || "";

  /** Update the browser URL to include ?cid=<collegeId> without reloading the page */
  const updateUrlWithCollegeId = (collegeId: string) => {
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?cid=${collegeId}`;
    window.history.replaceState({}, "", newUrl);
  };

  /**
   * Fetch the full list of colleges, match by slug, and set uniId if found.
   * Returns true if a match was found; false otherwise.
   */
  const fetchCollegesAndSetUniId = async (collegeSlug: string) => {
    try {
      setLoading(true);
      const resp = await fetch(`${BACKEND_URL}/api/user/auth/list`, {
        credentials: "include",
      });
      if (!resp.ok) throw new Error("Failed to fetch colleges");

      const colleges = (await resp.json()) as College[];
      const normalizedSlug = normalizeName(collegeSlug);

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
        if (colleges.length > 0) {
          setError(`College not found: ${collegeSlug}`);
        }
        setLoading(false);
        return false;
      }
    } catch {
      setError("Failed to load college information");
      setLoading(false);
      return false;
    }
  };

  /**
   * On component mount (or when slug/searchParams change), resolve uniId from:
   *  1) URL query param `cid`
   *  2) If `cid` is short (<10 chars), do a prefix match against all colleges
   *  3) If there's a slug prop, fetch colleges by name
   *  4) localStorage fallback
   */
  useEffect(() => {
    let isMounted = true;

    const resolveCollegeId = async () => {
      const cidParam = searchParams.get("cid");
      const localCollegeId = localStorage.getItem("currentCollegeId");

      if (cidParam) {
        if (cidParam.length < 10) {
          try {
            const resp = await fetch(`${BACKEND_URL}/api/user/auth/list`, {
              credentials: "include",
            });
            if (resp.ok) {
              const colleges = (await resp.json()) as College[];
              const found = colleges.find((c) => c._id.startsWith(cidParam));
              if (found && isMounted) {
                setUniId(found._id);
                localStorage.setItem("currentCollegeId", found._id);
                updateUrlWithCollegeId(found._id);
                return;
              }
            }
          } catch {
            /* ignore */
          }
        } else {
          if (isMounted) {
            setUniId(cidParam);
            localStorage.setItem("currentCollegeId", cidParam);
            updateUrlWithCollegeId(cidParam);
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

  /**
   * Once uniId is available, fetch the user's details and favorites.
   */
  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token || !uniId) return;

      try {
        // Fetch user data (contains userId and fullName)
        const userResp = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResp.ok) return;
        const userData = await userResp.json();
        setUserFullName(userData.fullName);
        setUserId(userData._id);

        // Fetch this user's favorites for the current college
        const favResp = await fetch(
          `${BACKEND_URL}/fav/${userData._id}/${uniId}`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!favResp.ok) return;
        const favData = (await favResp.json()) as ApiFavoritesResponse;
        setUserFavorites(favData.favourites);
      } catch {
        setUserFavorites([]);
      }
    };

    fetchUserAndFavorites();
  }, [uniId]);

  /**
   * Once uniId is set, fetch all menu items for each category/type in parallel.
   * Uses a "requestId" to ensure that only the latest request "wins" (cancels stale state updates).
   */
  useEffect(() => {
    if (!uniId) return;

    const requestId = ++currentRequest.current;
    const fetchAllItems = async () => {
      setLoading(true);
      setError(null);
      const allItems: { [key: string]: FoodItem[] } = {};

      try {
        await Promise.all(
          Object.entries(categories).flatMap(([category, types]) =>
            types.map(async (type) => {
              const url = `${BACKEND_URL}/items/${category}/${type}/${uniId}`;
              const resp = await fetch(url, { credentials: "include" });
              if (!resp.ok) return;
              const data = (await resp.json()) as ApiItem[];
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

        // Only set state if this is the most recent request
        if (requestId === currentRequest.current) {
          setItems(allItems);
          setLoading(false);
        }
      } catch {
        if (requestId === currentRequest.current) {
          setError("Failed to load items.");
          setLoading(false);
        }
      }
    };

    fetchAllItems();
  }, [uniId]);

  /**
   * Whenever userId changes (i.e., once we get it), fetch the cart items.
   * Also sets currentVendorId based on items in cart (if any).
   */
  useEffect(() => {
    const loadCartItems = async () => {
      if (!userId) {
        setCartItems([]);
        return;
      }
      try {
        const cartData = await fetchCartItems(userId);
        setCartItems(cartData || []);

        if (cartData && cartData.length > 0) {
          const vendorId = cartData[0].vendorId;
          setCurrentVendorId(vendorId);
          localStorage.setItem("currentVendorId", vendorId);
        } else {
          setCurrentVendorId(null);
          localStorage.removeItem("currentVendorId");
        }
      } catch {
        setCartItems([]);
      }
    };

    loadCartItems();
  }, [userId]);

  /** On initial mount, read any saved vendorId from localStorage */
  useEffect(() => {
    const savedVendorId = localStorage.getItem("currentVendorId");
    if (savedVendorId) {
      setCurrentVendorId(savedVendorId);
    }
  }, []);

  /**
   * Convert a FavoriteItem into a FoodItem (used by FavoritesSection).
   */
  const convertFavoriteToFoodItem = (item: FavoriteItem): FoodItem => {
    const isRetail = categories.retail.includes(item.kind);
    return {
      id: item._id,
      title: item.name,
      image: item.image,
      category: item.kind,
      type: isRetail ? "retail" : "produce",
      isSpecial: item.isSpecial,
      price: item.price,
      vendorId: item.vendorId,
    };
  };

  /**
   * Return a deduplicated array of favorite items (unique by `_id` + `vendorId`).
   */
  const getUniqueFavoriteItems = (): FavoriteItem[] => {
    if (!userFavorites || !Array.isArray(userFavorites)) return [];
    const uniqueMap = new Map<string, FavoriteItem>();
    userFavorites.forEach((item) => {
      const key = `${item._id}-${item.vendorId}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    return Array.from(uniqueMap.values());
  };
  const favoriteItems = getUniqueFavoriteItems();

  /** Slider settings stay the same */
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

  /**
   * For a list of FoodItems, fetch vendor availability and return only those items that
   * are in-stock for the currentVendorId. If no currentVendorId, return the items unchanged.
   */
  const filterItemsByVendor = async (itemsToFilter: FoodItem[]) => {
    if (!currentVendorId) {
      return itemsToFilter;
    }

    try {
      const availableItems = await Promise.all(
        itemsToFilter.map(async (item) => {
          try {
            const resp = await fetch(
              `${BACKEND_URL}/items/vendors/${item.id}`,
              {
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (!resp.ok) return null;
            const vendors = (await resp.json()) as Vendor[];

            // Keep only vendors where inventoryValue indicates availability
            const filteredVendors = vendors.filter((vendor) => {
              if (!vendor.inventoryValue) return false;
              if (item.type === "retail") {
                const qty = vendor.inventoryValue.quantity;
                return typeof qty === "number" && qty > 0;
              } else {
                return vendor.inventoryValue.isAvailable === "Y";
              }
            });
            return filteredVendors.length > 0 ? item : null;
          } catch {
            return null;
          }
        })
      );
      return (availableItems.filter((i): i is FoodItem => i !== null) as FoodItem[]);
    } catch {
      return [];
    }
  };

  /**
   * Whenever `items` or `currentVendorId` changes, recalculate `filteredItems`.
   */
  useEffect(() => {
    const updateFilteredItems = async () => {
      const newFiltered: { [key: string]: FoodItem[] } = {};

      await Promise.all(
        Object.entries(items).map(async ([key, itemList]) => {
          newFiltered[key] = currentVendorId
            ? await filterItemsByVendor(itemList)
            : itemList;
        })
      );
      setFilteredItems(newFiltered);
    };
    updateFilteredItems();
  }, [items, currentVendorId]);

  /**
   * Handle the "Add to Cart" button click.
   * - If userId is missing, show an error toast.
   * - If cart already has items, check vendor match and availability.
   * - If cart is empty, fetch availability across vendors and show modal.
   */
  const handleAddToCart = async (item: FoodItem) => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      return;
    }

    // If cart already has items, ensure same-vendor rule and check availability
    if (cartItems.length > 0 && currentVendorId) {
      if (item.vendorId !== currentVendorId) {
        toast.error("You can only add items from the same vendor");
        return;
      }

      const isFav = userFavorites.some((fav) => fav._id === item.id);
      const { isAvailable } = isFav
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
        toast.error("Item is not available at the moment");
        return;
      }

      const success = await addToCart(userId, item, currentVendorId);
      if (success) {
        const updatedCart = await fetchCartItems(userId);
        setCartItems(updatedCart);
        localStorage.setItem("currentVendorId", currentVendorId);
      }
      return;
    }

    // If cart is empty, check availability across all vendors
    const isFav = userFavorites.some((fav) => fav._id === item.id);
    const { vendors } = isFav
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

    if (!vendors || vendors.length === 0) {
      toast.error("No vendors have this item available at the moment");
      return;
    }

    setAvailableVendors(vendors);
    setSelectedItem(item);
    setShowVendorModal(true);
  };

  /** When a vendor is selected in the modal, store that choice in state. */
  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  /** Once the user confirms a vendor, actually add the item to cart under that vendorId */
  const handleVendorConfirm = async () => {
    if (!selectedItem || !selectedVendor || !userId) return;

    const success = await addToCart(userId, selectedItem, selectedVendor._id);
    if (success) {
      const updatedCart = await fetchCartItems(userId);
      setCartItems(updatedCart);
      if (updatedCart.length > 0) {
        setCurrentVendorId(selectedVendor._id);
        localStorage.setItem("currentVendorId", selectedVendor._id);
      }
      setShowVendorModal(false);
      setSelectedItem(null);
      setSelectedVendor(null);
      setAvailableVendors([]);
    }
  };

  /** Increase the quantity of an item already in cart */
  const handleIncreaseQuantity = async (item: FoodItem) => {
    if (!userId) return;
    const success = await increaseQuantity(userId, item);
    if (success) {
      const updatedCart = await fetchCartItems(userId);
      setCartItems(updatedCart);
    }
  };

  /** Decrease the quantity of an item already in cart; if final removal, clear currentVendorId */
  const handleDecreaseQuantity = async (item: FoodItem) => {
    if (!userId) return;
    const success = await decreaseQuantity(userId, item);
    if (success) {
      const updatedCart = await fetchCartItems(userId);
      setCartItems(updatedCart);
      if ((updatedCart || []).length === 0) {
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

        <SpecialOffersSection
          items={items}
          sliderSettings={sliderSettings}
          cartItems={cartItems}
          userFullName={userFullName}
          handleAddToCart={handleAddToCart}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
        />

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