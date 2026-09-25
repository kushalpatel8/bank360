"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const SEGMENT_DESCRIPTIONS: Record<string, string> = {
  Priority: "High-value customers with strong banking relationships and premium service needs.",
  Mass: "Standard customers forming the core customer base. Focus on engagement uplift.",
  Premium: "Above-average customers nearing priority status. Excellent cross-sell targets.",
  VIP: "Top-tier customers requiring dedicated relationship management.",
  Regular: "Active customers with standard engagement and product mix.",
};

export default function SegmentationPage() {
  const [data, setData] = useState<{ segment: string; count: number; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d.segmentDistribution || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
      {[0,1,2,3].map(i => <div key={i} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl h-80" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
        <h2 className="text-[#0D1117] font-semibold mb-2">Customer Segmentation Overview</h2>
        <p className="text-[#4A5568] text-sm">Customers are segmented based on behavioral and financial attributes from the banking dataset.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
          <h3 className="text-[#0D1117] font-semibold mb-4">Segment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="segment" cx="50%" cy="50%" outerRadius={110}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} itemStyle={{ color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-6">
          <h3 className="text-[#0D1117] font-semibold mb-4">Segment Counts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="segment" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((seg, i) => (
          <div key={seg.segment} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5 hover:border-[#CBD5E0] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <h3 className="text-[#0D1117] font-semibold">{seg.segment || "Unknown"}</h3>
              </div>
              <span className="text-2xl font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                {seg.percentage}%
              </span>
            </div>
            <p className="text-[#4A5568] text-sm font-medium mb-1">{seg.count.toLocaleString()} customers</p>
            <p className="text-[#4A5568] text-xs leading-relaxed">
              {SEGMENT_DESCRIPTIONS[seg.segment || ""] || "Customer group identified by behavioral and financial patterns."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
