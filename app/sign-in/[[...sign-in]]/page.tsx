import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}