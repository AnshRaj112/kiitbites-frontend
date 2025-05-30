import AboutPage from "./About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BitesBay - Campus Dining Reimagined",
  description: "Welcome to BitesBay — your partner in transforming campus dining. Discover how we simplify food ordering, optimize inventory management, and enhance student and vendor experiences across college food courts.",
  keywords: "BitesBay About Us, Campus Food Ordering, College Dining Platform, Inventory Management System, Student Food Delivery, Food Court Solutions",
  openGraph: {
    title: "About BitesBay - Campus Dining Reimagined",
    description: "Learn how BitesBay is revolutionizing food ordering and inventory management across colleges. Designed for students, vendors, and staff — built to streamline campus dining.",
    images: [
      {
        url: '/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'About BitesBay - Campus Dining Reimagined',
      },
    ],
    url: "https://bitesbay.com/about",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "About BitesBay - Campus Dining Reimagined",
    description: "BitesBay empowers students and food vendors with smart food ordering and inventory systems. Learn more about our mission to simplify college dining across campuses.",
    images: ['/about-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/about",
  },
};

export default function About() {
  return (
    <div>
      <AboutPage />
    </div>
  );
}
