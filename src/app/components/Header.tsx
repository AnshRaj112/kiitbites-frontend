"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { IoHelp, IoPersonOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import styles from "./styles/Header.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [menuOpen]);

  const handleNavigation = (path) => {
    router.push(path);
    setMenuOpen(false); // Close navbar on navigation
  };

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </Link>
      </div>

      <div className={`${styles.overlay} ${menuOpen ? styles.showOverlay : ""}`} onClick={() => setMenuOpen(false)}></div>
      
      <div className={`${styles.navOptions} ${menuOpen ? styles.open : ""}`}>
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
      </div>

      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <RxCross2 size={24} className={styles.crossIcon} /> : <FaBars size={24} />}
      </div>
    </header>
  );
};

export default Header;
