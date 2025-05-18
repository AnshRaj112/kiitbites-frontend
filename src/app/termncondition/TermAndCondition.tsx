"use client";

import React from "react";
import styles from "./styles/TermAndCondition.module.scss";

export default function TermAndCondition() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Term & Conditions</h1>
        <p>
          Welcome to <strong>BiteBay</strong>. By using our services, you
          agree to the following terms and conditions. Please read them
          carefully.
        </p>
        <section className={styles.termssection}>
          <h2>1. Account Registration and User Information</h2>
          <ul>
            <li>
              Users must provide accurate and truthful information during
              signup.
            </li>
            <li>
              Once registered, users <strong>cannot</strong> modify their
              personal details (such as name, contact information, or other
              credentials). If you face any issues, kindly reach out via the{" "}
              <a href="/help">Contact Us</a> page.
            </li>
            <li>
              Users must not misrepresent their <strong>gender</strong> or any
              other personal details.
            </li>
          </ul>
        </section>
        <section className={styles.termssection}>
          <h2>2. Order and Pickup Regulations</h2>
          <ul>
            <li>Users must ensure they pick up their orders on time.</li>
            <li>
              Excessive ordering without collecting food is prohibited. Repeat
              offenders may face penalties, including account suspension.
            </li>
            <li>
              Orders once placed <strong>cannot</strong> be canceled or
              refunded.
            </li>
          </ul>
        </section>
        <section className={styles.termssection}>
          <h2>3. Prohibited Activities</h2>
          <ul>
            <li>
              Users must not create fake profiles or register on behalf of
              someone else. Strict action, including a ban, will be taken
              against violators.
            </li>
            <li>
              Any fraudulent activity, including using multiple accounts to
              bypass system limitations, will lead to penalties.
            </li>
          </ul>
        </section>
        <section className={styles.termssection}>
          <h2>4. Violations and Penalties</h2>
          <ul>
            <li>
              Violating any of the above terms may result in a{" "}
              <strong>temporary or permanent</strong> ban from BiteBay.
            </li>
            <li>
              For any disputes or queries, please visit our{" "}
              <a href="/help">Contact Us</a> page.
            </li>
          </ul>
        </section>
        <p className={styles.footernote}>
          By using BiteBay, you agree to abide by these terms. We reserve the
          right to update these terms at any time.
        </p>
      </div>
    </div>
  );
}
