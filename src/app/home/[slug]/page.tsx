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

interface ApiItem {
  _id: string;
  name: string;
  image: string;
  type: string;
  isSpecial: string;
  collegeId?: string;
}

interface College {
  _id: string;
  name: string;
  // Add other college properties as needed
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Function to generate a short ID from a college ID
const generateShortId = (collegeId: string): string => {
  // Take first 6 characters of the college ID and convert to base36
  return parseInt(collegeId.slice(0, 6), 16).toString(36);
};

// Function to convert short ID back to original college ID
const convertShortIdToCollegeId = async (shortId: string): Promise<string | null> => {
  try {
    // Fetch all colleges from backend
    const response = await fetch(`${BACKEND_URL}/api/user/auth/list`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch colleges');
    }
    
    const colleges = await response.json() as College[];
    
    // Find the college that matches the short ID
    const college = colleges.find((college) => 
      generateShortId(college._id) === shortId
    );
    
    return college ? college._id : null;
  } catch (error) {
    console.error('Error converting short ID:', error);
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
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  const collegeDisplayName =
    collegeName?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "College";
  const displayName = userFullName ? userFullName.split(" ")[0] : "User";

  useEffect(() => {
    const getCollegeId = async () => {
      // First try to get from URL hash
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.substring(1));
      const hashCollegeId = hashParams.get('cid');
      
      // Then try localStorage
      const localCollegeId = localStorage.getItem("currentCollegeId");
      
      let collegeId = null;
      
      // If we have a hash college ID, use it
      if (hashCollegeId) {
        // Check if it's a short ID (less than 10 characters)
        if (hashCollegeId.length < 10) {
          collegeId = await convertShortIdToCollegeId(hashCollegeId);
        } else {
          collegeId = hashCollegeId;
        }
        
        if (collegeId) {
          localStorage.setItem("currentCollegeId", collegeId);
        }
      } else if (localCollegeId) {
        collegeId = localCollegeId;
      }
      
      if (collegeId) {
        // Update URL hash with short ID
        const shortId = generateShortId(collegeId);
        if (!window.location.hash.includes('cid=')) {
          window.location.hash = `cid=${shortId}`;
        }
        return collegeId;
      }
      
      return null;
    };

    getCollegeId().then(collegeId => {
      if (collegeId) {
        setUniId(collegeId);
      } else {
        setError("College ID not found");
      }
    });
  }, [collegeName]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserFullName(data.fullName);
          setUserFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (!uniId) return;

      try {
        setLoading(true);
        setError(null);

        const allItems: { [key: string]: FoodItem[] } = {};

        await Promise.all(
          Object.entries(categories).flatMap(([category, types]) =>
            types.map(async (type) => {
              const response = await fetch(
                `${BACKEND_URL}/items/${category}/${type}/${uniId}`,
                {
                  credentials: "include",
                }
              );

              if (response.ok) {
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
                }));
              }
            })
          )
        );

        setItems(allItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [uniId]);

  const getFavoriteItems = () => {
    if (!userFavorites.length || !uniId) return [];
    return Object.values(items)
      .flat()
      .filter((item) => userFavorites.includes(item.id) && item.collegeId === uniId);
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
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
    ],
  };

  const favoritesSliderSettings = {
    ...sliderSettings,
    slidesToShow: 5,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
      },
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
                        <img src={item.image} alt={item.title} className={styles.foodImage} />
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
