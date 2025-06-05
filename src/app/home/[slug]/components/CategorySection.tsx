import { Plus, Minus } from "lucide-react";
import Slider, { Settings } from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem, CartItem } from "../types";

interface CategorySectionProps {
  categoryItems: FoodItem[];
  cartItems: CartItem[];
  userFullName: string;
  categoryTitle: string;
  sliderSettings: Settings;
  handleAddToCart: (item: FoodItem) => void;
  handleIncreaseQuantity: (item: FoodItem) => void;
  handleDecreaseQuantity: (item: FoodItem) => void;
}

const CategorySection = ({
  categoryItems,
  cartItems = [],
  userFullName,
  categoryTitle,
  sliderSettings,
  handleAddToCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
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
          {categoryItems.map((item) => {
            const cartItem = Array.isArray(cartItems) ? cartItems.find(
              (cartItem) =>
                cartItem.itemId === item.id &&
                cartItem.vendorId === item.vendorId
            ) : null;
            const quantity = cartItem?.quantity || 0;

            return (
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
                  <p className={styles.foodPrice}>₹{item.price}</p>
                  {userFullName &&
                    (quantity > 0 ? (
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.quantity}>{quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className={styles.addToCartButton}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default CategorySection; 