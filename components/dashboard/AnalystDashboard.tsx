"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

interface AnalyticsData {
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    highRiskCustomers: number;
    churnedCustomers: number;
    avgEngagementScore: number;
    avgCreditScore: number;
  };
  segmentDistribution: { segment: string; count: number; percentage: number }[];
  riskDistribution: { riskSegment: string; count: number; percentage: number }[];
  churnDistribution: { label: string; count: number; percentage: number }[];
  engagementDistribution: { level: string; count: number }[];
  productAdoption: { product: string; count: number }[];
}

export function AnalystDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#CBD5E0] shadow-sm rounded-xl h-80" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <div className="text-[#4A5568] text-center py-24">No analytics data. Import customers first.</div>;
  }

  const radarData = [
    { metric: "Active Rate", value: Math.round((data.stats.activeCustomers / data.stats.totalCustomers) * 100) },
    { metric: "Engagement", value: data.stats.avgEngagementScore },
    { metric: "Credit Score", value: Math.round((data.stats.avgCreditScore / 850) * 100) },
    { metric: "Retention", value: Math.round(((data.stats.totalCustomers - data.stats.churnedCustomers) / data.stats.totalCustomers) * 100) },
    { metric: "Low Risk", value: Math.round(((data.stats.totalCustomers - data.stats.highRiskCustomers) / data.stats.totalCustomers) * 100) },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D1117] mb-2">Analyst Dashboard</h1>
        <p className="text-[#4A5568]">Deep dive into portfolio analytics and behavioral trends.</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: data.stats.totalCustomers.toLocaleString(), color: "text-[#2B6CB0]" },
          { label: "Avg Engagement Score", value: `${data.stats.avgEngagementScore}/100`, color: "text-purple-400" },
          { label: "Avg Credit Score", value: data.stats.avgCreditScore, color: "text-cyan-400" },
          { label: "Active Customers", value: `${data.stats.activeCustomers.toLocaleString()} (${Math.round((data.stats.activeCustomers / data.stats.totalCustomers) * 100)}%)`, color: "text-emerald-400" },
          { label: "High Risk Customers", value: data.stats.highRiskCustomers.toLocaleString(), color: "text-red-400" },
          { label: "Churned", value: data.stats.churnedCustomers.toLocaleString(), color: "text-orange-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#CBD5E0] shadow-sm rounded-xl p-5">
            <p className="text-[#4A5568] font-medium text-sm">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Segment Pie */}
        <div className="bg-white border border-[#CBD5E0] shadow-sm rounded-xl p-6">
          <h2 className="text-[#0D1117] font-semibold mb-4">Customer Segment Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.segmentDistribution} dataKey="count" nameKey="segment" cx="50%" cy="50%" outerRadius={100} innerRadius={50}>
                {data.segmentDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #CBD5E0", borderRadius: 8 }} itemStyle={{ color: "#0D1117" }} />
              <Legend formatter={(v) => <span style={{ color: "#4A5568" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Health Radar */}
        <div className="bg-white border border-[#CBD5E0] shadow-sm rounded-xl p-6">
          <h2 className="text-[#0D1117] font-semibold mb-4">Portfolio Health (0-100)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#CBD5E0" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#4A5568", fontSize: 12 }} />
              <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #CBD5E0", borderRadius: 8 }} itemStyle={{ color: "#0D1117" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white border border-[#CBD5E0] shadow-sm rounded-xl p-6">
          <h2 className="text-[#0D1117] font-semibold mb-4">Engagement Level Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.engagementDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="eng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="level" tick={{ fill: "#4A5568", fontSize: 10 }} />
              <YAxis tick={{ fill: "#4A5568", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #CBD5E0", borderRadius: 8 }} itemStyle={{ color: "#0D1117" }} />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fill="url(#eng)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Adoption */}
        <div className="bg-white border border-[#CBD5E0] shadow-sm rounded-xl p-6">
          <h2 className="text-[#0D1117] font-semibold mb-4">Card Type Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.productAdoption} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: "#4A5568", fontSize: 12 }} />
              <YAxis dataKey="product" type="category" tick={{ fill: "#4A5568", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #CBD5E0", borderRadius: 8 }} itemStyle={{ color: "#0D1117" }} />
              <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
