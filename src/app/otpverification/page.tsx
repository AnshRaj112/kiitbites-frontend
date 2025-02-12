import { Suspense } from "react";
import OtpVerificationClient from "./OtpVerificationClient";

export default function OtpVerification() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OtpVerificationClient />
    </Suspense>
  );
}
