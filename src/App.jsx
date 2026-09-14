import { useEffect, useRef, useState } from "react";
import Login from "./login.jsx";

import { motion } from "framer-motion";

import {
  Plus,
  MessageSquare,
  History,
  Brain,
  CheckSquare,
  Folder,
  Grid2X2,
  CalendarDays,
  Cloud,
  Search,
  Calculator,
  Mic,
  Send,
  Bell,
  ChevronRight,
  Clock3,
  Menu,
  X,
  Settings,
  LogOut,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activityVersion, setActivityVersion] = useState(0);
  const [activeView, setActiveView] = useState("chat");
  const [chatStarted, setChatStarted] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [jarvisLine, setJarvisLine] = useState("");
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! I'm TERRIFIC. How can I help you today?",
    },
  ]);

  // Show the login page until a username has been saved.
  if (!username) {
    return <Login />;
  }

  const sendMessage = async (prompt = message) => {
    const textToSend = typeof prompt === "string" ? prompt : message;
    const trimmedMessage = textToSend.trim();

    if (!trimmedMessage || isThinking) return;

    setChatStarted(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      setMessages((old) => [
        ...old,
        {
          type: "ai",
          text: "Please sign in with Google before sending a message.",
        },
      ]);
      return;
    }

    setMessages((old) => [
      ...old,
      {
        type: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setIsThinking(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: trimmedMessage }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("username");
          setUsername("");
        }
        throw new Error(data.message || "AI request failed");
      }

      const replyText = data.reply;
      setMessages((old) => [
        ...old,
        {
          type: "ai",
          text: replyText,
        },
      ]);
      speakText(replyText);
      setActivityVersion((version) => version + 1);
    } catch (error) {
      setMessages((old) => [
        ...old,
        {
          type: "ai",
          text: error.message || "I could not reach my AI service.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    const phrases = [
      "How can I help you today?",
      "Voice interface online.",
      "Awaiting your command.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        setJarvisLine(current.slice(0, charIndex));

        if (charIndex >= current.length) {
          deleting = true;
          setTimeout(typeLoop, 1200);
          return;
        }
      } else {
        charIndex -= 1;
        setJarvisLine(current.slice(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      const speed = deleting ? 35 : 70;
      setTimeout(typeLoop, speed);
    };

    const timer = setTimeout(typeLoop, 600);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const welcome = new SpeechSynthesisUtterance("How can I help you today?");
      welcome.lang = "en-US";
      welcome.rate = 1;
      welcome.pitch = 1.1;
      welcome.volume = 1;
      setTimeout(() => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(welcome);
      }, 900);
    }

    return () => clearTimeout(timer);
  }, []);

  const speakText = (text) => {
    if (!text || typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    synth.speak(utterance);
  };

  const focusComposer = (prompt = "") => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  const startVoiceInput = () => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      speakText("Listening. Please speak your question.");
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      focusComposer();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      focusComposer(transcript);
    };
    recognition.onerror = () => {
      speakText("I could not hear you clearly. Please type your message.");
    };
    recognition.start();
  };

  const resetChat = () => {
    setMessages([
      { type: "ai", text: "Hello! I'm TERRIFIC. How can I help you today?" },
    ]);
    setChatStarted(false);
    setActiveView("chat");
    setMessage("");
    focusComposer();
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setUsername("");
    setAccountMenuOpen(false);
  };

  return (
    <div className="TERRIFIC-bg grid-bg min-h-screen text-white">

      {/* MOBILE SIDEBAR BACKDROP */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <Sidebar
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
        onNewChat={resetChat}
        onAction={focusComposer}
        onOpenChat={() => setActiveView("chat")}
        onLogout={logout}
      />

      {/* MAIN APPLICATION */}

      <main className="relative z-10 min-h-screen overflow-visible lg:ml-[275px]">

        {/* TOP BAR */}

        <header className="relative z-50 flex h-[64px] items-center justify-between border-b border-blue-500/10 bg-[#020914]/70 px-5 backdrop-blur-xl lg:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-blue-500/10 hover:text-cyan-300 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />

              <span className="text-xs text-slate-300">
                Online
              </span>

            </div>

          </div>

          <div className="relative flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1.5 transition hover:border-cyan-400/40 hover:bg-blue-500/20"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/80 text-sm font-semibold">
                  {username.charAt(0).toUpperCase()}
                </div>

                <span className="hidden text-sm text-slate-200 sm:block">
                  {username}
                </span>

                <ChevronRight
                  size={14}
                  className={`text-slate-400 transition ${accountMenuOpen ? "rotate-90" : "rotate-0"}`}
                />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-[60] mt-2 w-40 overflow-hidden rounded-xl border border-blue-500/20 bg-[#041523] shadow-[0_20px_50px_rgba(11,50,94,0.55)]">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

        </header>

        {/* CONTENT */}

        <div className="flex min-h-[calc(100vh-64px)]">

          {/* CENTER */}

          {activeView === "activity" ? (
            <ActivityPage onBack={() => setActiveView("chat")} />
          ) : (
          <section className="flex min-w-0 flex-1 flex-col">
            {!chatStarted ? (
              <>
                {/* GREETING */}

                <div className="pt-8 text-center sm:pt-10">

                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto mb-5 flex max-w-[760px] items-center justify-center gap-3 rounded-full border border-cyan-400/20 bg-[#061827]/80 px-4 py-2 shadow-[0_0_35px_rgba(34,211,238,0.12)]"
                  >
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400/60" />
                      <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-cyan-300">
                      AI voice online
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold text-sky-200 sm:text-[28px]"
                  >
                    Good Evening, {username}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 mx-auto max-w-[720px] rounded-2xl border border-cyan-400/20 bg-slate-900/40 px-4 py-3 shadow-[0_0_30px_rgba(59,130,246,0.12)]"
                  >
                    <div className="mb-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cyan-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      TERRIFIC // voice interface
                    </div>

                    <div className="flex items-center justify-center gap-1">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <motion.span
                          key={bar}
                          animate={{
                            height: [4, 18, 10, 20, 8],
                            opacity: [0.4, 1, 0.7, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: bar * 0.1,
                          }}
                          className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-blue-500"
                          style={{ height: 8 }}
                        />
                      ))}
                    </div>

                    <p className="mt-4 min-h-[26px] text-base text-slate-200 sm:text-lg">
                      <span className="font-medium text-cyan-300">{jarvisLine}</span>
                      <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-cyan-300 align-middle" />
                    </p>
                  </motion.div>

                </div>

                {/* AI CORE */}

                <div className="flex justify-center py-5 sm:py-7">

                  <TerrificCore />

                </div>

                {/* QUICK ACTIONS */}

                <div className="mx-auto grid w-full max-w-[690px] grid-cols-2 gap-3 px-4 md:grid-cols-4">

                  <QuickAction
                    icon={<Cloud size={20} />}
                    title="Explain a concept"
                    subtitle="Ask me anything"
                    onClick={() => sendMessage("Explain a concept clearly with an example")}
                  />

                  <QuickAction
                    icon={<span className="text-lg">{"</>"}</span>}
                    title="Help with coding"
                    subtitle="Get code examples"
                    onClick={() => sendMessage("Help me with a coding problem. Ask for the language and requirements if needed.")}
                  />

                  <QuickAction
                    icon={<CalendarDays size={19} />}
                    title="Plan my day"
                    subtitle="Manage your tasks"
                    onClick={() => sendMessage("Plan my day and turn my priorities into a practical task list")}
                  />

                  <QuickAction
                    icon={<Search size={19} />}
                    title="Search the web"
                    subtitle="Find latest information"
                    onClick={() => setMessage("Search the web: ")}
                  />

                </div>
              </>
            ) : (
              <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-4 py-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400">
                      AI Conversation
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-sky-100">TERRIFIC Chat</h2>
                  </div>

                  <button
                    type="button"
                    onClick={resetChat}
                    className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
                  >
                    New chat
                  </button>
                </div>
              </div>
            )}

            {/* CHAT */}

            <div className={`mx-auto mt-5 flex w-full ${chatStarted ? "max-w-[900px]" : "max-w-[690px]"} flex-1 flex-col px-4 ${chatStarted ? "pb-6" : ""}`}>

              <div className="flex-1 space-y-3 overflow-y-auto pb-4">

                {messages.map((item, index) => (

                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex ${
                      item.type === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        item.type === "user"
                          ? "bg-blue-600/70 text-white"
                          : "glass text-slate-300"
                      }`}
                    >
                      {item.type === "ai" ? (
                        <FormattedAnswer text={item.text} />
                      ) : (
                        item.text
                      )}
                    </div>

                  </motion.div>

                ))}

                {isThinking && (
                  <div className="text-xs text-cyan-300">
                    TERRIFIC is thinking...
                  </div>
                )}

              </div>

              {/* INPUT */}

              <div className="pb-4">

                <div className="flex items-center rounded-[28px] border border-cyan-400/50 bg-[#04172a]/90 p-1.5 shadow-[0_0_30px_rgba(0,132,255,0.08)]">

                  <button
                    type="button"
                    title="Use voice input"
                    onClick={startVoiceInput}
                    className="ml-2 rounded-full p-2 text-slate-400 transition hover:text-cyan-300"
                  >
                    <Mic size={20} />
                  </button>

                  <input
                    ref={inputRef}
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage(message);
                      }
                    }}
                    placeholder="Type a message..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    title="Send message"
                    onClick={() => sendMessage(message)}
                    disabled={isThinking || !message.trim()}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_0_20px_rgba(0,140,255,0.6)] transition hover:scale-105 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={19} />
                  </button>

                </div>

                <div className="mt-3 flex justify-center gap-3 text-[10px] text-slate-500">

                  <Mic size={12} />

                  <span>Voice mode</span>

                  <span className="text-blue-500">|</span>

                  <span>TERRIFIC v1.0</span>

                </div>

              </div>

            </div>

          </section>
          )}

          {/* RIGHT PANEL */}

          {activeView === "chat" && (
            <RightPanel
              activityVersion={activityVersion}
              onOpenActivity={() => setActiveView("activity")}
            />
          )}

        </div>

      </main>

    </div>
  );
}

/* ==================================================
   SIDEBAR
================================================== */

function Sidebar({ open, close, onNewChat, onAction, onOpenChat, onLogout }) {

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[275px] flex-col border-r border-blue-500/15 bg-[#03101f]/95 px-4 py-5 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
        open
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
    >

      {/* LOGO */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="relative flex h-12 w-12 items-center justify-center">

            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl" />

            <div className="relative h-9 w-9 rounded-full border-2 border-cyan-300 shadow-[0_0_20px_#008cff]">

              <div className="absolute inset-1 rounded-full border border-blue-400" />

            </div>

          </div>

          <div>

            <h1 className="text-[23px] font-semibold tracking-wide text-sky-300">
              TERRIFIC
            </h1>

            <p className="text-xs text-slate-400">
              Your AI Assistant
            </p>

          </div>

        </div>

        <button
          onClick={close}
          className="text-slate-500 lg:hidden"
        >
          <X size={20} />
        </button>

      </div>

      {/* NEW CHAT */}

      <button
        type="button"
        onClick={onNewChat}
        className="mt-7 flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-medium shadow-[0_0_20px_rgba(0,119,255,0.25)] transition hover:scale-[1.01]"
      >

        <Plus size={21} />

        New Chat

      </button>

      {/* NAVIGATION */}

      <nav className="mt-3 space-y-1">

        <NavItem
          icon={<MessageSquare size={19} />}
          text="Chat"
          active
          onClick={onOpenChat}
        />

        <NavItem
          icon={<History size={19} />}
          text="Conversations"
          onClick={() => onAction("Summarize my recent conversations")}
        />

        <NavItem
          icon={<Brain size={19} />}
          text="Memory"
          onClick={() => onAction("What should I remember about my current work?")}
        />

        <NavItem
          icon={<CheckSquare size={19} />}
          text="Tasks"
          onClick={() => onAction("Help me create and prioritize my task list")}
        />

        <NavItem
          icon={<Folder size={19} />}
          text="Files"
          onClick={() => onAction("Help me organize my files")}
        />

        <NavItem
          icon={<Grid2X2 size={19} />}
          text="Tools"
          onClick={() => onAction("What tools can you help me use?")}
        />

      </nav>

      {/* DIVIDER */}

      <div className="my-4 h-px bg-blue-500/20" />

      {/* QUICK */}

      <p className="mb-2 px-3 text-xs font-medium text-sky-300">
        Quick Actions
      </p>

      <div className="space-y-1">

        <SmallNav
          icon={<CalendarDays size={18} />}
          text="Open Calendar"
          onClick={() => onAction("Help me plan my calendar")}
        />

        <SmallNav
          icon={<Cloud size={18} />}
          text="Check Weather"
          onClick={() => onAction("Search the web: What is the weather today?")}
        />

        <SmallNav
          icon={<Search size={18} />}
          text="Search Web"
          onClick={() => onAction("Search the web: ")}
        />

        <SmallNav
          icon={<Calculator size={18} />}
          text="Calculator"
          onClick={() => onAction("Calculate: ")}
        />

      </div>

      <MemoryUsage />

      {/* VERSION */}

      <div className="mt-auto border-t border-blue-500/10 pt-4">

        <p className="px-3 text-xs text-blue-400">
          TERRIFIC v1.0
        </p>

        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} />
          Log out
        </button>

      </div>

    </aside>
  );
}

function MemoryUsage() {
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    const readMemory = () => {
      const memoryInfo =
        typeof window !== "undefined" &&
        window.performance &&
        "memory" in window.performance
          ? window.performance.memory
          : null;

      if (
        !memoryInfo ||
        !Number.isFinite(memoryInfo.usedJSHeapSize) ||
        !Number.isFinite(memoryInfo.jsHeapSizeLimit) ||
        memoryInfo.jsHeapSizeLimit <= 0
      ) {
        setMemory(null);
        return;
      }

      setMemory({
        used: memoryInfo.usedJSHeapSize,
        limit: memoryInfo.jsHeapSizeLimit,
      });
    };

    readMemory();
    const interval = window.setInterval(readMemory, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const usedMegabytes = memory ? memory.used / 1024 / 1024 : 0;
  const limitMegabytes = memory ? memory.limit / 1024 / 1024 : 0;
  const percentage = memory
    ? Math.min(100, Math.max(0, Math.round((memory.used / memory.limit) * 100)))
    : 0;

  return (
    <div className="mt-5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-sky-300">
          Website Memory
        </p>
        {memory && (
          <span className="text-[10px] text-slate-500">{percentage}%</span>
        )}
      </div>

      {memory ? (
        <>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            {usedMegabytes.toFixed(1)} MB used of {limitMegabytes.toFixed(0)} MB
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">
            JS heap usage
          </p>
        </>
      ) : (
        <p className="mt-2 text-[10px] text-slate-500">
          This browser does not expose JS heap memory data.
        </p>
      )}
    </div>
  );
}

/* ==================================================
   NAV ITEM
================================================== */

function NavItem({ icon, text, active, onClick }) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-blue-600/50 text-white shadow-[inset_0_0_20px_rgba(0,140,255,0.15)]"
          : "text-slate-300 hover:bg-blue-500/10 hover:text-sky-300"
      }`}
    >

      {icon}

      {text}

    </button>
  );
}

/* ==================================================
   SMALL NAV
================================================== */

function SmallNav({ icon, text, onClick }) {

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg px-3 py-2 text-xs text-slate-400 transition hover:bg-blue-500/10 hover:text-cyan-300"
    >

      {icon}

      {text}

    </button>
  );
}

/* ==================================================
   QUICK ACTION
================================================== */

function QuickAction({
  icon,
  title,
  subtitle,
  onClick,
}) {

  return (
    <motion.button
      whileHover={{
        y: -3,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="glass rounded-xl p-3 text-left transition"
    >

      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-cyan-300">

        {icon}

      </div>

      <p className="text-xs font-medium text-slate-200">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-slate-500">
        {subtitle}
      </p>

    </motion.button>
  );
}

/* ==================================================
   TERRIFIC CORE
================================================== */

function TerrificCore() {

  return (
    <div className="relative flex h-[245px] w-[245px] items-center justify-center sm:h-[280px] sm:w-[280px]">

      {/* LARGE ROTATING RING */}

      <motion.div
        className="absolute h-[235px] w-[235px] rounded-full border border-blue-500/10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >

        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_#00c8ff]" />

        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_15px_#008cff]" />

      </motion.div>

      {/* SECOND RING */}

      <motion.div
        className="absolute h-[205px] w-[205px] rounded-full border border-cyan-400/20"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* THIRD RING */}

      <motion.div
        className="absolute h-[180px] w-[180px] rounded-full border-[2px] border-blue-400/40"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* MAIN CORE */}

      <motion.div
        animate={{
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex h-[145px] w-[145px] items-center justify-center rounded-full border-2 border-cyan-300 bg-[#031b35] core-glow"
      >

        {/* INNER RING */}

        <div className="core-inner flex h-[115px] w-[115px] items-center justify-center rounded-full border border-cyan-400/70">

          <span className="text-xl font-medium tracking-wide text-sky-100">
            TERRIFIC
          </span>

        </div>

      </motion.div>

      {/* SIDE LIGHTS */}

      <motion.div
        animate={{
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="absolute left-[18px] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_#00bfff]"
      />

      <motion.div
        animate={{
          opacity: [1, 0.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="absolute right-[18px] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_#00bfff]"
      />

    </div>
  );
}

/* ==================================================
   RIGHT PANEL
================================================== */

function RightPanel({ activityVersion, onOpenActivity }) {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setActivities(data.activities);
      })
      .catch(() => setActivities([]));
  }, [activityVersion]);

  return (
    <aside className="relative z-0 hidden w-[265px] shrink-0 border-l border-blue-500/10 p-4 xl:block">

      <StatusCard
        icon={<Clock3 size={20} />}
        title="Recent Activity"
        onClick={onOpenActivity}
      >

        {activities.length > 0 ? (
          <div className="max-h-52 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
            {activities.map((activity) => (
              <ActivityItem
                key={activity._id}
                question={activity.question || activity.text}
                answer={activity.answer}
                time={formatActivityTime(activity.createdAt)}
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-[11px] text-slate-500">
            No recent activity.
          </p>
        )}

      </StatusCard>

    </aside>
  );
}

function formatActivityTime(createdAt) {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(elapsed / 60000));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  return `${Math.floor(hours / 24)} days ago`;
}

function ActivityPage({ onBack }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setActivities(data.activities);
      })
      .catch(() => setActivities([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="min-w-0 flex-1 overflow-y-auto px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          <ArrowLeft size={17} />
          Exit history
        </button>

        {selectedActivity ? (
          <ActivityDetail
            activity={selectedActivity}
            onBack={() => setSelectedActivity(null)}
          />
        ) : (
        <>
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
            Your history
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-sky-100">
            Recent Activity
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            The prompts you have sent to TERRIFIC.
          </p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading your history...</p>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <button
                type="button"
                key={activity._id}
                onClick={() => setSelectedActivity(activity)}
                className="glass rounded-xl border border-blue-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-cyan-300">
                    <Sparkles size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-cyan-400">Question</p>
                    <p className="mt-1 min-w-0 break-words [overflow-wrap:anywhere] text-sm text-slate-200">
                      {activity.question || activity.text}
                    </p>
                    {activity.answer && (
                      <>
                        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-blue-400">Answer</p>
                        <div className="mt-1 text-left text-sm text-slate-300">
                          <FormattedAnswer text={activity.answer} />
                        </div>
                      </>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      {formatActivityTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500">No chat history yet.</p>
          )}
        </div>
        </>
        )}
      </div>
    </section>
  );
}

function ActivityDetail({ activity, onBack }) {
  return (
    <div className="glass rounded-xl border border-blue-500/10 p-5 sm:p-7">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
      >
        <ArrowLeft size={17} />
        Back to history
      </button>

      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-cyan-400">
        Question
      </p>
      <p className="mt-2 break-words [overflow-wrap:anywhere] text-lg text-slate-100">
        {activity.question || activity.text}
      </p>

      <div className="my-6 h-px bg-blue-500/10" />

      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-blue-400">
        AI Answer
      </p>
      <div className="mt-2 text-sm leading-6 text-slate-300">
        {activity.answer ? (
          <FormattedAnswer text={activity.answer} />
        ) : (
          <p>No saved answer for this older chat.</p>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        {formatActivityTime(activity.createdAt)}
      </p>
    </div>
  );
}

function FormattedAnswer({ text }) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let list = null;
  let paragraph = [];

  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paragraph.join(" "),
        key: blocks.length,
      });
      paragraph = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)/);
    const numberMatch = trimmedLine.match(/^\d+[.)]\s+(.+)/);

    if (bulletMatch || numberMatch) {
      flushParagraph();
      const type = bulletMatch ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(bulletMatch?.[1] || numberMatch[1]);
    } else if (trimmedLine) {
      flushList();
      paragraph.push(trimmedLine);
    } else {
      flushList();
      flushParagraph();
    }
  });

  flushList();
  flushParagraph();

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <p key={`paragraph-${block.key}`}>{block.text}</p>;
        }

        const ListTag = block.type;
        return (
          <ListTag
            key={`list-${index}`}
            className={`list-inside space-y-1 ${
              block.type === "ul" ? "list-disc" : "list-decimal"
            }`}
          >
            {block.items.map((item, itemIndex) => (
              <li key={`${index}-${itemIndex}`}>{item}</li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}

/* ==================================================
   STATUS CARD
================================================== */

function StatusCard({
  icon,
  title,
  children,
  onClick,
}) {

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      className={`glass mb-3 rounded-xl p-4 ${
        onClick ? "cursor-pointer transition hover:border-cyan-400/30" : ""
      }`}
    >

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-cyan-300">

          {icon}

        </div>

        <p className="text-xs font-medium text-slate-200">
          {title}
        </p>

        <ChevronRight
          size={15}
          className="ml-auto text-slate-600"
        />

      </div>

      <div className="mt-2">
        {children}
      </div>

    </motion.div>
  );
}

/* ==================================================
   TOOL
================================================== */

function Tool({ name }) {

  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-400">

      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_7px_#34d399]" />

      {name}

    </div>
  );
}

/* ==================================================
   ACTIVITY
================================================== */

function ActivityItem({
  question,
  answer,
  time,
}) {

  return (
    <div className="mt-3">

      <div className="flex items-center gap-2 text-[11px] text-slate-300">

        <Sparkles
          size={12}
          className="text-cyan-400"
        />

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-cyan-400">Question</p>
          <p className="mt-1 break-words [overflow-wrap:anywhere]">{question}</p>
          {answer && (
            <>
              <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.12em] text-blue-400">Answer</p>
              <div className="mt-1 break-words [overflow-wrap:anywhere] text-slate-400">
                <FormattedAnswer text={answer} />
              </div>
            </>
          )}
        </div>

      </div>

      <p className="ml-5 mt-1 text-[9px] text-slate-600">
        {time}
      </p>

    </div>
  );
}

export default App;
