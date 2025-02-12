"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles/OtpVerification.module.scss";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/forgotpassword");
    }
  }, [email, router]);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = ["", "", "", "", "", ""];
    pastedData.forEach((char, index) => {
      if (!/[^0-9]/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    inputRefs.current[newOtp.length - 1]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/auth/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/resetpassword?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>OTP Verification</h1>
        <p>Enter the OTP sent to {email}</p>
        <form onSubmit={handleVerifyOtp}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onPaste={handlePaste}
                className={styles.otpInput}
                required
              />
            ))}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
