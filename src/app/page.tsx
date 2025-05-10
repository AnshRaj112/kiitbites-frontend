

"use client";

import FoodItems from "./components/FoodItems";
import Header from "./components/Header";
import styles from './page.module.scss';
<Header showGetApp={true} showProfile={true} />

export default function Landing() {
  return (
    <div className={styles.homepage}>
      <main className={styles.main}>
        <h1>Order food on campus. Fast. Delicious!!</h1>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for Food Courts"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <h3>Faster Service</h3>
            <p>From your favorite food courts</p>
          </div>
          <div className={styles.card}>
            <h3>Instant Snacks</h3>
            <p>Get quick bites anytime</p>
          </div>
          <div className={styles.card}>
            <h3>No more Queue</h3>
            <p>Faster payment</p>
          </div>
        </div>

        <FoodItems customClass={styles.gridLayout} limit={10} />

      </main>
    </div>
  );
}