"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import styles from "./styles/OtpVerification.module.scss";

export default function OtpVerificationClient() {
  const [email, setEmail] = useState<string | null>("test@example.com"); // Temporarily set a default email for testing
  const [fromPage, setFromPage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const fromParam = searchParams.get("from");

    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Instead of pushing directly to /forgotpassword, check where the user is coming from
      if (fromParam === "forgotpassword") {
        router.push("/forgotpassword");
      } else if (fromParam === "signup" || fromParam === "login") {
        router.push("/otpverification");
      }
    }

    if (fromParam) {
      setFromPage(fromParam);
    }
  }, [searchParams, router]);

  return email ? (
    <OtpForm email={email} fromPage={fromPage} />
  ) : (
    <p>Loading...</p>
  );
}

function OtpForm({
  email,
  fromPage,
}: {
  email: string;
  fromPage: string | null;
}) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = otp.map((_, index) => pastedData[index] ?? "");
    setOtp(newOtp);
    inputRefs.current[Math.min(newOtp.length, 5)]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join(""); // Convert OTP array to a string

    if (!otpString) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/auth/otpverification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }), // Send as a string
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully!");
        setTimeout(() => {
          if (fromPage === "signup") {
            router.push("/home");
          } else if (fromPage === "forgotpassword") {
            router.push("/resetpassword");
          } else {
            router.push("/"); // Default fallback
          }
        }, 2000);
      } else {
        toast.error(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
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
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                style={{ color: "black" }}
                onChange={(e) => handleChange(index, e.target.value)}
                onPaste={handlePaste}
                className={styles.otpInput}
                required
                aria-label={`OTP Digit ${index + 1}`}
                title={`OTP Digit ${index + 1}`}
                placeholder=" "
              />
            ))}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
