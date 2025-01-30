"use client";

import React, { useState, useContext, useEffect } from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import styles from "./styles/Login.module.scss";

// Define the Google token response type
interface GoogleTokenResponse {
  access_token: string;
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState<string>(""); // Accepts username, email, or phone
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  // Load Google Client ID from environment variables
  useEffect(() => {
    setGoogleClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || null);
  }, []);

  // Google OAuth Login Handler
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse: GoogleTokenResponse) => handleGoogleLogin(tokenResponse),
    onError: (error) => console.error("Google login failed:", error),
  });

  const handleGoogleLogin = async (tokenResponse: GoogleTokenResponse) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/googleAuth", {
        access_token: tokenResponse.access_token,
      });

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;
        setAlert("Login successful!");

        localStorage.setItem("token", response.data.token);
        authCtx.login(
          user.name,
          user.email,
          user.img,
          user.rollNumber,
          user.school,
          user.college,
          user.contactNo,
          user.year,
          user.access,
          user.editProfileCount,
          user.regForm,
          user.blurhash,
          response.data.token,
          9600000
        );

        setTimeout(() => {
          router.push(sessionStorage.getItem("prevPage") || "/");
        }, 800);

        sessionStorage.removeItem("prevPage");
      } else {
        console.error("Unexpected response:", response.status);
      }
    } catch (error) {
      setAlert("There was an error logging in. Please try again.");
      console.error("Google Auth API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login successful:", data);
        setAlert("Login successful!");
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Login</h1>
          {alert && <div className={styles.alert}>{alert}</div>}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ color: "black" }}
              />
              <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <button type="submit">Login</button>
          </form>
          <div className={styles.divider}>OR</div>
          <div className={styles.googleLogin} onClick={() => googleLogin()}>
            {isLoading ? "Logging in..." : "Login with Google"}
          </div>
          <div className={styles.register}>
            <p className={styles["text-black"]}>
              Don&apos;t have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
