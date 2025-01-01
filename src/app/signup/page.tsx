"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./styles/Signup.module.scss";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Sign Up</h1>
        <form>
          <input type="text" placeholder="Username" required style={{ color: "black" }} />
          <input type="email" placeholder="Email" required style={{ color: "black" }} />
          <input type="tel" placeholder="Phone Number" pattern="[0-9]*" required style={{ color: "black" }} />
          <div className={styles.passwordField}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" required style={{ color: "black" }} />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div className={styles.passwordField}>
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" required style={{ color: "black" }} />
            <span className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className={styles.divider}>
          <span>OR</span>
        </div>
        <div className={styles.googleContainer}>
          <button onClick={() => signIn("google")} className={styles.googleButton}>
            Sign Up with Google
          </button>
        </div>
        <p className={styles.alreadyAccount}>
          Already have an account?{" "}
          <span className={styles.loginLink} onClick={() => signIn()}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
