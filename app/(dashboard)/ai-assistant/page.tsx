"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, Send, Search, User, Loader2, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "What are the key risk indicators for this customer?",
  "Summarize this customer's engagement history.",
  "What retention strategies do you recommend?",
  "Analyze the churn risk for this customer.",
  "What cross-sell opportunities exist?",
  "Explain the customer's financial profile.",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientNum, setClientNum] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg?: string) => {
    const text = (msg ?? input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          ...(clientNum ? { clientNum: parseInt(clientNum) } : {}),
        }),
      });

      const data = await res.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message, timestamp: new Date().toISOString() },
        ]);
      } else {
        throw new Error(data.error || "AI error");
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${e instanceof Error ? e.message : "Something went wrong. Please try again."}`, timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-[#FFFFFF] font-semibold">Bank360 AI Assistant</h2>
            <p className="text-[#4A5568] text-xs">Powered by LLaMA 3.3 70B via Groq</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#4A5568]" />
          <input
            value={clientNum}
            onChange={(e) => setClientNum(e.target.value)}
            placeholder="Client # (optional)"
            className="bg-[#EDF2F7] border border-[#CBD5E0] text-[#0D1117] placeholder:text-[#4A5568] rounded-lg px-3 py-1.5 text-sm outline-none w-40"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-[#0D1117] font-semibold mb-2">Bank360 AI Assistant</h3>
            <p className="text-[#4A5568] text-sm max-w-sm mb-8">
              Ask me anything about your customers. Enter a client number above to get customer-specific insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-left text-sm text-[#0D1117] bg-[#EDF2F7] hover:bg-slate-200 border border-[#CBD5E0] rounded-lg px-4 py-3 transition-colors shadow-sm font-medium"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-[#2B6CB0] text-[#FFFFFF] shadow-sm"
                    : "bg-[#EDF2F7] border border-[#CBD5E0] text-[#0D1117] shadow-sm"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1.5 ${msg.role === "user" ? "text-blue-200" : "text-[#4A5568]"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 bg-[#2B6CB0]/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#2B6CB0]" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="bg-[#EDF2F7] border border-[#CBD5E0] rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Suggested prompts when chat started */}
      {messages.length > 0 && !loading && (
        <div className="flex gap-2 flex-wrap mt-2">
          {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="text-xs font-medium text-[#4A5568] hover:text-[#0D1117] bg-[#FFFFFF] border border-[#CBD5E0] hover:bg-[#EDF2F7] rounded-full px-3 py-1 transition-colors">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask about a customer, portfolio trends, or banking insights..."
          className="flex-1 bg-[#FFFFFF] border border-[#CBD5E0] focus:border-[#2B6CB0] text-[#0D1117] placeholder:text-[#4A5568] rounded-xl px-4 py-3 text-sm outline-none transition-colors shadow-sm"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-12 h-12 bg-[#2B6CB0] hover:bg-[#2B6CB0] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
