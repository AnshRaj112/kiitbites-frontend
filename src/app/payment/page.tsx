"use client";

import { Suspense } from "react";
import PaymentPage from "./Payment";

function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Loading payment details...
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentPage />
    </Suspense>
  );
}
