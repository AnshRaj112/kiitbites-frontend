import Slider, { Settings } from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem } from "../types";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  categoryItems: FoodItem[];
  categoryTitle: string;
  sliderSettings: Settings;
}

const categories = {
  retail: ["biscuits", "chips", "icecream", "drinks", "snacks", "sweets", "nescafe"],
  produce: ["combos-veg", "combos-nonveg", "veg", "shakes", "juices", "soups", "non-veg"]
};

const CategorySection = ({
  categoryItems,
  categoryTitle,
  sliderSettings,
}: CategorySectionProps) => {
  if (!categoryItems || categoryItems.length === 0) return null;

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryTitle}>
          {categoryTitle
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </h3>
      </div>
      <div className={styles.carouselContainer}>
        <Slider {...sliderSettings} className={styles.slider}>
          {categoryItems.map((item) => (
            <ProductCard key={item.id} item={item} categories={categories} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CategorySection; 