import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  AlertOctagon,
  RefreshCw,
  Minus
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface ChatWidgetProps {
  onNavigate?: (tab: string) => void;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'model',
  text: "Hello. I'm Odell, your confidential, trauma-informed peer support companion here at AMEU. Whatever you are carrying right now—whether you are facing harassment on WhatsApp or Facebook, feeling overwhelmed, or just need someone safe to talk to—please know that your feelings are valid, and none of this is your fault.\n\nYou are in complete control of this conversation. We can talk through what happened, look at gentle ways to safeguard your accounts, or take a quiet breath together. How are you holding up today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTED_PROMPTS = [
  'Someone is harassing me on WhatsApp',
  'I feel anxious and overwhelmed',
  'How do I safely save screenshot evidence?',
  'Can I report 100% anonymously?',
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server-side Gemini API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply || "I'm listening and I'm right here with you. What else has been going on?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        throw new Error('Server response error');
      }
    } catch (err) {
      console.warn('Live API response not reachable, using empathetic fallback:', err);
      // Trauma-informed, compassionate fallback if network/proxy is temporarily offline
      let fallbackText = "I hear you, and I want you to know that you are not alone in this. What happened is not your fault. When dealing with hostile online situations, take a slow breath. Make sure to capture full, uncropped screenshots showing sender handles and timestamps before blocking them. You have full control over whether to report anonymously or connect with an AMEU peer counselor.";
      
      const lower = text.toLowerCase();
      if (lower.includes('emergency') || lower.includes('danger') || lower.includes('hurt') || lower.includes('suicide') || lower.includes('kill') || lower.includes('threat')) {
        fallbackText = "I care about your safety very much, and you do not have to carry this alone. Please connect with immediate emergency support right now:\n\n• AMEU Campus Security Dispatch (Camp Johnson Rd): +231 77 000 2638\n• Liberia National Police Command: 911 or +231 77 080 0911\n• National GBV & Cyber Harassment Helpline: 2883 (Toll-Free 24/7)\n\nI am right here with you. Please take a slow breath and reach out to them or a trusted friend immediately.";
      } else if (lower.includes('anxious') || lower.includes('overwhelmed') || lower.includes('panic') || lower.includes('scared') || lower.includes('stress')) {
        fallbackText = "I hear how heavy this feels right now. When online abuse hits, your body goes into high alert, and that is a completely normal reaction to an unfair situation.\n\nTake a slow, gentle breath with me. Inhale for 4 seconds, hold gently, and exhale slowly. Look around your room and name three steady objects you can see. You are safe here, and we can take this one small step at a time whenever you are ready.";
      } else if (lower.includes('whatsapp') || lower.includes('group') || lower.includes('harass')) {
        fallbackText = "Being targeted or humiliated in class or dorm WhatsApp groups is painful and deeply unfair. Here is what we recommend right now:\n\n1. Do not reply or argue back—it deprives the harassers of the reaction they want.\n2. Take full screenshots showing the sender's phone number, profile, message timestamps, and group name.\n3. In WhatsApp Settings > Privacy > Groups, change 'Who can add me' to 'My contacts except...' to stop unwanted group adds.\n4. You can submit an anonymous report anytime through the 'Report an Incident' tab above.";
      } else if (lower.includes('screenshot') || lower.includes('evidence')) {
        fallbackText = "Preserving evidence is a powerful step to protect yourself:\n\n• Capture the entire uncropped screen showing the sender's phone number or username, timestamp, and group name.\n• Save copies into a dedicated private folder or backup.\n• Once saved, step away from looking at them so you can give your mind some peace.";
      } else if (lower.includes('anonymous') || lower.includes('report')) {
        fallbackText = "Yes, absolutely. AMEU SafeSpace lets you submit reports completely anonymously. You do not have to provide your name or phone number. If you ever do want voluntary support from a peer counselor, you can optionally request contact—the choice is always 100% yours.";
      }

      const fallbackMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-[#064E32] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-950/40 ring-2 ring-white/80 hover:ring-emerald-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Chat with Odell - 24/7 AMEU Digital Guide"
          aria-label="Open Live Chat with Odell"
        >
          {/* Animated pulsing online beacon */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-white"></span>
          </span>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
            <span className="tracking-tight">Chat with Odell</span>
          </div>

          {unreadCount > 0 && !isOpen && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Live Chat Window Modal / Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[85vh] sm:max-h-[640px] flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="flex flex-col h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Chat with Odell"
            >
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-[#064E32] via-[#0E5C3C] to-[#138A45] text-white p-4 shrink-0 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white text-[#064E32] flex items-center justify-center shadow-md ring-2 ring-emerald-300/40 font-bold">
                      <Bot className="w-5 h-5 text-[#064E32]" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#064E32]"></span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-white tracking-tight">Odell</h3>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-400/20 text-emerald-200 text-[9px] font-black uppercase tracking-wider border border-emerald-300/30">
                        Trauma-Informed Peer
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100/90 leading-tight">
                      100% Confidential • SafeSpace Ally
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleResetChat}
                    className="p-1.5 rounded-xl hover:bg-white/15 text-emerald-100 transition-colors cursor-pointer"
                    title="Reset conversation"
                    aria-label="Reset conversation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white/15 text-emerald-100 transition-colors cursor-pointer"
                    title="Close live chat"
                    aria-label="Close live chat"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/80">
                {/* Reassurance pill */}
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-950 text-[11px] flex items-center gap-2 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Your chat is private and confidential. Never share your passwords or financial info.
                  </span>
                </div>

                {/* Messages list */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-xl bg-[#064E32] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                        msg.role === 'user'
                          ? 'bg-[#064E32] text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#064E32] text-white flex items-center justify-center text-xs shrink-0 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[11px] text-slate-400 ml-1.5">Odell is typing...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200/70 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:border-emerald-500 hover:text-emerald-800 text-[11px] font-semibold whitespace-nowrap transition-colors shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Quick Links / Escalate Bar */}
              {onNavigate && (
                <div className="px-3 py-1.5 bg-emerald-50/90 border-t border-emerald-100 flex items-center justify-between text-[11px] shrink-0">
                  <span className="font-semibold text-emerald-900">Need direct action?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onNavigate('report');
                        setIsOpen(false);
                      }}
                      className="text-emerald-700 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      File Report
                    </button>
                    <span className="text-emerald-300">•</span>
                    <button
                      onClick={() => {
                        onNavigate('support');
                        setIsOpen(false);
                      }}
                      className="text-emerald-700 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      Emergency Hotlines
                    </button>
                  </div>
                </div>
              )}

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    placeholder="Type a confidential message..."
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden disabled:opacity-50"
                  />

                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-[#064E32] hover:bg-[#0E5C3C] text-white transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
