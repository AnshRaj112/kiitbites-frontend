"use client";

import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/global.css";
import styles from "./styles/CollegePage.module.scss";
import { useEffect, useState } from "react";

interface FoodItem {
  id: string;
  title: string;
  image: string;
  category: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
}

interface FavoriteItem {
  itemId: string;
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
}

interface College {
  _id: string;
  name: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const generateShortId = (collegeId: string): string => {
  return parseInt(collegeId.slice(0, 6), 16).toString(36);
};

const convertShortIdToCollegeId = async (shortId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch colleges');
    }
    
    const colleges = await response.json() as College[];
    
    const college = colleges.find((college) => 
      generateShortId(college._id) === shortId
    );
    
    return college ? college._id : null;
  } catch {
    return null;
  }
};

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

const CustomPrevArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <button onClick={onClick} className={`${styles.carouselButton} ${styles.prevButton}`}>
      <ChevronLeft size={20} />
    </button>
  );
};

const CustomNextArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <button onClick={onClick} className={`${styles.carouselButton} ${styles.nextButton}`}>
      <ChevronRight size={20} />
    </button>
  );
};

const CollegePage = () => {
  const { collegeName } = useParams<{ collegeName: string }>();
  const [userFullName, setUserFullName] = useState<string>("");
  const [items, setItems] = useState<{ [key: string]: FoodItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uniId, setUniId] = useState<string | null>(null);
  const [userFavorites, setUserFavorites] = useState<FavoriteItem[]>([]);

  const collegeDisplayName =
    collegeName?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "College";
  const displayName = userFullName ? userFullName.split(" ")[0] : "User";

  useEffect(() => {
    let isMounted = true;
    const getCollegeId = async () => {
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.substring(1));
      const hashCollegeId = hashParams.get('cid');
      const localCollegeId = localStorage.getItem("currentCollegeId");
      let collegeId = null;
      
      console.log("Getting college ID:", {
        hash,
        hashCollegeId,
        localCollegeId
      });
      
      if (hashCollegeId) {
        if (hashCollegeId.length < 10) {
          console.log("Converting short ID to college ID:", hashCollegeId);
          collegeId = await convertShortIdToCollegeId(hashCollegeId);
          console.log("Converted college ID:", collegeId);
        } else {
          collegeId = hashCollegeId;
        }
        
        if (collegeId && isMounted) {
          console.log("Setting currentCollegeId in localStorage:", collegeId);
          localStorage.setItem("currentCollegeId", collegeId);
          setUniId(collegeId);
        }
      } else if (localCollegeId && isMounted) {
        console.log("Using localCollegeId:", localCollegeId);
        setUniId(localCollegeId);
      }
      
      if (collegeId && isMounted) {
        const shortId = generateShortId(collegeId);
        if (!window.location.hash.includes('cid=')) {
          console.log("Updating hash with short ID:", shortId);
          window.location.hash = `cid=${shortId}`;
        }
      }
    };

    getCollegeId();

    return () => {
      isMounted = false;
    };
  }, [collegeName]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        console.log("Fetching user data...");
        const response = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data received:", data);
          
          setUserFullName(data.fullName);
          
          // Check if favorites exist and is an array
          if (data.favourites && Array.isArray(data.favourites)) {
            console.log("Setting user favorites:", data.favourites);
            setUserFavorites(data.favourites);
          } else {
            console.log("No favorites found in user data or invalid format");
            setUserFavorites([]);
          }
        } else {
          console.error("Failed to fetch user data:", response.status);
          setUserFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserFavorites([]);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      if (!uniId) return;

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching items for uniId:", uniId);

        const allItems: { [key: string]: FoodItem[] } = {};

        await Promise.all(
          Object.entries(categories).flatMap(([category, types]) =>
            types.map(async (type) => {
              if (!isMounted) return;
              
              const url = `${BACKEND_URL}/items/${category}/${type}/${uniId}`;
              console.log(`Fetching from URL: ${url}`);
              
              const response = await fetch(url, {
                credentials: "include",
              });

              if (response.ok && isMounted) {
                const data = (await response.json()) as ApiItem[];
                console.log(`Fetched items for ${category}-${type} (uniId: ${uniId}):`, {
                  count: data.length,
                  items: data.map(item => ({
                    id: item._id,
                    name: item.name,
                    collegeId: item.collegeId
                  }))
                });
                
                const key = `${category}-${type}`;
                allItems[key] = data.map((item) => ({
                  id: item._id,
                  title: item.name,
                  image: item.image,
                  category: type,
                  type: item.type,
                  isSpecial: item.isSpecial,
                  collegeId: item.collegeId,
                }));
              } else if (isMounted) {
                console.error(`Failed to fetch ${category}-${type}:`, {
                  status: response.status,
                  statusText: response.statusText
                });
              }
            })
          )
        );

        if (isMounted) {
          console.log("All fetched items for uniId:", uniId, allItems);
          setItems(allItems);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching items:", error);
          setError("Failed to load items. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [uniId]);

  // Add logging for uniId changes
  useEffect(() => {
    console.log("uniId changed to:", uniId);
  }, [uniId]);

  const getFavoriteItems = () => {
    if (!userFavorites || !Array.isArray(userFavorites) || userFavorites.length === 0 || !uniId) {
      console.log("No favorites to display - Initial check failed:", {
        hasUserFavorites: !!userFavorites,
        isArray: Array.isArray(userFavorites),
        favoritesLength: userFavorites?.length,
        uniId,
        userFavorites
      });
      return [];
    }

    // Get all items from all categories
    const allItems = Object.values(items).flat();
    
    // Create a map of all items by their ID for faster lookup
    const itemsMap = new Map(allItems.map(item => [item.id, item]));
    
    // Filter and map favorites to their corresponding items
    const favoriteItems = userFavorites
      .map(fav => {
        const item = itemsMap.get(fav.itemId);
        if (item) {
          console.log(`Found matching item for favorite ${fav.itemId}:`, {
            id: item.id,
            title: item.title,
            image: item.image,
            collegeId: item.collegeId,
            currentUniId: uniId
          });
          
          // Return the item if it exists in the current university
          return {
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            type: item.type,
            isSpecial: item.isSpecial,
            collegeId: item.collegeId || ''
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    console.log("Final favorite items to display:", favoriteItems);
    return favoriteItems;
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
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } },
    ],
  };

  const favoritesSliderSettings = {
    ...sliderSettings,
    slidesToShow: 5,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
    ],
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
      <div className={styles.content}>
        <h1 className={styles.greeting}>
          Hi {displayName}, what are you craving for at {collegeDisplayName}?
        </h1>

        {userFullName && favoriteItems.length > 0 && (
          <div className={styles.favoritesSection}>
            <h2 className={styles.favoritesTitle}>Your favourites</h2>
            <div className={styles.carouselContainer}>
              <Slider {...favoritesSliderSettings} className={styles.slider}>
                {favoriteItems.map((item) => (
                  <div key={item.id} className={styles.slideWrapper}>
                    <div className={styles.foodCard}>
                      <div className={styles.imageContainer}>
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className={styles.foodImage}
                          onError={(e) => {
                            console.error(`Failed to load image for item ${item.id}`);
                            e.currentTarget.src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                      <h4 className={styles.foodTitle}>{item.title}</h4>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
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

export default CollegePage;
