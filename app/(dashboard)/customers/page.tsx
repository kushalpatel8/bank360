"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, User, TrendingDown, ShieldAlert } from "lucide-react";
import { Customer } from "@/types/customer";

const SEGMENTS = ["", "Priority", "Mass", "Premium", "VIP", "Regular"];
const RISK_LEVELS = ["", "Low", "Medium", "High"];
const STATUSES = ["", "active", "inactive", "churned"];

function RiskBadge({ risk }: { risk?: string }) {
  const colors: Record<string, string> = {
    High: "bg-red-500/10 text-red-400 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  const c = colors[risk || ""] || "bg-slate-800 text-[#4A5568] border-[#CBD5E0]";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${c}`}>
      {risk || "Unknown"}
    </span>
  );
}

function ChurnBadge({ flag }: { flag?: string }) {
  const isChurned = flag?.includes("Attrited");
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        isChurned
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      }`}
    >
      {isChurned ? "Churned" : "Active"}
    </span>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("");
  const [riskSegment, setRiskSegment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search && { search }),
        ...(segment && { segment }),
        ...(riskSegment && { riskSegment }),
        ...(status && { status }),
      });
      const res = await fetch(`/api/customers?${params}`);
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, segment, riskSegment, status]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(1);
  }, [search, segment, riskSegment, status]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-white border border-[#CBD5E0] rounded-lg px-3 py-2 flex-1 min-w-64 shadow-sm">
          <Search className="w-4 h-4 text-[#4A5568] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, province..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[#0D1117] placeholder:text-[#4A5568] text-sm outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4A5568]" />
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="bg-white border border-[#CBD5E0] text-[#0D1117] shadow-sm text-sm rounded-lg px-3 py-2 outline-none"
          >
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>{s || "All Segments"}</option>
            ))}
          </select>

          <select
            value={riskSegment}
            onChange={(e) => setRiskSegment(e.target.value)}
            className="bg-white border border-[#CBD5E0] text-[#0D1117] shadow-sm text-sm rounded-lg px-3 py-2 outline-none"
          >
            {RISK_LEVELS.map((r) => (
              <option key={r} value={r}>{r || "All Risk"}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-[#CBD5E0] text-[#0D1117] shadow-sm text-sm rounded-lg px-3 py-2 outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All Status"}</option>
            ))}
          </select>
        </div>

        <span className="text-[#4A5568] text-sm ml-auto">{total.toLocaleString()} customers</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#CBD5E0] shadow-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#CBD5E0]">
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Segment</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Balance</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Credit Score</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Engagement</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Risk</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Churn</th>
                <th className="text-left px-4 py-3 text-[#4A5568] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#CBD5E0]/50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-[#4A5568] py-16">
                    No customers found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-[#CBD5E0]/50 hover:bg-[#EDF2F7]/80 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2B6CB0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#2B6CB0]" />
                        </div>
                        <div>
                          <p className="text-[#0D1117] font-bold">{c.fullName}</p>
                          <p className="text-[#4A5568] text-xs">#{c.clientNum}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#4A5568]">{c.customerSegment || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#4A5568]">
                        {c.balance != null ? `$${Number(c.balance).toLocaleString()}` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${
                        (c.creditScore ?? 0) >= 700 ? "text-emerald-400" :
                        (c.creditScore ?? 0) >= 600 ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {c.creditScore || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#EDF2F7] rounded-full h-1.5 w-16">
                          <div
                            className="bg-[#2B6CB0] h-1.5 rounded-full"
                            style={{ width: `${c.engagementScore ?? 0}%` }}
                          />
                        </div>
                        <span className="text-[#4A5568] font-medium text-xs">{c.engagementScore ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge risk={c.riskSegment} />
                    </td>
                    <td className="px-4 py-3">
                      <ChurnBadge flag={c.attritionFlag} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/customers/${c._id}`}
                        className="text-[#2B6CB0] hover:text-blue-300 text-xs font-medium transition-colors"
                      >
                        View 360 →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#CBD5E0]">
          <span className="text-[#4A5568] text-sm">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-[#4A5568] hover:text-[#FFFFFF] hover:bg-[#EDF2F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-[#4A5568] hover:text-[#0D1117] hover:bg-[#EDF2F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
