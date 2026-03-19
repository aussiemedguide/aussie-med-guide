import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-10">
      <SignIn />
    </div>
  );
}