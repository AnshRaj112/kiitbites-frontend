"use client";

//import { useEffect } from 'react'
import React from "react";
import styles from "./styles/PrivacyPolicy.module.scss";

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Privacy Policy</h1>
        <p>
          At <strong>KIITBites</strong>, your privacy is important to us. This
          policy outlines how we collect, use, and protect your personal
          information.
        </p>
        <section className={styles.aboutsection}>
          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Personal details like name, email, and contact number.</li>
            <li>Order history and preferences.</li>
            <li>Device and usage information.</li>
          </ul>
        </section>
        <section className={styles.aboutsection}>
          <h2>How We Use Your Information</h2>
          <p>The data we collect is used to:</p>
          <ul>
            <li>Process your orders efficiently.</li>
            <li>Improve our services and user experience.</li>
            <li>Communicate with you about your orders and offers.</li>
          </ul>
        </section>
        <section className={styles.aboutsection}>
          <h2>Data Protection</h2>
          <p>
            We implement robust security measures to ensure your data is
            protected and handled responsibly.
          </p>
        </section>
        <section className={styles.aboutsection}>
          <h2>Third-Party Sharing</h2>
          <p>
            We do not sell your personal data. Your information is shared only
            with trusted partners necessary to fulfill our services.
          </p>
        </section>
        <section className={styles.aboutsection}>
          <h2>Cookies</h2>
          <p>
            Our platform uses cookies to enhance your browsing experience. You
            can modify your cookie settings at any time.
          </p>
        </section>
        <section className={styles.aboutsection}>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Please check back for the
            latest version.
          </p>
        </section>

        <section className={styles.aboutsection}>
          <h2>Need Assistance?</h2>
          <p>
            For any privacy-related concerns, please reach out via our{" "}
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
