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

const QUESTIONS = {
  "Learning and Development Strategy": [
    {
      title: "1.1 Aligned Investment",
      question: "What share of L&D spend is explicitly mapped to business OKRs/KPIs?",
      options: [
        "No goal alignment",
        "Programs aligned, spend unmapped",
        "About 25% mapped",
        "About 50% mapped",
        "Over 75% mapped"
      ],
    },
    {
      title: "1.2 Goal Alignment",
      question: "Are L&D goals reviewed in the same cadence/forum as enterprise priorities?",
      options: [
        "Set separately, siloed",
        "Shared occasionally, not reviewed",
        "Some BU planning, inconsistent",
        "Reviewed with key initiatives",
        "Embedded in enterprise reviews"
      ],
    },
    {
      title: "1.3 Stakeholder Sentiment",
      question: "How do executives perceive L&D’s role in the business?",
      options: [
        "Cost center perception",
        "Value noted, not strategic",
        "Growing executive support",
        "Essential to readiness",
        "Foundational growth lever"
      ],
    },
  ],
  "Operating Models and Governance": [
    {
      title: "2.1 Risk Management",
      question: "How are L&D compliance, risk, and privacy policies managed?",
      options: [
        "No policies documented",
        "Informal, inconsistent policies",
        "Documented, partial oversight",
        "Defined, regularly reviewed",
        "Audited annually, integrated"
      ],
    },
    {
      title: "2.2 Federated Access",
      question: "How much autonomy do BUs have to launch/curate learning within guardrails?",
      options: [
        "Fully centralized delivery",
        "Ad hoc BU content",
        "Guardrails piloted",
        "BU-led within guardrails",
        "Mature federated model"
      ],
    },
    {
      title: "2.3 Strategic Investment",
      question: "How is the L&D budget allocated and prioritized?",
      options: [
        "Reactive ad hoc spend",
        "Loose priorities, low visibility",
        "Some criteria, no portfolio",
        "Evaluates impact and alignment",
        "Structured ROI-weighted portfolio"
      ],
    },
  ],
  "Data, Analytics and Insights": [
    {
      title: "3.1 Leading Indicators",
      question: "Which leading indicators are tracked?",
      options: [
        "Completions only metrics",
        "Sporadic leading indicators",
        "Select programs tracked",
        "Most programs tracked",
        "Enterprise-wide leading indicators"
      ],
    },
    {
      title: "3.2 Data Integration (LRS)",
      question: "How integrated is learning data?",
      options: [
        "Silos no integration",
        "Manual export consolidation",
        "Partial shared dashboard",
        "Centralized LRS most systems",
        "Enterprise LRS real time"
      ],
    },
    {
      title: "3.3 Predictive Analytics",
      question: "How advanced are analytics recommendations?",
      options: [
        "Historical reporting only",
        "Basic role suggestions",
        "Targeted pilots running",
        "AI personalized suggestions",
        "Automated lifecycle pathways"
      ],
    },
  ],
  "Learning Technology and AI Adoption": [
    {
      title: "4.1 Workflow Automation",
      question: "How manual are learning workflows?",
      options: [
        ">90% manual spreadsheets",
        "~75% manual steps",
        "~50% digitized workflows",
        "<25% manual tasks",
        "<10% manual tasks"
      ],
    },
    {
      title: "4.2 AI Pilots",
      question: "What’s the status of AI pilots?",
      options: [
        "No pilots planned",
        "Research only no pilots",
        "Pilot launched or scoped",
        "Active pilots with results",
        "Pilots delivering value"
      ],
    },
    {
      title: "4.3 AI Support",
      question: "How are learner support needs handled?",
      options: [
        "Static content only",
        "Basic search only",
        "AI tests isolated",
        "AI handles common needs",
        "Proactive AI embedded"
      ],
    },
  ],
  "Learning Experience Design": [
    {
      title: "5.1 Cross-Functional Design",
      question: "How cross-functional is program design?",
      options: [
        "L&D only design",
        "Occasional ad hoc input",
        "Case-by-case support",
        "Standard cross-functional",
        "Deeply integrated teams"
      ],
    },
    {
      title: "5.2 Evidence-Based Iteration",
      question: "How data-driven is iteration?",
      options: [
        "No structured iteration",
        "Feedback rarely used",
        "Data informs some",
        "Regular A/B testing",
        "Continuous real-time optimization"
      ],
    },
    {
      title: "5.3 AI Personalization",
      question: "How personalized is delivery?",
      options: [
        "Same content for all",
        "Basic role-based",
        "Rule-based branching",
        "AI-tailored pathways",
        "Dynamic AI at scale"
      ],
    },
  ],
  "Culture and Talent": [
    {
      title: "6.1 Leadership Development",
      question: "How is manager coaching expected and measured?",
      options: [
        "No coaching expectation",
        "Encouraged not measured",
        "Mentioned in reviews",
        "Expected partially measured",
        "Core expectation measured"
      ],
    },
    {
      title: "6.2 Capability Development",
      question: "How formal are Capability Academies linking skills to talent pipelines?",
      options: [
        "No formal structure",
        "Within functions only",
        "Shared capabilities forming",
        "Academies aligned to roles",
        "Integrated into workforce planning"
      ],
    },
    {
      title: "6.3 Scalable Skills",
      question: "How unified and operational is your enterprise skills framework?",
      options: [
        "Siloed skills data",
        "Early cross-functional talks",
        "Draft shared taxonomy",
        "Unified skills ontology",
        "Ontology powers marketplace"
      ],
    },
  ],
  "Scalability and Reach": [
    {
      title: "7.1 Voluntary Engagement",
      question: "How strong is voluntary learning?",
      options: [
        "Compliance driven only",
        "Occasional self serve",
        "Promoted; pockets growing",
        "Regular self directed use",
        "Embedded in workflows"
      ],
    },
    {
      title: "7.2 Federated Ecosystem",
      question: "How seamless is cross-unit flow?",
      options: [
        "Fragmented low visibility",
        "Some coordination siloed",
        "Standardization underway",
        "Shared platforms governance",
        "Fully federated enterprise"
      ],
    },
    {
      title: "7.3 Strategic Focus",
      question: "How much focus on architecture vs delivery?",
      options: [
        "Consumed by delivery",
        "Strategy sporadic deprioritized",
        "Some long term focus",
        "Time protected for evolution",
        "Dedicated architecture roles"
      ],
    },
  ],
};

