"use client";

import React, { useEffect } from "react";
import SectionTitle from "./ui/section-title";


const WhatWeDoSection: React.FC = () => {
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      }, { threshold: 0.1 });
  
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
  
    return (
      <section id="what-we-do" className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="What We Do"
            subtitle="Connecting campus food vendors directly to hungry students"
          />
  
          <div className="max-w-3xl mx-auto">
            <div className="reveal">
              <h3 className="text-2xl font-bold text-bitesbay-text mb-4">
                Campus-Exclusive Food Delivery
              </h3>
              <p className="text-gray-700 mb-6">
                BitesBay connects students with campus-exclusive food vendors that
                aren&apos;t available on mainstream delivery platforms like Swiggy or
                Zomato. We&apos;re building a seamless connection between hungry students
                and the best campus food spots.
              </p>
              <p className="text-gray-700 mb-6">
                Our platform offers:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-bitesbay-accent mr-2">✓</span>
                  <span>Easy web and app ordering for students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-bitesbay-accent mr-2">✓</span>
                  <span>Advanced inventory management for vendors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-bitesbay-accent mr-2">✓</span>
                  <span>Live menu updates and real-time order tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-bitesbay-accent mr-2">✓</span>
                  <span>Automated stock updates to prevent ordering unavailable items</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default WhatWeDoSection;
  