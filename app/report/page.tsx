"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Priority = "Critical" | "High" | "Medium" | "Low";
type Status = "Pending" | "Assigned" | "In Progress" | "Rescued" | "Closed";

type Report = {
  id: string;
  name: string;
  phone: string;
  location: string;
  emergencyType: string;
  peopleAffected: string;
  details: string;
  priority: Priority;
  summary: string;
  resourceNeeds: string[];
  status: Status;
  createdAt: string;
  lat?: number;
  lng?: number;
};

function getResourceNeeds(details: string, emergencyType: string): string[] {
  const text = `${details} ${emergencyType}`.toLowerCase();
  const resources = new Set<string>();

  if (
    text.includes("flood") ||
    text.includes("water") ||
    text.includes("trapped") ||
    text.includes("evacuation")
  ) {
    resources.add("Evacuation team");
    resources.add("Rescue boat");
  }

  if (
    text.includes("medical") ||
    text.includes("injured") ||
    text.includes("bleeding") ||
    text.includes("chest pain") ||
    text.includes("breathing") ||
    text.includes("unconscious")
  ) {
    resources.add("Medical responders");
    resources.add("Ambulance");
  }

  if (
    text.includes("fire") ||
    text.includes("wildfire") ||
    text.includes("smoke")
  ) {
    resources.add("Fire response team");
    resources.add("Evacuation support");
  }

  if (
    text.includes("food") ||
    text.includes("water") ||
    text.includes("hygiene") ||
    text.includes("shelter")
  ) {
    resources.add("Food supplies");
    resources.add("Drinking water");
    resources.add("Shelter support");
  }

  if (resources.size === 0) {
    resources.add("Field assessment team");
  }

  return Array.from(resources);
}

function analyzeEmergency(
  details: string,
  emergencyType: string,
  peopleAffected: string
): {
  priority: Priority;
  summary: string;
  resourceNeeds: string[];
} {
  const text = `${details} ${emergencyType}`.toLowerCase();
  const affectedCount = Number(peopleAffected || 1);

  const criticalWords = [
    "trapped",
    "bleeding",
    "unconscious",
    "chest pain",
    "cannot breathe",
    "difficulty breathing",
    "drowning",
    "elderly",
    "child",
    "children",
    "pregnant",
    "collapsed",
    "life threatening",
    "severe injury",
  ];

  const highWords = [
    "injured",
    "flood",
    "fire",
    "wildfire",
    "water rising",
    "smoke",
    "stuck",
    "ambulance",
    "medicine",
    "evacuation",
    "no food",
    "no water",
    "shelter",
  ];

  const isCritical = criticalWords.some((word) => text.includes(word));
  const isHigh = highWords.some((word) => text.includes(word));

  let priority: Priority = "Medium";

  if (isCritical || affectedCount >= 10) {
    priority = "Critical";
  } else if (isHigh || affectedCount >= 5) {
    priority = "High";
  } else if (text.length < 25 && affectedCount <= 1) {
    priority = "Low";
  }

  const resourceNeeds = getResourceNeeds(details, emergencyType);

  const summary = `${priority} priority ${emergencyType.toLowerCase()} incident affecting approximately ${affectedCount} ${
    affectedCount === 1 ? "person" : "people"
  }. Recommended resources: ${resourceNeeds.join(", ")}. Details: ${details.slice(
    0,
    140
  )}${details.length > 140 ? "..." : ""}`;

  return { priority, summary, resourceNeeds };
}

function detectPossibleDuplicate(
  newLocation: string,
  newDetails: string,
  existingReports: Report[]
): Report | null {
  const locationWords = newLocation
    .toLowerCase()
    .split(/[\s,.-]+/)
    .filter((word) => word.length > 3);

  const detailWords = newDetails
    .toLowerCase()
    .split(/[\s,.-]+/)
    .filter((word) => word.length > 4);

  for (const report of existingReports) {
    const existingLocation = report.location.toLowerCase();
    const existingDetails = report.details.toLowerCase();

    const sharedLocationWords = locationWords.filter((word) =>
      existingLocation.includes(word)
    );

    const sharedDetailWords = detailWords.filter((word) =>
      existingDetails.includes(word)
    );

    if (sharedLocationWords.length >= 1 && sharedDetailWords.length >= 2) {
      return report;
    }
  }

  return null;
}

