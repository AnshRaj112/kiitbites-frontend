"use client";

import React, { useEffect, useState, useContext } from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function GoogleLogin() {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error(
          "Google client ID is missing. Check environment variables."
        );
        return;
      }
      setGoogleClientId(clientId);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await handleGoogleLogin(tokenResponse);
    },
    onError: (error) => console.error("Google login failed:", error),
  });

  if (!googleClientId || !authCtx) {
    if (!authCtx) {
      console.error(
        "AuthContext is undefined. Ensure AuthProvider is wrapping this component."
      );
    }
    return <div>Loading...</div>;
  }

  const handleGoogleLogin = async (tokenResponse: { access_token: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/googleAuth`,
        { access_token: tokenResponse.access_token },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;

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
        console.error("Google authentication failed.");
      }
    } catch (error) {
      console.error("Google Auth API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div onClick={() => googleLogin()}>
        {isLoading ? "Logging in..." : "Login with Google"}
      </div>
    </GoogleOAuthProvider>
  );
}
