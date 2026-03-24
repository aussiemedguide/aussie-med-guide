"use client";

import { useClerk } from "@clerk/nextjs";

type SignOutButtonProps = {
  className?: string;
  label?: string;
};

export default function SignOutButton({
  className = "",
  label = "Sign out",
}: SignOutButtonProps) {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/" })}
      className={className}
    >
      {label}
    </button>
  );
}