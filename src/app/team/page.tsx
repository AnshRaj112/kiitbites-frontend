import TeamPage from "./Team"; // Adjust the path if necessary
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | BitesBay",
  description: "Learn about BitesBay Team.",
  keywords: "About BitesBay, College Food Ordering, Campus Dining Tech, Inventory Management",
  openGraph: {
    title: "About BitesBay",
    description: "Streamlining food orders and inventory for college food courts.",
    images: ["https://bitebay.in/og-image.jpg"],
    url: "https://bitesbay.com/team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | BitesBay",
    description: "Discover how BitesBay is redefining food ordering and inventory management for colleges.",
    images: ["https://bitebay.in/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://bitebay.in/about",
  },
};

export default function Team() {
  return <TeamPage />;
}
