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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define categories and their types
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
    <button
      onClick={onClick}
      className={`${styles.carouselButton} ${styles.prevButton}`}
    >
      <ChevronLeft size={20} />
    </button>
  );
};

const CustomNextArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className={`${styles.carouselButton} ${styles.nextButton}`}
    >
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
    collegeName?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "College";
  const displayName = userFullName ? userFullName.split(" ")[0] : "User";

  useEffect(() => {
    const collegeId = localStorage.getItem("currentCollegeId");
    if (collegeId) {
      setUniId(collegeId);
    } else {
      setError("College ID not found");
    }
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
      if (!uniId) return; // Don't fetch items until we have the uniId

      try {
        setLoading(true);
        setError(null);

        // Fetch items for each category and type
        const allItems: { [key: string]: FoodItem[] } = {};

        for (const [category, types] of Object.entries(categories)) {
          for (const type of types) {
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
          }
        }

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

  // Helper function to get favorite items for current college
  const getFavoriteItems = () => {
    if (!userFavorites.length || !uniId) return [];
    
    return Object.values(items)
      .flat()
      .filter(item => 
        userFavorites.includes(item.id) && 
        item.collegeId === uniId
      );
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
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const favoritesSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
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
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.foodImage}
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
                    {type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h3>
                </div>
                <div className={styles.carouselContainer}>
                  <Slider {...sliderSettings} className={styles.slider}>
                    {categoryItems.map((item) => (
                      <div key={item.id} className={styles.slideWrapper}>
                        <div className={styles.foodCard}>
                          <div className={styles.imageContainer}>
                            <img
                              src={item.image}
                              alt={item.title}
                              className={styles.foodImage}
                            />
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

        {/* Special Items Section - Moved to the end */}
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
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.foodImage}
                        />
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
