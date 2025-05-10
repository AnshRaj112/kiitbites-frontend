

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { IoMdSearch } from "react-icons/io";
import { IoHelp, IoPersonOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuArrowUpRight } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";

import styles from "./styles/Header.module.scss";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface HeaderProps {
  showGetApp?: boolean;
  showProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showGetApp = true,
  showProfile = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const [scrolling, setScrolling] = useState(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <p>KIITBites</p>
        </Link>
      </div>

      {isLandingPage ? (
        <div className={styles.navOptions}>
          <div className={styles.menuBox}>
            {showGetApp && (
              <div
                className={styles.navItem}
                onClick={() => handleNavigation("/login")}
              >
                <LuArrowUpRight size={18} />
                <span>GET THE APP</span>
              </div>
            )}

            {showProfile && (
              <div className={styles.profileContainer} ref={dropdownRef}>
                <div
                  className={styles.profileIcon}
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <FaUserCircle size={32} />
                </div>
                {showDropdown && (
                    <div className={styles.dropdownWrapper}>
    <div className={styles.dropdownArrow}></div>
                  <div className={styles.dropdownMenu}>
                    <a href="/profile">Profile</a>
                    <a href="/orders">Orders</a>
                    <a href="/favourites">Favourites</a>
                    <a href="/logout">Logout</a>
                  </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <nav className={styles.navOptions}>
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
      )}
    </header>
  );
};

export default Header;
