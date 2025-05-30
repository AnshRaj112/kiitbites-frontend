
import ForgotPassword from "./ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Reset Your BitesBay Account",
  description: "Reset your BitesBay account password securely. Follow our simple steps to regain access to your account and continue ordering from campus restaurants.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Forgot Password - Reset Your BitesBay Account",
    description: "Reset your BitesBay account password securely. Follow our simple steps to regain access to your account and continue ordering from campus restaurants.",
    images: [
      {
        url: '/forgot-password-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Forgot Password',
      },
    ],
    url: "https://bitesbay.com/forgotpassword",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Forgot Password - Reset Your BitesBay Account",
    description: "Reset your BitesBay account password securely. Follow our simple steps to regain access to your account and continue ordering from campus restaurants.",
    images: ['/forgot-password-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/forgotpassword",
  },
}; 


export default function ResetPassword() {
  return (
    <div>
      <ForgotPassword />
    </div>
  );
}
