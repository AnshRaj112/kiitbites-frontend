"use client";

import ForgotPassword from "./ForgotPassword";
import { useRouter } from "next/navigation";  // ✅ Correct for App Router

export default function ResetPassword() {
  return (
    <div>
      <ForgotPassword />
    </div>
  );
}
