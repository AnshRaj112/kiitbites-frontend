import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css"; // Optional global styles
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "BitesBay - Campus Food Ordering Platform",
    template: "%s | BitesBay"
  },
  description: "BitesBay is your one-stop solution for campus food ordering. Order from your favorite campus restaurants, track deliveries, and enjoy hassle-free food ordering at KIIT University.",
  keywords: ["campus food", "food delivery", "KIIT University", "online food ordering", "campus restaurants", "food delivery app"],
  authors: [{ name: "BitesBay Team" }],
  creator: "BitesBay",
  publisher: "BitesBay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bitesbay.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bitesbay.com',
    siteName: 'BitesBay',
    title: 'BitesBay - Campus Food Ordering Platform',
    description: 'Order food from your favorite campus restaurants at KIIT University',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay - Campus Food Ordering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BitesBay - Campus Food Ordering Platform',
    description: 'Order food from your favorite campus restaurants at KIIT University',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
      {/* <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head> */}
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </GoogleOAuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
