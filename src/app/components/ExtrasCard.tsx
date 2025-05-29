import { FoodItem } from "../cart/types";
import styles from "./styles/ExtraCard.module.scss";

interface Props {
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
}

const ExtrasCard: React.FC<Props> = ({ item, onAdd }) => (
  <div className={styles.card}>
    <img src={item.image || "/placeholder.png"} alt={item.name} />
    <h4>{item.name}</h4>
    <p>₹{item.price}</p>
    <button onClick={() => onAdd(item)}>Add to Cart</button>

  </div>
);

export default ExtrasCard;
