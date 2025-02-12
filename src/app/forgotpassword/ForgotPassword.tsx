"use client";  // ✅ Ensures it's a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Use this for App Router
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
      const response = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/verifyotp?email=${encodeURIComponent(email)}`); // ✅ Redirect on success
      } else {
        setMessage(data.message || "Failed to send reset email.");
      }
    } catch (error) {
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
