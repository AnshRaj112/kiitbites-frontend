"use client"; 

import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Bell, 
  ShoppingCart, 
  Book, 
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info
} from 'lucide-react';
import styles from './styles/UserProfile.module.scss';
import { useRouter } from "next/navigation";  
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string; phone: string } | null>(null);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // Redirect to login if no token
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          router.push("/login"); // If unauthorized, redirect to login
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // ✅ Handle Logout
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    setIsLoggingOut(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setTimeout(() => router.push("/login"), 1000);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Logout failed:", await response.text());
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const togglePersonalInfo = () => {
    setIsPersonalInfoOpen(!isPersonalInfoOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <h1 className={styles.header}>Profile</h1>

        {/* Personal Info Section */}
        <div className={styles.section}>
          <div 
            className={styles.dropdownHeader}
            onClick={togglePersonalInfo}
          >
            <User className={styles.iconBlue} size={20} />
            <span>Personal Info</span>
            {isPersonalInfoOpen ? (
              <ChevronUp className={styles.chevron} size={16} />
            ) : (
              <ChevronDown className={styles.chevron} size={16} />
            )}
          </div>
          
          <div className={`${styles.dropdownContent} ${isPersonalInfoOpen ? styles.open : ''}`}>
            <div className={styles.infoItem}>
              <strong>Full Name:</strong> {user?.fullName || 'Loading...'}
            </div>
            <div className={styles.infoItem}>
              <strong>Email Address:</strong> {user?.email || 'Loading...'}
            </div>
            <div className={styles.infoItem}>
              <strong>Phone Number:</strong> +91 {user?.phone || 'Loading...'}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className={styles.section}>
          <Link href="/cart" className={styles.menuItem}>
            <ShoppingCart className={styles.iconGreen} size={20} />
            <span>Cart</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
          
          <Link href="/orders" className={styles.menuItem}>
            <Book className={styles.iconPurple} size={20} />
            <span>Previous Orders</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
          
          <Link href="/favourites" className={styles.menuItem}>
            <User className={styles.iconOrange} size={20} />
            <span>Favourites</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
          
          <Link href="/notifications" className={styles.menuItem}>
            <Bell className={styles.iconBlue} size={20} />
            <span>Notifications</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
        </div>

        {/* Support Section */}
        <div className={styles.section}>
          <Link href="/termncondition" className={styles.menuItem}>
            <HelpCircle className={styles.iconTeal} size={20} />
            <span>Terms & Conditions</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
          
          <Link href="/about" className={styles.menuItem}>
            <Info className={styles.iconIndigo} size={20} />
            <span>About Us</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
          
          <Link href="/contact" className={styles.menuItem}>
            <Mail className={styles.iconPink} size={20} />
            <span>Contact Us</span>
            <ChevronRight className={styles.chevron} size={16} />
          </Link>
        </div>

        {/* Logout Section */}
        <div className={styles.section}>
          <div 
            className={`${styles.menuItem} ${styles.logoutItem}`} 
            onClick={handleLogout}
            style={{ cursor: isLoggingOut ? 'not-allowed' : 'pointer' }}
          >
            <LogOut className={styles.iconRed} size={20} />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;