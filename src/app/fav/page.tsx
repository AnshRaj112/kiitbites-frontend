import FavouriteFoodPage from "./fav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites - Saved Foods on BitesBay",
  description: "Access your favorite foods and saved items on BitesBay. Quick reordering and easy access to your preferred food choices at KIIT University.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Favorites - Saved Foods on BitesBay",
    description: "Access your favorite foods and saved items on BitesBay. Quick reordering and easy access to your preferred food choices at KIIT University.",
    images: [
      {
        url: '/favorites-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Favorites',
      },
    ],
    url: "https://bitesbay.com/fav",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Favorites - Saved Foods on BitesBay",
    description: "Access your favorite foods and saved items on BitesBay. Quick reordering and easy access to your preferred food choices at KIIT University.",
    images: ['/favorites-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/fav",
  },
}; 


export default function FavPage() {
  return (
    <div>
      <FavouriteFoodPage />
    </div>
  );
}
