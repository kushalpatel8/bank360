import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default async function SignUpPage({ searchParams }: { searchParams: { role?: string } }) {
  // Await searchParams in case this is Next.js 15
  const params = await searchParams;
  const role = params?.role;
  const redirectUrl = role === "analyst" ? "/analytics" : "/dashboard";

  return (
    <div className="min-h-screen bg-[#EDF2F7] flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#2B6CB0] rounded-xl flex items-center justify-center">
            <span className="text-[#FFFFFF] font-bold text-lg">B</span>
          </div>
          <span className="text-[#FFFFFF] font-bold text-2xl">Bank360</span>
        </Link>
        <SignUp
          unsafeMetadata={{ role }}
          fallbackRedirectUrl={redirectUrl}
          appearance={{
            elements: {
              rootBox: "shadow-2xl",
              card: "bg-[#FFFFFF] border border-[#CBD5E0]",
              headerTitle: "text-[#0D1117]",
              headerSubtitle: "text-[#4A5568]",
              socialButtonsBlockButton: "bg-slate-800 border-[#CBD5E0] text-[#0D1117] hover:bg-slate-700",
              formFieldLabel: "text-[#4A5568]",
              formFieldInput: "bg-slate-800 border-[#CBD5E0] text-[#0D1117]",
              footerActionLink: "text-[#2B6CB0]",
              formButtonPrimary: "bg-[#2B6CB0] hover:bg-[#2B6CB0]",
            },
          }}
        />
      </div>
    </div>
  );
}
