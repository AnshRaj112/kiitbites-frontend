// components/DownloadButton.tsx
import { FiDownload } from "react-icons/fi";
import styles from "../styles/DateFilter.module.scss";

export default function DownloadButton() {
  return (
    <button className={styles.download}>
      <FiDownload /> Download Report
    </button>
  );
}
