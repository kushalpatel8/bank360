"use client";

import { useEffect, useState } from "react";
import { Plus, CalendarCheck, CheckCircle, Clock, XCircle, Circle } from "lucide-react";
import { FollowUp } from "@/types/customer";

const STATUS_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pending: { icon: Circle, color: "text-slate-600", bg: "bg-slate-100" },
  in_progress: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  low: "bg-[#EDF2F7] text-[#4A5568] border-[#CBD5E0]",
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    clientNum: "", title: "", notes: "", dueDate: "", priority: "medium", assignedTo: "self",
  });

  const fetch_ = async (status = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams(status ? { status } : {});
      const res = await fetch(`/api/follow-ups?${params}`);
      const d = await res.json();
      setFollowUps(d.followUps || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetch_(filter); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setFollowUps((prev) => prev.map((f) => f._id === id ? { ...f, status: status as FollowUp["status"] } : f));
    } catch (e) { console.error(e); }
  };

  const submit = async () => {
    if (!form.title || !form.dueDate) return;
    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientNum: form.clientNum ? parseInt(form.clientNum) : undefined }),
      });
      const d = await res.json();
      setFollowUps((prev) => [d.followUp, ...prev]);
      setShowForm(false);
      setForm({ clientNum: "", title: "", notes: "", dueDate: "", priority: "medium", assignedTo: "self" });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["", "pending", "in_progress", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-[#2B6CB0] text-[#FFFFFF]" : "bg-[#FFFFFF] border border-[#CBD5E0] text-[#4A5568] hover:text-[#FFFFFF]"}`}>
              {s ? s.replace("_", " ") : "All"}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Follow-up
        </button>
      </div>

      {showForm && (
        <div className="bg-[#FFFFFF] border border-blue-500/30 rounded-xl p-5 space-y-4">
          <h3 className="text-[#FFFFFF] font-semibold">Create Follow-up</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Title *</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Follow-up title" className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Client Number</label>
              <input value={form.clientNum} onChange={(e) => setForm((p) => ({ ...p, clientNum: e.target.value }))}
                placeholder="Optional" className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Due Date *</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] rounded-lg px-3 py-2 text-sm outline-none">
                {["low", "medium", "high", "urgent"].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[#4A5568] text-sm mb-1 block">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={2} className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#4A5568] hover:text-[#0D1117] text-sm transition-colors">Cancel</button>
            <button onClick={submit} className="px-4 py-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] rounded-lg text-sm font-medium transition-colors">Create</button>
          </div>
        </div>
      )}

      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-lg" />)}
          </div>
        ) : followUps.length === 0 ? (
          <div className="text-center text-[#4A5568] py-20">
            <CalendarCheck className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No follow-ups found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#CBD5E0]">
            {followUps.map((f) => {
              const st = STATUS_STYLES[f.status] || STATUS_STYLES.pending;
              const Icon = st.icon;
              const isOverdue = new Date(f.dueDate) < new Date() && f.status === "pending";
              return (
                <div key={f._id} className="flex items-start gap-4 p-4 hover:bg-[#EDF2F7]/80 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${st.bg}`}>
                    <Icon className={`w-4 h-4 ${st.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[#0D1117] text-sm font-medium">{f.title}</p>
                        {f.clientNum && <p className="text-[#4A5568] text-xs">Client #{f.clientNum}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[f.priority] || ""}`}>
                          {f.priority}
                        </span>
                        {f.status !== "completed" && f.status !== "cancelled" && (
                          <button onClick={() => updateStatus(f._id, "completed")}
                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-xs ${isOverdue ? "text-red-400 font-medium" : "text-[#4A5568]"}`}>
                        Due: {new Date(f.dueDate).toLocaleDateString()}{isOverdue ? " (Overdue)" : ""}
                      </span>
                      <span className={`text-xs ${st.color}`}>{f.status.replace("_", " ")}</span>
                    </div>
                    {f.notes && <p className="text-[#4A5568] text-xs mt-1">{f.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
