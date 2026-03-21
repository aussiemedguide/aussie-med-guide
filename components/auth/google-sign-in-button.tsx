import Link from "next/link";

export default function GoogleSignInButton() {
  return (
    <Link
      href="/sign-in"
      className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
    >
      Continue with Google
    </Link>
  );
}