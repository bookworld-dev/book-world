import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_API_ROUTES: { path: string; method: string }[] = [
  { path: "/api/books/random", method: "GET" },
  { path: "/api/locations", method: "GET" },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublicApi = PUBLIC_API_ROUTES.some(
    (route) => pathname === route.path && req.method === route.method
  );
  if (isPublicApi) return NextResponse.next();

  if (!req.auth) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", "/admin");
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/((?!auth).*)"],
};
