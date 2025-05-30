// src/app/home/[slug]/page.tsx

import { Metadata } from "next";
import CollegePageClient from "./CollegePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Campus Food Ordering on BitesBay`,
    description: `Order food from the best restaurants. Browse menus, place orders, and enjoy quick delivery through BitesBay's campus food ordering platform.`,
    openGraph: {
      title: `Campus Food Ordering on BitesBay`,
      description: `Order food from the best restaurants. Browse menus, place orders, and enjoy quick delivery through BitesBay's campus food ordering platform.`,
      images: [
        {
          url: "/college-og.jpg",
          width: 1200,
          height: 630,
          alt: `BitesBay - Food Ordering`,
        },
      ],
      url: `https://bitesbay.com/home`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Campus Food Ordering on BitesBay`,
      description: `Order food from the best restaurants. Browse menus, place orders, and enjoy quick delivery through BitesBay's campus food ordering platform.`,
      images: ["/college-twitter.jpg"],
    },
    alternates: {
      canonical: `https://bitesbay.com/home`,
    },
  };
}

export default function Page() {
  return <CollegePageClient />;
}
