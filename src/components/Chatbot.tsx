"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, HelpCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI career coach. Ask me anything about writing cover letters, optimizing your resume, or preparing for job interviews! How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue("");
    
    // Add user message to stack
    const updatedMessages = [...messages, { role: "user", content: userMessageText } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Chat assistant failed to respond");
      }

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error(data.error || "Invalid response format");
      }
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `Sorry, I encountered an error: ${error.message}. Please verify your API keys and try again.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 border border-blue-500/30 cursor-pointer focus:outline-none"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageSquare className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Floating Chat Panel Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[360px] md:w-[400px] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl glass-panel shadow-2xl flex flex-col overflow-hidden z-[9998] pointer-events-auto"
          >
            {/* Header bar */}
            <div className="p-4 border-b border-border-color bg-blue-600/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-always-white" />
                  {/* Status Indicator (online) */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground tracking-tight">Career Assistant</h4>
                  <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Powered by Groq AI</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-background/40 scrollbar-thin">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                         <Sparkles className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                        msg.role === "user"
                          ? "bg-blue-600 text-always-white rounded-tr-none shadow-md shadow-blue-600/10"
                          : "bg-secondary/60 text-foreground border border-border-color rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-secondary border border-border-color flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-text-muted" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Thinking/loading bubble */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="px-4 py-3 bg-secondary/60 border border-border-color rounded-2xl rounded-tl-none flex items-center space-x-1.5 h-9">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-border-color bg-background/40 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me a question..."
                className="flex-1 bg-background border border-border-color rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-blue-500/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-always-white disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md shadow-blue-600/10 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
