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
          <Link href="/admin/books/create">New book</Link>
          <span> | </span>
          <Link href="/">Bookworld home</Link>
        </div>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          <button type="submit" className="admin-nav-sign-out">Sign out</button>
        </form>
      </div>
      <main>
        {children}
      </main>
    </>
  );
}