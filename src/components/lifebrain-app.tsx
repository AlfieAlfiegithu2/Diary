"use client";

import {
  AudioLines,
  Brain,
  CalendarDays,
  Check,
  Circle,
  Flame,
  HeartPulse,
  Keyboard,
  Mic,
  Pause,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { followUpQuestions, memoryEdges, memoryNodes, reflectionQuestions, summaries } from "@/lib/demo-data";
import type { JournalMessage } from "@/types/lifebrain";

type Tab = "home" | "journal" | "timeline" | "brain" | "search" | "insights";
type JournalMode = "voice" | "text";

const navItems: Array<{ tab: Tab; label: string; icon: typeof Brain }> = [
  { tab: "home", label: "Today", icon: Circle },
  { tab: "journal", label: "Voice", icon: Mic },
  { tab: "timeline", label: "Timeline", icon: CalendarDays },
  { tab: "brain", label: "Brain", icon: Brain },
  { tab: "search", label: "Search", icon: Search },
];

function getRandomQuestion(except?: string) {
  const candidates = reflectionQuestions.filter((question) => question !== except);
  const pool = candidates.length > 0 ? candidates : reflectionQuestions;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function LifeBrainApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeQuestion, setActiveQuestion] = useState(reflectionQuestions[0]);
  const [journalMode, setJournalMode] = useState<JournalMode>("voice");
  const [messages, setMessages] = useState<JournalMessage[]>([
    {
      id: "m1",
      role: "ai",
      transcriptText: activeQuestion,
      createdAt: "now",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "saved">("idle");
  const [searchQuery, setSearchQuery] = useState("When was I happiest?");
  const [searchAnswer, setSearchAnswer] = useState(
    "Your strongest stored pattern is that visible progress makes you feel grounded and proud.",
  );
  const recorderRef = useRef<MediaRecorder | null>(null);

  const currentQuestion =
    activeTab === "home"
      ? activeQuestion
      : messages.filter((message) => message.role === "ai").at(-1)?.transcriptText ?? activeQuestion;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextQuestion = getRandomQuestion();
      setActiveQuestion(nextQuestion);
      setMessages((existing) => [
        {
          id: existing[0]?.id ?? "m1",
          role: "ai",
          transcriptText: nextQuestion,
          createdAt: "now",
        },
      ]);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function rotateQuestion() {
    const nextQuestion = getRandomQuestion(activeQuestion);
    setActiveQuestion(nextQuestion);
    setMessages((existing) => {
      const hasUserMessage = existing.some((message) => message.role === "user");
      if (hasUserMessage) {
        return existing;
      }

      return [
        {
          id: existing[0]?.id ?? "m1",
          role: "ai",
          transcriptText: nextQuestion,
          createdAt: "now",
        },
      ];
    });
  }

  function startJournal(mode: JournalMode) {
    setJournalMode(mode);
    setMessages((existing) => {
      const hasUserMessage = existing.some((message) => message.role === "user");
      if (hasUserMessage) {
        return existing;
      }

      return [
        {
          id: existing[0]?.id ?? "m1",
          role: "ai",
          transcriptText: activeQuestion,
          createdAt: "now",
        },
      ];
    });
    setActiveTab("journal");
  }

  async function toggleRecording() {
    if (recordingState === "recording") {
      recorderRef.current?.stop();
      setRecordingState("saved");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingState("saved");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.start();
    setRecordingState("recording");
  }

  function submitReflection() {
    const text = draft.trim() || "I felt happy when my student improved because it made the day feel meaningful.";
    const nextFollowUp = followUpQuestions[messages.filter((message) => message.role === "user").length % followUpQuestions.length];

    setMessages((existing) => [
      ...existing,
      {
        id: crypto.randomUUID(),
        role: "user",
        transcriptText: text,
        createdAt: "now",
      },
      {
        id: crypto.randomUUID(),
        role: "ai",
        transcriptText: nextFollowUp,
        createdAt: "now",
      },
    ]);
    setDraft("");
    setRecordingState("idle");
  }

  async function askMemory() {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery }),
    });
    const data = await response.json();
    setSearchAnswer(data.answer);
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-32 pt-4 text-[var(--foreground)] sm:px-6 lg:px-8">
      <HeroBackground />
      {activeTab === "home" && (
        <section className="relative z-10 flex min-h-[calc(100vh-9rem)] items-center justify-center pt-8">
          <div className="hero-shell w-full max-w-[26rem] rounded-[38px] px-7 py-10 text-center sm:px-9 sm:py-12">
            <div className="flex justify-end">
              <button
                onClick={rotateQuestion}
                className="hero-rotate grid size-10 place-items-center rounded-full"
                aria-label="New question"
                title="New question"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <h2 className="sentimental-title mx-auto mt-16 max-w-[18.5rem] text-[2.02rem] font-semibold leading-[1.1]">
              {currentQuestion}
            </h2>
            <div className="mx-auto mt-12 grid max-w-[17rem] grid-cols-2 gap-3">
              <button
                onClick={() => startJournal("voice")}
                className="hero-button inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-5 text-[0.82rem] font-bold"
                aria-label="Voice diary"
                title="Voice diary"
              >
                <AudioLines size={18} />
                Voice
              </button>
              <button
                onClick={() => startJournal("text")}
                className="hero-pill inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-5 text-[0.82rem] font-bold text-[var(--foreground)]"
                aria-label="Text diary"
                title="Text diary"
              >
                <Keyboard size={18} />
                Text
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-10 mt-5">
        {activeTab === "journal" && (
          <JournalPanel
            draft={draft}
            mode={journalMode}
            messages={messages}
            recordingState={recordingState}
            onDraftChange={setDraft}
            onSubmit={submitReflection}
            onToggleRecording={toggleRecording}
          />
        )}
        {activeTab === "timeline" && <TimelinePanel />}
        {activeTab === "brain" && <BrainPanel />}
        {activeTab === "search" && (
          <SearchPanel
            answer={searchAnswer}
            query={searchQuery}
            onAsk={askMemory}
            onQueryChange={setSearchQuery}
          />
        )}
      </section>

      <nav className="fixed inset-x-0 bottom-3 z-20 px-3">
        <div className="glass-dock mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-[28px] p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`grid h-14 place-items-center rounded-[20px] text-xs font-medium transition ${
                  isActive ? "bg-white/55 text-[var(--accent-strong)] shadow-sm" : "text-[var(--muted)]"
                }`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function HeroBackground() {
  return (
    <div className="hero-background" aria-hidden="true">
      <div className="hero-weather-photo" />
      <div className="hero-light hero-light-a" />
      <div className="hero-light hero-light-b" />
      <div className="hero-grid" />
      <div className="hero-cloud hero-cloud-a" />
      <div className="hero-cloud hero-cloud-b" />
      <div className="hero-moon" />
      <div className="hero-horizon" />
    </div>
  );
}

function InsightStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
      <Metric icon={Flame} label="Streak" value="4" tone="text-[var(--amber)]" />
      <Metric icon={HeartPulse} label="Emotional pattern" value="Grounded pride" tone="text-[var(--rose)]" />
      <Metric icon={Sparkles} label="New memories" value="7" tone="text-[var(--accent-strong)]" />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Brain;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="glass-panel flex items-center justify-between rounded-[28px] p-4">
      <div>
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">{value}</p>
      </div>
      <Icon className={tone} size={24} />
    </div>
  );
}

function PatternRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="text-right font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function JournalPanel({
  draft,
  mode,
  messages,
  recordingState,
  onDraftChange,
  onSubmit,
  onToggleRecording,
}: {
  draft: string;
  mode: JournalMode;
  messages: JournalMessage[];
  recordingState: "idle" | "recording" | "saved";
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  onToggleRecording: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
      <section className="glass-panel rounded-[32px] p-4 sm:p-5">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[88%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm ${
                message.role === "ai"
                  ? "glass-pill text-[var(--foreground)]"
                  : "ml-auto bg-[var(--accent-strong)] text-[var(--cream)] backdrop-blur-xl"
              }`}
            >
              {message.transcriptText}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={mode === "voice" ? "Transcript preview" : "Write what is on your mind"}
            className="glass-input min-h-28 resize-none rounded-[24px] p-4 text-sm leading-6 outline-none focus:border-[var(--accent)]"
          />
          <div className="flex flex-wrap items-center gap-3">
            {mode === "voice" && (
              <button
                onClick={onToggleRecording}
                className={`inline-flex h-12 items-center gap-2 rounded-full px-5 font-medium shadow-sm ${
                  recordingState === "recording"
                    ? "bg-[var(--rose)] text-[var(--cream)]"
                    : "glass-button"
                }`}
              >
                {recordingState === "recording" ? <Pause size={18} /> : <Mic size={18} />}
                {recordingState === "recording" ? "Recording" : "Record"}
              </button>
            )}
            <button
              onClick={onSubmit}
              className="glass-button-dark inline-flex h-12 items-center gap-2 rounded-full px-5 font-medium"
            >
              <Send size={18} />
              Send
            </button>
            <button className="glass-pill inline-flex h-12 items-center gap-2 rounded-full px-5 font-medium text-[var(--muted)]">
              <Square size={16} />
              End
            </button>
          </div>
        </div>
      </section>

      <aside className="glass-panel rounded-[30px] p-5">
        <h2 className="font-semibold text-[var(--foreground)]">Session capture</h2>
        <div className="mt-4 space-y-4 text-sm">
          <CaptureRow complete label={mode === "voice" ? "Audio" : "Writing"} />
          <CaptureRow complete={mode === "text" || recordingState === "saved"} label={mode === "voice" ? "Transcript" : "Draft"} />
          <CaptureRow complete={messages.length > 2} label="Follow-up" />
          <CaptureRow complete={messages.length > 2} label="Memory extraction" />
        </div>
      </aside>
    </div>
  );
}

