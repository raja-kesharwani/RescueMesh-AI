"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

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

function createPriorityIcon(priority: Priority) {
  const color =
    priority === "Critical"
      ? "#ef4444"
      : priority === "High"
      ? "#f97316"
      : priority === "Medium"
      ? "#eab308"
      : "#22c55e";

  return L.divIcon({
    className: "custom-priority-marker",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: ${color};
        border: 3px solid white;
        border-radius: 9999px;
        box-shadow: 0 0 18px ${color};
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);

  return null;
}

export default function CrisisMap({ reports }: { reports: Report[] }) {
  return (
    <div className="h-[620px] w-full overflow-hidden rounded-xl bg-slate-900">
      <MapContainer
        center={[40.7306, -73.9352]}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <ResizeMap />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat ?? 40.7128, report.lng ?? -74.006]}
            icon={createPriorityIcon(report.priority)}
          >
            <Popup>
              <div style={{ maxWidth: 280 }}>
                <strong>{report.priority} Priority</strong>

                <p style={{ marginTop: 6, marginBottom: 6 }}>
                  {report.location}
                </p>

                <p style={{ marginTop: 6, marginBottom: 6 }}>
                  {report.summary}
                </p>

                <p style={{ marginTop: 6, marginBottom: 6 }}>
                  <strong>Status:</strong> {report.status}
                </p>

                <p style={{ marginTop: 6, marginBottom: 6 }}>
                  <strong>Responder:</strong>{" "}
                  {report.assignedResponder ?? "Unassigned"}
                </p>

                <p style={{ marginTop: 6, marginBottom: 6 }}>
                  <strong>ETA:</strong> {report.eta ?? "Pending"}
                </p>

                {report.resourceNeeds && report.resourceNeeds.length > 0 && (
                  <p style={{ marginTop: 6, marginBottom: 0 }}>
                    <strong>Resources:</strong>{" "}
                    {report.resourceNeeds.join(", ")}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}