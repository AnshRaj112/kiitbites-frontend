import { Suspense } from "react";
import OtpVerificationClient from "./OtpVerification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification - Secure Your BitesBay Account",
  description: "Verify your BitesBay account with a secure OTP. Complete the verification process to ensure the security of your account and continue using our campus food ordering services.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "OTP Verification - Secure Your BitesBay Account",
    description: "Verify your BitesBay account with a secure OTP. Complete the verification process to ensure the security of your account and continue using our campus food ordering services.",
    images: [
      {
        url: '/otp-verification-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay OTP Verification',
      },
    ],
    url: "https://bitesbay.com/otpverification",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "OTP Verification - Secure Your BitesBay Account",
    description: "Verify your BitesBay account with a secure OTP. Complete the verification process to ensure the security of your account and continue using our campus food ordering services.",
    images: ['/otp-verification-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/otpverification",
  },
}; 

export default function OtpVerification() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OtpVerificationClient />
    </Suspense>
  );
}
