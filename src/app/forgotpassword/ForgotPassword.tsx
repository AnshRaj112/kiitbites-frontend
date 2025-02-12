"use client";  // ✅ Ensures it's a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Use this for Next.js App Router
import styles from "./styles/ForgotPassword.module.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ✅ Ensures Next.js router is available

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgotpassword`, // ✅ Uses env variable
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error("Invalid JSON response:", err);
        throw new Error("Unexpected server response.");
      }

      if (response.ok) {
        router.push(`/verifyotp?email=${encodeURIComponent(email)}`); // ✅ Redirects on success
      } else {
        setMessage(data?.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.text}>Enter your email to receive a password reset link.</p>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
