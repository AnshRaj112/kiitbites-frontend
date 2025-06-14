import Slider, { Settings } from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem } from "../types";
import ProductCard from "./ProductCard";

interface SpecialOffersSectionProps {
  items: { [key: string]: FoodItem[] };
  sliderSettings: Settings;
  userId?: string | null;
}

const categories = {
  retail: ["biscuits", "chips", "icecream", "drinks", "snacks", "sweets", "nescafe"],
  produce: ["combos-veg", "combos-nonveg", "veg", "shakes", "juices", "soups", "non-veg"]
};

const SpecialOffersSection = ({ items, sliderSettings, userId }: SpecialOffersSectionProps) => {
  // Flatten all items and filter for special items
  const specialItems = Object.values(items)
    .flat()
    .filter((item) => item.isSpecial);

  if (specialItems.length === 0) return null;

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryTitle}>Special Offers</h3>
      </div>
      <div className={styles.carouselContainer}>
        <Slider {...sliderSettings} className={styles.slider}>
          {specialItems.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              categories={categories} 
              userId={userId}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SpecialOffersSection; 