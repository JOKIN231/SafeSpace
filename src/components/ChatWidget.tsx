import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  Smartphone,
  HeartHandshake,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  followUps?: string[];
}

interface ChatWidgetProps {
  onNavigate?: (tab: string) => void;
}

interface PresetResponse {
  answer: string;
  followUps: string[];
}

const PRESET_KNOWLEDGE_BASE: Record<string, PresetResponse> = {
  // Reporting & Anonymity
  'Can I report 100% anonymously?': {
    answer:
      "Yes, absolutely. AMEU SafeSpace is specifically designed so you never have to provide your name, student ID, or contact details to submit a report.\n\n• You will receive a unique confidential Reference Code (e.g., AMEU-7X9B).\n• No IP address, device location, or identity tracking is recorded.\n• You can optionally request counselor follow-up, but that choice is 100% voluntary.",
    followUps: ['Can professors or classmates see it?', 'What happens after I report?', 'Do I need proof to submit a report?'],
  },
  'Can professors or classmates see it?': {
    answer:
      "No. Incident reports are strictly isolated in a private database accessible only by authorized university peer counselors and the designated safeguarding administrator.\n\nNeither course instructors, academic deans, student council leaders, nor classmates have access to report submissions. Your safety and confidentiality are strictly protected.",
    followUps: ['Can I report 100% anonymously?', 'What happens after I report?'],
  },
  'What happens after I report?': {
    answer:
      "Here is the exact journey of a report:\n\n1. Registration: The incident is securely registered with your confidential reference code.\n2. Triage: An authorized counselor reviews the category and urgency (high, medium, or low).\n3. Support: If you voluntarily requested contact, a counselor will reach out via your provided phone number in a discreet manner. If you chose anonymous mode, the pattern is aggregated to campus safety measures without revealing who reported it.",
    followUps: ['Do I need proof to submit a report?', 'How to connect with a peer counselor'],
  },
  'Do I need proof to submit a report?': {
    answer:
      "No! Having screenshots or chat exports is very helpful, but you do NOT need hard proof to report what happened.\n\nIf you were harassed, threatened, or targeted, your account of the situation is enough for counselors to review and document the pattern. Never let the lack of a screenshot prevent you from speaking up or seeking support.",
    followUps: ['How do I safely save screenshot evidence?', 'Can I report 100% anonymously?'],
  },

  // WhatsApp & Social Media
  'Someone is harassing me on WhatsApp': {
    answer:
      "I hear how frustrating and invasive this feels. Here are immediate protective actions you can take right now:\n\n1. Do not reply or trade insults—harassers feed on reactions.\n2. Capture full, uncropped screenshots showing their phone number, message timestamps, and any group names.\n3. In WhatsApp Settings > Privacy > Groups, change 'Who can add me' to 'My contacts except...' to prevent being added to harassment groups.\n4. Block the sender and report them to WhatsApp by holding down the message and tapping 'Report'.\n5. Submit a confidential report here so our counselors are aware of repeated harassment on campus.",
    followUps: ['How to stop unwanted group adds', 'How do I safely save screenshot evidence?', 'I feel anxious and overwhelmed'],
  },
  'How to stop unwanted group adds': {
    answer:
      "To permanently prevent anyone from adding you to random WhatsApp groups:\n\n1. Open WhatsApp and tap Settings (or the three dots on Android).\n2. Tap Privacy > Groups.\n3. Change the setting from 'Everyone' to 'My contacts' or 'My contacts except...'.\n\nWhen people try to add you, they will be forced to send you a private group invite link that expires after 3 days, giving you 100% control over which groups you join.",
    followUps: ['Someone is harassing me on WhatsApp', 'Dealing with fake accounts & impersonation'],
  },
  'Dealing with fake accounts & impersonation': {
    answer:
      "Impersonation (someone making a fake Facebook, TikTok, or Instagram profile using your photo or name) is a serious cyber violation.\n\n1. Take screenshots of the fake account profile, username, and bio.\n2. Tap the '...' on their profile and choose 'Report' > 'Impersonation' (select 'They are pretending to be me').\n3. Ask 2 or 3 trusted friends to also report the profile to speed up takedown by Meta or TikTok.\n4. You can also file a report on SafeSpace under the 'Impersonation / Fake Profile' category.",
    followUps: ['How do I safely save screenshot evidence?', 'What if intimate photos or rumors are shared?'],
  },
  'What if intimate photos or rumors are shared?': {
    answer:
      "Please take a deep breath. Non-consensual image sharing or rumor spreading is illegal under Liberian Cybercrime and Penal Code regulations.\n\n• Do not delete the messages yet—take full screenshots of where they were posted with timestamps and sender info.\n• You can use TakeItDown.ncmec.org (a free global tool supported by Meta and tech platforms to stop intimate images from being circulated).\n• Reach out to campus counselors or the National GBV Helpline (2883) for immediate legal and psychosocial intervention.",
    followUps: ['Immediate AMEU campus security dispatch', 'National GBV & Cyber Harassment Helpline (2883)', 'How to connect with a peer counselor'],
  },

  // Screenshots & Evidence
  'How do I safely save screenshot evidence?': {
    answer:
      "To preserve evidence that counselors and authorities can verify:\n\n1. Capture Full Screen: Do not crop out the top status bar (time, battery, network) or bottom navigation—it proves authenticity.\n2. Include Identifiers: Ensure the sender's phone number (+231...) or exact username handle is visible, not just a nickname.\n3. Show Context: Screenshot the messages leading up to the harassment, including dates and times.\n4. Protect Your Peace: Save them into a private, locked folder (like Google Photos Locked Folder or Apple Hidden Album), then close the chat so you don't keep reliving it.",
    followUps: ['Do I need proof to submit a report?', 'Someone is harassing me on WhatsApp'],
  },

  // Emotional Wellbeing & Calming
  'I feel anxious and overwhelmed': {
    answer:
      "I hear how heavy this is, and I want to remind you: your nervous system is in protection mode, and that is a completely normal reaction to online cruelty.\n\nLet's take a slow pause right now:\n• Exhale all the air from your lungs.\n• Take a gentle breath in through your nose for 4 counts...\n• Hold softly for 2 counts...\n• Slowly release through your mouth for 6 counts.\n\nLook around your room and name three steady, quiet things you can see. You are here, you are safe in this moment, and we can take this one step at a time.",
    followUps: ['Guided calming breath exercise', 'How to connect with a peer counselor'],
  },
  'Guided calming breath exercise': {
    answer:
      "Here is the 5-4-3-2-1 Sensory Reset:\n\n• 5 things you can SEE around you (a desk, a window, your hand, a light, a shoe).\n• 4 things you can physically TOUCH (your phone screen, the fabric of your clothes, the floor under your feet).\n• 3 things you can HEAR (ambient campus noise, a fan, birds outside).\n• 2 things you can SMELL or like the scent of.\n• 1 positive truth about yourself: 'I am resilient, and I deserve peace.'\n\nWhenever you are ready, what would you like to explore next?",
    followUps: ['I feel anxious and overwhelmed', 'How to connect with a peer counselor'],
  },
  'How to connect with a peer counselor': {
    answer:
      "AMEU SafeSpace peer counselors are fellow university students and trained staff who provide confidential, non-judgmental guidance.\n\nYou can connect in two easy ways:\n1. Submit a report through the 'Report an Incident' tab and select 'Yes, I would like a peer counselor to reach out'.\n2. Visit the 'Get Support' page on this app to view counselor specialties, office locations on Camp Johnson Road, and drop-in counseling hours.",
    followUps: ['Can I report 100% anonymously?', 'What happens after I report?'],
  },

  // Immediate Hotlines & Security
  'Immediate AMEU campus security dispatch': {
    answer:
      "If you feel unsafe on or near campus, AMEU Campus Security Dispatch is on duty 24/7:\n\n📞 AMEU Campus Security Dispatch: +231 77 000 2638\n📍 Location: Main Campus Gate & Administration Building, Camp Johnson Road, Monrovia.\n\nYou can direct-dial from the Emergency Contacts button on the Support page.",
    followUps: ['Liberia National Police (LNP) emergency line', 'National GBV & Cyber Harassment Helpline (2883)'],
  },
  'Liberia National Police (LNP) emergency line': {
    answer:
      "For immediate legal protection or emergency response outside campus:\n\n📞 Liberia National Police (LNP) Dispatch: 911 or +231 77 080 0911\n📞 National Fire & Medical Emergency: 112\n\nOfficers can intervene in cases of active extortion, physical assault, or in-person stalking.",
    followUps: ['Immediate AMEU campus security dispatch', 'National GBV & Cyber Harassment Helpline (2883)'],
  },
  'National GBV & Cyber Harassment Helpline (2883)': {
    answer:
      "The Ministry of Gender, Children and Social Protection operates a national, toll-free 24/7 hotline for gender-based violence, cyber harassment, and online extortion:\n\n📞 Dial: 2883 (Toll-Free from all Liberian networks - Lonestar Cell MTN & Orange)\n\nCalls are completely confidential and counselors can provide rapid legal, medical, and psychosocial referrals.",
    followUps: ['Immediate AMEU campus security dispatch', 'How to connect with a peer counselor'],
  },
};

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'reporting', label: '🛡️ Reporting' },
  { id: 'whatsapp', label: '📱 WhatsApp & Social' },
  { id: 'evidence', label: '📸 Evidence' },
  { id: 'wellness', label: '💚 Wellbeing' },
  { id: 'hotlines', label: '🚨 Hotlines' },
];

