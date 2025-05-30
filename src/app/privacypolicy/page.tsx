import PrivacyPolicy from "./PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Your Data, Your Trust | BitesBay",
  description: "Review BitesBay’s Privacy Policy to understand how we collect, use, and protect your personal data. Learn about our commitment to security, transparency, and your privacy rights.",
  keywords: "BitesBay Privacy Policy, Student Data Protection, Campus Food Ordering Privacy, User Information Security, College App Privacy",
  openGraph: {
    title: "Privacy Policy – Your Data, Your Trust | BitesBay",
    description: "Your trust matters. Discover how BitesBay ensures the confidentiality and security of your personal and order-related data across our campus dining services.",
    images: [
      {
        url: '/privacy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Privacy Policy',
      },
    ],
    url: "https://bitesbay.com/privacy-policy",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy – Your Data, Your Trust | BitesBay",
    description: "BitesBay is committed to protecting your personal information. Read how we collect, store, and responsibly use your data on our food-ordering platform.",
    images: ['/privacy-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/privacy-policy",
  },
};

export default function tnc() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
