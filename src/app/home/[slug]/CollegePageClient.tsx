"use client";

import { useSearchParams, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/global.css";
import styles from "./styles/CollegePage.module.scss";
import { useEffect, useRef, useState } from "react";

interface FoodItem {
  id: string;
  title: string;
  image: string;
  category: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
  price: number;
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

const CollegePageClient = () => {
  const { collegeName } = useParams<{ collegeName: string }>();
  const searchParams = useSearchParams();

  const [uniId, setUniId] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [items, setItems] = useState<{ [key: string]: FoodItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFavorites, setUserFavorites] = useState<FavoriteItem[]>([]);

  const currentRequest = useRef<number>(0);

  // Normalize college name for matching
  const normalizeName = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Update URL with college ID
  const updateUrlWithCollegeId = (collegeId: string) => {
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?cid=${collegeId}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Get college list and match collegeName to get actual college id
  const fetchCollegesAndSetUniId = async (collegeSlug: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch colleges");
      const colleges = (await response.json()) as College[];
      
      // Normalize the input slug
      const normalizedSlug = normalizeName(collegeSlug);
      
      // Find the college that matches the normalized slug
      const matchedCollege = colleges.find((college) => 
        normalizeName(college.name) === normalizedSlug
      );

      if (matchedCollege) {
        setUniId(matchedCollege._id);
        localStorage.setItem("currentCollegeId", matchedCollege._id);
        updateUrlWithCollegeId(matchedCollege._id);
        return true;
      } else {
        console.error(`No college found matching slug: ${collegeSlug}`);
        setError(`College not found: ${collegeSlug}`);
        return false;
      }
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setError("Failed to load college information");
      return false;
    }
  };

  // On load, determine uniId from multiple sources:
  useEffect(() => {
    // 1. Try from URL search param cid
    const cid = searchParams.get("cid");

    // 2. Try from URL path param collegeName (slug)
    // 3. Try localStorage fallback
    const localCollegeId = localStorage.getItem("currentCollegeId");

    const resolveCollegeId = async () => {
      if (cid) {
        // If cid is short id (length < 10), convert it
        if (cid.length < 10) {
          // Convert short id to full id by fetching list and matching
          try {
            const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, { credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch colleges");
            const colleges = (await response.json()) as College[];
            const found = colleges.find((c) => c._id.startsWith(cid));
            if (found) {
              setUniId(found._id);
              localStorage.setItem("currentCollegeId", found._id);
              updateUrlWithCollegeId(found._id);
              return;
            }
          } catch {
            // ignore error
          }
        } else {
          // Use full id directly
          setUniId(cid);
          localStorage.setItem("currentCollegeId", cid);
          updateUrlWithCollegeId(cid);
          return;
        }
      }

      if (collegeName) {
        const success = await fetchCollegesAndSetUniId(collegeName);
        if (success) return;
      }

      if (localCollegeId) {
        setUniId(localCollegeId);
        updateUrlWithCollegeId(localCollegeId);
      }
    };

    resolveCollegeId();
  }, [collegeName, searchParams]);

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
                type: item.type,
                isSpecial: item.isSpecial,
                collegeId: item.collegeId,
                price: item.price,
              }));
            })
          )
        );

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

    fetchItems();
  }, [uniId]);

  const getFavoriteItems = () => {
    if (!userFavorites || !Array.isArray(userFavorites)) return [];
    return userFavorites;
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
  const collegeDisplayName = collegeName
    ? collegeName.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "College";

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
            const categoryItems = items[key] || [];
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
                    {categoryItems.map((item) => (
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
      </div>
    </div>
  );
};

export default CollegePageClient; 