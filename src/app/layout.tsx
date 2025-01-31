"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css"; // Optional global styles
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider> 
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
