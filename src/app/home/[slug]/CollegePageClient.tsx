"use client";

import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/global.css";
import styles from "./styles/CollegePage.module.scss";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoritesSection from "./components/FavoritesSection";
import SpecialOffersSection from "./components/SpecialOffersSection";
import CategorySection from "./components/CategorySection";
import { CartProvider } from "./context/CartContext";
import {
  FoodItem,
  FavoriteItem,
  College,
  ApiFavoritesResponse,
  ApiItem,
} from "./types";

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
                vendorId: item.vendorId || null,
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

  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.greeting}>Please login to continue</h1>
        </div>
      </div>
    );
  }

  return (
    <CartProvider userId={userId}>
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
            Hi{" "}
            <span style={{ color: "#4ea199" }}>
              {userFullName.split(" ")[0]}
            </span>
            , what are you craving for{" "}
            {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}?
          </h1>

          {Object.entries(categories).map(([category, types]) =>
            types.map((type) => {
              const key = `${category}-${type}`;
              const categoryItems = items[key] || [];

              return (
                <CategorySection
                  key={key}
                  categoryItems={categoryItems}
                  categoryTitle={type}
                  sliderSettings={sliderSettings}
                />
              );
            })
          )}

          <FavoritesSection
            favoriteItems={userFavorites}
            convertFavoriteToFoodItem={convertFavoriteToFoodItem}
            sliderSettings={sliderSettings}
          />

          <SpecialOffersSection items={items} sliderSettings={sliderSettings} />
        </div>
      </div>
    </CartProvider>
  );
};

export default CollegePageClient;
