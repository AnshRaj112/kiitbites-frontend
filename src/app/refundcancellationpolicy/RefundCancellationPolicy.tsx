"use client";

import React from "react";
import styles from "./styles/RefundCancellationPolicy.module.scss";
import Link from "next/link";

export default function RefundCancellationPage() {
  return (
    <div className={styles.policyContainer}>
      <h1>Refund & Cancellation Policy</h1>

      <p className={styles.intro}>
        At BitesBay, we value transparency, accountability, and a smooth
        ordering experience. This policy clearly defines our stance on refunds,
        cancellations, and payment guidelines, ensuring fairness for users and
        food vendors across campus food courts.
      </p>

      <div className={styles.section}>
        <h2>Refund Policy</h2>
        <ul className={styles.policyList}>
          <li>
            All confirmed orders are <strong>non-refundable</strong>. Once an
            order is placed and payment is successfully processed (where
            applicable), no refund requests will be entertained.
          </li>
          <li>
            Users are encouraged to double-check their order details—items,
            quantities, and food preferences—before making any payment.
          </li>
          <li>
            Visiting food court outlets to request or argue for refunds is
            strictly against platform policy. Such conduct will be treated as a
            violation and may result in account suspension or permanent
            termination.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Cancellation Policy</h2>
        <ul className={styles.policyList}>
          <li>
            Orders cannot be canceled once placed, regardless of the order type
            or time.
          </li>
          <li>
            To ensure reliable order processing and reduce food waste,
            cancellations are not supported.
          </li>
          <li>
            Users placing multiple or excessive orders without following through
            on payment or pickup will face permanent suspension from the
            platform.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Payment Policy</h2>
        <p>
          To streamline the ordering process and support operational efficiency:
        </p>
        <ul className={styles.policyList}>
          <li>
            If your order consists solely of pre-packed items (such as bottled
            beverages, chips, or sealed snacks), you may opt for Pay Later and
            complete payment at the time of pickup.
          </li>
          <li>
            If your order includes any prepared or made-to-order items (such as
            meals, sandwiches, or custom dishes), advance payment is mandatory
            at the time of ordering.
          </li>
        </ul>
        <p>
          This distinction ensures that freshly prepared food is made only
          against confirmed and paid requests, preventing resource misuse and
          vendor losses.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Platform Integrity</h2>
        <p>
          BitesBay operates on mutual trust between users and food court
          vendors. Any misuse of platform functionality—such as:
        </p>
        <ul className={styles.policyList}>
          <li>Coercing vendors or staff,</li>
          <li>Falsifying refund claims,</li>
          <li>Repeatedly exploiting  &quot;Pay Later&quot; for unpaid pickups,</li>
          <li>Abusing support or system loopholes—</li>
        </ul>
        <p>
          ...will result in immediate investigation and appropriate penalties,
          including account bans without prior warning.
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
          Thank you for choosing BitesBay — empowering campuses with smarter
          food experiences.
          <br />
          Your cooperation helps us serve you better, every day.
        </p>
      </div>
    </div>  
  );
}
