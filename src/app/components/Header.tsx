"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdSearch } from "react-icons/io";
import { IoHelp, IoPersonOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import styles from "./styles/Header.module.scss";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Header: React.FC = () => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock/Unlock Scrolling when Menu Opens
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Fetch User Data or Use Mock User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!BACKEND_URL) {
          // Mock user data (REMOVE THIS WHEN BACKEND IS READY)
          setUserFullName("Demo User");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/user`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserFullName(data.fullName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  // Handle Navigation with Type Annotation
  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
      setMenuOpen(false);
    },
    [router]
  );

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      {/* Mobile Menu Toggle */}
      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
          <RxCross2 size={24} className={styles.menuToggleIcon} />
        ) : (
          <FaBars size={24} />
        )}
      </div>

      {/* KIITBites Logo */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <p>KIITBites</p>
        </Link>
      </div>

      {/* Overlay for Mobile Menu */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.showOverlay : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Navigation Options */}
      <nav className={`${styles.navOptions} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.menuBox}>
          <div
            className={styles.navItem}
            onClick={() => handleNavigation("/search")}
          >
            <IoMdSearch size={24} />
            <span>Search</span>
          </div>
          <div
            className={styles.navItem}
            onClick={() => handleNavigation("/help")}
          >
            <IoHelp size={24} />
            <span>Help</span>
          </div>
          <div
            className={styles.navItem}
            onClick={() =>
              handleNavigation(userFullName ? "/profile" : "/login")
            }
          >
            <IoPersonOutline size={24} />
            <span>{userFullName || "Login"}</span>
          </div>
          <div
            className={styles.navItem}
            onClick={() => handleNavigation("/cart")}
          >
            <PiShoppingCartSimpleBold size={24} />
            <span>Cart</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
