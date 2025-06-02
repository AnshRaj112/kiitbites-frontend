import React, { useEffect } from "react";
import SectionTitle from "../ui/section-title";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection: React.FC = () => {
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

  const testimonials = [
    {
      content:
        "BitesBay has completely changed how I eat on campus. No more waiting in long lines or missing out on my favorite cafeteria meals. The app is super easy to use!",
      name: "Sarah Johnson",
      role: "Engineering Student",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      content:
        "As a busy student with back-to-back classes, BitesBay is a lifesaver. I can order between lectures and pick up my food without wasting time in queues.",
      name: "Michael Chang",
      role: "Business Major",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      content:
        "The inventory management system has transformed our small campus café. We've reduced waste by 30% and can focus more on food quality instead of paperwork.",
      name: "Lisa Rodriguez",
      role: "Campus Vendor",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4,
    },
    {
      content:
        "My campus coffee shop used to have lines out the door during rush hours. With BitesBay, we've streamlined operations and improved customer satisfaction.",
      name: "David Wilson",
      role: "Campus Restaurant Owner",
      avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="section bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="What People Are Saying"
          subtitle="Don't just take our word for it - hear from our users"
        />

        <div className="grid md:grid-cols-2 gap-8 reveal">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              name={testimonial.name}
              role={testimonial.role}
              avatarUrl={testimonial.avatarUrl}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
