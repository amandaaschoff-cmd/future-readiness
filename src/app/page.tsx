"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Download, Info } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DOMAINS = [
  "Learning and Development Strategy",
  "Operating Models and Governance",
  "Data, Analytics and Insights",
  "Learning Technology and AI Adoption",
  "Learning Experience Design",
  "Culture and Talent",
  "Scalability and Reach",
];

const QUESTIONS: Record<string, any[]> = {
  "Learning and Development Strategy": [
    {
      title: "1.1 Aligned Investment",
      question: "What share of L&D spend is explicitly mapped to business OKRs/KPIs?",
      options: ["No goal alignment","Programs aligned, spend unmapped","About 25% mapped","About 50% mapped","Over 75% mapped"],
    },
    {
      title: "1.2 Goal Alignment",
      question: "Are L&D goals reviewed in the same cadence/forum as enterprise priorities?",
      options: ["Set separately, siloed","Shared occasionally, not reviewed","Some BU planning, inconsistent","Reviewed with key initiatives","Embedded in enterprise reviews"],
    },
    {
      title: "1.3 Stakeholder Sentiment",
      question: "How do executives perceive L&D’s role in the business?",
      options: ["Cost center perception","Value noted, not strategic","Growing executive support","Essential to readiness","Foundational growth lever"],
    },
  ],
  "Operating Models and Governance": [
    {
      title: "2.1 Risk Management",
      question: "How are L&D compliance, risk, and privacy policies managed?",
      options: ["No policies documented","Informal, inconsistent policies","Documented, partial oversight","Defined, regularly reviewed","Audited annually, integrated"],
    },
    {
      title: "2.2 Federated Access",
      question: "How much autonomy do BUs have to launch/curate learning within guardrails?",
      options: ["Fully centralized delivery","Ad hoc BU content","Guardrails piloted","BU-led within guardrails","Mature federated model"],
    },
    {
      title: "2.3 Strategic Investment",
      question: "How is the L&D budget allocated and prioritized?",
      options: ["Reactive ad hoc spend","Loose priorities, low visibility","Some criteria, no portfolio","Evaluates impact and alignment","Structured ROI-weighted portfolio"],
    },
  ],
  "Data, Analytics and Insights": [
    {
      title: "3.1 Leading Indicators",
      question: "Which leading indicators are tracked?",
      options: ["Completions only metrics","Sporadic leading indicators","Select programs tracked","Most programs tracked","Enterprise-wide leading indicators"],
    },
    {
      title: "3.2 Data Integration (LRS)",
      question: "How integrated is learning data?",
      options: ["Silos no integration","Manual export consolidation","Partial shared dashboard","Centralized LRS most systems","Enterprise LRS real time"],
    },
    {
      title: "3.3 Predictive Analytics",
      question: "How advanced are analytics recommendations?",
      options: ["Historical reporting only","Basic role suggestions","Targeted pilots running","AI personalized suggestions","Automated lifecycle pathways"],
    },
  ],
  "Learning Technology and AI Adoption": [
    {
      title: "4.1 Workflow Automation",
      question: "How manual are learning workflows?",
      options: [">90% manual spreadsheets","~75% manual steps","~50% digitized workflows","<25% manual tasks","<10% manual tasks"],
    },
    {
      title: "4.2 AI Pilots",
      question: "What’s the status of AI pilots?",
      options: ["No pilots planned","Research only no pilots","Pilot launched or scoped","Active pilots with results","Pilots delivering value"],
    },
    {
      title: "4.3 AI Support",
      question: "How are learner support needs handled?",
      options: ["Static content only","Basic search only","AI tests isolated","AI handles common needs","Proactive AI embedded"],
    },
  ],
  "Learning Experience Design": [
    {
      title: "5.1 Cross-Functional Design",
      question: "How cross-functional is program design?",
      options: ["L&D only design","Occasional ad hoc input","Case-by-case support","Standard cross-functional","Deeply integrated teams"],
    },
    {
      title: "5.2 Evidence-Based Iteration",
      question: "How data-driven is iteration?",
      options: ["No structured iteration","Feedback rarely used","Data informs some","Regular A/B testing","Continuous real-time optimization"],
    },
    {
      title: "5.3 AI Personalization",
      question: "How personalized is delivery?",
      options: ["Same content for all","Basic role-based","Rule-based branching","AI-tailored pathways","Dynamic AI at scale"],
    },
  ],
  "Culture and Talent": [
    {
      title: "6.1 Leadership Development",
      question: "How is manager coaching expected and measured?",
      options: ["No coaching expectation","Encouraged not measured","Mentioned in reviews","Expected partially measured","Core expectation measured"],
    },
    {
      title: "6.2 Capability Development",
      question: "How formal are Capability Academies linking skills to talent pipelines?",
      options: ["No formal structure","Within functions only","Shared capabilities forming","Academies aligned to roles","Integrated into workforce planning"],
    },
    {
      title: "6.3 Scalable Skills",
      question: "How unified and operational is your enterprise skills framework?",
      options: ["Siloed skills data","Early cross-functional talks","Draft shared taxonomy","Unified skills ontology","Ontology powers marketplace"],
    },
  ],
  "Scalability and Reach": [
    {
      title: "7.1 Voluntary Engagement",
      question: "How strong is voluntary learning?",
      options: ["Compliance driven only","Occasional self serve","Promoted; pockets growing","Regular self directed use","Embedded in workflows"],
    },
    {
      title: "7.2 Federated Ecosystem",
      question: "How seamless is cross-unit flow?",
      options: ["Fragmented low visibility","Some coordination siloed","Standardization underway","Shared platforms governance","Fully federated enterprise"],
    },
    {
      title: "7.3 Strategic Focus",
      question: "How much focus on architecture vs delivery?",
      options: ["Consumed by delivery","Strategy sporadic deprioritized","Some long term focus","Time protected for evolution","Dedicated architecture roles"],
    },
  ],
};