function CaptureRow({ complete, label }: { complete: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--muted)]">{label}</span>
      <span
        className={`grid size-7 place-items-center rounded-full ${
          complete ? "bg-[var(--accent-strong)] text-[var(--cream)]" : "glass-pill"
        }`}
      >
        {complete && <Check size={15} />}
      </span>
    </div>
  );
}

function TimelinePanel() {
  return (
    <div className="grid gap-4">
      <InsightStrip />
      <div className="glass-panel rounded-[30px] p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">This week</h2>
        <div className="mt-4 grid gap-4">
          <PatternRow label="Repeated joy" value="Seeing people grow" />
          <PatternRow label="Repeated worry" value="Losing momentum" />
          <PatternRow label="Value signal" value="Patience over speed" />
        </div>
      </div>
      {summaries.map((summary) => (
        <article key={summary.id} className="glass-panel rounded-[30px] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--muted)]">{summary.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{summary.shortSummary}</h2>
            </div>
            <span className="glass-pill rounded-full px-3 py-1 text-xs text-[var(--muted)]">
              {summary.emotionalSummary}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...summary.keyPeople, ...summary.keyValues].map((item) => (
              <span key={item} className="glass-pill rounded-full px-3 py-1 text-sm text-[var(--muted)]">
                {item}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function BrainPanel() {
  const nodeById = new Map(memoryNodes.map((node) => [node.id, node]));

  return (
    <div className="grid gap-4">
      <div className="glass-panel rounded-[32px] p-4">
        <div className="glass-card relative h-[28rem] overflow-hidden rounded-[28px]">
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {memoryEdges.map((edge) => {
              const source = nodeById.get(edge.sourceNodeId);
              const target = nodeById.get(edge.targetNodeId);
              if (!source || !target) return null;
              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  x2={target.x}
                  y1={source.y}
                  y2={target.y}
                  stroke="rgba(232,255,251,0.82)"
                  strokeOpacity={0.68}
                  strokeWidth={0.35 + edge.strength * 0.8}
                />
              );
            })}
          </svg>
          {memoryNodes.map((node) => (
            <button
              key={node.id}
              className="glass-panel absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-[24px] p-3 text-left"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              title={node.description}
            >
              <span className="block text-xs uppercase text-[var(--muted)]">{node.type}</span>
              <span className="mt-1 block text-sm font-semibold leading-5 text-[var(--foreground)]">{node.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent memory cards</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {memoryNodes.slice(0, 3).map((node) => (
            <article key={node.id} className="glass-card rounded-[26px] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="glass-pill rounded-full px-3 py-1 text-xs uppercase text-[var(--muted)]">
                  {node.type}
                </span>
                <span className="font-mono text-xs text-[var(--muted)]">{Math.round(node.confidenceScore * 100)}%</span>
              </div>
              <h3 className="mt-3 font-semibold text-[var(--foreground)]">{node.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{node.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchPanel({
  answer,
  query,
  onAsk,
  onQueryChange,
}: {
  answer: string;
  query: string;
  onAsk: () => void;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="glass-panel rounded-[30px] p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Memory search</h2>
        <div className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="glass-input h-12 min-w-0 flex-1 rounded-full px-4 outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={onAsk}
            className="glass-button grid size-12 shrink-0 place-items-center rounded-full"
            aria-label="Ask memory"
            title="Ask memory"
          >
            <Search size={18} />
          </button>
        </div>
      </section>
      <section className="glass-panel rounded-[30px] p-5">
        <p className="font-mono text-xs uppercase text-[var(--muted)]">Answer</p>
        <p className="mt-3 text-xl leading-8 text-[var(--foreground)]">{answer}</p>
        <div className="mt-5 grid gap-2 text-sm text-[var(--muted)]">
          <p>References: Today, Yesterday, memory nodes with linked transcript snippets.</p>
          <p>Confidence: medium</p>
        </div>
      </section>
    </div>
  );
}
