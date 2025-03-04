"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";
import { IoHelp, IoPersonOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import styles from "./styles/Header.module.scss";

const Header = () => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Body Class for Menu
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  // Handle Navigation with useCallback
  const handleNavigation = useCallback(
    (path) => {
      router.push(path);
      setMenuOpen(false);
    },
    [router]
  );

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={100} height={40} priority />
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
          <div className={styles.navItem} onClick={() => handleNavigation("/search")}>
            <IoMdSearch size={24} />
            <span>Search</span>
          </div>
          <div className={styles.navItem} onClick={() => handleNavigation("/help")}>
            <IoHelp size={24} />
            <span>Help</span>
          </div>
          <div className={styles.navItem} onClick={() => handleNavigation("/login")}>
            <IoPersonOutline size={24} />
            <span>Login</span>
          </div>
          <div className={styles.navItem} onClick={() => handleNavigation("/cart")}>
            <PiShoppingCartSimpleBold size={24} />
            <span>Cart</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <RxCross2 size={24} className={styles.crossIcon} /> : <FaBars size={24} />}
      </div>
    </header>
  );
};

export default Header;
