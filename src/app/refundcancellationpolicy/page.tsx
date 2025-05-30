import RefundCancellationPolicy from "./RefundCancellationPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | BitesBay",
  description: "Review BitesBay’s Refund & Cancellation Policy to understand our guidelines on payments, order changes, non-refundable items, and fair usage practices across college food courts.",
  keywords: "BitesBay Refund Policy, Food Order Cancellation, Campus Food Payment Rules, Non-refundable Orders, College Dining Terms, Pay Later Policy",
  openGraph: {
    title: "Refund & Cancellation Policy | BitesBay",
    description: "Learn about BitesBay’s firm yet fair policies for refunds, cancellations, and order payments to ensure transparency and platform integrity for students and food vendors.",
    images: [
      {
        url: '/refund-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Refund & Cancellation Policy',
      },
    ],
    url: "https://bitesbay.com/refund-policy",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Refund & Cancellation Policy | BitesBay",
    description: "Understand BitesBay’s policies on non-refundable orders, order cancellations, Pay Later restrictions, and misuse protection. Built for a smooth and fair food ordering experience.",
    images: ['/refund-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/refund-policy",
  },
};

export default function tnc() {
  return (
    <div>
      <RefundCancellationPolicy />
    </div>
  );
}
