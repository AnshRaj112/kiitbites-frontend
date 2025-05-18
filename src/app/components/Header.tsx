"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { IoMdSearch } from "react-icons/io";
import { IoHelp, IoPersonOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Optional: Notify backend to invalidate the session
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Clear token and redirect
      localStorage.removeItem("token");
      setUserFullName(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [menuOpen, isMobile]);

  const handleNavigation = useCallback(
    (path: string) => {
      setMenuOpen(false);
      router.push(path);
    },
    [router]
  );

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dt45pu5mx/image/upload/v1747555898/logo_u1ndj9.png"
            alt="BiteBay Logo"
            width={150} // adjust width as needed
            height={50} // adjust height as needed
          />
        </Link>
      </div>

      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
          <RxCross2 size={24} className={styles.menuToggleIcon} />
        ) : (
          <FaBars size={24} />
        )}
      </div>

      {!isLandingPage && menuOpen && isMobile && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {!isLandingPage ? (
        isMobile ? (
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                className={styles.navOptions}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className={styles.menuBox}>
                  <div
                    className={`${styles.navItem} ${
                      pathname === "/search" ? styles.activeNavItem : ""
                    }`}
                    onClick={() => handleNavigation("/search")}
                  >
                    <IoMdSearch size={24} />
                    <span>Search</span>
                  </div>
                  <div
                    className={`${styles.navItem} ${
                      pathname === "/help" ? styles.activeNavItem : ""
                    }`}
                    onClick={() => handleNavigation("/help")}
                  >
                    <IoHelp size={24} />
                    <span>Help</span>
                  </div>
                  <div
                    className={`${styles.navItem} ${
                      pathname === "/profile" || pathname === "/login"
                        ? styles.activeNavItem
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigation(userFullName ? "/profile" : "/login")
                    }
                  >
                    <IoPersonOutline size={24} />
                    <span>{userFullName || "Login"}</span>
                  </div>
                  <div
                    className={`${styles.navItem} ${
                      pathname === "/cart" ? styles.activeNavItem : ""
                    }`}
                    onClick={() => handleNavigation("/cart")}
                  >
                    <PiShoppingCartSimpleBold size={24} />
                    <span>Cart</span>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        ) : (
          <nav className={styles.navOptions}>
            <div className={styles.menuBox}>
              <div
                className={`${styles.navItem} ${
                  pathname === "/search" ? styles.activeNavItem : ""
                }`}
                onClick={() => handleNavigation("/search")}
              >
                <IoMdSearch size={24} />
                <span>Search</span>
              </div>
              <div
                className={`${styles.navItem} ${
                  pathname === "/help" ? styles.activeNavItem : ""
                }`}
                onClick={() => handleNavigation("/help")}
              >
                <IoHelp size={24} />
                <span>Help</span>
              </div>
              <div
                className={`${styles.navItem} ${
                  pathname === "/profile" || pathname === "/login"
                    ? styles.activeNavItem
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(userFullName ? "/profile" : "/login")
                }
              >
                <IoPersonOutline size={24} />
                <span>{userFullName || "Login"}</span>
              </div>
              <div
                className={`${styles.navItem} ${
                  pathname === "/cart" ? styles.activeNavItem : ""
                }`}
                onClick={() => handleNavigation("/cart")}
              >
                <PiShoppingCartSimpleBold size={24} />
                <span>Cart</span>
              </div>
            </div>
          </nav>
        )
      ) : isMobile && menuOpen ? (
        <AnimatePresence>
          <motion.nav
            className={styles.navOptions}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={styles.menuBox}>
              {showGetApp && (
                <div
                  className={styles.navItem}
                  onClick={() => handleNavigation("/login")}
                >
                  <LuArrowUpRight size={24} />
                  <span>GET THE APP</span>
                </div>
              )}
              {showProfile && (
                <div
                  className={styles.navItem}
                  onClick={() =>
                    handleNavigation(userFullName ? "/profile" : "/login")
                  }
                >
                  {userFullName ? (
                    <FaUserCircle size={24} />
                  ) : (
                    <IoPersonOutline size={24} />
                  )}
                  <span>{userFullName || "Login"}</span>
                </div>
              )}
            </div>
          </motion.nav>
        </AnimatePresence>
      ) : (
        <div className={styles.rightOptions}>
          <div
            className={styles.navItem}
            onClick={() => handleNavigation("/login")}
          >
            <LuArrowUpRight size={18} />
            <span>GET THE APP</span>
          </div>

          {userFullName ? (
            <div className={styles.profileContainer} ref={dropdownRef}>
              <div
                className={styles.navItem}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <FaUserCircle size={32} />
              </div>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className={styles.dropdownWrapper}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.dropdownMenu}>
                      <div
                        className={styles.navItem}
                        onClick={() => handleNavigation("/profile")}
                        style={{ fontSize: "1rem" }}
                      >
                        <span style={{ fontSize: "1rem" }}>Profile</span>
                      </div>
                      <div
                        className={styles.navItem}
                        onClick={() => handleNavigation("/orders")}
                        style={{ fontSize: "1rem" }}
                      >
                        <span style={{ fontSize: "1rem" }}>Orders</span>
                      </div>
                      <div
                        className={styles.navItem}
                        onClick={() => handleNavigation("/favourites")}
                        style={{ fontSize: "1rem" }}
                      >
                        <span style={{ fontSize: "1rem" }}>Favourites</span>
                      </div>
                      <div
                        className={styles.navItem}
                        onClick={handleLogout}
                        style={{ fontSize: "1rem" }}
                      >
                        <span style={{ fontSize: "1rem" }}>Logout</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div
              className={styles.navItem}
              onClick={() => handleNavigation("/login")}
            >
              <IoPersonOutline size={24} />
              <span>Login</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
