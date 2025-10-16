import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand2 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm">
              Docebo • Future-Ready
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Future Readiness Assessment
            </h1>
            <p className="mt-4 text-lg text-white/90">
              A minimal Next.js + Tailwind app with an example Assessment component and proper CSS wiring for Vercel.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/assessment" className="rounded-xl bg-white px-5 py-3 font-semibold text-ink shadow">
                Open Assessment
              </Link>
              <a href="https://vercel.com" target="_blank" className="rounded-xl border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Learn about Vercel
              </a>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">What’s inside</h2>
        <p className="mt-2 text-slate-600">
          This starter includes Tailwind, layout wiring, and an example component to prove styles deploy correctly.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          <li className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Tailwind wired</h3>
            <p className="text-sm text-slate-600">`globals.css` imported in `app/layout.tsx`.</p>
          </li>
          <li className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Globs configured</h3>
            <p className="text-sm text-slate-600">`tailwind.config.js` covers `app/` and `components/`.</p>
          </li>
          <li className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Assessment example</h3>
            <p className="text-sm text-slate-600">Simple component to verify styling after deploy.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
