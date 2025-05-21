import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-bitesbay-background opacity-20 z-0"
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 relative z-1">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-bitesbay-text">Your Campus.</span>
            <br />
            <span className="text-bitesbay-text">Your Cravings.</span>
            <br />
            <span className="text-bitesbay-accent">Our Command.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Order from campus-exclusive vendors in minutes. Skip the lines and 
            enjoy your favorite campus food delivered right to your doorstep.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-bitesbay-accent hover:bg-bitesbay-dark text-white px-8"
            >
                <Link href="/home">
              Order Now
                </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-bitesbay-text text-bitesbay-text hover:bg-bitesbay-light hover:text-bitesbay-dark"
            >
                <Link href="/about">
              Learn More
                </Link>
            </Button>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Available on web and mobile apps</p>
            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17v.01" />
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 10h10" />
                </svg>
                <span>Web</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span>iOS</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span>Android</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#what-we-do" className="text-gray-500 hover:text-bitesbay-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5" />
            <path d="M7 6l5 5 5-5" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
