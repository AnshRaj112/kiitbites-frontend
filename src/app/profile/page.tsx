"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // Redirect to login if no token
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/user`, {
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
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token"); // Remove token from localStorage
      // router.push("/login"); 
      setTimeout(() => router.push("/login"), 1000);// Redirect to login page
      setTimeout(() => {
        window.location.reload(); // Refresh the page to update the header
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Profile</h1>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
