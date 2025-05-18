"use client";

import React from "react";
import styles from "./styles/RefundCancellationPolicy.module.scss";

export default function RefundCancellationPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Refund & Cancellation Policy</h1>
        <p>
          At <strong>BiteBay</strong>, we are committed to transparency and user satisfaction. This policy outlines our stance regarding refunds and cancellations.
        </p>

        <section className={styles.aboutsection}>
          <h2>Refund Policy</h2>
          <p>
            Please note that <strong>we do not provide any refunds</strong> once an order has been successfully placed and confirmed.
          </p>
          <p>
            All transactions are final, and users are expected to review their orders thoroughly before proceeding with payment.
          </p>
          <p>
            Visiting any food court locations — such as <strong>KIIT Kafé, Maggie Point, Central Canteen</strong>, or other affiliated vendors — and attempting to negotiate refunds in person is strictly prohibited.
          </p>
          <p>
            Any such attempt will be considered a violation of platform conduct and may result in <strong>account termination</strong>.
          </p>
        </section>

        <section className={styles.aboutsection}>
          <h2>Cancellation Policy</h2>
          <p>
            Once an order is placed, it cannot be canceled under any circumstance. This policy exists to maintain the efficiency and reliability of our order fulfillment process.
          </p>
          <p>
            Additionally, <strong>placing multiple or bulk orders</strong> and failing to make payment or pick them up is considered misuse of our service.
          </p>
          <p>
            Such behavior will also result in <strong>permanent suspension or termination</strong> of your BiteBay account.
          </p>
        </section>

        <section className={styles.aboutsection}>
          <h2>Platform Integrity</h2>
          <p>
            BiteBay functions on mutual trust between users and our partnered food vendors. Misuse of platform functionalities — including attempts to coerce vendors, spam support requests, or circulate false claims — compromises that trust.
          </p>
          <p>
            We reserve the right to monitor account activity for abuse patterns and take necessary action without prior warning.
          </p>
        </section>

        <section className={styles.aboutsection}>
          <h2>Need Assistance?</h2>
          <p>
            For any privacy-related concerns, please reach out via our <a href="/contact">Contact Us</a> page.
          </p>
        </section>

        <p className={styles.footernote}>
          Thank you for choosing BiteBay. We look forward to serving you!
        </p>
      </div>
    </div>
  );
}
