/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserProfile, Report } from "../types";
import { User, Mail, Shield, ShieldAlert, Award, Calendar, Bell, Sliders, Smartphone } from "lucide-react";

interface CitizenProfileProps {
  profile: UserProfile;
  reports: Report[];
  onLogout: () => void;
}

export default function CitizenProfile({ profile, reports, onLogout }: CitizenProfileProps) {
  const citizenReports = React.useMemo(() => {
    return reports.filter((r) => r.createdBy === profile.uid);
  }, [reports, profile.uid]);

  const stats = React.useMemo(() => {
    const total = citizenReports.length;
    const resolved = citizenReports.filter((r) => r.status === "Resolved" || r.status === "Closed").length;
    const pending = citizenReports.filter((r) => r.status === "Pending").length;
    return { total, resolved, pending };
  }, [citizenReports]);

  // Simple client-side preferences states
  const [prefEmail, setPrefEmail] = React.useState(true);
  const [prefSMS, setPrefSMS] = React.useState(false);
  const [prefContrast, setPrefContrast] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">Citizen Profile Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your reporter credentials, communication channels, and telemetry preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
          
          <div className="flex flex-col items-center text-center space-y-3 pt-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/10">
              {profile.displayName?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{profile.displayName}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-0.5 rounded-full mt-1.5">
                <Award className="w-3 h-3" /> {profile.role}
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono uppercase text-[10px]">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono uppercase text-[10px]">
                <Shield className="w-3.5 h-3.5" /> Security
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Active Credential</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono uppercase text-[10px]">
                <Calendar className="w-3.5 h-3.5" /> Registered
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Just Now"}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition border border-slate-200/50 dark:border-slate-800/50"
          >
            Sign Out of Portal
          </button>
        </div>

        {/* Right Column: Multi-Tabs Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Reporter Performance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-4 uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Reporter Activity Scorecard
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                <span className="text-2xl font-black text-slate-800 dark:text-white block">{stats.total}</span>
                <span className="text-[10px] text-slate-400 font-mono block uppercase mt-0.5">Submitted</span>
              </div>
              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-50 dark:border-emerald-950/50">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">{stats.resolved}</span>
                <span className="text-[10px] text-slate-400 font-mono block uppercase mt-0.5">Resolved</span>
              </div>
              <div className="bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-50 dark:border-amber-950/50">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">{stats.pending}</span>
                <span className="text-[10px] text-slate-400 font-mono block uppercase mt-0.5">In Progress</span>
              </div>
            </div>
          </div>

          {/* Section 2: Notifications Preference & Channels */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-4 uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Communications Preferences
            </h3>

            <div className="space-y-3.5">
              {/* Email alerts toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Email Notification Alerts</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Receive formal incident dispatch emails on status update.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefEmail}
                  onChange={(e) => setPrefEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                />
              </div>

              {/* SMS alerts toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">SMS Broadcast Telemetry</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Instant community broadcast SMS when emergency pins drop near you.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefSMS}
                  onChange={(e) => setPrefSMS(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                />
              </div>

              {/* Contrast layout toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg shrink-0 mt-0.5">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">High Contrast Map Mode</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Simplify telemetry graphics to absolute high-contrast values.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefContrast}
                  onChange={(e) => setPrefContrast(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
