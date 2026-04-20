import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <Link href="/admin">Admin home</Link>
        <span> | </span>
        <Link href="/">Bookworld home</Link>
      </div>
      {children}
    </>
  );
}