export default function ReportPage() {
  const [isOnline, setIsOnline] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    emergencyType: "Flood",
    peopleAffected: "1",
    details: "",
  });

  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [possibleDuplicate, setPossibleDuplicate] = useState<Report | null>(
    null
  );

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const existingReports: Report[] = JSON.parse(
      localStorage.getItem("rescuemesh-reports") || "[]"
    );

    const duplicate = detectPossibleDuplicate(
      formData.location,
      formData.details,
      existingReports
    );

    const aiResult = analyzeEmergency(
      formData.details,
      formData.emergencyType,
      formData.peopleAffected
    );

    const newReport: Report = {
      id: `RM-${Date.now()}`,
      ...formData,
      priority: aiResult.priority,
      summary: aiResult.summary,
      resourceNeeds: aiResult.resourceNeeds,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "rescuemesh-reports",
      JSON.stringify([newReport, ...existingReports])
    );

    setPossibleDuplicate(duplicate);
    setSubmittedReport(newReport);

    setFormData({
      name: "",
      phone: "",
      location: "",
      emergencyType: "Flood",
      peopleAffected: "1",
      details: "",
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          ← Back to home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400">
            Emergency SOS
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Submit a Rescue Request
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Send emergency details to the RescueMesh command center. The system
            estimates urgency, identifies resource needs, detects duplicate
            reports, and generates a responder-ready rescue summary.
          </p>

          <div
            className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${
              isOnline
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
            }`}
          >
            {isOnline
              ? "Online: reports sync instantly"
              : "Offline mode: report will be saved locally"}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-red-500/40 focus:ring-2"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Phone Number</label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 0100"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-red-500/40 focus:ring-2"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Location</label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Area, landmark, city"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-red-500/40 focus:ring-2"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Emergency Type</label>
              <select
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-red-500/40 focus:ring-2"
              >
                <option>Flood</option>
                <option>Fire</option>
                <option>Wildfire</option>
                <option>Earthquake</option>
                <option>Hurricane</option>
                <option>Medical</option>
                <option>Trapped</option>
                <option>Food/Water</option>
                <option>Shelter</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">People Affected</label>
              <input
                required
                type="number"
                min="1"
                name="peopleAffected"
                value={formData.peopleAffected}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-red-500/40 focus:ring-2"
              />
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-200">
                AI triage is active
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Words like trapped, bleeding, unconscious, child, wildfire, or
                water rising will increase emergency priority.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm text-slate-300">Emergency Details</label>
            <textarea
              required
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={6}
              placeholder="Describe what happened. Example: Water is rising quickly and one elderly person is trapped on the second floor."
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-red-500/40 focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-red-500 px-6 py-4 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
          >
            Submit SOS Report
          </button>
        </form>

        {submittedReport && (
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm font-semibold text-emerald-300">
              {isOnline
                ? "Report submitted successfully"
                : "Offline report saved locally"}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Tracking ID: {submittedReport.id}
            </h2>

            <p className="mt-3 text-slate-300">
              Priority:{" "}
              <span className="font-semibold text-white">
                {submittedReport.priority}
              </span>
            </p>

            <p className="mt-3 text-slate-300">{submittedReport.summary}</p>

            {!isOnline && (
              <p className="mt-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                Internet connection is unavailable. RescueMesh stored this SOS
                report on this device and will be ready to sync when
                connectivity returns.
              </p>
            )}

            {possibleDuplicate && (
              <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
                <p className="text-sm font-semibold text-orange-200">
                  Possible duplicate detected
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  RescueMesh found a similar report near{" "}
                  <span className="font-semibold text-white">
                    {possibleDuplicate.location}
                  </span>
                  . Responders can review both reports before dispatching
                  duplicate teams.
                </p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm font-semibold text-emerald-200">
                Recommended Resources
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {submittedReport.resourceNeeds.map((resource) => (
                  <span
                    key={resource}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-block rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
              >
                View in Command Center
              </Link>

              <Link
                href="/command"
                className="inline-block rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
              >
                View AI Action Plan
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}