const LEVEL_LABELS = [
  "No structure / ad-hoc",
  "Basic foundation in place",
  "Partially standardized",
  "Well-structured & measured",
  "Optimized / enterprise-aligned",
];

function getStageInfo(avg: number) {
  if (!avg || Number.isNaN(avg)) return { stage: "—", signal: "" };
  if (avg < 2.0) return { stage: "Foundational", signal: "Mostly ad hoc, compliance‑driven, little data or tech leverage" };
  if (avg < 3.0) return { stage: "Developing", signal: "Core processes forming, pilots running, early alignment to strategy" };
  if (avg < 4.0) return { stage: "Advanced", signal: "Scaled practices, cross‑functional ways of working, measurable value" };
  return { stage: "Transformative", signal: "Data‑driven, AI‑enabled, viewed as critical infrastructure" };
}

export default function Page() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showGate, setShowGate] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);

  const isCurrentBlockComplete = useMemo(() => {
    const domain = DOMAINS[currentBlock];
    const qs = QUESTIONS[domain] || [];
    return qs.every((_, j) => answers[`${currentBlock}-${j}`] != null);
  }, [answers, currentBlock]);

  const progress = useMemo(() => {
    const total = DOMAINS.length * 3;
    const filled = Object.keys(answers).length;
    return Math.round((filled / total) * 100);
  }, [answers]);

  const { avg, data } = useMemo(() => {
    const all = Object.values(answers);
    const sum = all.reduce((a, b) => a + b, 0);
    const avg = all.length ? sum / all.length : 0;
    const data = DOMAINS.map((domain, i) => {
      const scores = (QUESTIONS[domain] as any[]).map((_, j) => answers[`${i}-${j}`]).filter(Boolean);
      const avgDomain = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { subject: domain, A: avgDomain, fullMark: 5 };
    });
    return { avg, data };
  }, [answers]);

  const { stage, signal } = getStageInfo(avg);

  const goNext = () => {
    if (isCurrentBlockComplete && currentBlock < DOMAINS.length - 1) {
      setCurrentBlock((n) => n + 1);
      document.getElementById('assessment-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (isCurrentBlockComplete && currentBlock === DOMAINS.length - 1) {
      setShowGate(true);
    }
  };

  const goBack = () => {
    if (currentBlock > 0) {
      setCurrentBlock((n) => n - 1);
      document.getElementById('assessment-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const reset = () => { setAnswers({}); setShowGate(false); setCurrentBlock(0); };

  return (
    <div
      className="min-h-screen text-white p-6 sm:p-10"
      style={{ background: "linear-gradient(180deg, #4b00e0 0%, #d1007a 50%, #f9c74f 100%)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 lg:mb-24 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://companieslogo.com/img/orig/DCBO_BIG.D-27ac031c.png?t=1720244491" alt="Docebo" className="h-6 sm:h-8" />
            <h1 className="sr-only">Future-Readiness Assessment</h1>
          </div>
          <Button variant="secondary" onClick={reset} className="bg-white/20 text-white hover:bg-white/30">Reset</Button>
        </header>

        <section className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-16 items-center">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-3 sm:mb-4">Future-Readiness Assessment</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                Only ~30% of orgs reach high learning maturity. Where do you stand?
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/90 max-w-2xl">
                <span className="font-medium">5-minute assessment</span> → personalized score, peer benchmark, and an exec‑ready PDF you can share.
              </p>
              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button onClick={() => document.getElementById('assessment-start')?.scrollIntoView({behavior:'smooth'})} className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white border-0 hover:opacity-90 w-full sm:w-auto">
                  Benchmark my L&D
                </Button>
              </div>
              <div className="mt-10 lg:mt-12" />
              <div className="mt-3 sm:mt-4 text-xs text-white/80">Used by leaders at (customer logos)</div>
            </div>

            <Card className="bg-white/90 text-slate-900 rounded-2xl shadow-lg overflow-hidden lg:mt-10">
              <CardContent className="p-0">
                <img src="https://ibb.co/nygzK38" alt="Sample benchmark report preview" className="w-full h-auto block" />
              </CardContent>
            </Card>
          </div>
        </section>

        <div id="assessment-start" className="h-0" aria-hidden="true" />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Completion</span>
            <span className="text-sm text-white/90">
              {Object.keys(answers).length}/{DOMAINS.length * 3}
            </span>
          </div>
          <Progress value={progress} className="bg-white/20 [&>div]:bg-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="space-y-6">
            {(() => {
              const i = currentBlock;
              const domain = DOMAINS[i];
              const questions = QUESTIONS[domain];
              return (
                <div key={domain} className="shadow-sm rounded-2xl bg-white/90 text-slate-900 border border-slate-200">
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold">{domain}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">Rate each statement 1-5 based on your maturity level.</p>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Block {i + 1} of {DOMAINS.length}</div>
                    </div>

                    {questions.map((q, j) => {
                      const isObj = typeof q === 'object' && q !== null;
                      const optionLabels = isObj && q.options ? q.options : LEVEL_LABELS;
                      const optionsList = optionLabels.map((label, idx) => ({ label, value: idx + 1 }));
                      return (
                        <div key={`${i}-${j}`} className="border rounded-xl p-4 bg-white">
                          <p className="text-sm mb-2">
                            {isObj ? (<span className="font-semibold">{q.title}:</span>) : null} {isObj ? q.question : q}
                          </p>
                          <div className="flex flex-col gap-2">
                            {optionsList.map((opt) => {
                              const active = answers[`${i}-${j}`] === opt.value;
                              return (
                                <button
                                  title={opt.label}
                                  key={opt.value}
                                  onClick={() => setAnswers((prev) => ({ ...prev, [`${i}-${j}`]: opt.value }))}
                                  className={[
                                    'px-3 py-2 rounded-lg border text-sm transition text-left w-full hover:bg-slate-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 leading-snug line-clamp-2',
                                    active ? 'border-yellow-400 ring-2 ring-yellow-300/70 bg-yellow-50' : 'border-slate-200 hover:border-slate-300',
                                  ].join(' ')}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    <div className="mt-4 flex items-center justify-between">
                      <button onClick={goBack} disabled={currentBlock === 0} className="text-slate-600 hover:underline disabled:opacity-50 disabled:hover:no-underline">
                        Back
                      </button>
                      <Button
                        onClick={goNext}
                        disabled={!isCurrentBlockComplete}
                        className={`px-4 py-2 rounded-xl border transition ${isCurrentBlockComplete ? 'bg-green-600 text-white border-transparent hover:bg-green-700' : 'bg-slate-200 text-slate-700 border-slate-300'}`}
                      >
                        {currentBlock === DOMAINS.length - 1 ? 'Done' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6 self-start">
            <Card className="rounded-2xl shadow-md bg-white/90 text-slate-900">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Your assessment results</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Results update as you answer. Complete all 21 questions for the full radar chart.
                    </p>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Overall score</div>
                    <div className="text-2xl font-bold text-blue-600">{avg ? avg.toFixed(2) : "—"}</div>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-sm">
                        {stage}
                      </span>
                    </div>
                    {avg ? (
                      <div className="text-[11px] text-slate-500 mt-1">{signal}</div>
                    ) : (
                      <div className="text-[11px] text-slate-500 mt-1">Your current maturity stage</div>
                    )}
                  </div>
                </div>

                <div className="mt-6 h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                      <PolarGrid stroke="#2563eb40" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
                      <Tooltip formatter={(value) => `${value}/5`} />
                      <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.map((d) => (
                    <div key={d.subject} className="rounded-xl border border-slate-200 p-3 bg-white">
                      <div className="text-xs text-slate-500">{d.subject}</div>
                      <div className="text-sm font-medium text-blue-700">{d.A ? d.A.toFixed(2) : "—"}/5</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button onClick={() => setShowGate(true)} className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-yellow-400 text-white border-0 hover:opacity-90">
                    <span className="mr-2 inline-block">⬇</span> Get your playbook
                  </Button>
                  <div className="text-xs text-slate-600">Receive a custom summary based on your results.</div>
                </div>
              </CardContent>
            </Card>

            {showGate && (
              <Card className="rounded-2xl shadow-sm border-yellow-300 bg-white/95">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-700">Request your tailored playbook</h3>
                  <p className="text-sm text-slate-600 mt-1">Replace with your marketing form integration.</p>
                  <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="First name" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Last name" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 sm:col-span-2" placeholder="Work email" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 sm:col-span-2" placeholder="Company" />
                    <textarea className="rounded-xl border border-slate-300 px-3 py-2 sm:col-span-2" placeholder="Any specific areas to improve?" />
                    <Button type="button" className="sm:col-span-2 bg-gradient-to-r from-pink-600 to-yellow-400 text-white hover:opacity-90">
                      Send my tailored playbook
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>

        <div className="mt-10 text-xs text-white/80 text-center">
          Styled with Docebo’s new brand gradient and accent colors. Layout and functionality unchanged.
        </div>
      </div>
    </div>
  );
}
