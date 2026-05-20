"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

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
  resourceNeeds?: string[];
  assignedResponder?: string;
  eta?: string;
  status: Status;
  createdAt: string;
  lat?: number;
  lng?: number;
};

const CrisisMap = dynamic(() => import("../components/CrisisMap"), {
  ssr: false,
});

const demoReports: Report[] = [
  {
    id: "RM-MAP-001",
    name: "Sofia Martinez",
    phone: "+1 555 0148",
    location: "Harbor District, Zone A",
    emergencyType: "Flood",
    peopleAffected: "4",
    details:
      "Water is rising quickly and one elderly person is trapped on the second floor.",
    priority: "Critical",
    summary:
      "Critical flood rescue needed. Four people affected, including one elderly person trapped on the second floor.",
    resourceNeeds: ["Evacuation team", "Rescue boat", "Medical responders"],
    assignedResponder: "Unassigned",
    eta: "Pending",
    status: "Pending",
    createdAt: "Demo data",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "RM-MAP-002",
    name: "Daniel Kim",
    phone: "+44 7700 900123",
    location: "North Bridge Evacuation Route",
    emergencyType: "Medical",
    peopleAffected: "1",
    details:
      "Person has chest pain and difficulty breathing. Medical response required urgently.",
    priority: "Critical",
    summary:
      "Critical medical emergency. One person has chest pain and breathing difficulty. Medical responders required immediately.",
    resourceNeeds: ["Medical responders", "Ambulance"],
    assignedResponder: "Medical Team Bravo",
    eta: "8 min",
    status: "Assigned",
    createdAt: "Demo data",
    lat: 40.7306,
    lng: -73.9352,
  },
  {
    id: "RM-MAP-003",
    name: "Amina Hassan",
    phone: "+61 400 123 456",
    location: "Central Community Shelter",
    emergencyType: "Food/Water",
    peopleAffected: "12",
    details:
      "A group of evacuees needs drinking water, food supplies, and basic hygiene kits.",
    priority: "Medium",
    summary:
      "Medium priority supply request. Twelve evacuees need drinking water, food supplies, and hygiene kits.",
    resourceNeeds: ["Food supplies", "Drinking water", "Hygiene kits"],
    assignedResponder: "Relief Team Delta",
    eta: "22 min",
    status: "Pending",
    createdAt: "Demo data",
    lat: 40.758,
    lng: -73.9855,
  },
  {
    id: "RM-MAP-004",
    name: "Luca Rossi",
    phone: "+39 06 5550 1212",
    location: "West Hills Residential Block",
    emergencyType: "Wildfire",
    peopleAffected: "7",
    details:
      "Smoke is spreading near homes. Several families need evacuation support.",
    priority: "High",
    summary:
      "High priority wildfire evacuation support needed near residential homes. Seven people affected.",
    resourceNeeds: ["Fire response team", "Evacuation support"],
    assignedResponder: "Fire Unit Echo",
    eta: "14 min",
    status: "In Progress",
    createdAt: "Demo data",
    lat: 40.7003,
    lng: -73.9875,
  },
];

function getPriorityStyle(priority: Priority) {
  if (priority === "Critical") {
    return "border-red-500/30 bg-red-500/15 text-red-300";
  }

  if (priority === "High") {
    return "border-orange-500/30 bg-orange-500/15 text-orange-300";
  }

  if (priority === "Medium") {
    return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
  }

  return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
}

function addFallbackCoordinates(report: Report, index: number): Report {
  return {
    ...report,
    lat: report.lat ?? 40.7128 + index * 0.015,
    lng: report.lng ?? -74.006 + index * 0.018,
    resourceNeeds: report.resourceNeeds ?? ["Field assessment team"],
    assignedResponder: report.assignedResponder ?? "Unassigned",
    eta: report.eta ?? "Pending",
  };
}

export default function CrisisMapPage() {
  const [reports, setReports] = useState<Report[]>(() => {
    if (typeof window === "undefined") {
      return demoReports.map(addFallbackCoordinates);
    }

    try {
      const storedReports: Report[] = JSON.parse(
        window.localStorage.getItem("rescuemesh-reports") || "[]"
      );

      return storedReports.length > 0
        ? storedReports.map(addFallbackCoordinates)
        : demoReports.map(addFallbackCoordinates);
    } catch {
      return demoReports.map(addFallbackCoordinates);
    }
  });

  const [selectedPriority, setSelectedPriority] = useState<"All" | Priority>(
    "All"
  );

  const filteredReports = useMemo(() => {
    if (selectedPriority === "All") return reports;
    return reports.filter((report) => report.priority === selectedPriority);
  }, [reports, selectedPriority]);

  const criticalCount = reports.filter(
    (report) => report.priority === "Critical"
  ).length;

  const activeZones = new Set(reports.map((report) => report.location)).size;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <Link href="/" className="text-sm text-slate-400 hover:text-white">
              ← Back to home
            </Link>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-red-400">
              Crisis Intelligence Map
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Emergency Situation Map
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Visualize active SOS reports, identify high-risk zones, and track
              assigned response teams across the disaster area.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Open Dashboard
            </Link>

            <Link
              href="/command"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-100 hover:bg-emerald-500/20"
            >
              AI Action Plan
            </Link>

            <Link
              href="/report"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
            >
              New SOS Report
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Mapped Reports</p>
            <h2 className="mt-2 text-4xl font-bold">
              {filteredReports.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-sm text-red-300">Critical Cases</p>
            <h2 className="mt-2 text-4xl font-bold">{criticalCount}</h2>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
            <p className="text-sm text-orange-300">Active Zones</p>
            <h2 className="mt-2 text-4xl font-bold">{activeZones}</h2>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm text-emerald-300">Map Mode</p>
            <h2 className="mt-2 text-2xl font-bold">Live Demo</h2>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
            <CrisisMap reports={filteredReports} />
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Map Feed</h2>

              <select
                value={selectedPriority}
                onChange={(event) =>
                  setSelectedPriority(event.target.value as "All" | Priority)
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none"
              >
                <option>All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="mt-5 space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-white/10 bg-slate-900 p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                        report.priority
                      )}`}
                    >
                      {report.priority}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {report.emergencyType}
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold">{report.location}</h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {report.summary}
                  </p>

                  <div className="mt-3 grid gap-1 text-xs text-slate-400">
                    <p>
                      <span className="text-slate-200">Responder:</span>{" "}
                      {report.assignedResponder ?? "Unassigned"}
                    </p>

                    <p>
                      <span className="text-slate-200">ETA:</span>{" "}
                      {report.eta ?? "Pending"}
                    </p>

                    <p>
                      <span className="text-slate-200">Status:</span>{" "}
                      {report.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}