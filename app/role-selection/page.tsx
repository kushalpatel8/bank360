"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle, LineChart, Shield, CheckCircle2, ArrowRight, X, Lock } from "lucide-react";
import { verifyAdminToken } from "./verifyToken";

const ROLES = [
  {
    id: "relationship_manager",
    title: "Relationship Manager",
    icon: UserCircle,
    color: "from-blue-500 to-cyan-400",
    bgLight: "bg-[#2B6CB0]/10",
    borderLight: "border-blue-500/20",
    description: "Manage customers and take action.",
    capabilities: [
      "View assigned customers",
      "Search customers",
      "View Customer 360",
      "Record interactions",
      "Create follow-ups",
      "Review customer insights",
      "Use AI assistant",
    ],
  },
  {
    id: "analyst",
    title: "Analyst",
    icon: LineChart,
    color: "from-purple-500 to-pink-400",
    bgLight: "bg-purple-500/10",
    borderLight: "border-purple-500/20",
    description: "Deep dive into data and trends.",
    capabilities: [
      "View analytics",
      "Analyze customer segments",
      "Analyze churn",
      "Review risk indicators",
      "Explore customer behavior",
    ],
  },
  {
    id: "administrator",
    title: "Administrator",
    icon: Shield,
    color: "from-emerald-500 to-teal-400",
    bgLight: "bg-emerald-500/10",
    borderLight: "border-emerald-500/20",
    description: "System management and oversight.",
    capabilities: [
      "Manage users",
      "View system analytics",
      "Manage customer records",
      "Review audit information",
    ],
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const isValid = await verifyAdminToken(adminToken);
      if (isValid) {
        router.push("/sign-up?role=administrator");
      } else {
        setError("Invalid administrator token.");
      }
    } catch (err) {
      setError("An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF2F7] flex flex-col items-center py-20 px-6 sm:px-12 relative">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2B6CB0]/10 border border-blue-500/20 rounded-2xl mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-bold text-3xl">B</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A365D] mb-4 tracking-tight">
            Select Your Role
          </h1>
          <p className="text-lg text-[#4A5568] max-w-2xl mx-auto">
            Choose how you'll be using Bank360 to personalize your experience.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {ROLES.map((role) => {
            const Icon = role.icon;
            
            const cardClasses = "group relative flex flex-col text-left rounded-3xl p-8 transition-all duration-300 border-2 bg-[#FFFFFF]/50 border-[#CBD5E0] hover:border-[#CBD5E0] hover:bg-[#FFFFFF]/60 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-900/50 h-full";
            const innerClasses = `inline-flex self-start p-4 rounded-2xl mb-6 ${role.bgLight} ${role.borderLight} border group-hover:scale-110 transition-transform duration-300`;
            const iconClasses = `w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r ${role.color}`;

            const CardContent = (
              <>
                <div className={innerClasses}>
                  <Icon className={iconClasses} />
                  <Icon className="w-8 h-8 absolute opacity-50 blur-sm" />
                </div>

                <h3 className="text-2xl font-bold text-[#0D1117] mb-2">{role.title}</h3>
                <p className="text-[#4A5568] mb-6 h-12">{role.description}</p>

                <div className="space-y-3 mb-8">
                  <h4 className="text-sm font-semibold text-[#4A5568] uppercase tracking-wider mb-4">Capabilities</h4>
                  {role.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#2B6CB0] mt-1 shrink-0" />
                      <span className="text-[#4A5568] text-sm">{cap}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[#0D1117] font-medium group-hover:text-[#2B6CB0] transition-colors mt-auto pt-4 border-t border-[#CBD5E0]">
                  Continue as {role.title.split(' ')[0]} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </>
            );

            if (role.id === "administrator") {
              return (
                <button
                  key={role.id}
                  onClick={() => setShowAdminPrompt(true)}
                  className={cardClasses}
                >
                  {CardContent}
                </button>
              );
            }

            return (
              <Link href={`/sign-up?role=${role.id}`} key={role.id} className={cardClasses}>
                {CardContent}
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/" className="text-[#4A5568] hover:text-[#4A5568] text-sm transition-colors font-medium">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Admin Token Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#EDF2F7]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => { setShowAdminPrompt(false); setError(""); setAdminToken(""); }}
              className="absolute top-6 right-6 text-[#4A5568] hover:text-[#0D1117] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-[#0D1117] mb-2">Admin Authentication</h3>
            <p className="text-[#4A5568] text-sm mb-6">
              Please enter the administrator token to continue registration for this role.
            </p>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Enter token (e.g. 12345)"
                  className="w-full bg-[#EDF2F7] border border-[#CBD5E0] rounded-xl px-4 py-3 text-[#0D1117] placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  autoFocus
                />
                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isVerifying || !adminToken}
                className="w-full bg-[#2B6CB0] hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-[#FFFFFF] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
