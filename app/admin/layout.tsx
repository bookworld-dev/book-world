import Link from "next/link";
import { signOut } from "@/auth";
import "./styles/admin.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="admin-nav">
        <div className="admin-nav-links">
          <Link href="/admin">Admin home</Link>
          <span> | </span>
          <Link href="/">Bookworld home</Link>
        </div>
        <a className="admin-nav-sign-out" href="#" onClick={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          Sign out
        </a>
      </div>
      <main>
        {children}
      </main>
    </>
  );
}