const OPTIONS = [1, 2, 3, 4, 5];
const LEVEL_LABELS = [
  "No structure / ad-hoc",
  "Basic foundation in place",
  "Partially standardized",
  "Well-structured & measured",
  "Optimized / enterprise-aligned",
];

function getStageInfo(avg) {
  if (!avg || Number.isNaN(avg)) return { stage: "—", signal: "" };
  if (avg < 2.0) {
    return {
      stage: "Foundational",
      signal: "Mostly ad hoc, compliance‑driven, little data or tech leverage",
    };
  }
  if (avg < 3.0) {
    return {
      stage: "Developing",
      signal: "Core processes forming, pilots running, early alignment to strategy",
    };
  }
  if (avg < 4.0) {
    return {
      stage: "Advanced",
      signal: "Scaled practices, cross‑functional ways of working, measurable value",
    };
  }
  return {
    stage: "Transformative",
    signal: "Data‑driven, AI‑enabled, viewed as critical infrastructure",
  };
}

export default function FutureReadinessAssessment() {
  const [answers, setAnswers] = useState({});
  const [showGate, setShowGate] = useState(false);

  // Wizard navigation across domain blocks
  const [currentBlock, setCurrentBlock] = useState(0);
  const totalBlocks = DOMAINS.length;

  // Per-question option overrides (keep numeric prefixes)
  const OPTION_OVERRIDES = {
    "1.1 Aligned Investment": [
      "1. Learning investments are made without formal alignment to business goals or success metrics.",
      "2. Programs are aligned to business needs, but spending is not consistently mapped to measurable outcomes.",
      "3. Roughly 25% of learning spend is partially mapped to OKRs or KPIs, often at the program level.",
      "4. Roughly 50% learning initiatives are tied to specific business metrics, with ongoing review of their contribution to outcomes.",
      "5. More than 75% of Learning investments are strategically linked to enterprise OKRs or KPIs, with spend tracked and prioritized accordingly.",
    ],
    "1.2 Goal Alignment": [
      "1. Goals are set independently and reviewed separately from broader business planning.",
      "2. Goals are occasionally shared with leadership, but not reviewed as part of enterprise planning cycles.",
      "3. Goals are discussed with some business units during planning, but not consistently tracked across the organization.",
      "4. Goals are reviewed alongside key business initiatives, with visibility in regular planning forums.",
      "5. Goals are embedded into enterprise performance reviews, tracked at executive levels, and influence broader strategic planning.",
    ],
    "1.3 Stakeholder Sentiment": [
      "1. L&D is viewed primarily as a cost center or optional support function.",
      "2. Executives recognize L&D's potential value, but it is rarely positioned as strategic infrastructure.",
      "3. There is growing executive support for L&D, especially around reskilling and talent development.",
      "4. L&D is seen as essential to workforce readiness and increasingly involved in business transformation.",
      "5. Executives view L&D as a foundational lever for growth, resilience, and long-term competitiveness.",
    ],
    "2.1 Risk Management": [
      "1. There are no documented policies for compliance, risk, or privacy in L&D.",
      "2. Some policies exist but are informal, outdated, or not consistently applied.",
      "3. Key policies are documented, with periodic updates and partial compliance oversight.",
      "4. Policies are well defined, owned, and reviewed regularly.",
      "5. Policies are proactively maintained, audited annually, and integrated into learning systems and workflows across the organization.",
    ],
    "2.2 Federated Access": [
      "1. All learning design, development and delivery is centralized within L&D.",
      "2. Some business units create content independently, but without clear guidance or coordination.",
      "3. Guardrails are being developed to support decentralized learning, with initial pilots underway.",
      "4. Business units curate and launch learning within defined parameters, with oversight from the central L&D function.",
      "5. A federated model is in place, allowing business units to move quickly while staying aligned with L&D standards and strategy.",
    ],
    "2.3 Strategic Investment": [
      "1. Budget decisions are reactive, based on historical spend or ad hoc requests.",
      "2. Spending is loosely prioritized, with limited visibility into ROI or strategic alignment.",
      "3. Some criteria guide investment decisions, but there is no formal portfolio approach.",
      "4. Budgeting includes evaluation of program impact and alignment to business needs.",
      "5. L&D manages its investments through a structured portfolio process, weighing ROI, risk, and strategic value across initiatives.",
    ],
    "3.1 Leading Indicators": [
      "1. L&D reporting focuses solely on completions and participation metrics.",
      "2. Some business units explore leading indicators, but these are not used consistently.",
      "3. Time-to-proficiency and skill gaps are tracked for select programs or roles.",
      "4. Leading indicators are tracked across most programs and reviewed in partnership with business stakeholders.",
      "5. Leading indicators are used enterprise-wide to drive decision-making, forecast capability risk, and inform learning strategy.",
    ],
    "3.2 Data Integration (LRS)": [
      "1. Learning data is siloed within individual platforms with no integration.",
      "2. Basic data exports are used to consolidate information manually across systems.",
      "3. Some systems feed into a shared dashboard or warehouse, but data is delayed or incomplete.",
      "4. A centralized LRS is in place, pulling data from most major platforms and tools.",
      "5. An enterprise-grade LRS integrates learning, talent, and performance data in real time, enabling advanced analytics and reporting.",
    ],
    "3.3 Predictive Analytics": [
      "1. Analytics are unavailable or limited to historical reporting and basic dashboards.",
      "2. Some systems suggest learning content based on role or usage, but these are not personalized or automated.",
      "3. Targeted recommendations are piloted for specific audiences or programs.",
      "4. AI-supported analytics inform skill development, offering personalized suggestions to learners at scale.",
      "5. Analytics automatically generate and refine development pathways across the employee lifecycle, powering internal mobility and workforce planning.",
    ],
    "4.1 Workflow Automation": [
      "1. More than 90% of learning operations rely on manual processes and disconnected spreadsheets.",
      "2. Some digital tools are in use, but 75% of core workflows still depend heavily on manual steps.",
      "3. 50% of key workflows have been digitized, though manual workarounds remain common.",
      "4. The majority of operational tasks are automated, with less than 25% of tasks relying on manual interventions.",
      "5. Less than 10% of our learning workflows rely on manual, spreadsheet-driven processes.",
    ],
    "4.2 AI Pilots": [
      "1. No AI pilots are in place and there is no current plan to explore them.",
      "2. Early discussions or research is underway, but no pilots have been launched.",
      "3. A pilot has been launched or scoped for a specific use case within L&D.",
      "4. One or more pilots are active, with measurable results shaping future implementation plans.",
      "5. AI pilots are delivering value, with post-mortem learnings actively informing broader rollout strategies.",
    ],
    "4.3 AI Support": [
      "1. Learners rely on static content or human support for all questions or troubleshooting.",
      "2. Basic search functions exist, but support is inconsistent and not AI-driven.",
      "3. AI tools are being tested for search or support in isolated use cases.",
      "4. AI agents or virtual coaches handle common support needs across key programs or platforms.",
      "5. Proactive AI tools are embedded in the learner experience, resolving most reactive needs without human intervention.",
    ],
    "5.1 Cross-Functional Design": [
      "1. Program design is handled exclusively within L&D with limited input from other functions.",
      "2. Occasional collaboration occurs, but there is no consistent structure for cross-functional input.",
      "3. Some teams partner with SMEs or analysts during program development on a case-by-case basis.",
      "4. Cross-functional collaboration is a standard part of program design across key initiatives.",
      "5. Instructional design is deeply integrated with product, data, and business teams to ensure relevance, accuracy, and impact.",
    ],
    "5.2 Evidence-Based Iteration": [
      "1. Programs are launched and maintained without structured feedback or iteration.",
      "2. Some feedback is collected post-program, but data is not consistently used to improve design.",
      "3. Behavioral data is reviewed for select programs and occasionally informs updates.",
      "4. A/B testing and analytics-based iteration occur regularly across core programs.",
      "5. Programs are continuously optimized through experimentation and real-time learner behavior analytics.",
    ],
    "5.3 AI Personalization": [
      "1. All learners receive the same static content regardless of role, need, or performance.",
      "2. Some personalization exists, typically based on job title or department.",
      "3. Rule-based logic informs basic branching or content recommendations.",
      "4. AI tools provide tailored learning pathways informed by learner performance or behavior.",
      "5. AI systems dynamically generate personalized pathways and content at scale, supporting just-in-time development across the workforce.",
    ],
    "6.1 Leadership Development": [
      "1. Coaching is not expected or evaluated as part of people leader responsibilities.",
      "2. Coaching may be encouraged informally, but it is not consistently supported or measured.",
      "3. Coaching is referenced in manager guidance and some performance conversations, but expectations vary.",
      "4. People leaders are expected to coach, and performance reviews include some structured evaluation of this behavior.",
      "5. Coaching is a core expectation for all people leaders, supported by enablement, tracked in performance reviews, and reinforced by HR business partners.",
    ],
    "6.2 Capability Development": [
      "1. No formal structure exists to guide capability development across the organization.",
      "2. Skills development happens within functions, but without clear linkage to enterprise-wide talent strategy.",
      "3. Initial efforts are underway to define shared capabilities and connect them to development pathways.",
      "4. Capability Academies are established and aligned to critical roles, with input from business and HR.",
      "5. Capability Academies are mature, integrated into workforce planning, and guide both internal mobility and succession across technical and behavioral domains.",
    ],
    "6.3 Scalable Skills": [
      "1. Each function manages skills data independently, with no shared framework or coordinated planning.",
      "2. Cross-functional conversations are happening, but skills frameworks are still siloed or in an early stage.",
      "3. A shared skills taxonomy has been drafted and is being tested across some functions.",
      "4. A unified skills ontology is in place and actively informs talent, learning, and workforce planning decisions.",
      "5. Skills data flows across systems through a shared ontology, powering an internal talent marketplace and enabling AI-supported mobility, reskilling, and planning.",
    ],
    "7.1 Voluntary Engagement": [
      "1. Learning engagement is driven almost entirely by compliance or assigned training.",
      "2. A small percentage of learners seek out non-mandatory content occasionally.",
      "3. Voluntary learning is promoted, and uptake is growing in specific functions or regions.",
      "4. A large portion of the workforce regularly engages in self-directed learning each month.",
      "5. Voluntary engagement is widespread and consistent, with learning embedded into daily workflows and culture.",
    ],
    "7.2 Federated Ecosystem": [
      "1. Learning systems and content are fragmented across business units with limited visibility or consistency.",
      "2. Some coordination exists, but learning experiences and data remain siloed.",
      "3. Initial efforts are underway to standardize content and connect systems.",
      "4. Content and data flow across units through shared platforms and governance.",
      "5. A fully federated ecosystem enables seamless learning delivery, localization, and data sharing across the enterprise.",
    ],
    "7.3 Strategic Focus": [
      "1. L&D is consumed by daily delivery with little time for strategic design or system improvement.",
      "2. Strategic work happens sporadically but is often deprioritized for urgent execution needs.",
      "3. Some teams focus on long-term design, but most resources are still tied to delivery.",
      "4. Time is intentionally protected for building and evolving the learning ecosystem.",
      "5. L&D operates as a strategic function, with dedicated roles focused on systems architecture, innovation, and long-range planning.",
    ],
  };

  const isCurrentBlockComplete = useMemo(() => {
    const domain = DOMAINS[currentBlock];
    const qs = QUESTIONS[domain] || [];
    // Each domain has 3 questions indexed j = 0..2 with answer keys `${i}-${j}`
    return qs.every((_, j) => {
      const key = `${currentBlock}-${j}`;
      return answers[key] !== undefined && answers[key] !== null;
    });
  }, [answers, currentBlock]);

  const goNext = () => {
    if (currentBlock < totalBlocks - 1 && isCurrentBlockComplete) {
      setCurrentBlock((i) => i + 1);
      const el = document.getElementById('assessment-start');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goBack = () => {
    if (currentBlock > 0) {
      setCurrentBlock((i) => i - 1);
      const el = document.getElementById('assessment-start');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dev sanity checks (lightweight "tests" to prevent schema regressions)
  useEffect(() => {
    console.assert(
      DOMAINS.length === Object.keys(QUESTIONS).length,
      "[Schema] DOMAINS and QUESTIONS keys mismatch"
    );
    for (const d of DOMAINS) {
      console.assert(
        Array.isArray(QUESTIONS[d]) && QUESTIONS[d].length === 3,
        `[Schema] Domain "${d}" does not have exactly 3 questions.`
      );
    }
  }, []);

  const { avg, filledCount, data } = useMemo(() => {
    const allScores = Object.values(answers);
    const sum = allScores.reduce((a, b) => a + b, 0);
    const avg = allScores.length ? sum / allScores.length : 0;

    const data = DOMAINS.map((domain, i) => {
      const questions = QUESTIONS[domain];
      const scores = questions.map((_, j) => answers[`${i}-${j}`]).filter(Boolean);
      const avgDomain = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { subject: domain, A: avgDomain, fullMark: 5 };
    });

    return { avg, filledCount: allScores.length, data };
  }, [answers]);

  const progress = Math.round((filledCount / (DOMAINS.length * 3)) * 100);
  const { stage, signal } = getStageInfo(avg);

  const reset = () => {
    setAnswers({});
    setShowGate(false);
  };

  return (
    <div
      className="min-h-screen text-white p-6 sm:p-10"
      style={{
        background: "linear-gradient(180deg, #4b00e0 0%, #d1007a 50%, #f9c74f 100%)",
        fontFamily: 'Figtree, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Load Figtree font */}
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;600;700&display=swap" rel="stylesheet" />
        {/* Header with Logo */}
        <header className="mb-16 lg:mb-24 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://companieslogo.com/img/orig/DCBO_BIG.D-27ac031c.png?t=1720244491" alt="Docebo" className="h-6 sm:h-8" />
            <h1 className="sr-only">Future-Readiness Assessment</h1>
          </div>
          <Button variant="secondary" onClick={reset} className="bg-white/20 text-white hover:bg-white/30">
            Reset
          </Button>
        </header>

        {/* HERO: Benchmark-led section */}
        <section className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-16 items-center">
            {/* Copy block */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-3 sm:mb-4">Future-Readiness Assessment</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                Only ~30% of orgs reach high learning maturity. Where do you stand?
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/90 max-w-2xl">
                <span className="font-medium">5-minute assessment</span> → personalized score, peer benchmark, and an exec‑ready PDF you can share.
              </p>
              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button
                  onClick={() => document.getElementById('assessment-start')?.scrollIntoView({behavior:'smooth'})}
                  className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white border-0 hover:opacity-90 w-full sm:w-auto"
                >
                  Benchmark my L&D
                </Button>
              </div>

              {/* Tiny trust strip logos (placeholders) */}
              <div className="mt-10 lg:mt-12" />
              <div className="mt-3 sm:mt-4 text-xs text-white/80">Used by leaders at (customer logos)</div>
            </div>

            {/* Sample report preview */}
            <Card className="bg-white/90 text-slate-900 rounded-2xl shadow-lg overflow-hidden lg:mt-10">
              <CardContent className="p-0">
                <img
                  src="https://ibb.co/nygzK38"
                  alt="Sample benchmark report preview"
                  className="w-full h-auto block"
                />
              </CardContent>
            </Card>
          </div>
          {/* Persistent bottom wizard controls (always visible) */}
          <div id="wizard-controls" className="hidden">
            <div className="mx-auto max-w-5xl px-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-3 shadow">
                <button onClick={goBack} disabled={currentBlock === 0} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 disabled:opacity-50">Back</button>
                <div className="text-sm text-slate-700">Block {currentBlock + 1} of {DOMAINS.length}</div>
                <button
                  onClick={() => (currentBlock === DOMAINS.length - 1 ? setShowGate(true) : goNext())}
                  disabled={!isCurrentBlockComplete}
                  className="px-4 py-2 rounded-xl bg-[var(--brand)] text-white disabled:opacity-60"
                >
                  {currentBlock === DOMAINS.length - 1 ? 'Done' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress */}
        <div id="assessment-start" className="h-0" aria-hidden="true" />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Completion</span>
            <span className="text-sm text-white/90">{filledCount}/{DOMAINS.length * 3}</span>
          </div>
          <Progress value={progress} className="bg-white/20 [&>div]:bg-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Questions */}
          <section className="space-y-6">
            {/* Single active block (wizard-style) */}
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
                      const optionLabels = (isObj && OPTION_OVERRIDES[q.title]) ? OPTION_OVERRIDES[q.title] : (isObj && q.options ? q.options : LEVEL_LABELS);
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
                                  key={opt.value}
                                  onClick={() => setAnswers((prev) => ({ ...prev, [`${i}-${j}`]: opt.value }))}
                                  className={[
                                    'px-3 py-2 rounded-lg border text-sm transition text-left w-full hover:bg-slate-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
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

                    {/* Spacer where inline controls used to be */}
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={goBack}
                        disabled={currentBlock === 0}
                        className="text-slate-600 hover:underline disabled:opacity-50 disabled:hover:no-underline"
                      >
                        Back
                      </button>
                      <Button
                        onClick={() => (currentBlock === DOMAINS.length - 1 ? setShowGate(true) : goNext())}
                        disabled={!isCurrentBlockComplete}
                        className={`px-4 py-2 rounded-xl border transition ${isCurrentBlockComplete ? 'bg-green-600 text-white border-transparent hover:bg-green-700' : 'bg-slate-200 text-slate-700 border-slate-300'}` }
                      >
                        {currentBlock === DOMAINS.length - 1 ? 'Done' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Sticky Live Results */}
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
                    <Download className="mr-2 h-4 w-4" /> Get your playbook
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
