"use client";

import React, { useState, useContext, useEffect } from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import axios from "axios";
// import styles from "./styles/GoogleSignup.module.scss";

interface GoogleTokenResponse {
  access_token: string;
}

export default function GoogleSignup() {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setAlert("Google client ID is missing. Please check your environment variables.");
        return;
      }
      setGoogleClientId(clientId);
    }
  }, []);

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await handleGoogleSignup(tokenResponse);
    },
    onError: (error) => console.error("Google signup failed:", error),
  });

  if (!googleClientId || !authCtx) {
    if (!authCtx) {
      console.error("AuthContext is undefined. Ensure AuthProvider is wrapping this component.");
    }
    return <div>Loading...</div>;
  }

  const handleGoogleSignup = async (tokenResponse: GoogleTokenResponse) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/googleAuth`,
        { access_token: tokenResponse.access_token },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;
        setAlert("Signup successful! Logged in.");

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
          router.push("/");
        }, 800);
      } else {
        setAlert("Google signup failed. Please try again.");
      }
    } catch (error) {
      setAlert("Error during Google signup. Please try again.");
      console.error("Google Auth API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div onClick={() => googleSignup()}>
      {isLoading ? "Signing up..." : "Sign up with Google"}
    </div>
  );  
}