"use client";

import { useEffect } from "react";
import "@/app/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

type AccommodationType =
  | "Traditional Residential"
  | "Faith-Affiliated"
  | "Large Flagship"
  | "Womens College"
  | "University Hall"
  | "University Residence"
  | "Graduate Residence"
  | "Private Residence";

export type AccommodationCollege = {
  id: string;
  name: string;
  university: string;
  city: string;
  state: string;
  type: AccommodationType;
  weeklyPrice: number;
  lat: number;
  lng: number;
  summary: string;
  interviewAngle: string[];
  website?: string;
  catered: boolean;
  distanceToCampus: string;
  contract: string;
  vibe: string;
  tags: string[];
};


const typeColors: Record<AccommodationType, string> = {
  "Traditional Residential": "#3b82f6",
  "Faith-Affiliated": "#a855f7",
  "Large Flagship": "#f59e0b",
  "Womens College": "#ec4899",
  "University Hall": "#22c55e",
  "University Residence": "#64748b",
  "Graduate Residence": "#6366f1",
  "Private Residence": "#06b6d4",
};

function createMarkerIcon(color: string) {
  return new L.DivIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 9999px;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 6px 18px rgba(15,23,42,0.22);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function ResetControl({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    const resetControl = new L.Control({
      position: "bottomright" as L.ControlPosition,
    });

    resetControl.onAdd = function () {
      const button = L.DomUtil.create("button", "");
      button.innerHTML = "Reset";
      button.style.background = "white";
      button.style.border = "1px solid #dbe3ee";
      button.style.borderRadius = "12px";
      button.style.padding = "8px 12px";
      button.style.fontSize = "12px";
      button.style.fontWeight = "600";
      button.style.color = "#334155";
      button.style.boxShadow = "0 8px 20px rgba(15,23,42,0.08)";
      button.style.cursor = "pointer";

      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.on(button, "click", () => {
        map.setView(center, zoom);
      });

      return button;
    };

    resetControl.addTo(map);

    return () => {
      resetControl.remove();
    };
  }, [map, center, zoom]);

  return null;
}

export default function AccommodationMap({
  colleges,
  onSelectCollege,
}: {
  colleges: AccommodationCollege[];
  onSelectCollege?: (id: string) => void;
}) {
  const center: [number, number] = [-25.8, 134.8];
  const zoom = 4;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full"
        style = {{ height: "440px"}}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {colleges.map((college) => (
          <Marker
            key={college.id}
            position={[college.lat, college.lng]}
            icon={createMarkerIcon(typeColors[college.type])}
          >
            <Popup>
              <div className="min-w-56">
                <p className="text-sm font-bold text-slate-900">
                  {college.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {college.university} • {college.city}
                </p>
                <p className="mt-2 text-xs text-slate-600">{college.type}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  From ${college.weeklyPrice}/week
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  {college.summary}
                </p>
                {onSelectCollege ? (
                  <button
                    onClick={() => onSelectCollege(college.id)}
                    className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    View details
                  </button>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}

        <ResetControl center={center} zoom={zoom} />
      </MapContainer>

      <div className="grid gap-2 border-t border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(typeColors).map(([label, color]) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs text-slate-600"
          >
            <span
              className="h-3 w-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}