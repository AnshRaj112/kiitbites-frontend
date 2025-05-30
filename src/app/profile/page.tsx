import ProfilePage from "./ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - BitesBay Account Settings",
  description: "Manage your BitesBay profile, view order history, and update your preferences. Personalize your campus food ordering experience at KIIT University.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Profile - BitesBay Account Settings",
    description: "Manage your BitesBay profile, view order history, and update your preferences. Personalize your campus food ordering experience at KIIT University.",
    images: [
      {
        url: '/profile-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BitesBay Profile',
      },
    ],
    url: "https://bitesbay.com/profile",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Profile - BitesBay Account Settings",
    description: "Manage your BitesBay profile, view order history, and update your preferences. Personalize your campus food ordering experience at KIIT University.",
    images: ['/profile-twitter.jpg'],
  },
  alternates: {
    canonical: "https://bitesbay.com/profile",
  },
}; 

export default function Profile() {
  return (
    <div>
      <ProfilePage />
    </div>
  );
}
