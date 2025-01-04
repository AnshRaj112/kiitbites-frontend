"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./styles/Login.module.scss";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // For username, email, or phone
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !Password) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier, Password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login successful:", data);
        // Redirect or update UI after successful login
      } else {
        const errorData = await res.json();
        console.error("Error:", errorData);
        alert(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username, Email, or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={{ color: "black" }}
          />
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
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
