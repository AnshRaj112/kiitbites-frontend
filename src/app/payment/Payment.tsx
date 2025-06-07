"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles/Payment.module.scss";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🎉 Payment Successful!</h1>
      <p className={styles.message}>Thank you for your order.</p>
      <p className={styles.orderId}>
        <strong>Order ID:</strong> {orderId}
      </p>

      <button className={styles.button} onClick={() => router.push("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default PaymentPage;
