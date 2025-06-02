import { CartItem } from "../cart/types";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import styles from "./styles/CartItemCard.module.scss";

interface Props {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItemCard: React.FC<Props> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => (
  <div className={styles.card}>
    <div className={styles.left}>
      {item.image ? (
        <img src={item.image} alt={item.name} />
      ) : (
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#eee",
            borderRadius: "0.5rem",
          }}
        />
      )}
      <div>
        <h3>{item.name}</h3>
        <p>₹{item.price}</p>
      </div>
    </div>
    <div className={styles.controls}>
      <button
        onClick={() => onDecrease(item._id)}
        disabled={item.quantity === 1}
        title={
          item.quantity === 1 ? "Cannot reduce further" : "Decrease quantity"
        }
      >
        <FaMinus />
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => onIncrease(item._id)} title="Increase quantity">
        <FaPlus />
      </button>
      <button onClick={() => onRemove(item._id)} title="Remove item">
        <FaTrash />
      </button>
    </div>
  </div>
);

export default CartItemCard;
