"use client";
import React, { useMemo, useState } from "react";
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
    "Aligned Investment: more than 75% of learning spend is mapped to business OKRs or KPIs",
    "Goal Alignment: L&D team goals are reviewed in the same cadence and forum as other enterprise priorities",
    "Stakeholder Sentiment: executives regard L&D as critical infrastructure, not a discretionary support service",
  ],
  "Operating Models and Governance": [
    "Risk Management: policies and workflows for compliance, risk, and privacy are documented and audited at least annually",
    "Federated Access: business units can launch or curate learning autonomously within guardrails supplied by the central L&D team",
    "Strategic Investment: the L&D budget is allocated through a portfolio management process that weighs ROI and strategic fit",
  ],
  "Data, Analytics and Insights": [
    "Leading Indicators: L&D tracks leading indicators such as time to proficiency or capability gaps",
    "Data Integration: a learning record store consolidates data from multiple systems in real time",
    "Predictive Analytics: analytics drive proactive recommendations without human intervention",
  ],
  "Learning Technology and AI Adoption": [
    "Workflow Automation: less than 10% of our learning workflows rely on manual, spreadsheet driven processes",
    "AI Pilots: at least one live AI pilot is informing future rollouts",
    "AI Support: most reactive learner needs are met by AI agents or coaches",
  ],
  "Learning Experience Design": [
    "Cross Functional Design: instructional specialists partner with data analysts, SMEs, and product managers",
    "Evidence Based Iteration: programs are routinely A/B tested and iterated based on learner behavior analytics",
    "AI Personalization: learners receive personalized, just in time pathways curated by AI based on performance data",
  ],
  "Culture and Talent": [
    "Leadership Development: people leaders actively coach and reinforce learning on the job",
    "Capability Development: a formal Capability Academy connects technical and behavioral skills to talent pipelines",
    "Scalable Skills: a unified skills ontology and a talent marketplace are in operation",
  ],
  "Scalability and Reach": [
    "Voluntary Engagement: more than 70% of the workforce accesses learning each month without mandated assignments",
    "Federated Ecosystem: content, experiences, and data flow seamlessly across business units and geographies",
    "Strategic Focus: the function dedicates more time to architecture and evolution than to day to day delivery",
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

function getStage(avg) {
  if (avg >= 4.5) return "Transformative";
  if (avg >= 3.5) return "Strategic";
  if (avg >= 2.5) return "Impacting";
  if (avg >= 1.5) return "Proactive";
  return "Reactive";
}

export default function FutureReadinessAssessment() {
  const [answers, setAnswers] = useState({});
  const [showGate, setShowGate] = useState(false);

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
  const stage = getStage(avg);

  const reset = () => {
    setAnswers({});
    setShowGate(false);
  };

  return (
    <div
      className="min-h-screen text-white p-6 sm:p-10"
      style={{
        background: "linear-gradient(180deg, #4b00e0 0%, #d1007a 50%, #f9c74f 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header with Logo */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAr0AAACpCAYAAAAm/IV8AAAABGdBTUEAALGPC/xhBQAACklpQ0NQc1JHUkNJRyAAAHicfZJ3U1TnGcc/6Y2k3RIEQihBQhUpLShQApJCpS6doUed2a8dY6N6tT2btV1K3u7rZ8+h1H3Z0S9m+9KcO2nGdL2WfZkWNNuK3wZKhb+gQFZxZKQkQ5SAgNHDgG0cCQ7mS7L1v5kG3m6mZ5v6b9h9bJrE0z7dC7Z4Sxo1HGnCq4kTn7n4zv0w3n5+eTXO1vQ/8BzP8cR4+RjQ2u0HqA3b0YgYwPZ9eJm1yI0X5kQF3hXG7h8j2M5h5mMZkzq7n6T3bDTd7qQJ0d5wYJ2p6m1C5s6z6qDqj6w4k0U8nDaxj0bG2rGv9d9+7N0f6l2oU0gB6CqA9o1A9I1gH0H2qB6M2gA0JqH5qgJ0HcNHiHhQJmB5iJqC1gXxHEDQ4QxDqJ8f8V9V3H3Tt1t7i6Tj9f8z9K2oO0gkA8wEAAI4iSURBVHja7Z15cBRlXwaf75x7s5k3M3u1rY3KMq7gQJmM0IYq6IuS6qJcA7wQq8QZ1fQ2K1Yv1CEN1qkqCi5Ssg0qE3A6JrB2ZtP4hB7HnDq7YxGq6pW3fC9rHc7E0b6Vf3z2e+9+2f3m0ZpJp9u6e6eH3+Y8v8kzv+0bG6wC4CwAAACAAAAgAABYkqgAAAgAAAIgAAEAgAAAiAAAEAgAAAiAAAQCAAACIABABAAAgAABYkqgAAAAAAACc7YJ7GQ6s5bC7fF9vXkH0v5m3P1C3c4v2+z1dYQqvV9YJZ+nJ6H2WwYzN1eAq2vZyqgVJ6p0GvotQ1c9c6QG3GJ6Jm3W1JrQXQ3nqfCwq6s6gH0m0e6m2c8Wq6e1mY1W4i02dYbQqv0v2bqVwq1V+YVxQw0r1Bf6d4Tj1Z9bX7m5nY6b8p2m4mQ6kCk2kQm2k4m2m0mY0l8l8Y0Y0f8a0d8a0Y0f8Y0a8Y0Y0j8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0a8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0b8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0Z8Y0xc7l9zI/Ec1v03dAo019xLT7dLMDer/nKD39G1O/vgvO+9gc9aEeJZzvPHL5fZ2s5vtF+H/xQrRGrpsRrwAAAABJRU5ErkJggg==" alt="Docebo" className="h-6 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Future-Readiness Assessment
            </h1>
          </div>
          <Button variant="secondary" onClick={reset} className="bg-white/20 text-white hover:bg-white/30">
            Reset
          </Button>
        </header>

        {/* Progress */}
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
            {DOMAINS.map((domain, i) => (
              <Card key={domain} className="shadow-sm rounded-2xl bg-white/90 text-slate-900">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">{domain}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
                      <Info className="h-4 w-4" /> Rate each statement 1–5 based on your maturity level.
                    </p>
                  </div>

                  {QUESTIONS[domain].map((q, j) => (
                    <div key={`${i}-${j}`} className="border rounded-xl p-4 bg-white">
                      <p className="text-sm font-medium mb-2">{q}</p>
                      <div className="flex flex-wrap gap-2">
                        {OPTIONS.map((opt) => {
                          const active = answers[`${i}-${j}`] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, [`${i}-${j}`]: opt }))
                              }
                              className={[
                                "px-3 py-2 rounded-lg border text-sm transition",
                                active
                                  ? "border-yellow-400 ring-2 ring-yellow-300/70 bg-yellow-50"
                                  : "border-slate-200 hover:border-slate-300",
                              ].join(" ")}
                            >
                              {opt} – {LEVEL_LABELS[opt - 1]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
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
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Overall score</div>
                    <div className="text-2xl font-bold text-pink-600">{avg ? avg.toFixed(2) : "—"}</div>
                    <div className="text-xs text-slate-500">
                      Stage: <span className="font-medium text-purple-700">{stage}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                      <PolarGrid stroke="#d1007a40" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
                      <Tooltip formatter={(value) => `${value}/5`} />
                      <Radar name="Score" dataKey="A" stroke="#d1007a" fill="#d1007a" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.map((d) => (
                    <div key={d.subject} className="rounded-xl border border-slate-200 p-3 bg-white">
                      <div className="text-xs text-slate-500">{d.subject}</div>
                      <div className="text-sm font-medium text-pink-700">{d.A ? d.A.toFixed(2) : "—"}/5</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button onClick={() => setShowGate(true)} className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-yellow-400 text-white border-0 hover:opacity-90">
                    <Download className="mr-2 h-4 w-4" /> Get your tailored playbook
                  </Button>
                  <div className="text-xs text-slate-600">Receive a custom summary based on your results.</div>
                </div>
              </CardContent>
            </Card>

            {showGate && (
              <Card className="rounded-2xl shadow-sm border-yellow-300 bg-white/95">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-pink-700">Request your tailored playbook</h3>
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
