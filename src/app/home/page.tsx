"use client";
import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Home.module.scss";
import FoodItems from "../components/FoodItems";

const HomePage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState("");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // ✅ Fetch user from API and handle fallback to "User" if not logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();
        const fullName = data?.fullName?.trim() || "";
        const spaceIndex = fullName.indexOf(" ");
        const namePart =
          spaceIndex > 0 ? fullName.slice(0, spaceIndex) : fullName;

        setFirstName(namePart || "User");
      } catch {
        console.warn("User not logged in. Using fallback greeting.");
        setFirstName("User");
      }
    };

    fetchUser();
  }, []);

  const scrollBy = (distance: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  const updateButtonStates = () => {
    const el = scrollRef.current;
    if (el) {
      setIsAtStart(el.scrollLeft <= 0);
      setIsAtEnd(Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const timeout = setTimeout(updateButtonStates, 100);
    el.addEventListener("scroll", updateButtonStates);
    window.addEventListener("resize", updateButtonStates);

    return () => {
      clearTimeout(timeout);
      el.removeEventListener("scroll", updateButtonStates);
      window.removeEventListener("resize", updateButtonStates);
    };
  }, []);

  return (
    <div className={styles.homepage}>
      <div className={styles.pageWrapper}>
        {firstName && (
          <h2 className={styles.greeting}>
            Hi {firstName}, what&apos;s on your mind?
          </h2>
        )}

        <div className={styles.scrollContainer}>
          <button
            onClick={() => scrollBy(-300)}
            disabled={isAtStart}
            className={`${styles.scrollButton} ${styles.leftButton} ${
              isAtStart ? styles.disabledButton : ""
            }`}
          >
            &#8592;
          </button>

          <div className={styles.scrollWrapper} ref={scrollRef}>
            <FoodItems layout="scroll" />
          </div>

          <button
            onClick={() => scrollBy(300)}
            disabled={isAtEnd}
            className={`${styles.scrollButton} ${styles.rightButton} ${
              isAtEnd ? styles.disabledButton : ""
            }`}
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
