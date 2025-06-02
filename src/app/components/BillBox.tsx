import styles from "./styles/BillBox.module.scss";
import { CartItem } from "../cart/types";

interface Props {
  items: CartItem[];
  onProceed: () => void;
}

const BillBox: React.FC<Props> = ({ items, onProceed }) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.billBox}>
      <h2>🧾 Your Bill</h2>
      <ul className={styles.billList}>
        {items.map((item) => (
          <li key={item._id}>
            <div className={styles.itemLine}>
              <span className={styles.name}>
                {item.name} x{item.quantity}
              </span>
              <span className={styles.price}>
                ₹{item.price * item.quantity}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <hr className={styles.divider} />
      <div className={styles.total}>
        <span>Total</span>
        <span>₹{total}</span>
      </div>
      <button onClick={onProceed}>Proceed to Payment</button>
    </div>
  );
};

export default BillBox;
