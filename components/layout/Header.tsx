"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/analytics": "Analytics",
  "/segmentation": "Segmentation",
  "/churn": "Churn Analysis",
  "/risk": "Risk Dashboard",
  "/interactions": "Interactions",
  "/follow-ups": "Follow-ups",
  "/ai-assistant": "AI Assistant",
};

export function Header() {
  const pathname = usePathname();
  const base = "/" + pathname.split("/")[1];
  const title = pageTitles[base] || "Bank360";

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[#FFFFFF]/80 backdrop-blur-sm border-b border-[#CBD5E0] sticky top-0 z-10">
      <h1 className="text-[#1A365D] font-bold text-xl">{title}</h1>

      <div className="flex items-center gap-4">
        <Link
          href="/customers"
          className="flex items-center gap-2 bg-[#EDF2F7] border border-[#CBD5E0] hover:border-[#2B6CB0] text-[#4A5568] hover:text-[#0D1117] px-4 py-2 rounded-md text-sm transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:block">Search customers...</span>
        </Link>

        <button className="relative p-2 text-[#4A5568] hover:text-[#0D1117] hover:bg-[#EDF2F7] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2B6CB0] rounded-full" />
        </button>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
