"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CalendarCheck, ShieldAlert, MessageSquare, ArrowRight, Brain, Search } from "lucide-react";
import { Customer } from "@/types/customer";

export function RMDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers?limit=5")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A365D] mb-2">Relationship Manager Hub</h1>
          <p className="text-[#4A5568]">Manage your portfolio, track interactions, and drive retention.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/customers" className="flex items-center gap-2 bg-[#EDF2F7] border border-[#CBD5E0] hover:border-[#2B6CB0] text-[#4A5568] hover:text-[#0D1117] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Search className="w-4 h-4" />
            Search Customers
          </Link>
          <Link href="/ai-assistant" className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#1A365D] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            <Brain className="w-4 h-4" />
            AI Assistant
          </Link>
        </div>
      </div>

      {/* Action Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="My Portfolio" value="142" color="bg-[#2B6CB0]" trend="+3 this week" />
        <StatCard icon={CalendarCheck} label="Follow-ups Due" value="8" color="bg-orange-600" alert />
        <StatCard icon={ShieldAlert} label="High Risk Alert" value="3" color="bg-red-600" alert />
        <StatCard icon={MessageSquare} label="Recent Interactions" value="24" color="bg-[#2B6CB0]" trend="Last 7 days" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Customers */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl overflow-hidden shadow-xl shadow-black/20">
          <div className="p-6 border-b border-[#CBD5E0] flex items-center justify-between bg-[#FFFFFF]/50">
            <h2 className="text-[#1A365D] font-semibold">Priority Customers</h2>
            <Link href="/customers" className="text-[#2B6CB0] hover:text-[#1A365D] text-sm font-medium flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="divide-y divide-[#CBD5E0]/50">
            {loading ? (
              <div className="p-6 animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[#EDF2F7] rounded-xl" />)}
              </div>
            ) : customers.length === 0 ? (
              <div className="p-12 text-center text-[#4A5568] font-medium">No customers found in your portfolio.</div>
            ) : (
              customers.map(customer => (
                <div key={customer._id} className="p-4 hover:bg-[#EDF2F7]/40 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-center text-[#2B6CB0] font-bold text-lg shadow-inner">
                      {customer.fullName?.charAt(0) || "C"}
                    </div>
                    <div>
                      <Link href={`/customers/${customer._id}`} className="text-[#0D1117] font-semibold group-hover:text-[#2B6CB0] transition-colors text-lg">
                        {customer.fullName}
                      </Link>
                      <p className="text-[#4A5568] text-sm">{customer.email || `Client #${customer.clientNum}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[#0D1117] text-sm font-semibold">${customer.balance?.toLocaleString() || "0"}</p>
                      <p className="text-[#4A5568] text-xs uppercase tracking-wider font-medium">Balance</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                      customer.riskSegment === 'High' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                      customer.riskSegment === 'Medium' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' :
                      'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                    }`}>
                      {customer.riskSegment || "Low"} Risk
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Follow ups */}
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl flex flex-col shadow-xl shadow-black/20">
          <div className="p-6 border-b border-[#CBD5E0] bg-[#FFFFFF]/50">
            <h2 className="text-[#1A365D] font-semibold">Today's Tasks</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            {[
              { title: "Review Attrition Risk", desc: "Michael Johnson showed unusual transfer activity.", time: "10:00 AM", type: "alert" },
              { title: "Quarterly Check-in", desc: "Call Sarah Williams regarding Premium Account.", time: "1:30 PM", type: "call" },
              { title: "Onboarding Follow-up", desc: "Email new VIP client David Chen.", time: "3:00 PM", type: "email" },
            ].map((task, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-[#CBD5E0] bg-[#EDF2F7]/50 hover:border-[#CBD5E0] hover:bg-[#EDF2F7]/80 transition-all cursor-pointer group">
                <div className={`w-2 h-2 mt-1.5 rounded-full shadow-lg ${task.type === 'alert' ? 'bg-red-500 shadow-red-500/50' : task.type === 'call' ? 'bg-[#2B6CB0] shadow-blue-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                <div>
                  <h4 className="text-[#0D1117] text-sm font-semibold group-hover:text-[#2B6CB0] transition-colors">{task.title}</h4>
                  <p className="text-[#4A5568] text-xs mt-1.5 mb-2.5 leading-relaxed">{task.desc}</p>
                  <span className="text-[#4A5568] text-xs font-medium bg-[#FFFFFF] px-2 py-1 rounded-md border border-[#CBD5E0]">{task.time}</span>
                </div>
              </div>
            ))}
            <Link href="/follow-ups" className="mt-auto w-full py-3 rounded-xl border border-[#CBD5E0] text-[#4A5568] text-sm font-semibold text-center hover:bg-[#EDF2F7] hover:text-[#0D1117] transition-colors">
              View All Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend, alert }: any) {
  return (
    <div className={`bg-[#FFFFFF] border rounded-xl p-6 transition-all shadow-lg ${alert ? 'border-red-500/30 shadow-red-500/5' : 'border-[#CBD5E0] hover:border-[#CBD5E0] shadow-black/10'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-white shadow-inner`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-extrabold text-[#0D1117] mb-1.5">{value}</p>
      <p className="text-[#4A5568] text-sm font-medium">{label}</p>
    </div>
  );
}
