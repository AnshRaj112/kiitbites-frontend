import TermsAndConditions from "./TermAndCondition";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | BitesBay",
  description: "Review BitesBay’s Terms & Conditions to understand our user obligations, platform rules, and service usage guidelines. Designed for fairness and operational clarity in college food ordering.",
  keywords: "BitesBay Terms, Conditions of Use, Campus Food App Rules, Food Ordering Policies, User Agreement, Student Dining Regulations",
  openGraph: {
    title: "Terms & Conditions | BitesBay",
    description: "Understand the terms of using BitesBay’s platform — including rules around account creation, order handling, prohibited conduct, and user responsibilities.",
    images: [
      {
        url: '/terms-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Terms and Conditions',
      },
    ],
    url: "https://bitesbay.com/terms-and-conditions",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms & Conditions | BitesBay",
    description: "Read the official Terms & Conditions for using BitesBay — our commitments to fair usage, user integrity, and platform security across college food services.",
    images: ['/terms-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/terms-and-conditions",
  },
};

export default function tnc() {
  return (
    <div>
      <TermsAndConditions />
    </div>
  );
}
