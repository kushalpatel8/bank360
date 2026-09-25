"use client";

import { useEffect, useState } from "react";
import { Plus, Phone, Mail, Building, MessageSquare, Activity, FileText } from "lucide-react";
import { Interaction } from "@/types/customer";

const TYPE_ICONS: Record<string, React.ElementType> = {
  call: Phone, email: Mail, meeting: Building, query: MessageSquare, note: FileText,
};
const TYPE_COLORS: Record<string, string> = {
  call: "bg-[#2B6CB0]/10 text-[#2B6CB0]", email: "bg-purple-500/10 text-purple-400",
  meeting: "bg-emerald-500/10 text-emerald-400", query: "bg-yellow-500/10 text-yellow-400",
  note: "bg-slate-700 text-[#4A5568]",
};

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientNum: "", type: "call", notes: "", outcome: "" });

  useEffect(() => {
    fetch("/api/interactions")
      .then((r) => r.json())
      .then((d) => setInteractions(d.interactions || []))
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!form.notes || !form.clientNum) return;
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientNum: parseInt(form.clientNum), date: new Date().toISOString() }),
      });
      const d = await res.json();
      setInteractions((prev) => [d.interaction, ...prev]);
      setShowForm(false);
      setForm({ clientNum: "", type: "call", notes: "", outcome: "" });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#4A5568] text-sm">{interactions.length} recorded interactions</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Log Interaction
        </button>
      </div>

      {showForm && (
        <div className="bg-[#FFFFFF] border border-blue-500/30 rounded-xl p-5 space-y-4">
          <h3 className="text-[#FFFFFF] font-semibold">Log New Interaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Client Number *</label>
              <input value={form.clientNum} onChange={(e) => setForm((p) => ({ ...p, clientNum: e.target.value }))}
                placeholder="e.g. 768805383" className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Interaction Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] rounded-lg px-3 py-2 text-sm outline-none">
                {["call", "meeting", "email", "query", "note"].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Outcome</label>
              <input value={form.outcome} onChange={(e) => setForm((p) => ({ ...p, outcome: e.target.value }))}
                placeholder="Outcome of the interaction" className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Notes *</label>
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={2} className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#4A5568] hover:text-[#0D1117] text-sm transition-colors">Cancel</button>
            <button onClick={submit} className="px-4 py-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] rounded-lg text-sm font-medium transition-colors">Save</button>
          </div>
        </div>
      )}

      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-slate-800 rounded-lg" />)}
          </div>
        ) : interactions.length === 0 ? (
          <div className="text-center text-[#4A5568] py-20">
            <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No interactions recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#CBD5E0]">
            {interactions.map((i) => {
              const Icon = TYPE_ICONS[i.type] || MessageSquare;
              const color = TYPE_COLORS[i.type] || TYPE_COLORS.note;
              return (
                <div key={i._id} className="flex items-start gap-4 p-4 hover:bg-[#EDF2F7]/80 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#0D1117] text-sm font-medium capitalize">{i.type}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[#4A5568] text-xs">Client #{i.clientNum}</span>
                      </div>
                      <span className="text-[#4A5568] text-xs">{new Date(i.date).toLocaleString()}</span>
                    </div>
                    <p className="text-[#4A5568] text-sm mt-1">{i.notes}</p>
                    {i.outcome && <p className="text-[#4A5568] text-xs mt-1">Outcome: {i.outcome}</p>}
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
