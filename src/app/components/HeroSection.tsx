import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#e0f5f0] min-h-[80vh] sm:min-h-screen lg:min-h-[70vh] flex flex-col justify-center sm:pt-16 lg:pt-8">
      {/* Background Buildings - CSS Only */}
      <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
        <div className="buildings-container">
          <div className="building building-1"></div>
          <div className="building building-2"></div>
          <div className="building building-3"></div>
        </div>
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-br from-green-300 via-white to-green-500 opacity-70 z-0"
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left column with text */}
          <div className="max-w-xl lg:ml-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0e6e6e] leading-tight mb-4">
              <span className="block text-bitesbay-text mb-4">
                Your Campus.
              </span>
              <span className="block text-bitesbay-text mb-4">
                Your Cravings.
              </span>
              <span className="text-bitesbay-accent">Our Command.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Order from campus-exclusive vendors in minutes. Skip the lines and
              enjoy your favorite campus food delivered right to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="bg-[#0e6e6e] hover:bg-[#0a5858] text-white px-8 py-6 rounded-md text-lg">
                <Link href="/home">Order Now</Link>
              </Button>
              <Button
                variant="outline"
                className="border-[#0e6e6e] text-[#0e6e6e] hover:bg-[#d3eeea] px-8 py-6 rounded-md text-lg"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Also Available on</span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 text-gray-700 flex items-center justify-center">
                  <AppleIcon />
                </span>
                <span className="text-gray-700">iOS</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 text-gray-700 flex items-center justify-center">
                  <AndroidIcon />
                </span>
                <span className="text-gray-700">Android</span>
              </span>
            </div>
          </div>

          {/* Right column with image */}
          <div className="relative w-full max-w-md lg:mr-12">
            <div className="relative z-10">
              <img
                src="https://res.cloudinary.com/dt45pu5mx/image/upload/v1747823127/f465837f-20c2-43c1-bd47-228aa24cb2c8_z5tdnw.png"
                alt="Student with food delivery"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon components
const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width="16"
    height="16"
    fill="currentColor"
  >
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const AndroidIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    width="16"
    height="16"
    fill="currentColor"
  >
    <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55" />
  </svg>
);

export default HeroSection;
