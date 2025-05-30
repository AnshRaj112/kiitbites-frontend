import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Campus Food Ordering Made Easy",
  description: "Welcome to BitesBay - Your ultimate campus food ordering platform. Discover local restaurants, order your favorite meals, and enjoy quick delivery at KIIT University.",
  openGraph: {
    title: "Home - Campus Food Ordering Made Easy",
    description: "Welcome to BitesBay - Your ultimate campus food ordering platform. Discover local restaurants, order your favorite meals, and enjoy quick delivery at KIIT University.",
    images: [
      {
        url: '/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Home Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Home - Campus Food Ordering Made Easy",
    description: "Welcome to BitesBay - Your ultimate campus food ordering platform. Discover local restaurants, order your favorite meals, and enjoy quick delivery at KIIT University.",
    images: ['/home-twitter.jpg'],
  },
}; 