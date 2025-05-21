import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TestimonialCardProps {
  content: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  name,
  role,
  avatarUrl,
  rating = 5,
}) => {
  return (
    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={i < rating ? "#ffc107" : "none"}
              stroke="#ffc107"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <p className="text-gray-600 mb-4 italic">&ldquo;{content}&rdquo;</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center">
          <img
            src={avatarUrl}
            alt={name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="font-medium text-bitesbay-text">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
