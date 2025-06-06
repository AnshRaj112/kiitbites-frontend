import { Plus, Minus } from "lucide-react";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem, CartItem } from "../types";

interface CartItemDisplayProps {
  item: FoodItem;
  cartItems: CartItem[];
  userFullName: string;
  onAddToCart: (item: FoodItem) => void;
  onIncreaseQuantity: (item: FoodItem) => void;
  onDecreaseQuantity: (item: FoodItem) => void;
}

const CartItemDisplay = ({
  item,
  cartItems,
  userFullName,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: CartItemDisplayProps) => {
  const cartItem = cartItems.find(
    (cartItem) =>
      cartItem.itemId === item.id && cartItem.vendorId === item.vendorId
  );
  const quantity = cartItem?.quantity || 0;

  return (
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
              onClick={() => onDecreaseQuantity(item)}
            >
              <Minus size={16} />
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => onIncreaseQuantity(item)}
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button
            className={styles.addToCartButton}
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
        ))}
    </div>
  );
};

export default CartItemDisplay; 