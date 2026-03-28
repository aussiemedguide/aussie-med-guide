"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "@/app/leaflet.css";
import { ExternalLink, MapPin } from "lucide-react";

type TacKey = "vtac" | "satac" | "qtac" | "uac" | "tisc" | "direct";

type SchoolData = {
  id: string;
  name: string;
  shortName: string;
  university: string;
  state: string;
  tac: TacKey;
  ranking: number;
  places: number;
  campus: string;
  lat: number;
  lng: number;
  officialUrl: string;
  metroAtar?: string;
  ruralAtar?: string;
  noUcat?: boolean;
};

type TacMeta = Record<
  TacKey,
  {
    label: string;
    pill: string;
    soft: string;
    border: string;
  }
>;

const TAC_HEX: Record<TacKey, string> = {
  vtac: "#2563eb",
  satac: "#059669",
  qtac: "#f43f5e",
  uac: "#0891b2",
  tisc: "#7c3aed",
  direct: "#475569",
};

function getTacHex(tac: TacKey) {
  return TAC_HEX[tac] ?? "#475569";
}

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: ${color};
        border: 2px solid #ffffff;
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.24);
        display: block;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

function ResetMapView({ schools }: { schools: SchoolData[] }) {
  const map = useMap();

  useEffect(() => {
    if (!schools.length) return;

    if (schools.length === 1) {
      map.setView([schools[0].lat, schools[0].lng], 7);
      return;
    }

    const bounds = L.latLngBounds(
      schools.map((school) => [school.lat, school.lng] as [number, number])
    );

    map.fitBounds(bounds, { padding: [40, 40] });
  }, [schools, map]);

  return null;
}

export default function MedicalSchoolsMap({
  schools,
  tacMeta,
  onSelectSchool,
}: {
  schools: SchoolData[];
  tacMeta: TacMeta;
  onSelectSchool: (id: string) => void;
}) {
  return (
    <div className="h-96 w-full overflow-hidden rounded-3xl border border-slate-200">
      <MapContainer
        center={[-25.2744, 133.7751]}
        zoom={4}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ResetMapView schools={schools} />

        {schools.map((school) => {
          const color = getTacHex(school.tac);

          return (
            <Marker
              key={school.id}
              position={[school.lat, school.lng]}
              icon={makeIcon(color)}
            >
              <Popup>
                <div className="min-w-56 space-y-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {tacMeta[school.tac].label}
                      </span>
                    </div>

                    <p className="text-base font-bold text-slate-900">
                      {school.shortName}
                    </p>
                    <p className="text-xs text-slate-500">{school.university}</p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-700">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {school.campus}, {school.state}
                    </p>
                    <p>Places: {school.places}</p>
                    <p>Metro ATAR: {school.metroAtar ?? "N/A"}</p>
                    <p>Rural ATAR: {school.ruralAtar ?? "N/A"}</p>
                    <p>{school.noUcat ? "No UCAT" : "UCAT pathway"}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectSchool(school.id)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      View Details
                    </button>

                    <a
                      href={school.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Official
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}