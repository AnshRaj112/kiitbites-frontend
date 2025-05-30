import { Suspense } from "react";
import ResetPassword from "./ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Secure Your BitesBay Account",
  description: "Reset your BitesBay account password. Securely update your password to ensure the security of your account and continue using our campus food ordering services.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Reset Password - Secure Your BitesBay Account",
    description: "Reset your BitesBay account password. Securely update your password to ensure the security of your account and continue using our campus food ordering services.",
    images: [
      {
        url: '/otp-verification-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Reset Password',
      },
    ],
    url: "https://bitesbay.com/otpverification",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Reset Password - Secure Your BitesBay Account",
    description: "Reset your BitesBay account password. Securely update your password to ensure the security of your account and continue using our campus food ordering services.",
    images: ['/otp-verification-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/otpverification",
  },
}; 

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPassword />
    </Suspense>
  );
}
