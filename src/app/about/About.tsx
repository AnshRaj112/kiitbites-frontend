"use client";

//import { useEffect } from 'react'
import React from 'react';
import styles from "./styles/About.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>About Us</h1>
        <p>
          Welcome to <strong>KIITBites</strong>. We are dedicated to providing a seamless 
          and efficient food ordering experience for students and staff.
        </p>
        <section className={styles.aboutsection}>
          <h2>Our Mission</h2>
          <p>
            At <strong>KIITBites</strong>, our goal is to make food ordering easy, fast, and 
            reliable while ensuring quality service for everyone.
          </p>
        </section>
        <section className={styles.aboutsection}>
          <h2>What We Offer</h2>
          <ul>
            <li>Fast and convenient food ordering system.</li>
            <li>Easy pickup process without long waiting times.</li>
            <li>Transparent policies to ensure fair usage.</li>
          </ul>
        </section>
        <section className={styles.aboutsection}>
        <h2>Need Assistance?</h2>
          <p>
            If you have any queries or feedback, feel free to reach out via our{" "}
            <a href="/contact">Contact Us</a> page.
          </p>
        </section>
        <p className={styles.footernote}>
          Thank you for choosing KIITBites. We look forward to serving you!
        </p>
      </div>
    </div>
  );
}
