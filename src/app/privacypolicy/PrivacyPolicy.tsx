"use client";

//import { useEffect } from 'react'
import React from "react";
import styles from "./styles/PrivacyPolicy.module.scss";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className={styles.privacyContainer}>
      <h1>Privacy Policy</h1>

      <p className={styles.intro}>
        At BitesBay, your privacy and trust are of utmost importance. This
        policy outlines how we collect, use, store, and safeguard your personal
        information as you use our services across campus food courts.
      </p>

      <div className={styles.section}>
        <h2>Information We Collect</h2>
        <p>
          To provide a seamless and personalized experience, we may collect the
          following types of information:
        </p>
        <ul className={styles.privacyList}>
          <li>
            <strong>Personal Information: </strong>Personal Information: Name,
            mobile number, email address, gender, address,and college
            affiliation.
          </li>
          <li>
            <strong>Order Details: </strong>Order history, food preferences,
            transaction records, and pickup activity.
          </li>
          <li>
            <strong>Device Information: </strong>IP address, browser type,
            operating system, and device identifiers.
          </li>
          <li>
            <strong>Usage Data: </strong>Pages visited, features used, and
            interaction patterns.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>How We Use Your Information</h2>
        <p>
          The data we collect is used responsibly and for the following
          purposes:
        </p>
        <ul className={styles.privacyList}>
          <li>To process and fulfill your orders efficiently.</li>
          <li>
            To personalize your experience based on your preferences and past
            activity.
          </li>
          <li>
            To communicate important updates, including order confirmations,
            support responses, and special offers.
          </li>
          <li>
            To enhance platform functionality, detect misuse, and improve
            service quality.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Data Protection & Security</h2>
        <p>
          We implement industry-standard security practices to protect your
          information from unauthorized access, alteration, or misuse. All data
          is encrypted during transmission and stored with restricted access
          controls.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Third-Party Sharing</h2>
        <ul className={styles.privacyList}>
          <li>
            We do not sell or rent your personal data under any circumstances.
          </li>
          <li>
            Your information is only shared with trusted service providers and
            food vendors as necessary to complete your orders or maintain
            platform operations.
          </li>
          <li>
            All partners are contractually obligated to handle your data with
            confidentiality and integrity.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Cookies & Tracking Technologies</h2>
        <p>Our platform uses cookies and similar tracking tools to:</p>
        <ul className={styles.privacyList}>
          <li>Enhance your browsing experience,</li>
          <li>Store session preferences,</li>
          <li>Analyze usage trends for platform optimization.</li>
        </ul>
        <p>
          You may choose to <strong> modify your cookie settings </strong>{" "}
          through your browser at any time, though some features may become
          limited as a result.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Policy Updates</h2>
        <p>
          This Privacy Policy may be updated from time to time to reflect
          changes in technology, regulation, or service practices. We encourage
          users to review it periodically. Continued use of BitesBay implies
          acceptance of the most recent version.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Need Assistance?</h2>
        <p>
          If you have any concerns or require clarification regarding your
          orders or payment obligations, feel free to contact us anytime via our{" "}
          <Link href="/help" className={styles.contactLink}>
            Contact Us
          </Link>{" "}
          page.
        </p>
      </div>

      <div className={styles.closing}>
        <p>
          Thank you for trusting BitesBay — where your time, taste, and data are
          respected. We are committed to serving you responsibly.
        </p>
      </div>
    </div>
  );
}
