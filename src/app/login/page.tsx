"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./styles/Login.module.scss";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Login</h1>
        <form>
          <input type="text" placeholder="Email or Username" required style={{ color: "black" }} />
          <div className={styles.passwordField}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" required style={{ color: "black" }} />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
        <button onClick={() => signIn("google")} className={styles.googleButton}>
          Login with Google
        </button>
      </div>
    </div>
  );
}
