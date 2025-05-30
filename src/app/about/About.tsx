"use client";

//import { useEffect } from 'react'
import React from 'react';
import styles from "./styles/About.module.scss";
import Link from 'next/link';

export default function AboutPage() {
  return (
<div className={styles.aboutUsContainer}>
        <h1>About Us</h1>
        <p>
          Welcome to BitesBay — your trusted partner in redefining how food is ordered and managed 
          within college food courts. We are committed to streamlining the campus dining experience 
          by making food ordering more efficient for students, staff, and vendors alike.
        </p>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          At BitesBay, our mission is to empower students and food court operators with a modern, 
          digital platform that simplifies food ordering and inventory management. We strive to save time, 
          reduce queues, and enhance satisfaction with a system that&apos;s built for speed, accuracy, and ease of use.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What We Offer</h2>
        <ul className={styles.offerList}>
          <li>
            <strong>Smart Online Food Ordering</strong> – Helping students order their favorite meals quickly and skip the lines.
          </li>
          <li>
            <strong>Simplified Pickup Process</strong> – Reducing wait times with scheduled pickups and real-time updates.
          </li>
          <li>
            <strong>Robust Inventory Management</strong> – Assisting vendors with accurate tracking, restocking, and supply insights.
          </li>
          <li>
            <strong>Fair & Transparent Policies</strong> – Ensuring equitable usage and accountability for both users and service providers.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Need Assistance?</h2>
        <p>
          If you have any questions, suggestions, or require support, please don&apos;t hesitate to reach out through our{' '}
          <Link href="/help" className={styles.contactLink}>Contact Us</Link> page. 
          Your feedback is essential to our continuous improvement.
        </p>
      </section>

      <div className={styles.closing}>
        <p>
          Thank you for choosing BitesBay — where convenience meets campus cuisine.
          <br />
          We&apos;re here to serve, support, and simplify your food experience.
        </p>
      </div>
    </div>
  );
}
