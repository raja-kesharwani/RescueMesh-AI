import Link from "next/link";

const features = [
  {
    title: "AI Triage",
    description:
      "Classifies SOS reports by urgency using emergency keywords, affected population, and incident type.",
  },
  {
    title: "Crisis Map",
    description:
      "Visualizes active emergencies with priority-colored markers and responder information.",
  },
  {
    title: "Command Center",
    description:
      "Turns scattered emergency reports into a prioritized operational action plan.",
  },
  {
    title: "Resource Matching",
    description:
      "Suggests rescue boats, medical responders, ambulances, fire units, shelters, and relief supplies.",
  },
  {
    title: "Offline SOS Mode",
    description:
      "Stores reports locally when connectivity is unavailable, supporting disaster conditions.",
  },
  {
    title: "Duplicate Detection",
    description:
      "Flags similar reports so responders avoid dispatching duplicate teams to the same incident.",
  },
];

const techStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Leaflet",
  "LocalStorage Prototype",
  "AI Triage Logic",
];

export default function PitchPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400">
            Hackathon Pitch
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-bold md:text-7xl">
            RescueMesh AI
          </h1>

          <p className="mt-5 max-w-3xl text-xl text-slate-300">
            From chaos to coordinated rescue — an AI-powered disaster response
            platform that helps emergency teams prioritize SOS reports, assign
            responders, and coordinate resources faster.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/simulator"
              className="rounded-xl bg-red-500 px-6 py-4 font-semibold text-white hover:bg-red-600"
            >
              Launch Demo
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-6 py-4 font-semibold text-white hover:bg-white/10"
            >
              Open Dashboard
            </Link>

            <Link
              href="/command"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 font-semibold text-emerald-100 hover:bg-emerald-500/20"
            >
              AI Action Plan
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="text-3xl font-bold">The Problem</h2>

            <p className="mt-4 text-slate-300">
              During floods, earthquakes, wildfires, hurricanes, and other
              emergencies, response teams receive many scattered SOS messages.
              Important details are buried in calls, texts, forms, and social
              posts. Without fast triage, the most critical cases can be delayed.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h2 className="text-3xl font-bold">Our Solution</h2>

            <p className="mt-4 text-slate-300">
              RescueMesh AI collects emergency reports, analyzes urgency,
              recommends resources, identifies duplicate reports, maps affected
              zones, and generates an operational rescue plan for coordinators.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-3xl font-bold">Core Features</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-bold">Tech Stack</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-bold">Demo Flow</h2>

            <ol className="mt-5 space-y-3 text-slate-300">
              <li>
                <span className="font-semibold text-white">1.</span> Launch the
                disaster simulator.
              </li>
              <li>
                <span className="font-semibold text-white">2.</span> View AI
                triaged SOS reports in the dashboard.
              </li>
              <li>
                <span className="font-semibold text-white">3.</span> Assign
                responders and ETA.
              </li>
              <li>
                <span className="font-semibold text-white">4.</span> Open the
                crisis map to see affected zones.
              </li>
              <li>
                <span className="font-semibold text-white">5.</span> Open AI
                Action Plan to explain recommended response sequence.
              </li>
            </ol>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
          <h2 className="text-3xl font-bold">Real-World Impact</h2>

          <p className="mt-4 text-slate-300">
            RescueMesh AI can support local governments, NGOs, campus safety
            teams, volunteer networks, and emergency response organizations by
            reducing coordination time and helping teams focus on the most
            life-threatening cases first.
          </p>
        </section>
      </div>
    </main>
  );
}