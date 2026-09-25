"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from "lucide-react";

const RISK_FLAGS = [
  { flag: "High Utilization Ratio", desc: "Credit utilization > 80% — potential over-leverage", severity: "high" },
  { flag: "Low Credit Score", desc: "Credit score below 600 — elevated default risk", severity: "high" },
  { flag: "Extended Inactivity", desc: "No activity for 3+ months — churn and delinquency risk", severity: "medium" },
  { flag: "High Revolving Balance", desc: "Carrying large revolving balance month-over-month", severity: "medium" },
  { flag: "Frequent Contact", desc: "Multiple contacts in 12 months — potential dissatisfaction", severity: "low" },
  { flag: "Low Relationship Count", desc: "Only 1-2 products — concentration risk", severity: "low" },
];

export default function RiskPage() {
  const [data, setData] = useState<{
    riskDistribution: { riskSegment: string; count: number; percentage: number }[];
    stats: { totalCustomers: number; highRiskCustomers: number };
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0,1,2].map(i => <div key={i} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl h-28" />)}
      </div>
    </div>;
  }

  if (!data) return null;

  const { riskDistribution, stats } = data;
  const highRisk = riskDistribution.find((r) => r.riskSegment === "High");
  const medRisk = riskDistribution.find((r) => r.riskSegment === "Medium");
  const lowRisk = riskDistribution.find((r) => r.riskSegment === "Low");

  const RISK_COLORS: Record<string, string> = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-amber-900 font-medium text-sm">
          Risk scores are analytical indicators based on customer data patterns. They should be reviewed by a relationship manager and not used as automated financial decisions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] border border-red-500/30 rounded-xl p-5">
          <ShieldAlert className="w-5 h-5 text-red-400 mb-3" />
          <p className="text-2xl font-bold text-red-400">{highRisk?.count?.toLocaleString() || "0"}</p>
          <p className="text-[#4A5568] text-sm mt-1">High Risk ({highRisk?.percentage ?? 0}%)</p>
        </div>
        <div className="bg-[#FFFFFF] border border-yellow-500/30 rounded-xl p-5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mb-3" />
          <p className="text-2xl font-bold text-yellow-400">{medRisk?.count?.toLocaleString() || "0"}</p>
          <p className="text-[#4A5568] text-sm mt-1">Medium Risk ({medRisk?.percentage ?? 0}%)</p>
        </div>
        <div className="bg-[#FFFFFF] border border-emerald-500/30 rounded-xl p-5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mb-3" />
          <p className="text-2xl font-bold text-emerald-400">{lowRisk?.count?.toLocaleString() || "0"}</p>
          <p className="text-[#4A5568] text-sm mt-1">Low Risk ({lowRisk?.percentage ?? 0}%)</p>
        </div>
      </div>

      {/* Risk Bar */}
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
        <h2 className="text-[#0D1117] font-semibold mb-4">Risk Distribution</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={riskDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="riskSegment" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} itemStyle={{ color: "#fff" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {riskDistribution.map((entry) => (
                <Cell key={entry.riskSegment} fill={RISK_COLORS[entry.riskSegment] || "#6b7280"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Flags */}
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
        <h2 className="text-[#0D1117] font-semibold mb-4">Risk Flags & Indicators</h2>
        <div className="space-y-3">
          {RISK_FLAGS.map((rf) => (
            <div key={rf.flag} className="flex items-start justify-between py-3 border-b border-[#CBD5E0] last:border-0 gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  rf.severity === "high" ? "bg-red-500" :
                  rf.severity === "medium" ? "bg-yellow-500" : "bg-emerald-500"
                }`} />
                <div>
                  <p className="text-[#0D1117] text-sm font-medium">{rf.flag}</p>
                  <p className="text-[#4A5568] text-xs mt-0.5">{rf.desc}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${
                rf.severity === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                rf.severity === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>{rf.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
