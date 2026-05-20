"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
};

const sampleReports: Report[] = [
  {
    id: "RM-DEMO-001",
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
  },
  {
    id: "RM-DEMO-002",
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
  },
  {
    id: "RM-DEMO-003",
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
  },
  {
    id: "RM-DEMO-004",
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
  },
];

const responderTeams = [
  "Unassigned",
  "Rescue Team Alpha",
  "Medical Team Bravo",
  "Evacuation Team Charlie",
  "Relief Team Delta",
  "Fire Unit Echo",
  "Field Assessment Team",
];

const etaOptions = [
  "Pending",
  "5 min",
  "8 min",
  "12 min",
  "15 min",
  "20 min",
  "30 min",
  "45 min",
];

function getPriorityStyle(priority: Priority) {
  if (priority === "Critical") {
    return "bg-red-500/15 text-red-300 border-red-500/30";
  }

  if (priority === "High") {
    return "bg-orange-500/15 text-orange-300 border-orange-500/30";
  }

  if (priority === "Medium") {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
  }

  return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
}

function getStatusStyle(status: Status) {
  if (status === "Rescued") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }

  if (status === "Assigned") {
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  }

  if (status === "In Progress") {
    return "bg-purple-500/15 text-purple-300 border-purple-500/30";
  }

  if (status === "Closed") {
    return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }

  return "bg-red-500/15 text-red-300 border-red-500/30";
}

function normalizeReport(report: Report): Report {
  return {
    ...report,
    resourceNeeds: report.resourceNeeds ?? ["Field assessment team"],
    assignedResponder: report.assignedResponder ?? "Unassigned",
    eta: report.eta ?? "Pending",
  };
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");

  useEffect(() => {
    try {
      const storedReports: Report[] = JSON.parse(
        localStorage.getItem("rescuemesh-reports") || "[]"
      );

      if (storedReports.length === 0) {
        setReports(sampleReports);
      } else {
        setReports(storedReports.map(normalizeReport));
      }
    } catch {
      setReports(sampleReports);
    }
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesPriority && matchesStatus;
    });
  }, [reports, priorityFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      active: reports.filter(
        (report) => report.status !== "Rescued" && report.status !== "Closed"
      ).length,
      critical: reports.filter((report) => report.priority === "Critical")
        .length,
      pending: reports.filter((report) => report.status === "Pending").length,
      assigned: reports.filter((report) => report.status === "Assigned").length,
      rescued: reports.filter((report) => report.status === "Rescued").length,
      peopleAffected: reports.reduce(
        (sum, report) => sum + Number(report.peopleAffected || 0),
        0
      ),
    };
  }, [reports]);

  function saveRealReports(updatedReports: Report[]) {
    const realReports = updatedReports.filter(
      (report) => !report.id.startsWith("RM-DEMO")
    );

    localStorage.setItem("rescuemesh-reports", JSON.stringify(realReports));
  }

  function updateStatus(reportId: string, newStatus: Status) {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, status: newStatus } : report
    );

    setReports(updatedReports);
    saveRealReports(updatedReports);
  }

  function updateAssignment(
    reportId: string,
    field: "assignedResponder" | "eta",
    value: string
  ) {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, [field]: value } : report
    );

    setReports(updatedReports);
    saveRealReports(updatedReports);
  }

  function loadDemoData() {
    setReports(sampleReports);
  }

  function clearReports() {
    localStorage.removeItem("rescuemesh-reports");
    setReports([]);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <Link href="/" className="text-sm text-slate-400 hover:text-white">
              ← Back to home
            </Link>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-red-400">
              RescueMesh Command Center
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Live Emergency Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Monitor SOS reports, prioritize critical cases, assign responders,
              track rescue progress, and coordinate resources in real time.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/report"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
            >
              New SOS Report
            </Link>

            <Link
              href="/command"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-100 hover:bg-emerald-500/20"
            >
              AI Action Plan
            </Link>

            <Link
              href="/map"
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Crisis Map
            </Link>

            <button
              onClick={loadDemoData}
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Load Demo
            </button>

            <button
              onClick={clearReports}
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 hover:bg-white/10"
            >
              Clear
            </button>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Total Reports</p>
            <h2 className="mt-2 text-4xl font-bold">{stats.total}</h2>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
            <p className="text-sm text-blue-300">Active</p>
            <h2 className="mt-2 text-4xl font-bold">{stats.active}</h2>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-sm text-red-300">Critical</p>
            <h2 className="mt-2 text-4xl font-bold">{stats.critical}</h2>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
            <p className="text-sm text-orange-300">Assigned</p>
            <h2 className="mt-2 text-4xl font-bold">{stats.assigned}</h2>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm text-emerald-300">People Affected</p>
            <h2 className="mt-2 text-4xl font-bold">
              {stats.peopleAffected}
            </h2>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold">SOS Reports</h2>
              <p className="mt-1 text-sm text-slate-400">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value as "All" | Priority)
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
              >
                <option>All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "All" | Status)
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Rescued</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {filteredReports.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-slate-900 p-8 text-center text-slate-400">
                No reports found. Submit an SOS report or load demo data.
              </div>
            )}

            {filteredReports.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                          report.priority
                        )}`}
                      >
                        {report.priority}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {report.emergencyType}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold">
                      {report.location}
                    </h3>

                    <p className="mt-2 text-slate-300">{report.summary}</p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-400 md:grid-cols-2">
                      <p>
                        <span className="text-slate-200">Reporter:</span>{" "}
                        {report.name}
                      </p>

                      <p>
                        <span className="text-slate-200">Phone:</span>{" "}
                        {report.phone}
                      </p>

                      <p>
                        <span className="text-slate-200">
                          People affected:
                        </span>{" "}
                        {report.peopleAffected}
                      </p>

                      <p>
                        <span className="text-slate-200">Created:</span>{" "}
                        {report.createdAt}
                      </p>

                      <p>
                        <span className="text-slate-200">Responder:</span>{" "}
                        {report.assignedResponder ?? "Unassigned"}
                      </p>

                      <p>
                        <span className="text-slate-200">ETA:</span>{" "}
                        {report.eta ?? "Pending"}
                      </p>
                    </div>

                    <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      {report.details}
                    </p>

                    {report.resourceNeeds && report.resourceNeeds.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-200">
                          Recommended Resources
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {report.resourceNeeds.map((resource) => (
                            <span
                              key={resource}
                              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="min-w-64 rounded-xl border border-white/10 bg-white/5 p-4">
                    <label className="text-sm text-slate-400">
                      Update Status
                    </label>

                    <select
                      value={report.status}
                      onChange={(event) =>
                        updateStatus(report.id, event.target.value as Status)
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    >
                      <option>Pending</option>
                      <option>Assigned</option>
                      <option>In Progress</option>
                      <option>Rescued</option>
                      <option>Closed</option>
                    </select>

                    <div className="mt-4">
                      <label className="text-sm text-slate-400">
                        Assigned Responder
                      </label>

                      <select
                        value={report.assignedResponder ?? "Unassigned"}
                        onChange={(event) =>
                          updateAssignment(
                            report.id,
                            "assignedResponder",
                            event.target.value
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      >
                        {responderTeams.map((team) => (
                          <option key={team}>{team}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm text-slate-400">
                        Estimated Arrival
                      </label>

                      <select
                        value={report.eta ?? "Pending"}
                        onChange={(event) =>
                          updateAssignment(report.id, "eta", event.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      >
                        {etaOptions.map((eta) => (
                          <option key={eta}>{eta}</option>
                        ))}
                      </select>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      Assign teams and ETA to simulate emergency response
                      coordination.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}