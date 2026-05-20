"use client";

import Link from "next/link";
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
};

const demoReports: Report[] = [
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
];

function getResourceNeeds(report: Report) {
  if (report.resourceNeeds && report.resourceNeeds.length > 0) {
    return report.resourceNeeds;
  }

  const text = `${report.emergencyType} ${report.details}`.toLowerCase();
  const resources = new Set<string>();

  if (text.includes("flood") || text.includes("water") || text.includes("trapped")) {
    resources.add("Evacuation team");
    resources.add("Rescue boat");
  }

  if (
    text.includes("medical") ||
    text.includes("chest pain") ||
    text.includes("breathing") ||
    text.includes("injured") ||
    text.includes("bleeding")
  ) {
    resources.add("Medical responders");
    resources.add("Ambulance");
  }

  if (text.includes("food") || text.includes("drinking water") || text.includes("hygiene")) {
    resources.add("Food supplies");
    resources.add("Drinking water");
    resources.add("Hygiene kits");
  }

  if (text.includes("fire") || text.includes("wildfire") || text.includes("smoke")) {
    resources.add("Fire response team");
    resources.add("Evacuation support");
  }

  if (resources.size === 0) {
    resources.add("Field assessment team");
  }

  return Array.from(resources);
}

function getPriorityWeight(priority: Priority) {
  if (priority === "Critical") return 4;
  if (priority === "High") return 3;
  if (priority === "Medium") return 2;
  return 1;
}

function normalizeReport(report: Report): Report {
  return {
    ...report,
    resourceNeeds: report.resourceNeeds ?? getResourceNeeds(report),
    assignedResponder: report.assignedResponder ?? "Unassigned",
    eta: report.eta ?? "Pending",
  };
}

function generateActionPlan(reports: Report[]) {
  const activeReports = reports.filter(
    (report) => report.status !== "Rescued" && report.status !== "Closed"
  );

  const sortedReports = [...activeReports].sort(
    (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
  );

  const topCases = sortedReports.slice(0, 4);

  const resourceCounts: Record<string, number> = {};

  activeReports.forEach((report) => {
    getResourceNeeds(report).forEach((resource) => {
      resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
    });
  });

  const resourceList = Object.entries(resourceCounts).sort((a, b) => b[1] - a[1]);

  const critical = activeReports.filter((report) => report.priority === "Critical").length;
  const high = activeReports.filter((report) => report.priority === "High").length;
  const unassigned = activeReports.filter(
    (report) => !report.assignedResponder || report.assignedResponder === "Unassigned"
  ).length;

  const peopleAffected = activeReports.reduce(
    (sum, report) => sum + Number(report.peopleAffected || 0),
    0
  );

  return {
    activeReports,
    topCases,
    resourceList,
    critical,
    high,
    unassigned,
    peopleAffected,
  };
}

function getPriorityStyle(priority: Priority) {
  if (priority === "Critical") return "border-red-500/30 bg-red-500/15 text-red-300";
  if (priority === "High") return "border-orange-500/30 bg-orange-500/15 text-orange-300";
  if (priority === "Medium") return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
  return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
}

export default function CommandPage() {
  const [reports, setReports] = useState<Report[]>(() => {
    if (typeof window === "undefined") {
      return demoReports.map(normalizeReport);
    }

    try {
      const storedReports: Report[] = JSON.parse(
        window.localStorage.getItem("rescuemesh-reports") || "[]"
      );

      return storedReports.length > 0
        ? storedReports.map(normalizeReport)
        : demoReports.map(normalizeReport);
    } catch {
      return demoReports.map(normalizeReport);
    }
  });

  const plan = useMemo(() => generateActionPlan(reports), [reports]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <Link href="/" className="text-sm text-slate-400 hover:text-white">
              ← Back to home
            </Link>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.3em] text-red-400">
              AI Command Center
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Rescue Action Plan
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              RescueMesh converts scattered SOS reports into an operational
              action plan with priority sequence, resource demand, assignments,
              and response strategy.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Dashboard
            </Link>

            <Link
              href="/map"
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Crisis Map
            </Link>

            <Link
              href="/report"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
            >
              New SOS Report
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Active Reports</p>
            <h2 className="mt-2 text-4xl font-bold">
              {plan.activeReports.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-sm text-red-300">Critical</p>
            <h2 className="mt-2 text-4xl font-bold">{plan.critical}</h2>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
            <p className="text-sm text-orange-300">High Priority</p>
            <h2 className="mt-2 text-4xl font-bold">{plan.high}</h2>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
            <p className="text-sm text-blue-300">Unassigned</p>
            <h2 className="mt-2 text-4xl font-bold">{plan.unassigned}</h2>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm text-emerald-300">People Affected</p>
            <h2 className="mt-2 text-4xl font-bold">{plan.peopleAffected}</h2>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Recommended Response Sequence</h2>

            <div className="mt-6 space-y-5">
              {plan.topCases.map((report, index) => (
                <article
                  key={report.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500 text-lg font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
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

                        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                          {report.assignedResponder ?? "Unassigned"}
                        </span>

                        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
                          ETA: {report.eta ?? "Pending"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold">{report.location}</h3>

                      <p className="mt-2 text-slate-300">{report.summary}</p>

                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                        <p className="text-sm font-semibold text-red-200">
                          Recommended action
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          Dispatch {getResourceNeeds(report).join(", ")}.{" "}
                          {report.assignedResponder === "Unassigned"
                            ? "This case is not assigned yet and should be routed immediately."
                            : `${report.assignedResponder} is assigned with ETA ${report.eta}.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold">Resource Demand</h2>

              <div className="mt-5 space-y-3">
                {plan.resourceList.map(([resource, count]) => (
                  <div
                    key={resource}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900 p-4"
                  >
                    <span className="font-medium">{resource}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-950">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
              <h2 className="text-2xl font-bold">AI Situation Brief</h2>

              <p className="mt-4 text-slate-300">
                Current operation includes {plan.activeReports.length} active
                emergency reports affecting approximately {plan.peopleAffected}{" "}
                people. Prioritize {plan.critical} critical case
                {plan.critical === 1 ? "" : "s"} first.
              </p>

              <p className="mt-4 text-slate-300">
                {plan.unassigned > 0
                  ? `${plan.unassigned} active case${
                      plan.unassigned === 1 ? " is" : "s are"
                    } still unassigned. Assign response teams before routing lower-priority supply requests.`
                  : "All active cases have assigned responders. Continue monitoring ETA, status changes, and resource shortages."}
              </p>

              <p className="mt-4 text-slate-300">
                Recommended strategy: stabilize life-threatening cases, dispatch
                evacuation and medical resources, then route relief supplies to
                shelters and affected zones.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}