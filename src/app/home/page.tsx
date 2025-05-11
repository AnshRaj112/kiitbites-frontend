"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Home.module.scss";
import FoodItems from "../components/FoodItems";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const HomePage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`${BACKEND_URL}/api/auth/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  return (
    <div className={styles.homepage}>
      <div className={styles.pageWrapper}>
        <div className={styles.headerRow}>
          {firstName && (
            <h2 className={styles.greeting}>
              Hi {firstName}, what&apos;s on your mind?
            </h2>
          )}
        </div>

        <div className={styles.scrollWrapper} ref={scrollRef}>
          <FoodItems layout="scroll" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
