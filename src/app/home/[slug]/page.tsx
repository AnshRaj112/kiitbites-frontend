"use client";

import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/global.css";
import styles from "./styles/CollegePage.module.scss";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FoodItem {
  id: number;
  title: string;
  image: string;
  category: string;
}

const foodItems: FoodItem[] = [
  { id: 1, title: "Spicy Chicken Burger", image: "/placeholder.svg", category: "Hot Picks" },
  { id: 2, title: "Margherita Pizza", image: "/placeholder.svg", category: "Hot Picks" },
  { id: 3, title: "Chicken Combo Meal", image: "/placeholder.svg", category: "Combos" },
  { id: 4, title: "Veg Burger + Fries", image: "/placeholder.svg", category: "Combos" },
  { id: 5, title: "Samosa Chat", image: "/placeholder.svg", category: "Quick Bites" },
  { id: 6, title: "Pav Bhaji", image: "/placeholder.svg", category: "Quick Bites" },
  { id: 7, title: "Fresh Lime Soda", image: "/placeholder.svg", category: "Drinks" },
  { id: 8, title: "Masala Chai", image: "/placeholder.svg", category: "Drinks" },
  { id: 9, title: "Chef's Special Thali", image: "/placeholder.svg", category: "Special" },
  { id: 10, title: "Paneer Tikka Roll", image: "/placeholder.svg", category: "Special" },
  { id: 11, title: "Butter Chicken", image: "/placeholder.svg", category: "Hot Picks" },
  { id: 12, title: "Veggie Deluxe", image: "/placeholder.svg", category: "Hot Picks" }
];

const categories = ["Hot Picks", "Combos", "Quick Bites", "Drinks", "Special"];

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

  const collegeDisplayName = collegeName?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "College";
  const displayName = userFullName ? userFullName.split(' ')[0] : "User";

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
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

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
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
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
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.greeting}>Hi {displayName}, what are you craving for at {collegeDisplayName}?</h1>
        
        {userFullName && (
          <div className={styles.favoritesSection}>
            <h2 className={styles.favoritesTitle}>Your favourites</h2>
            <div className={styles.carouselContainer}>
              <Slider {...favoritesSliderSettings} className={styles.slider}>
                {foodItems.slice(0, 8).map((item) => (
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
        
        {categories.map((category) => (
          <section key={category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h3 className={styles.categoryTitle}>{category}</h3>
            </div>
            <div className={styles.carouselContainer}>
              <Slider {...sliderSettings} className={styles.slider}>
                {foodItems.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default CollegePage;