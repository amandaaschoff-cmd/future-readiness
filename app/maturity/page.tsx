"use client";

import React, { useMemo, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * Self‑contained version (no external UI deps)
 * - Lightweight local components
 * - Docebo-style tokens
 * - UPDATED: 4 levels → Foundational, Developing, Advanced, Transformative
 */

// ---------------- THEME ----------------
const THEME = {
  brand: "#2B6DEF", // swap for Docebo token
  brandMuted: "#1E4CB6",
  accent: "#00C2A8",
  bg: "#F7F9FC",
  card: "#FFFFFF",
  ink: "#0F172A",
  muted: "#5B6472",
};

// ------------- LIGHT UI PRIMITIVES -------------
function clsx(...xs: any[]) { return xs.filter(Boolean).join(" "); }

function Card({ children, className, style }: any) {
  return (
    <div className={clsx("rounded-2xl border border-[#E5E7EB] shadow-sm", className)} style={{ background: THEME.card, ...style }}>
      {children}
    </div>
  );
}
function CardContent({ children, className }: any) {
  return <div className={clsx("p-4 sm:p-6", className)}>{children}</div>;
}
function Button({ children, variant = "solid", disabled, className, ...rest }: any) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none";
  const solid = { background: THEME.brand, color: "#fff", border: `1px solid ${THEME.brand}` } as const;
  const outline = { background: "transparent", color: THEME.brand, border: `1px solid ${THEME.brand}` } as const;
  const style = variant === "outline" ? outline : solid;
  const disabledStyle = disabled ? { opacity: 0.5, cursor: "not-allowed" } : {};
  return (
    <button {...rest} disabled={disabled} className={clsx(base, className)} style={{ ...style, ...disabledStyle }}>
      {children}
    </button>
  );
}
function Progress({ value = 0, className }: any) {
  return (
    <div className={clsx("w-full h-2 rounded-full bg-[#E5E7EB]", className)}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: THEME.brand }} className="h-2 rounded-full" />
    </div>
  );
}

// Tiny inline icons
const Icon = {
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#94A3B8" strokeWidth="2" />
      <path d="M12 8.5v.01M11 11h2v6h-2z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke={THEME.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" stroke={THEME.brand} strokeWidth="1.5" />
    </svg>
  ),
  External: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 3h7v7M21 3l-9 9" stroke="#64748B" strokeWidth="2" />
      <path d="M5 12v7h7" stroke="#64748B" strokeWidth="2" />
    </svg>
  ),
};

// ---------------- DATA ----------------
const DIMENSIONS = [
  "Learning strategy",
  "Leadership alignment",
  "SME collaboration",
  "Learner engagement",
  "Learning needs identification",
  "Training processes",
  "Learning metrics",
];

// UPDATED: 4 levels
const LEVELS = [
  { label: "Foundational", value: 1 },
  { label: "Developing", value: 2 },
  { label: "Advanced", value: 3 },
  { label: "Transformative", value: 4 },
];

const STAGE_RULES = [
  { min: 3.5, max: 4.01, name: "Transformative" },
  { min: 2.5, max: 3.5, name: "Advanced" },
  { min: 1.5, max: 2.5, name: "Developing" },
  { min: 1.0, max: 1.5, name: "Foundational" },
];

const levelHelp: Record<number, string> = {
  1: "Initial practices; ad‑hoc and inconsistent.",
  2: "Basic processes defined; ownership emerging.",
  3: "Consistent execution with measurable outcomes and cross‑team alignment.",
  4: "Continuous improvement, automation, and enterprise‑wide impact.",
};

// ---------------- UTILS ----------------
function stageFromScore(avg: number) {
  if (!avg || Number.isNaN(avg)) return "—";
  const rule = STAGE_RULES.find((r) => avg >= r.min && avg < r.max);
  return rule ? rule.name : "—";
}

