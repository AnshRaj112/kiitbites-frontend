import React from "react";
import styles from "./styles/SkeletonCard.module.scss";

interface SkeletonCardProps {
  animationClass?: string; // Optional now
  delay?: number; // Optional now
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ animationClass = "", delay = 0 }) => {
  return (
    <div className={`${styles.skeletonCard} ${animationClass}`} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonLinks}></div>
    </div>
  );
};

export default SkeletonCard;
