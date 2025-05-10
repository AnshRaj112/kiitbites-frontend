
"use client";
import React, { useRef, useState, useEffect } from 'react';
import styles from './styles/Home.module.scss';
import FoodItems from '../components/FoodItems';

const HomePage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const fullName = localStorage.getItem("username") || "";
      const namePart = fullName.trim().split(" ")[0];
      setFirstName((prev) => (prev !== namePart ? namePart : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const updateButtonStates = () => {
    const el = scrollRef.current;
    if (el) {
      setIsAtStart(el.scrollLeft <= 0);
      setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateButtonStates();
    el.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);

    return () => {
      el.removeEventListener('scroll', updateButtonStates);
      window.removeEventListener('resize', updateButtonStates);
    };
  }, []);

  return (
    <div className={styles.homepage}>
      <div className={styles.pageWrapper}>
        {firstName && (
          <h2 className={styles.greeting}>
            {firstName}, what's on your mind?
          </h2>
        )}

        <div className={styles.headerRow}>
          <div className={styles.controls}>
            <button
              onClick={scrollLeft}
              disabled={isAtStart}
              className={isAtStart ? styles.disabledButton : ""}
            >
              &#8592;
            </button>
            <button
              onClick={scrollRight}
              disabled={isAtEnd}
              className={isAtEnd ? styles.disabledButton : ""}
            >
              &#8594;
            </button>
          </div>
        </div>
        
        <div className={styles.outerWrapper}>
          <div className={styles.scrollWrapper} ref={scrollRef}>
            <FoodItems layout="scroll" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
