"use client";

import React, { useState, useContext, useEffect } from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import styles from "./styles/Login.module.scss";

interface GoogleTokenResponse {
  access_token: string;
}

export default function LoginPage() {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  // Fetch googleClientId from environment variables
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setAlert("Google client ID is missing. Please check your environment variables.");
      return;
    }
    setGoogleClientId(clientId);
  }, []);

  // If googleClientId is missing, show loading spinner or alert
  if (!googleClientId) {
    return <div>Loading...</div>;
  }

  // Ensure googleLogin hook is called unconditionally
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await handleGoogleLogin(tokenResponse);
    },
    onError: (error) => console.error("Google login failed:", error),
  });

  if (!authCtx) {
    console.error("AuthContext is undefined. Ensure AuthProvider is wrapping this component.");
    return <p>Error: Authentication context not available.</p>;
  }

  // Handle Google login logic
  const handleGoogleLogin = async (tokenResponse: GoogleTokenResponse) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/googleAuth`,
        { access_token: tokenResponse.access_token },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;
        setAlert("Login successful!");

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
      }
    } catch (error) {
      setAlert("There was an error logging in. Please try again.");
      console.error("Google Auth API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle normal login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      setAlert("Please fill all the fields.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAlert("Login successful!");

        authCtx.login(
          data.user.name,
          data.user.email,
          data.user.img,
          data.user.rollNumber,
          data.user.school,
          data.user.college,
          data.user.contactNo,
          data.user.year,
          data.user.access,
          data.user.editProfileCount,
          data.user.regForm,
          data.user.blurhash,
          data.token,
          9600000
        );

        setTimeout(() => router.push("/"), 800);
      } else {
        const errorData = await res.json();
        setAlert(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert("An error occurred. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
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
            <p>
              Don&apos;t have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
