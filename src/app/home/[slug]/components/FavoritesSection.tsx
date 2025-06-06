import Slider from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FavoriteItem, FoodItem } from "../types";
import ProductCard from "./ProductCard";

const categories = {
  retail: ["biscuits", "chips", "icecream", "drinks", "snacks", "sweets", "nescafe"],
  produce: ["combos-veg", "combos-nonveg", "veg", "shakes", "juices", "soups", "non-veg"]
};

interface FavoritesSectionProps {
  favoriteItems: FavoriteItem[];
  convertFavoriteToFoodItem: (item: FavoriteItem) => FoodItem;
}

const FavoritesSection = ({
  favoriteItems,
  convertFavoriteToFoodItem,
}: FavoritesSectionProps) => {
  if (favoriteItems.length === 0) return null;

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryTitle}>Your Favorites</h3>
      </div>
      <div className={styles.carouselContainer}>
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={4}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3000}
          pauseOnHover={true}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
          ]}
          className={styles.slider}
        >
          {favoriteItems.map((item) => (
            <ProductCard
              key={item._id}
              item={convertFavoriteToFoodItem(item)}
              categories={categories}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FavoritesSection;
