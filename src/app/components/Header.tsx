"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { IoHelp, IoPersonOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import styles from "./styles/Header.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50); // Change header when scrolled past 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </Link>
      </div>

      <div className={styles.navOptions}>
        <div className={styles.navItem} onClick={() => router.push("/search")}>
          <IoMdSearch size={20} />
          <span>Search</span>
        </div>

        <div className={styles.navItem} onClick={() => router.push("/help")}>
          <IoHelp size={20} />
          <span>Help</span>
        </div>

        <div className={styles.navItem} onClick={() => router.push("/login")}>
          <IoPersonOutline size={20} />
          <span>LogIn</span>
        </div>

        <div className={styles.navItem} onClick={() => router.push("/cart")}>
          <PiShoppingCartSimpleBold size={20} />
          <span>Cart</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
