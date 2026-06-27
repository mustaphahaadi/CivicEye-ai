/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Info, Navigation, ZoomIn, ZoomOut, AlertTriangle, HelpCircle } from "lucide-react";
import { Report } from "../types";

interface InteractiveCityMapProps {
  reports?: Report[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLat?: number;
  selectedLng?: number;
  readOnly?: boolean;
}

// Fixed coordinates of our virtual city (Metropolis)
// Map dimensions: width 100%, height 380px. Grid coordinates run from X: 0-100%, Y: 0-100%
// Lat runs from 40.7000 to 40.8000 (roughly 10km grid)
// Lng runs from -74.0500 to -73.9000
const MAP_LAT_MIN = 40.7000;
const MAP_LAT_MAX = 40.8000;
const MAP_LNG_MIN = -74.0500;
const MAP_LNG_MAX = -73.9000;

export function latLngToXY(lat: number, lng: number) {
  // Translate GPS coordinates to percentage width and height on the map
  const pctX = ((lng - MAP_LNG_MIN) / (MAP_LNG_MAX - MAP_LNG_MIN)) * 100;
  // Lat increases upwards, but Y coordinates in browser increase downwards
  const pctY = (1 - (lat - MAP_LAT_MIN) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100;
  return {
    x: Math.max(0, Math.min(100, pctX)),
    y: Math.max(0, Math.min(100, pctY)),
  };
}

export function xyToLatLng(x: number, y: number) {
  // Translate percentage width and height back to GPS coordinates
  const lng = MAP_LNG_MIN + (x / 100) * (MAP_LNG_MAX - MAP_LNG_MIN);
  const lat = MAP_LAT_MIN + (1 - y / 100) * (MAP_LAT_MAX - MAP_LAT_MIN);
  return { lat, lng };
}

export default function InteractiveCityMap({
  reports = [],
  onLocationSelect,
  selectedLat = 40.7500,
  selectedLng = -73.9800,
  readOnly = false,
}: InteractiveCityMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoveredReport, setHoveredReport] = React.useState<Report | null>(null);
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !onLocationSelect || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;
    
    const coords = xyToLatLng(pctX, pctY);
    onLocationSelect(coords.lat, coords.lng);
    setSelectedReport(null); // Close active popup when placing a new pin
  };

  // Convert current selected location coordinates to visual percentages
  const pinPos = latLngToXY(selectedLat, selectedLng);

  // Styling helper for status dots
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-600 ring-red-400";
      case "High": return "bg-orange-500 ring-orange-300";
      case "Medium": return "bg-amber-500 ring-amber-300";
      case "Low": return "bg-blue-500 ring-blue-300";
      default: return "bg-slate-500 ring-slate-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Road Damage": return "#2563EB"; // Blue
      case "Flooding": return "#0ea5e9"; // Sky Blue
      case "Illegal Dumping": return "#84cc16"; // Lime
      case "Water Leakage": return "#06b6d4"; // Cyan
      case "Power Outage": return "#eab308"; // Yellow
      case "Broken Streetlight": return "#a855f7"; // Purple
      case "Fire Hazard": return "#ef4444"; // Red
      case "Fallen Tree": return "#10b981"; // Emerald
      case "Sewage": return "#78350f"; // Brown
      default: return "#64748b"; // Slate
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-white relative">
      {/* Map Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Metropolis Municipal Telemetry System
          </span>
        </div>
        {!readOnly && (
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
            Click Grid to Drop Report Pin
          </span>
        )}
      </div>

      {/* Map Area */}
      <div
        ref={containerRef}
        onClick={handleMapClick}
        className={`relative w-full h-[360px] cursor-crosshair overflow-hidden select-none bg-[#0a0f1d]`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0),
            linear-gradient(to right, #111827 1px, transparent 1px),
            linear-gradient(to bottom, #111827 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 100px 100px, 100px 100px",
        }}
      >
        {/* Visual City Landmarks & Layout */}
        <div className="absolute top-10 left-12 opacity-10 font-mono text-sm tracking-widest uppercase select-none">North Expressway</div>
        <div className="absolute top-1/4 right-16 opacity-10 font-mono text-sm tracking-widest uppercase select-none">East Industrial Park</div>
        <div className="absolute bottom-12 left-16 opacity-10 font-mono text-sm tracking-widest uppercase select-none">West Residential Green</div>
        <div className="absolute bottom-1/4 right-1/3 opacity-10 font-mono text-sm tracking-widest uppercase select-none">Downtown Commercial Core</div>
        
        {/* River Overlay Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M -20 180 Q 200 120 400 240 T 900 200" fill="none" stroke="#2563eb" strokeWidth="24" strokeLinecap="round" />
          <path d="M 500 230 L 510 380" fill="none" stroke="#2563eb" strokeWidth="8" />
        </svg>

        {/* Existing Issues Pins */}
        {reports.map((report) => {
          const pos = latLngToXY(report.latitude, report.longitude);
          const isSelected = selectedReport?.id === report.id;
          return (
            <div
              key={report.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReport(isSelected ? null : report);
                }}
                onMouseEnter={() => setHoveredReport(report)}
                onMouseLeave={() => setHoveredReport(null)}
                className={`w-3.5 h-3.5 rounded-full ring-4 flex items-center justify-center transition-all ${
                  isSelected ? "scale-150 ring-white z-30 shadow-lg" : "scale-100 hover:scale-125 hover:ring-white"
                } ${getPriorityColor(report.priority)}`}
              />

              {/* Hover Tooltip */}
              {hoveredReport?.id === report.id && !isSelected && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-sans shadow-xl pointer-events-none whitespace-nowrap z-40">
                  <div className="font-semibold text-slate-200">{report.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(report.category) }} />
                    {report.category} | {report.priority}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Active Placement Marker (Draft Marker) */}
        {!readOnly && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full z-30 pointer-events-none transition-all duration-300"
            style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md shadow-lg border border-blue-400 mb-1 flex items-center gap-1">
                <span>NEW REPORT PIN</span>
              </div>
              <MapPin className="w-8 h-8 text-blue-500 fill-blue-500/20 drop-shadow-[0_4px_6px_rgba(37,99,235,0.4)] map-marker-pulse" />
            </div>
          </div>
        )}

        {/* Selected Pin Popover Detail */}
        {selectedReport && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-2xl z-40 transition-all text-slate-200">
            <div className="flex justify-between items-start gap-1 mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                selectedReport.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                selectedReport.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {selectedReport.status}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReport(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-mono font-bold"
              >
                ESC
              </button>
            </div>
            
            <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">{selectedReport.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{selectedReport.description}</p>
            
            {selectedReport.imageUrl && (
              <div className="h-20 w-full rounded bg-slate-950 overflow-hidden mb-3 border border-slate-800">
                <img src={selectedReport.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
              <span>CAT: <strong className="text-white">{selectedReport.category}</strong></span>
              <span>PRIORITY: <strong className="text-white">{selectedReport.priority}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Information */}
      <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row justify-between gap-1.5">
        <div className="flex items-center gap-3">
          <span>COORDS: LAT <strong className="text-white">{selectedLat.toFixed(4)}</strong>, LNG <strong className="text-white">{selectedLng.toFixed(4)}</strong></span>
          <span>DISTRICT: <strong className="text-white">Central Sector</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600 ring-2 ring-red-400" /> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 ring-2 ring-orange-300" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-300" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-300" /> Low
          </span>
        </div>
      </div>
    </div>
  );
}
