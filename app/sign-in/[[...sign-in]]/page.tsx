import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}