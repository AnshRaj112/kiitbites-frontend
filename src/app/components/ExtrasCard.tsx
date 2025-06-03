import { FoodItem } from "../cart/types";
import styles from "./styles/ExtraCard.module.scss";
import { Minus, Plus } from "lucide-react";

interface Props {
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  quantity: number;
}

const ExtrasCard: React.FC<Props> = ({ item, onAdd, onIncrease, onDecrease, quantity }) => (
  <div className={styles.card}>
    <img src={item.image || "/placeholder.png"} alt={item.name} />
    <h4>{item.name}</h4>
    <p>₹{item.price}</p>
    {/* Optional: display vendorId if useful */}
    {/* <small>Vendor: {item.vendorId}</small> */}
    {quantity === 0 ? (
      <button 
        className={styles.addToCartButton}
        onClick={() => onAdd(item)}
      >
        Add to Cart
      </button>
    ) : (
      <div className={styles.quantityControls}>
        <button
          className={styles.quantityButton}
          onClick={() => onDecrease(item._id)}
        >
          <Minus size={16} />
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          className={styles.quantityButton}
          onClick={() => onIncrease(item._id)}
        >
          <Plus size={16} />
        </button>
      </div>
    )}
  </div>
);

export default ExtrasCard;
