// components/DateFilter.tsx
import { FiCalendar, FiFilter } from "react-icons/fi";
import styles from "../styles/DateFilter.module.scss";

interface Props {
  date: string;
  onChange: (d: string) => void;
}

export default function DateFilter({ date, onChange }: Props) {
  return (
    <div className={styles.dateFilter}>
      <FiCalendar className={styles.calendarIcon} />
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className={styles.filterBtn}>
        <FiFilter /> Filter
      </button>
    </div>
  );
}
