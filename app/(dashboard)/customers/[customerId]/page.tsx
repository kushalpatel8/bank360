"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Activity,
  ShieldAlert,
  TrendingDown,
  MessageSquare,
  CalendarCheck,
  Brain,
  Plus,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import { Customer, Interaction, FollowUp } from "@/types/customer";

function SectionCard({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[#2B6CB0]" />
        <h3 className="text-[#FFFFFF] font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-[#4A5568] text-sm">{label}</span>
      <span className="text-[#0D1117] text-sm font-medium">{String(value)}</span>
    </div>
  );
}

function RiskMeter({ score }: { score?: number }) {
  const s = score ?? 0;
  const color = s > 0.6 ? "#ef4444" : s > 0.3 ? "#f59e0b" : "#10b981";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[#4A5568]">Risk Score</span>
        <span className="font-medium" style={{ color }}>{(s * 100).toFixed(1)}%</span>
      </div>
      <div className="bg-slate-800 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${s * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

const INTERACTION_ICONS: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Building,
  query: MessageSquare,
  note: Activity,
};

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: "call" as "call" | "meeting" | "email" | "query" | "note",
    notes: "",
    outcome: "",
  });

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}`)
      .then((r) => r.json())
      .then((d) => {
        setCustomer(d.customer);
        setInteractions(d.interactions || []);
        setFollowUps(d.followUps || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [customerId]);

  const generateInsight = async () => {
    if (!customer) return;
    setAiLoading(true);
    try {
      const sessionId = `insight-${customerId}-${Date.now()}`;
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "What are the most important things to know about this customer? Provide a concise summary including their risk profile, engagement status, and any recommended actions.",
          sessionId,
          clientNum: customer.clientNum,
        }),
      });
      const data = await res.json();
      setAiInsight(data.message);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const addInteraction = async () => {
    if (!customer || !newInteraction.notes) return;
    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          clientNum: customer.clientNum,
          ...newInteraction,
          date: new Date().toISOString(),
        }),
      });
      setShowInteractionForm(false);
      setNewInteraction({ type: "call", notes: "", outcome: "" });
      // Refresh
      const res = await fetch(`/api/customers/${customerId}`);
      const d = await res.json();
      setInteractions(d.interactions || []);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center text-[#4A5568] py-24">
        Customer not found.{" "}
        <button onClick={() => router.back()} className="text-[#2B6CB0] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <Link
          href="/customers"
          className="flex items-center gap-2 text-[#4A5568] hover:text-[#0D1117] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-900/50 to-slate-900 border border-[#CBD5E0] rounded-xl p-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#2B6CB0]/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-[#2B6CB0]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#FFFFFF]">{customer.fullName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[#4A5568] text-sm">#{customer.clientNum}</span>
              {customer.customerSegment && (
                <span className="bg-[#2B6CB0]/10 text-[#2B6CB0] border border-blue-500/20 text-xs px-2 py-0.5 rounded-full">
                  {customer.customerSegment}
                </span>
              )}
              {customer.loyaltyLevel && (
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2 py-0.5 rounded-full">
                  {customer.loyaltyLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateInsight}
            disabled={aiLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Brain className="w-4 h-4" />
            {aiLoading ? "Generating..." : "AI Insight"}
          </button>
          <button
            onClick={() => setShowInteractionForm(true)}
            className="flex items-center gap-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Interaction
          </button>
        </div>
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-purple-300 font-semibold text-sm">AI-Generated Insight</h3>
          </div>
          <p className="text-[#4A5568] text-sm leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
        </div>
      )}

      {/* Add Interaction Form */}
      {showInteractionForm && (
        <div className="bg-[#FFFFFF] border border-blue-500/30 rounded-xl p-5 space-y-4">
          <h3 className="text-[#FFFFFF] font-semibold">Record Interaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Type</label>
              <select
                value={newInteraction.type}
                onChange={(e) => setNewInteraction((p) => ({ ...p, type: e.target.value as "call" | "meeting" | "email" | "query" | "note" }))}
                className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] rounded-lg px-3 py-2 text-sm outline-none"
              >
                {["call", "meeting", "email", "query", "note"].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#4A5568] text-sm mb-1 block">Outcome</label>
              <input
                value={newInteraction.outcome}
                onChange={(e) => setNewInteraction((p) => ({ ...p, outcome: e.target.value }))}
                placeholder="e.g. Interested in loan product"
                className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[#4A5568] text-sm mb-1 block">Notes *</label>
            <textarea
              value={newInteraction.notes}
              onChange={(e) => setNewInteraction((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Write interaction notes..."
              rows={3}
              className="w-full bg-slate-800 border border-[#CBD5E0] text-[#0D1117] placeholder:text-slate-600 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowInteractionForm(false)}
              className="px-4 py-2 text-[#4A5568] hover:text-[#0D1117] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={addInteraction}
              className="px-4 py-2 bg-[#2B6CB0] hover:bg-[#2B6CB0] text-[#FFFFFF] rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard title="Personal Information" icon={User}>
          <div className="divide-y divide-[#CBD5E0]">
            <InfoRow label="Age" value={customer.age} />
            <InfoRow label="Gender" value={customer.gender} />
            <InfoRow label="Marital Status" value={customer.maritalStatus} />
            <InfoRow label="Education" value={customer.educationLevel} />
            <InfoRow label="Dependents" value={customer.dependentCount} />
            <InfoRow label="Occupation" value={customer.occupation} />
          </div>
        </SectionCard>

        <SectionCard title="Location" icon={MapPin}>
          <div className="divide-y divide-[#CBD5E0]">
            <InfoRow label="Province" value={customer.originProvince} />
            <InfoRow label="Address" value={customer.address} />
            <InfoRow label="Tenure (years)" value={customer.tenureYears} />
            <InfoRow label="Member Since" value={customer.createdDate ? new Date(customer.createdDate).toLocaleDateString() : null} />
            <InfoRow label="Last Active" value={customer.lastActiveDate ? new Date(customer.lastActiveDate).toLocaleDateString() : null} />
          </div>
        </SectionCard>

        <SectionCard title="Financial Profile" icon={CreditCard}>
          <div className="divide-y divide-[#CBD5E0]">
            <InfoRow label="Balance" value={customer.balance != null ? `$${Number(customer.balance).toLocaleString()}` : null} />
            <InfoRow label="Credit Score" value={customer.creditScore} />
            <InfoRow label="Credit Limit" value={customer.creditLimit ? `$${Number(customer.creditLimit).toLocaleString()}` : null} />
            <InfoRow label="Monthly Income" value={customer.monthlyIncome ? `$${Number(customer.monthlyIncome).toLocaleString()}` : null} />
            <InfoRow label="Revolving Balance" value={customer.totalRevolvingBal ? `$${Number(customer.totalRevolvingBal).toLocaleString()}` : null} />
            <InfoRow label="Utilization Ratio" value={customer.avgUtilizationRatio != null ? `${(Number(customer.avgUtilizationRatio) * 100).toFixed(1)}%` : null} />
          </div>
        </SectionCard>

        <SectionCard title="Engagement" icon={Activity}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#4A5568] text-sm">Engagement Score</span>
              <span className="text-[#FFFFFF] font-bold">{customer.engagementScore ?? "—"}/100</span>
            </div>
            <div className="bg-slate-800 rounded-full h-2">
              <div
                className="bg-[#2B6CB0] h-2 rounded-full"
                style={{ width: `${customer.engagementScore ?? 0}%` }}
              />
            </div>
            <div className="divide-y divide-[#CBD5E0]">
              <InfoRow label="Loyalty Level" value={customer.loyaltyLevel} />
              <InfoRow label="Digital Behavior" value={customer.digitalBehavior} />
              <InfoRow label="Months Inactive" value={customer.monthsInactive12Mon} />
              <InfoRow label="Contacts (12m)" value={customer.contactsCount12Mon} />
              <InfoRow label="Trans Amount" value={customer.totalTransAmt ? `$${Number(customer.totalTransAmt).toLocaleString()}` : null} />
              <InfoRow label="Trans Count" value={customer.totalTransCt} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Risk Profile" icon={ShieldAlert}>
          <div className="space-y-4">
            <RiskMeter score={customer.riskScore} />
            <div className="divide-y divide-[#CBD5E0]">
              <InfoRow label="Risk Segment" value={customer.riskSegment} />
              <InfoRow label="Card Category" value={customer.cardCategory} />
              <InfoRow label="Income Category" value={customer.incomeCategory} />
              <InfoRow label="Cluster Group" value={customer.clusterGroup} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Churn Analysis" icon={TrendingDown}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#4A5568] text-sm">Churn Probability</span>
              <span className={`font-bold ${(customer.churnProbability ?? 0) > 0.5 ? "text-red-400" : "text-emerald-400"}`}>
                {customer.churnProbability != null ? `${(Number(customer.churnProbability) * 100).toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <div className="bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${(customer.churnProbability ?? 0) > 0.5 ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${(customer.churnProbability ?? 0) * 100}%` }}
              />
            </div>
            <div className="divide-y divide-[#CBD5E0]">
              <InfoRow label="Status" value={customer.attritionFlag} />
              <InfoRow label="Active Member" value={customer.isActiveMember ? "Yes" : "No"} />
              <InfoRow label="Months on Book" value={customer.monthsOnBook} />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Interactions */}
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-[#2B6CB0]" />
          <h3 className="text-[#FFFFFF] font-semibold">Recent Interactions</h3>
        </div>
        {interactions.length === 0 ? (
          <p className="text-[#4A5568] text-sm text-center py-8">No interactions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {interactions.map((i) => {
              const Icon = INTERACTION_ICONS[i.type] || MessageSquare;
              return (
                <div key={i._id} className="flex items-start gap-3 py-3 border-b border-[#CBD5E0] last:border-0">
                  <div className="w-8 h-8 bg-[#2B6CB0]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#2B6CB0]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#FFFFFF] text-sm font-medium capitalize">{i.type}</span>
                      <span className="text-[#4A5568] text-xs">•</span>
                      <span className="text-[#4A5568] text-xs">{new Date(i.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#4A5568] text-sm">{i.notes}</p>
                    {i.outcome && <p className="text-[#4A5568] text-xs mt-1">Outcome: {i.outcome}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Follow-ups */}
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarCheck className="w-4 h-4 text-[#2B6CB0]" />
          <h3 className="text-[#FFFFFF] font-semibold">Follow-ups</h3>
        </div>
        {followUps.length === 0 ? (
          <p className="text-[#4A5568] text-sm text-center py-8">No follow-ups scheduled.</p>
        ) : (
          <div className="space-y-2">
            {followUps.map((f) => {
              const isOverdue = new Date(f.dueDate) < new Date() && f.status === "pending";
              return (
                <div key={f._id} className="flex items-center justify-between py-2 border-b border-[#CBD5E0] last:border-0">
                  <div>
                    <p className="text-[#0D1117] text-sm font-medium">{f.title}</p>
                    <p className={`text-xs ${isOverdue ? "text-red-400" : "text-[#4A5568]"}`}>
                      Due: {new Date(f.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      f.priority === "urgent" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      f.priority === "high" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      "bg-slate-800 text-[#4A5568] border-[#CBD5E0]"
                    }`}>{f.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      f.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      f.status === "in_progress" ? "bg-[#2B6CB0]/10 text-[#2B6CB0] border-blue-500/20" :
                      "bg-slate-800 text-[#4A5568] border-[#CBD5E0]"
                    }`}>{f.status.replace("_", " ")}</span>
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
