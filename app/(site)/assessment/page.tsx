import Assessment from "@/components/Assessment";

export default function AssessmentPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Assessment</h1>
      <p className="mt-2 text-slate-600">
        This page renders the sample Assessment component. If you see styled cards and a chart placeholder,
        Tailwind + TS are working in production.
      </p>
      <div className="mt-8">
        <Assessment />
      </div>
    </main>
  );
}
