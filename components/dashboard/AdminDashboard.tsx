"use client";

import { Shield, Users, Activity, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-[#EDF2F7] min-h-[calc(100vh-4rem)] p-8 -m-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A365D] mb-2">Admin Control Center</h1>
          <p className="text-[#4A5568]">System health, user management, and platform analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/settings" className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#1A365D] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" />
            System Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6 flex flex-col justify-between group hover:border-[#2B6CB0] transition-all shadow-sm hover:shadow-md">
          <div>
            <div className="w-12 h-12 bg-[#EDF2F7] rounded-xl flex items-center justify-center mb-4 text-[#1A365D]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-2">User Management</h3>
            <p className="text-[#4A5568] text-sm mb-6">Manage relationship managers, analysts, and access controls.</p>
          </div>
          <Link href="/admin/users" className="flex items-center gap-2 text-[#2B6CB0] text-sm font-bold hover:text-[#1A365D] transition-colors">
            Manage Users <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6 flex flex-col justify-between group hover:border-[#2B6CB0] transition-all shadow-sm hover:shadow-md">
          <div>
            <div className="w-12 h-12 bg-[#EDF2F7] rounded-xl flex items-center justify-center mb-4 text-[#1A365D]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1117] mb-2">System Analytics</h3>
            <p className="text-[#4A5568] text-sm mb-6">Monitor API usage, database performance, and system health.</p>
          </div>
          <Link href="/analytics" className="flex items-center gap-2 text-[#2B6CB0] text-sm font-bold hover:text-[#1A365D] transition-colors">
            View Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6 flex flex-col justify-between group hover:border-[#2B6CB0] transition-all shadow-sm hover:shadow-md">
          <div>
            <div className="w-12 h-12 bg-[#EDF2F7] rounded-xl flex items-center justify-center mb-4 text-[#1A365D]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1117] mb-2">Audit Logs</h3>
            <p className="text-[#4A5568] text-sm mb-6">Review system events, access logs, and security alerts.</p>
          </div>
          <Link href="/admin/logs" className="flex items-center gap-2 text-[#2B6CB0] text-sm font-bold hover:text-[#1A365D] transition-colors">
            Review Logs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
