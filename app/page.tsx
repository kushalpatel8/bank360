import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Shield, Users } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { cookies } from "next/headers";

export default async function HomePage() {
  const { userId } = await auth();
  
  let role: string | undefined;
  if (userId) {
    const user = await currentUser();
    const cookieStore = await cookies();
    role = (user?.publicMetadata?.role as string | undefined) || cookieStore.get("user_role")?.value;
  }

  const mainBtnLabel = !role ? "Complete Setup" : "Go to Dashboard";

  return (
    <div className="min-h-screen bg-[#EDF2F7] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#CBD5E0]">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#2B6CB0] rounded-lg flex items-center justify-center">
            <span className="text-[#FFFFFF] font-bold text-sm">B</span>
          </div>
          <span className="text-[#0D1117] font-bold text-xl tracking-tight">Bank360</span>
        </Link>
        <div className="flex items-center gap-4">
          {userId ? (
            <div className="flex items-center gap-4">
              <Link href={!role ? "/role-selection" : "/dashboard"} className="bg-[#2B6CB0] hover:bg-[#1A365D] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {!role ? "Select Role" : "Dashboard"}
              </Link>
              <UserButton />
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-[#4A5568] hover:text-[#0D1117] transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/role-selection"
                className="bg-[#2B6CB0] hover:bg-[#1A365D] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-[#2B6CB0]/10 border border-[#2B6CB0]/20 rounded-full px-4 py-1.5 mb-8">
          <Brain className="w-4 h-4 text-[#2B6CB0]" />
          <span className="text-[#2B6CB0] text-sm font-bold">AI-Powered Banking Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-[#1A365D] mb-6 leading-tight tracking-tight">
          Customer Intelligence
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            at 360°
          </span>
        </h1>

        <p className="text-xl text-[#4A5568] max-w-2xl mb-12 leading-relaxed">
          Unified CRM platform for relationship managers. Understand customers deeply,
          predict churn, assess risk, and take action—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {userId ? (
            <Link
              href={!role ? "/role-selection" : "/dashboard"}
              className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              {mainBtnLabel}
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                href="/role-selection"
                className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Enter Platform
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/role-selection"
                className="flex items-center gap-2 border border-[#CBD5E0] hover:border-white/30 text-[#0D1117] px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-white/5"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-4xl w-full">
          {[
            { icon: Users, title: "Customer 360", desc: "Complete customer profiles" },
            { icon: BarChart3, title: "Analytics", desc: "Deep behavioral insights" },
            { icon: Brain, title: "AI Assistant", desc: "LangChain-powered insights" },
            { icon: Shield, title: "Risk Scoring", desc: "Real-time risk indicators" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-2xl p-6 text-left hover:border-[#2B6CB0] transition-colors shadow-sm hover:shadow-md group"
            >
              <Icon className="w-8 h-8 text-[#2B6CB0] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-[#0D1117] font-bold mb-1">{title}</h3>
              <p className="text-[#4A5568] text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-slate-600 text-sm border-t border-[#CBD5E0]">
        © 2026 Bank360. Powered by AI.
      </footer>
    </div>
  );
}
