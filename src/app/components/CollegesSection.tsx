"use client";

import React, { useEffect } from "react";
import SectionTitle from "./ui/section-title";

const CollegesSection: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  // College logos - in a real implementation these would be actual college logos
//   const colleges = [
//     {
//       name: "University of Technology",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=University+of+Technology",
//     },
//     {
//       name: "State College",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=State+College",
//     },
//     {
//       name: "Innovation Institute",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=Innovation+Institute",
//     },
//     {
//       name: "Liberal Arts College",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=Liberal+Arts+College",
//     },
//     {
//       name: "Technical University",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=Technical+University",
//     },
//     {
//       name: "Business School",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=Business+School",
//     },
//     {
//       name: "Science Academy",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=Science+Academy",
//     },
//     {
//       name: "Design Institute",
//       logo: "https://via.placeholder.com/200x80/54a6a1/ffffff?text=Design+Institute",
//     },
//   ];

  return (
    <section id="colleges" className="section bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Our Partner Colleges"
          subtitle="BitesBay is rapidly expanding to campuses across the country"
        />

        <div className="reveal">
          {/* <div className="relative overflow-hidden w-full py-8">
            <div className="flex animate-scroll-x whitespace-nowrap">
              {colleges.map((college, index) => (
                <div
                  key={`college-1-${index}`}
                  className="flex-shrink-0 w-[200px] mx-6 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={college.logo}
                    alt={college.name}
                    className="h-20 object-contain"
                  />
                </div>
              ))}
              
              {/* Duplicated set for seamless scrolling */}
              {/* {colleges.map((college, index) => (
                <div
                  key={`college-2-${index}`}
                  className="flex-shrink-0 w-[200px] mx-6 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={college.logo}
                    alt={college.name}
                    className="h-20 object-contain"
                  />
                </div>
              ))}
            </div> */}
            
            {/* Gradient masks for smooth fade in/out */}
            {/* <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          </div> 
           */}
          <div className="text-center mt-12">
            <p className="text-lg text-bitesbay-text font-medium">
              Want to bring BitesBay to your campus?
            </p>
            <a 
              href="/help" 
              className="text-bitesbay-accent hover:text-bitesbay-dark inline-flex items-center mt-2 font-medium transition-colors"
            >
              Contact us to learn more
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollegesSection;