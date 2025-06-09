import { InventoryItem } from "../types";
import styles from "../styles/InventoryTable.module.scss";

interface Props {
  items: InventoryItem[];
  date: string;
}

export default function InventoryTable({ items, date }: Props) {
  return (
    <div className={styles.tableWrap}>
      <h3>Daily Inventory Report – {new Date(date).toDateString()}</h3>
      <p className={styles.sub}>
        Opening stock, movements, and closing balances
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Opening Stock</th>
              <th>Received</th>
              <th>Sold</th>
              <th>Closing Stock</th>
              <th>Item Type</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.name}</td>
                <td>{it.opening}</td>
                <td className={styles.received}>+{it.received}</td>
                <td className={styles.sold}>-{it.sold}</td>
                <td>{it.closing}</td>
                <td>{it.itemType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
