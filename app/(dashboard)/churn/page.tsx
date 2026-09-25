"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, AlertTriangle, Users, Activity } from "lucide-react";

export default function ChurnPage() {
  const [data, setData] = useState<{
    churnDistribution: { label: string; count: number; percentage: number }[];
    stats: { totalCustomers: number; churnedCustomers: number; avgEngagementScore: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <div key={i} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl h-28" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0,1].map(i => <div key={i} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl h-72" />)}
      </div>
    </div>;
  }

  if (!data) return null;

  const { churnDistribution, stats } = data;
  const churnRate = stats.totalCustomers > 0
    ? ((stats.churnedCustomers / stats.totalCustomers) * 100).toFixed(1)
    : "0.0";
  const retentionRate = (100 - parseFloat(churnRate)).toFixed(1);

  const churnedData = churnDistribution.find((d) => d.label?.includes("Attrited"));
  const activeData = churnDistribution.find((d) => !d.label?.includes("Attrited"));

  const riskIndicators = [
    { label: "High Inactivity Risk", desc: "Customers inactive for 3+ months in last 12", value: "~15%", color: "text-red-400" },
    { label: "Moderate Inactivity", desc: "Customers inactive for 1-2 months", value: "~28%", color: "text-yellow-400" },
    { label: "Fully Active", desc: "Regular monthly engagement", value: "~57%", color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
          <TrendingDown className="w-5 h-5 text-red-400 mb-3" />
          <p className="text-2xl font-bold text-red-400">{churnRate}%</p>
          <p className="text-[#4A5568] text-sm mt-1">Churn Rate</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
          <Users className="w-5 h-5 text-emerald-400 mb-3" />
          <p className="text-2xl font-bold text-emerald-400">{retentionRate}%</p>
          <p className="text-[#4A5568] text-sm mt-1">Retention Rate</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-3" />
          <p className="text-2xl font-bold text-orange-400">{churnedData?.count?.toLocaleString() || "0"}</p>
          <p className="text-[#4A5568] text-sm mt-1">Attrited Customers</p>
        </div>
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
          <Activity className="w-5 h-5 text-[#2B6CB0] mb-3" />
          <p className="text-2xl font-bold text-[#2B6CB0]">{stats.avgEngagementScore}/100</p>
          <p className="text-[#4A5568] text-sm mt-1">Avg Engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Churn Pie */}
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
          <h2 className="text-[#0D1117] font-semibold mb-4">Churn vs Retention</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={churnDistribution} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={100} innerRadius={55}>
                {churnDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.label?.includes("Attrited") ? "#ef4444" : "#10b981"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} itemStyle={{ color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-[#4A5568] text-sm">Attrited ({churnedData?.percentage ?? 0}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-[#4A5568] text-sm">Existing ({activeData?.percentage ?? 0}%)</span>
            </div>
          </div>
        </div>

        {/* Churn Bar */}
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
          <h2 className="text-[#0D1117] font-semibold mb-4">Churn Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={churnDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {churnDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.label?.includes("Attrited") ? "#ef4444" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
        <h2 className="text-[#0D1117] font-semibold mb-4">Churn Risk Indicators</h2>
        <div className="space-y-3">
          {riskIndicators.map((r) => (
            <div key={r.label} className="flex items-center justify-between py-3 border-b border-[#CBD5E0] last:border-0">
              <div>
                <p className="text-[#0D1117] text-sm font-medium">{r.label}</p>
                <p className="text-[#4A5568] text-xs">{r.desc}</p>
              </div>
              <span className={`text-lg font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-4">
          Note: These indicators are based on historical dataset patterns and should be used as analytical guidance, not automated decisions.
        </p>
      </div>
    </div>
  );
}
