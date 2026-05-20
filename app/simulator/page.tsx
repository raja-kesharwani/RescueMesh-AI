"use client";

import Link from "next/link";
import { useState } from "react";

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
  lat: number;
  lng: number;
};

const disasterScenario: Report[] = [
  {
    id: "RM-SIM-001",
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
    status: "Pending",
    createdAt: "Simulation",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "RM-SIM-002",
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
    status: "Assigned",
    createdAt: "Simulation",
    lat: 40.7306,
    lng: -73.9352,
  },
  {
    id: "RM-SIM-003",
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
    status: "Pending",
    createdAt: "Simulation",
    lat: 40.758,
    lng: -73.9855,
  },
  {
    id: "RM-SIM-004",
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
    status: "In Progress",
    createdAt: "Simulation",
    lat: 40.7003,
    lng: -73.9875,
  },
  {
    id: "RM-SIM-005",
    name: "Noah Williams",
    phone: "+1 555 0199",
    location: "East Tunnel Underpass",
    emergencyType: "Trapped",
    peopleAffected: "3",
    details:
      "Three people are trapped inside a vehicle near a flooded underpass. Water level is increasing.",
    priority: "Critical",
    summary:
      "Critical trapped-person rescue near flooded underpass. Three people are inside a vehicle with rising water.",
    resourceNeeds: ["Evacuation team", "Rescue boat", "Medical responders"],
    status: "Pending",
    createdAt: "Simulation",
    lat: 40.742,
    lng: -74.02,
  },
  {
    id: "RM-SIM-006",
    name: "Maya Chen",
    phone: "+65 8123 4567",
    location: "South Relief Camp",
    emergencyType: "Shelter",
    peopleAffected: "25",
    details:
      "Families displaced by flooding need temporary shelter, blankets, clean water, and medical screening.",
    priority: "Critical",
    summary:
      "Critical shelter and relief request affecting twenty-five displaced people. Shelter, water, blankets, and screening needed.",
    resourceNeeds: [
      "Shelter support",
      "Drinking water",
      "Medical responders",
      "Relief supplies",
    ],
    status: "Pending",
    createdAt: "Simulation",
    lat: 40.688,
    lng: -73.965,
  },
];

export default function SimulatorPage() {
  const [loaded, setLoaded] = useState(false);

  function startSimulation() {
    localStorage.setItem(
      "rescuemesh-reports",
      JSON.stringify(disasterScenario)
    );

    setLoaded(true);
  }

  function clearSimulation() {
    localStorage.removeItem("rescuemesh-reports");
    setLoaded(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          ← Back to home
        </Link>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400">
            Demo Disaster Simulator
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Launch a Live Crisis Scenario
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-slate-300">
            Load a realistic emergency dataset into RescueMesh AI. This lets
            judges instantly test the dashboard, crisis map, resource matching,
            and AI action plan without manually submitting reports.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
              <p className="text-sm text-red-300">Scenario</p>
              <h2 className="mt-2 text-2xl font-bold">Urban Flood</h2>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-orange-300">Reports</p>
              <h2 className="mt-2 text-2xl font-bold">6 SOS Cases</h2>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-sm text-emerald-300">Features Tested</p>
              <h2 className="mt-2 text-2xl font-bold">4 Modules</h2>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={startSimulation}
              className="rounded-xl bg-red-500 px-6 py-4 font-semibold text-white hover:bg-red-600"
            >
              Start Simulation
            </button>

            <button
              onClick={clearSimulation}
              className="rounded-xl border border-white/10 px-6 py-4 font-semibold text-white hover:bg-white/10"
            >
              Clear Simulation
            </button>
          </div>

          {loaded && (
            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
              <p className="font-semibold text-emerald-300">
                Simulation loaded successfully.
              </p>

              <p className="mt-2 text-slate-300">
                Open the dashboard, map, or AI action plan to see RescueMesh AI
                respond to the crisis.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"
                >
                  Open Dashboard
                </Link>

                <Link
                  href="/map"
                  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Open Crisis Map
                </Link>

                <Link
                  href="/command"
                  className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-100 hover:bg-emerald-500/20"
                >
                  Open AI Action Plan
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}