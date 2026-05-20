import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          AI-Powered Disaster Response Platform
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          RescueMesh AI
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
          From chaos to coordinated rescue. Collect SOS reports, prioritize
          emergencies with AI, and help responders act faster during disasters.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/report"
            className="rounded-xl bg-red-500 px-8 py-4 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
          >
            Send SOS Report
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/20 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Open Command Center
          </Link>
          <Link
            href="/map"
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-8 py-4 font-semibold text-red-100 transition hover:bg-red-500/20"
          >
            View Crisis Map
          </Link>
          <Link
            href="/command"
            className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-8 py-4 font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
          >
            AI Action Plan
          </Link>
          <Link
            href="/simulator"
            className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-8 py-4 font-semibold text-blue-100 transition hover:bg-blue-500/20"
          >
            Launch Simulator
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="text-xl font-semibold">AI Triage</h3>
            <p className="mt-3 text-slate-400">
              Automatically classify reports as Critical, High, Medium, or Low
              priority.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="text-xl font-semibold">Live Dashboard</h3>
            <p className="mt-3 text-slate-400">
              Track emergency cases, statuses, responders, and rescue progress
              in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="text-xl font-semibold">Crisis Map</h3>
            <p className="mt-3 text-slate-400">
              Visualize SOS locations and identify high-risk zones during an
              active disaster.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}