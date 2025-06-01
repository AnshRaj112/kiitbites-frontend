"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For App Router (Next.js 13+)
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import styles from "./styles/Login.module.scss";
// import GoogleLogin from "./GoogleLogin";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const notify = (message: string, type: "success" | "error") => {
    toast[type](message, { position: "bottom-right", autoClose: 3000 });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      notify("Please fill all the fields.", "error");
      return;
    }

    if (!BACKEND_URL) {
      notify("Server configuration error. Please contact support.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/user/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 400 && data.redirectTo) {
        // If user is unverified, redirect them to /otpverification
        notify("Account not verified. OTP sent to email.", "error");
        setTimeout(() => {
          router.push(
            `/otpverification?email=${encodeURIComponent(
              formData.identifier
            )}&from=login`
          );
        }, 2000);
        return;
      }

      if (!res.ok) {
        notify(data.message || "Login failed. Please try again.", "error");
        return;
      }

      localStorage.setItem("token", data.token);

      notify("Login successful!", "success");
      setTimeout(() => router.push("/home"), 2000);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      notify("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh token on visit
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });
  
      if (res.ok) {
        console.log("✅ Session refreshed successfully");
      } else if (res.status === 401 || res.status === 403) {
        console.log("🔴 Session expired, redirecting to login...");
        localStorage.removeItem("token"); // Clear stored token (if any)
        router.push("/login"); // Redirect to login page
      } else {
        console.log("⚠️ Unexpected response from server");
      }
    } catch (error) {
      console.error("❌ Error refreshing session:", error);
    }
  }, [BACKEND_URL, router]);
  

  // Refresh session on component mount
  useEffect(() => {
    checkSession(); // Refresh on page load
  
    const interval = setInterval(() => {
      checkSession();
    },  60 * 60 * 1000); // Refresh every 1 hour
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [checkSession]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone"
            value={formData.identifier}
            onChange={handleInputChange}
            required
            style={{ color: "black" }}
          />
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ color: "black" }}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div className={styles.forgotPassword}>
            <Link href="/forgotpassword">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* <div className={styles.divider}>
          <span>OR</span>
        </div>
        <div
          style={{
            backgroundColor: "#1e90fc",
            color: "black",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1em",
            textAlign: "center",
            margin: "10px 0",
          }}
          className={styles.googleSignUp}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#01796f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1e90fc")
          }
        >
          <GoogleLogin />
        </div> */}
        <div className={styles.register}>
          <p className={styles["text-black"]}>
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