// ---------------- COMPONENT ----------------
export default function MaturityAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({}); // key: dimension index, value: 1..4
  const [showGate, setShowGate] = useState(false);

  const { avg, filledCount, data } = useMemo(() => {
    const values = DIMENSIONS.map((_, i) => answers[i]).filter(Boolean) as number[];
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = values.length ? sum / values.length : 0;
    const data = DIMENSIONS.map((name, i) => ({ subject: name, A: answers[i] || 0, fullMark: 4 }));
    return { avg, filledCount: values.length, data };
  }, [answers]);

  const progress = Math.round((filledCount / DIMENSIONS.length) * 100);
  const stage = stageFromScore(avg);

  const reset = () => { setAnswers({}); setShowGate(false); };

  const canShowResultsCtas = filledCount >= 5; // encourage completion before CTAs
  const qualifiesForTrial = avg >= 3.5 && filledCount === DIMENSIONS.length; // Transformative threshold

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: "100vh", padding: "2.5rem" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Docebo Learning Experience Maturity Assessment</h1>
            <p style={{ color: "#64748B", marginTop: 6 }}>Select one level (1–4) for each dimension. Results update in real time.</p>
          </div>
          <Button variant="outline" onClick={reset} aria-label="Reset assessment">Reset</Button>
        </header>

        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "#334155", fontWeight: 500 }}>Completion</span>
            <span style={{ fontSize: 14, color: "#475569" }}>{filledCount}/{DIMENSIONS.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {DIMENSIONS.map((dim, i) => (
              <Card key={dim}>
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{dim}</h3>
                      <p style={{ fontSize: 13, color: "#64748B", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon.Info /> Choose the level that best describes your current state.
                      </p>
                    </div>
                    {answers[i] && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: "#64748B" }}>Selected</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {LEVELS.find((l) => l.value === answers[i])?.label} ({answers[i]}/4)
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8 }}>
                    {LEVELS.map((level) => {
                      const active = answers[i] === level.value;
                      return (
                        <button
                          key={level.value}
                          onClick={() => setAnswers((prev) => ({ ...prev, [i]: level.value }))}
                          style={{
                            border: `1px solid ${active ? THEME.brand : "#E5E7EB"}`,
                            borderRadius: 12,
                            padding: 12,
                            textAlign: "left",
                            background: "#fff",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                          }}
                          aria-pressed={active}
                          aria-label={`${dim} level ${level.label}`}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{level.label}</span>
                            {active && <Icon.Check />}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{levelHelp[level.value]}</div>
                          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 8 }}>{level.value} / 4</div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Results */}
          <div style={{ display: "grid", gap: 16 }}>
            <Card>
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Your self‑assessment results</h2>
                    <p style={{ color: "#64748B", fontSize: 14, marginTop: 6 }}>Updates as you select levels. Complete all {DIMENSIONS.length} for the full radar chart.</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#64748B" }}>Overall score</div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{avg ? avg.toFixed(2) : "—"}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>Stage: <span style={{ fontWeight: 600 }}>{stage}</span></div>
                  </div>
                </div>

                <div style={{ height: 288, width: "100%", marginTop: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 4]} tickCount={5} />
                      <Tooltip formatter={(value) => `${value}/4`} />
                      <Radar name="Score" dataKey="A" stroke={THEME.brand} fill={THEME.brand} fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                  {DIMENSIONS.map((dim, i) => (
                    <div key={dim} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 12, background: "#fff" }}>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{dim}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{answers[i] ? `${LEVELS.find((l) => l.value === answers[i])?.label} (${answers[i]}/4)` : "—"}</div>
                    </div>
                  ))}
                </div>

                {/* Contextual CTAs */}
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                  <Button onClick={() => setShowGate(true)} disabled={!canShowResultsCtas}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon.Download /> Get your tailored maturity playbook
                    </span>
                  </Button>

                  <Button variant="outline" disabled={!qualifiesForTrial}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon.Sparkles /> Request enterprise trial
                    </span>
                  </Button>
                </div>

                {!canShowResultsCtas && (
                  <p style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>
                    Answer at least <strong>5</strong> dimensions to unlock tailored recommendations.
                  </p>
                )}
                {canShowResultsCtas && !qualifiesForTrial && (
                  <p style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>
                    Reach <strong>Transformative (≥3.5)</strong> across all dimensions to qualify for a trial request.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Gate (lead form mock) */}
            {showGate && (
              <Card>
                <CardContent>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>We’ll send your tailored guide</h3>
                  <p style={{ fontSize: 14, color: "#64748B", marginTop: 6 }}>
                    Replace this mock with your HubSpot/Marketo embed. We’ll include next steps to <strong>book a demo</strong> and, if eligible, <strong>request a trial</strong>.
                  </p>

                  <form style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} onSubmit={(e) => e.preventDefault()}>
                    <input style={inputStyle()} placeholder="First name" aria-label="First name" />
                    <input style={inputStyle()} placeholder="Last name" aria-label="Last name" />
                    <input style={inputStyle({ gridColumn: "1 / -1" })} placeholder="Work email" aria-label="Work email" />
                    <input style={inputStyle({ gridColumn: "1 / -1" })} placeholder="Company" aria-label="Company" />
                    <textarea style={inputStyle({ gridColumn: "1 / -1" })} placeholder="Anything specific you want to improve?" aria-label="Notes" />
                    <Button type="submit" style={{ gridColumn: "1 / -1" }}>Send my tailored guide</Button>
                  </form>

                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748B" }}>
                    <Icon.External />
                    <span>Security & privacy: enterprise‑grade. Link to ISO/SOC pages can go here.</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ marginTop: 24, fontSize: 12, color: "#64748B" }}>
          Real‑time feedback with accessible controls. 4‑level scale (Foundational → Transformative). No external UI library. Chart via Recharts.
        </p>
      </div>
    </div>
  );
}

function inputStyle(extra: any = {}) {
  return {
    border: "1px solid #CBD5E1",
    borderRadius: 12,
    padding: "10px 12px",
    background: "#fff",
    ...extra,
  };
}
