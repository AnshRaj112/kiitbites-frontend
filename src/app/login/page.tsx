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
        <form action={"/login"} method="POST">
          <input
            type="text"
            placeholder="Email or Username"
            required
            style={{ color: "black" }}
          />
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
          <button type="submit">Login</button>
        </form>
        <div className={styles.divider}>OR</div>
        <div className={styles.googleLogin} onClick={() => signIn("google")}>
          Login with Google
        </div>
        <div className={styles.register}>
          <p className={styles["text-black"]}>
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
