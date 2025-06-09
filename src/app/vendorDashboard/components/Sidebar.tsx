// components/Sidebar.tsx
import {
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineApple,
  AiOutlineShopping,
  AiOutlineFileText,
  AiOutlineSync,
  AiOutlineSetting,
} from "react-icons/ai";
import styles from "../styles/SideBar.module.scss";

const segments = [
  { key: "dashboard", label: "Dashboard", icon: <AiOutlineDashboard /> },
  {
    key: "retail-inventory",
    label: "Retail Inventory",
    icon: <AiOutlineAppstore />,
  },
  {
    key: "produce-inventory",
    label: "Produce Inventory",
    icon: <AiOutlineApple />,
  },
  { key: "raw-materials", label: "Raw Materials", icon: <AiOutlineShopping /> },
  {
    key: "inventory-reports",
    label: "Inventory Reports",
    icon: <AiOutlineFileText />,
  },
  {
    key: "reorder-requests",
    label: "Reorder Requests",
    icon: <AiOutlineSync />,
  },
  { key: "settings", label: "Settings", icon: <AiOutlineSetting /> },
];

interface Props {
  active: string;
  onSegmentChange: (key: string) => void;
  vendorName?: string;
  vendorId?: string;
}

export default function Sidebar({
  active,
  onSegmentChange,
  vendorName = "—",
  vendorId = "—",
}: Props) {
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menu}>
        {segments.map((s) => (
          <li
            key={s.key}
            className={active === s.key ? styles.active : ""}
            onClick={() => onSegmentChange(s.key)}
          >
            <span className={styles.icon}>{s.icon}</span>
            <span className={styles.label}>{s.label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span className={styles.vendorName}>{vendorName}</span>
        <br />
        <span className={styles.vendorId}>ID: {vendorId}</span>
      </div>
    </aside>
  );
}
