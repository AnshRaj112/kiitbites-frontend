import TeamPage from "./Team"; // Adjust the path if necessary
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Our Team | BitesBay",
  description: "Learn about BitesBay Team.",
  keywords: "About BitesBay, College Food Ordering, Campus Dining Tech, Inventory Management",
  openGraph: {
    title: "Meet Our Team | BitesBay",
    description: "Learn about BitesBay Team.",
    images: ["https://bitebay.in/og-image.jpg"],
    url: "https://bitesbay.com/team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Our Team | BitesBay",
    description: "Learn about BitesBay Team.",
    images: ["https://bitebay.in/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://bitesbay.com/team",
  },
};

export default function Team() {
  return <TeamPage />;
}
