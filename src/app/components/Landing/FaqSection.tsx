"use client";

import React, { useEffect } from "react";
import SectionTitle from "../ui/section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FaqSection: React.FC = () => {
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

  const faqs = [
    {
      question: "How is BitesBay different from other food delivery apps?",
      answer:
        "BitesBay is specifically designed for campus communities. We focus exclusively on connecting students with campus vendors that aren't available on mainstream delivery platforms. Our system is tailored to the unique needs of campus life, including scheduled pickups, real-time inventory tracking, and campus-specific delivery options.",
    },
    {
      question: "Is BitesBay available at my college?",
      answer:
        "BitesBay is rapidly expanding to campuses across the country. Check our partner colleges section or contact us to see if we're available at your campus. If we're not there yet, let your campus administration know you'd like to see BitesBay at your school!",
    },
    {
      question: "How do I become a vendor on BitesBay?",
      answer:
        "If you operate a food service on a college campus, you can apply to become a vendor through our website. Click on the 'Become a Vendor' link in the footer, fill out the application form, and our team will contact you with next steps. We provide all the necessary training and support to get you started.",
    },
    {
      question: "Are there any fees for students to use BitesBay?",
      answer:
        "BitesBay is free to download and create an account. There may be small service fees applied to orders, which are clearly displayed before checkout. We strive to keep these fees minimal to ensure affordability for students.",
    },
    {
      question: "Can I schedule orders in advance?",
      answer:
        "Yes! One of BitesBay's key features is the ability to schedule orders in advance. This is perfect for planning meals between classes or scheduling a pick-up during your free period. You can place orders up to 7 days in advance.",
    },
    {
      question: "How do refunds work if there's an issue with my order?",
      answer:
        "If there's an issue with your order, you can report it through the app within 24 hours of pickup. Our customer service team will review your request and process a refund if applicable. We work closely with vendors to ensure high quality standards and minimal order issues.",
    },
  ];

  return (
    <section id="faqs" className="section bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about BitesBay"
        />

        <div className="max-w-3xl mx-auto reveal">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-bitesbay-text hover:text-bitesbay-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center reveal">
          <p className="text-gray-600 mb-4">
            Have more questions? We&apos;re here to help!
          </p>
          <a
            href="#contact"
            className="text-bitesbay-accent hover:text-bitesbay-dark font-medium underline"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;