"use client";

import React from "react";
import styles from "./styles/TermAndCondition.module.scss";
import Link from "next/link";

export default function TermAndCondition() {
  return (
    <div className={styles.termsContainer}>
      <h1>Terms & Conditions</h1>
      <p className={styles.intro}>
        Welcome to BitesBay. By accessing or using our platform, you agree to
        comply with the following terms and conditions. We encourage all users
        to read them thoroughly to ensure a smooth and fair experience for
        everyone.
      </p>

      <div className={styles.section}>
        <h2>1. Account Registration & User Information</h2>
        <ul className={styles.termsList}>
          <li>
            Users are required to provide accurate, complete, and truthful
            information during registration.
          </li>
          <li>
            Once an account is created, users will not be able to change
            personal details such as name, contact number, or identity
            credentials. For corrections or support, please contact us via the
            Contact Us page.
          </li>
          <li>
            Misrepresentation of identity, including gender or personal details,
            is strictly prohibited and may result in account action.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>2. Ordering & Pickup Guidelines</h2>
        <ul className={styles.termsList}>
          <li>
            Users must collect their food orders promptly at the designated
            pickup time to avoid service disruption.
          </li>
          <li>
            Placing excessive orders without timely pickup is not allowed.
            Repeated instances may lead to penalties, including suspension of
            account privileges.
          </li>
          <li>
            Once confirmed, orders cannot be canceled or refunded under any
            circumstances.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>3. Prohibited Conduct</h2>
        <ul className={styles.termsList}>
          <li>
            Creating fake accounts or registering on behalf of another person is
            not allowed. Such actions will result in immediate termination of
            the involved accounts.
          </li>
          <li>
            Any form of fraud, including using multiple accounts to exploit
            system features or avoid limitations, will be dealt with strictly
            and may incur severe penalties.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>4. Violations & Consequences</h2>
        <ul className={styles.termsList}>
          <li>
            Breach of any of these terms may lead to temporary suspension or
            permanent banning of the user from BitesBay.
          </li>
          <li>
            In case of any disputes, clarifications, or issues, users are
            encouraged to reach out through the{" "}
            <Link href="/help" className={styles.contactLink}>
              Contact Us
            </Link>{" "}
            page for resolution.
          </li>
        </ul>
      </div>

      <div className={styles.closing}>
        <p>
          By using BitesBay, you acknowledge and agree to all of the above
          terms. We reserve the right to modify or update these terms at any
          time without prior notice. Continued use of the platform constitutes
          acceptance of the most recent terms.
        </p>
      </div>
    </div>
  );
}
