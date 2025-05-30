import HomePage from "./HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Discover Campus Food Ordering",
  description: "Explore BitesBay's campus food ordering platform. Find and order from the best restaurants at your college. Quick delivery and easy ordering for students.",
  openGraph: {
    title: "Home - Discover Campus Food Ordering",
    description: "Explore BitesBay's campus food ordering platform. Find and order from the best restaurants at your college. Quick delivery and easy ordering for students.",
    images: [
      {
        url: '/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Home',
      },
    ],
    url: "https://bitesbay.com/home",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Home - Discover Campus Food Ordering",
    description: "Explore BitesBay's campus food ordering platform. Find and order from the best restaurants at your college. Quick delivery and easy ordering for students.",
    images: ['/home-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/home",
  },
};

export default function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}
