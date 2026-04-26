import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div>
      <h1>Access denied</h1>
      <p>Your account is not authorised to access this app.</p>
      <Link href="/">Go home</Link>
    </div>
  );
}
