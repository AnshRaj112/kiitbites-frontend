import styles from "../styles/StatCard.module.scss";

interface Props {
  label: string;
  value: number | string;
  positive?: boolean;
  warning?: boolean;
}

export default function StatCard({ label, value, positive, warning }: Props) {
  const cardClass = positive
    ? styles.positive
    : warning
    ? styles.warning
    : styles.default;

  return (
    <div className={`${styles.card} ${cardClass}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
