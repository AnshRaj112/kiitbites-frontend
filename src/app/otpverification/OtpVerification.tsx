"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Removed useRouter (not used here)
import { useRouter } from "next/navigation"; // ✅ Only used in OtpForm
import { ToastContainer, toast } from "react-toastify";
import styles from "./styles/OtpVerification.module.scss";

export default function OtpVerificationClient() {
  const [email, setEmail] = useState<string | null>(null);
  const [fromPage, setFromPage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const fromParam = searchParams.get("from");

    console.log("Extracted email:", emailParam);
    console.log("Extracted fromPage:", fromParam);
    console.log("All search params:", Object.fromEntries(searchParams.entries()));

    if (emailParam) setEmail(emailParam);
    if (fromParam) setFromPage(fromParam);
  }, [searchParams]);

  return email ? <OtpForm email={email} fromPage={fromPage} /> : <p>Loading...</p>;
}

function OtpForm({ email, fromPage }: { email: string; fromPage: string | null }) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const router = useRouter(); // ✅ Correctly using router here
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    
    newOtp.forEach((num, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = num;
      }
    });
    inputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (!otpString || otpString.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/auth/otpverification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully!");
        console.log("Redirecting based on fromPage:", fromPage);
        console.log("fromPage type:", typeof fromPage);
        console.log("fromPage === 'forgotpassword':", fromPage === "forgotpassword");

        setTimeout(() => {
          if (fromPage === "forgotpassword" || fromPage === "/forgotpassword") {
            console.log("Redirecting to resetpassword");
            router.replace(`/resetpassword?email=${encodeURIComponent(email)}`);
          } else if (fromPage === "signup" || fromPage === "login") {
            console.log("Redirecting to home");
            router.replace("/home");
          } else {
            console.log("Default redirect to home");
            router.replace("/home");
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
                ref={(el) => (inputRefs.current[index] = el)}
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
