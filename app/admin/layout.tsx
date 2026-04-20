import Link from "next/link";

export default function AdminLayout({
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
