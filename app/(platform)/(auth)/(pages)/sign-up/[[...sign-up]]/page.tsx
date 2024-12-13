import { SignUp } from "@clerk/nextjs";

export const runtime="edge";

export default function SignUpPage() {
  return (
    <SignUp 
    routing="hash"/>
  );
}