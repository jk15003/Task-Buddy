import { SignIn } from "@clerk/nextjs";

export const runtime="edge";

export default function SignInPage() {
  return (
    <SignIn 
      routing="hash"
    />
  );
}