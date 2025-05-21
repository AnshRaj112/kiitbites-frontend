import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="h-full transition-transform duration-300 hover:scale-105 hover:shadow-lg border-t-4 border-t-bitesbay-accent">
      <CardHeader>
        <div className="w-12 h-12 flex items-center justify-center bg-bitesbay-light rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold text-bitesbay-text">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;