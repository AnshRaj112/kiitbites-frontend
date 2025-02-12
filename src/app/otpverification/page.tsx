import { Suspense } from "react";
import OtpVerificationClient from "./OtpVerification";

export default function OtpVerification() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OtpVerificationClient />
    </Suspense>
  );
}
