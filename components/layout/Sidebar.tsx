"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  PieChart,
  TrendingDown,
  ShieldAlert,
  MessageSquare,
  CalendarCheck,
  Brain,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { useUser } from "@clerk/nextjs";

const navItems = [
  // Administrator links (Exactly as requested)
  { href: "/admin/users", icon: Users, label: "Manage users", roles: ["administrator"] },
  { href: "/analytics", icon: BarChart3, label: "View system analytics", roles: ["administrator"] },
  { href: "/customers", icon: UserCircle, label: "Manage customer records", roles: ["administrator"] },
  { href: "/admin/logs", icon: ShieldAlert, label: "Review audit information", roles: ["administrator"] },

  // Relationship Manager links (Exactly as requested)
  { href: "/dashboard", icon: LayoutDashboard, label: "View assigned customers", roles: ["relationship_manager"] },
  { href: "/customers", icon: Users, label: "Search customers", roles: ["relationship_manager"] },
  { href: "/customers", icon: UserCircle, label: "View Customer 360", roles: ["relationship_manager"] },
  { href: "/interactions", icon: MessageSquare, label: "Record interactions", roles: ["relationship_manager"] },
  { href: "/follow-ups", icon: CalendarCheck, label: "Create follow-ups", roles: ["relationship_manager"] },
  { href: "/dashboard", icon: BarChart3, label: "Review customer insights", roles: ["relationship_manager"] },
  { href: "/ai-assistant", icon: Brain, label: "Use AI assistant", roles: ["relationship_manager"] },

  // Analyst links (Exactly as requested)
  { href: "/dashboard", icon: LayoutDashboard, label: "View analytics", roles: ["analyst"] },
  { href: "/segmentation", icon: PieChart, label: "Analyze customer segments", roles: ["analyst"] },
  { href: "/churn", icon: TrendingDown, label: "Analyze churn", roles: ["analyst"] },
  { href: "/risk", icon: ShieldAlert, label: "Review risk indicators", roles: ["analyst"] },
  { href: "/customers", icon: Users, label: "Explore customer behavior", roles: ["analyst"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      let currentRole = user.publicMetadata?.role as string | undefined;
      if (!currentRole) {
        const match = document.cookie.match(/(?:^|; )user_role=([^;]*)/);
        if (match) currentRole = match[1];
      }
      setRole(currentRole || null);
    }
  }, [user]);

  // Filter items based on the user's role
  const filteredNavItems = navItems.filter((item) => {
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#FFFFFF] border-r border-[#CBD5E0] transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 py-5 border-b border-[#CBD5E0] hover:bg-[#EDF2F7]/50 transition-colors">
        <div className="w-8 h-8 bg-[#2B6CB0] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#FFFFFF] font-bold text-sm">B</span>
        </div>
        {!collapsed && (
          <span className="text-[#0D1117] font-bold text-lg tracking-tight">Bank360</span>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-[#2B6CB0] text-[#FFFFFF] shadow-lg shadow-blue-600/20"
                      : "text-[#4A5568] hover:text-[#0D1117] hover:bg-[#EDF2F7]"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-[#CBD5E0] text-[#4A5568] hover:text-[#0D1117] hover:bg-[#EDF2F7] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