const TOPIC_PRESETS = [
  { topic: 'Someone is harassing me on WhatsApp', category: 'whatsapp' },
  { topic: 'Can I report 100% anonymously?', category: 'reporting' },
  { topic: 'I feel anxious and overwhelmed', category: 'wellness' },
  { topic: 'How do I safely save screenshot evidence?', category: 'evidence' },
  { topic: 'Immediate AMEU campus security dispatch', category: 'hotlines' },
  { topic: 'Can professors or classmates see it?', category: 'reporting' },
  { topic: 'How to stop unwanted group adds', category: 'whatsapp' },
  { topic: 'Guided calming breath exercise', category: 'wellness' },
  { topic: 'What if intimate photos or rumors are shared?', category: 'whatsapp' },
  { topic: 'Do I need proof to submit a report?', category: 'evidence' },
  { topic: 'What happens after I report?', category: 'reporting' },
  { topic: 'How to connect with a peer counselor', category: 'wellness' },
  { topic: 'National GBV & Cyber Harassment Helpline (2883)', category: 'hotlines' },
  { topic: 'Dealing with fake accounts & impersonation', category: 'whatsapp' },
  { topic: 'Liberia National Police (LNP) emergency line', category: 'hotlines' },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'model',
  text: "Hello. I'm Odell, your confidential, trauma-informed peer support companion here at AMEU SafeSpace.\n\nWhatever you are carrying right now—whether you are facing harassment in a class WhatsApp group, dealing with rumors, or feeling overwhelmed—please know that your feelings are valid, and none of this is your fault.\n\nYou are in complete control here. Tap any of the preset guidance topics below to get instant confidential steps, or browse by category:",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  followUps: [
    'Someone is harassing me on WhatsApp',
    'Can I report 100% anonymously?',
    'I feel anxious and overwhelmed',
    'How do I safely save screenshot evidence?',
  ],
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages, isTyping]);

  const handleSelectTopic = (topic: string) => {
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: topic,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Realistic empathetic pause
    setTimeout(() => {
      const preset = PRESET_KNOWLEDGE_BASE[topic] || {
        answer:
          "I hear you, and please know that your safety and peace of mind matter. If you are experiencing online harassment, remember to capture full uncropped screenshots before blocking the sender. You can also file a confidential report through the 'Report an Incident' tab above.",
        followUps: [
          'Can I report 100% anonymously?',
          'How do I safely save screenshot evidence?',
          'Immediate AMEU campus security dispatch',
        ],
      };

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: preset.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: preset.followUps,
      };

      setMessages((prev) => [...prev, modelMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    setSelectedCategory('all');
  };

  const visiblePresets = TOPIC_PRESETS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-[#064E32] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-950/40 ring-2 ring-white/80 hover:ring-emerald-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Chat with Odell - 24/7 AMEU Digital Guide"
          aria-label="Open Live Chat with Odell"
        >
          {/* Animated pulsing beacon */}
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

      {/* Odell Guided Dialog Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] sm:max-h-[660px] flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="flex flex-col h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
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
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Conversation Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                        msg.role === 'user'
                          ? 'bg-emerald-800 text-white rounded-tr-xs font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs whitespace-pre-wrap font-normal'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.role === 'user' ? 'You' : 'Odell'} • {msg.timestamp}
                    </span>

                    {/* Contextual Follow-up Chips under Model Response */}
                    {msg.role === 'model' && msg.followUps && msg.followUps.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                        <span className="text-[10px] font-bold text-slate-400 w-full">
                          Suggested next steps:
                        </span>
                        {msg.followUps.map((fu) => (
                          <button
                            key={fu}
                            onClick={() => handleSelectTopic(fu)}
                            disabled={isTyping}
                            className="text-left px-2.5 py-1 rounded-xl bg-white border border-emerald-200/80 text-emerald-900 hover:bg-emerald-50 text-[11px] font-medium transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-xl border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.3s]"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Preset Topic Selection Drawer Area (Replaces broken text box) */}
              <div className="bg-white border-t border-slate-200 p-3 shrink-0 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                    Select a Question / Topic:
                  </span>
                  <span className="text-[10px] text-slate-400">Guaranteed Instant Guidance</span>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-800 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Question Preset Buttons Grid */}
                <div className="max-h-32 overflow-y-auto pr-1 space-y-1.5">
                  {visiblePresets.map((item) => (
                    <button
                      key={item.topic}
                      onClick={() => handleSelectTopic(item.topic)}
                      disabled={isTyping}
                      className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-slate-800 hover:text-emerald-950 text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
                    >
                      <span className="truncate pr-2">{item.topic}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Escalate Action Bar */}
              {onNavigate && (
                <div className="px-3.5 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-[11px] shrink-0">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
