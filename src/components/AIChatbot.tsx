/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MessageSquare, X, Send, Bot, User, CornerDownLeft, Sparkles } from "lucide-react";
import { Report } from "../types";

interface Message {
  role: "user" | "model";
  content: string;
}

interface AIChatbotProps {
  reports: Report[];
}

export default function AIChatbot({ reports }: AIChatbotProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am **CivicEye AI**, your intelligent smart city assistant. Ask me anything about how to report issues, check report statuses, or learn more about our city infrastructure!",
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMsg = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      // Package reports as minimal context to reduce token size and cost
      const reportsSummary = reports.map((r) => ({
        id: r.id.substring(0, 8),
        title: r.title,
        status: r.status,
        category: r.category,
        priority: r.priority,
        department: r.department,
        createdAt: new Date(r.createdAt).toLocaleDateString(),
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          // Exclude first greeting from history
          history: messages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          reportsContext: reportsSummary,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat network response was not ok");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "I apologize, I'm having trouble connecting to my central brain right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown link and bold renderer
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center z-40 group border border-blue-500/30"
        title="CivicEye AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-medium text-sm whitespace-nowrap group-hover:ml-2">
          Civic Assistant
        </span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
        </span>
      </button>

      {/* Chat Windows Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            <div className="flex items-center gap-2.5">
              <div className="bg-white/10 p-1.5 rounded-lg border border-white/15">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm flex items-center gap-1">
                  CivicEye Assistant <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                </h4>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Smart City Agent
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/40"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.role === "user"
                      ? "bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>

                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-750 shadow-sm rounded-tl-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="space-y-1 whitespace-pre-line">
                      {renderMessageContent(msg.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 border border-slate-200 dark:border-slate-700">
                  <Bot className="w-4 h-4 animate-bounce text-emerald-500" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder="Ask about reports or file status..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs transition placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
