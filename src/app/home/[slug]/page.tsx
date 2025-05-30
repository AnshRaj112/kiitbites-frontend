// src/app/home/[slug]/page.tsx

import { Metadata } from "next";
import CollegePageClient from "./CollegePageClient";

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// For metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const collegeName = decodeURIComponent(params.slug)
    .toUpperCase()
    .replace(/\s+/g, "-");

  return {
    title: `${collegeName} - Campus Food Ordering on BitesBay`,
    description: `Order food from the best restaurants at ${collegeName}. Browse menus, place orders, and enjoy quick delivery through BitesBay's campus food ordering platform.`,
    openGraph: {
      title: `${collegeName} - Campus Food Ordering on BitesBay`,
      description: `Order food from the best restaurants at ${collegeName}. Browse menus, place orders, and enjoy quick delivery through BitesBay's campus food ordering platform.`,
      images: [
        {
          url: "/college-og.jpg",
          width: 1200,
          height: 630,
          alt: `BitesBay - ${collegeName} Food Ordering`,
        },
      ],
      url: `https://bitesbay.com/home/${params.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collegeName} - Campus Food Ordering on BitesBay`,
      description: `Order food from the best restaurants at ${collegeName}. Browse menus, place orders, and enjoy quick delivery through BitesBay's campus food ordering platform.`,
      images: ["/college-twitter.jpg"],
    },
    alternates: {
      canonical: `https://bitesbay.com/home/${params.slug}`,
    },
  };
}

// Main page component
export default function Page({ params }: PageProps) {
  return <CollegePageClient slug={params.slug} />;
}
