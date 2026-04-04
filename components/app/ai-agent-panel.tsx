"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Bot, Send, Copy, Check, Zap, Mail, Phone, UserSearch,
  BarChart3, ChevronRight, Loader2, Settings, X, Star, MapPin,
} from "lucide-react"

interface Lead {
  id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  rating?: number | null
  reviewCount?: number | null
  category?: string | null
  googleMapsUrl?: string | null
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  action?: string
  createdAt: Date
}

interface AIAgentPanelProps {
  lead?: Lead | null
  businessContext?: string
  onSaveContext?: (context: string) => void
}

type ActionType = "analyze" | "email" | "callScript" | "decisionMaker"

const ACTION_CONFIG: Record<ActionType, { icon: React.ElementType; label: string; color: string }> = {
  analyze: {
    icon: BarChart3,
    label: "Analyze lead",
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300 hover:border-violet-400/50",
  },
  email: {
    icon: Mail,
    label: "Write outreach email",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300 hover:border-blue-400/50",
  },
  callScript: {
    icon: Phone,
    label: "Generate call script",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300 hover:border-green-400/50",
  },
  decisionMaker: {
    icon: UserSearch,
    label: "Find decision maker",
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300 hover:border-orange-400/50",
  },
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-slate-500"
          style={{
            animation: "bounce-dot 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isAssistant = message.role === "assistant"

  return (
    <div
      className={`group flex gap-3 ${isAssistant ? "flex-row" : "flex-row-reverse"}`}
      style={{ animation: "fadeInUp 0.3s ease-out" }}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isAssistant
            ? "bg-gradient-to-br from-violet-500 to-blue-500"
            : "bg-gradient-to-br from-slate-600 to-slate-700 border border-white/10"
        }`}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <span className="text-xs text-white font-medium">You</span>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isAssistant ? "items-start" : "items-end"}`}>
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isAssistant
              ? "bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm"
              : "bg-violet-600 text-white rounded-tr-sm"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {isAssistant && (
            <button
              onClick={handleCopy}
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d0d1a] border border-white/10 rounded-full p-1 shadow-lg"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3 text-slate-400" />
              )}
            </button>
          )}
        </div>

        <span className="text-xs text-slate-600 px-1">
          {message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}

export function AIAgentPanel({ lead, businessContext = "", onSaveContext }: AIAgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showContextPanel, setShowContextPanel] = useState(false)
  const [context, setContext] = useState(businessContext)
  const [contextDraft, setContextDraft] = useState(businessContext)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (lead && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your AI sales agent. I'm ready to help you with **${lead.name}**.\n\nSelect a quick action or ask me anything about this lead.`,
          createdAt: new Date(),
        },
      ])
    }
    // Reset messages when lead changes
    if (lead) {
      setMessages([])
    }
  }, [lead?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (lead && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your AI sales agent. I'm ready to help you with **${lead.name}**.\n\nSelect a quick action below, or ask me anything about this lead.`,
          createdAt: new Date(),
        },
      ])
    }
  }, [messages.length, lead])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = useCallback(
    async (userMessage: string, actionType?: ActionType) => {
      if (!lead || !userMessage.trim() || isLoading) return

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage.trim(),
        action: actionType,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/ai-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            action: actionType,
            lead,
            businessContext: context,
            conversationHistory: messages.slice(-6).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error("API error")
        }

        const data = await response.json() as { message: string }

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          createdAt: new Date(),
        }

        setMessages((prev) => [...prev, assistantMsg])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "❌ An error occurred. Please try again.",
            createdAt: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
        inputRef.current?.focus()
      }
    },
    [lead, isLoading, context, messages]
  )

  function handleQuickAction(action: ActionType) {
    const prompts: Record<ActionType, string> = {
      analyze: "Analyze this lead",
      email: "Write an outreach email",
      callScript: "Generate a call script",
      decisionMaker: "Find the decision maker",
    }
    sendMessage(prompts[action], action)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) sendMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) sendMessage(input)
    }
  }

  function handleSaveContext() {
    setContext(contextDraft)
    onSaveContext?.(contextDraft)
    setShowContextPanel(false)
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
          <Bot className="h-10 w-10 text-violet-400/60" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Select a lead to start</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Choose a lead from the list on the left to analyze it with your AI agent.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#080812]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-violet-500/5 to-blue-500/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Agent</p>
            <p className="text-xs text-slate-500 truncate max-w-[200px]">{lead.name}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowContextPanel(!showContextPanel)
            setContextDraft(context)
          }}
          className={`p-2 rounded-lg transition-colors ${
            showContextPanel
              ? "bg-violet-600/20 text-violet-400"
              : "hover:bg-white/5 text-slate-500 hover:text-slate-300"
          }`}
          title="Business context"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Context panel */}
      {showContextPanel && (
        <div className="border-b border-white/5 bg-white/2 p-4" style={{ animation: "fadeInUp 0.2s ease-out" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">Your business context</p>
            <button
              onClick={() => setShowContextPanel(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            The AI uses this to personalize all outputs for your specific situation.
          </p>
          <textarea
            value={contextDraft}
            onChange={(e) => setContextDraft(e.target.value)}
            placeholder="E.g.: I sell CRM software to SMBs in construction, targeting operations managers..."
            rows={3}
            className="w-full text-sm rounded-lg border border-white/10 bg-white/5 text-slate-200 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder:text-slate-600"
          />
          <button
            onClick={handleSaveContext}
            className="mt-2 text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Save context
          </button>
        </div>
      )}

      {/* Lead info */}
      <div className="px-4 py-3 border-b border-white/5 bg-white/2">
        <div className="flex flex-wrap gap-2">
          {lead.address && (
            <span className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1 text-slate-400">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate max-w-[120px]">{lead.address}</span>
            </span>
          )}
          {lead.rating && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-1 text-amber-400">
              <Star className="h-2.5 w-2.5 fill-amber-400" />
              {lead.rating} ({lead.reviewCount} reviews)
            </span>
          )}
          {lead.category && (
            <span className="inline-flex items-center gap-1 text-xs bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-1 text-violet-400">
              {lead.category}
            </span>
          )}
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(ACTION_CONFIG) as [ActionType, typeof ACTION_CONFIG[ActionType]][]).map(
            ([action, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-gradient-to-br text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-left ${config.color}`}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{config.label}</span>
                  <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0 opacity-40" />
                </button>
              )
            }
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex gap-3" style={{ animation: "fadeInUp 0.3s ease-out" }}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 bg-[#080812]">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this lead..."
              rows={1}
              disabled={isLoading}
              className="w-full text-sm rounded-xl border border-white/10 bg-white/5 text-slate-200 px-4 py-3 pr-3 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder:text-slate-600 disabled:opacity-50 min-h-[44px] max-h-32"
              onInput={(e) => {
                const target = e.currentTarget
                target.style.height = "auto"
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <p className="text-xs text-slate-600 mt-2 text-center flex items-center justify-center gap-1">
          <Zap className="h-3 w-3 text-violet-500" />
          <span>Powered by GPT-4o</span>
        </p>
      </div>
    </div>
  )
}
