"use client";
import { useMemo, useState } from "react";

type Q = { id: string; label: string };

const QUESTIONS: Q[] = [
  { id: "strategy", label: "Strategy & Alignment" },
  { id: "operations", label: "Operations & Governance" },
  { id: "experience", label: "Learning Experience" },
  { id: "analytics", label: "Analytics & Impact" },
];

export default function Assessment() {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(QUESTIONS.map(q => [q.id, 2]))
  );

  const total = useMemo(() => {
    const vals = Object.values(scores);
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round((sum / (vals.length * 4)) * 100);
  }, [scores]);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr,380px]">
      <div className="space-y-4">
        {QUESTIONS.map(q => (
          <div key={q.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{q.label}</h3>
                <p className="text-sm text-slate-500">Rate 0–4</p>
              </div>
              <div className="flex items-center gap-2">
                {[0,1,2,3,4].map(n => (
                  <button
                    key={n}
                    onClick={() => setScores(s => ({ ...s, [q.id]: n }))}
                    className={`h-9 w-9 rounded-lg border text-sm font-semibold ${scores[q.id]===n ? "bg-brand text-white border-brand" : "bg-white text-slate-700 hover:bg-slate-50"}`}
                    aria-label={`Set ${q.label} to ${n}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="sticky top-8 h-fit rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-brand">Future-Ready Score</div>
        <div className="mt-2 text-5xl font-black text-ink">{total}%</div>
        <p className="mt-2 text-sm text-slate-600">
          This is a simple example to verify Tailwind styles and layout on Vercel.
        </p>
        <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-brand/10 to-brand2/10" />
      </aside>
    </div>
  );
}
