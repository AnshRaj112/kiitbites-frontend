"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/ForgotPassword.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgotpassword`,
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
        toast.success("OTP sent successfully! Check your email.");
        setTimeout(() => router.push(`/otpverification?email=${encodeURIComponent(email)}`), 2000);
      } else {
        toast.error(data?.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Something went wrong. Try again.");
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
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
