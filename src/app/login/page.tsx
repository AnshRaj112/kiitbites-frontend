import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Access Your BitesBay Account",
  description: "Securely log in to your BitesBay account to order food from your favorite campus restaurants. Quick and easy access to campus food delivery services.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login - Access Your BitesBay Account",
    description: "Securely log in to your BitesBay account to order food from your favorite campus restaurants. Quick and easy access to campus food delivery services.",
    images: [
      {
        url: '/login-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Login',
      },
    ],
    url: "https://bitesbay.com/login",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Login - Access Your BitesBay Account",
    description: "Securely log in to your BitesBay account to order food from your favorite campus restaurants. Quick and easy access to campus food delivery services.",
    images: ['/login-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/login",
  },
}; 

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}