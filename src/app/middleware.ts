import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const lowercasePath = url.pathname.toLowerCase();

  // If the current path is not already in lowercase, redirect to the lowercase version
  if (url.pathname !== lowercasePath) {
    return NextResponse.redirect(new URL(lowercasePath, request.url));
  }

  return NextResponse.next(); // Allow request to proceed normally if already correct
}

export const config = {
  matcher: "/:path*", // Apply this middleware to all paths
};
