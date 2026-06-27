/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  Shield,
  Eye,
  Camera,
  Compass,
  Zap,
  CheckCircle,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Building,
  ArrowRight,
  Sparkles,
  Smartphone
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <nav className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            C
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight block">CivicEye</span>
            <span className="text-[9px] font-mono text-blue-500 uppercase tracking-widest font-semibold block">Smart Governance</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onLogin}
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium text-sm transition py-2 px-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Portal Login
          </button>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
          >
            <span>Report Issue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Glowing Background Blobs */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Powered by Gemini 2.5 Flash
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              The AI-Powered Eyes <br />
              Of Your <span className="text-blue-600 dark:text-blue-400 relative">Smart City</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              CivicEye empowers citizens to report community hazards—potholes, leakages, and blackouts. In seconds, Gemini AI analyzes images, classifies severity, and dispatches files directly to appropriate city departments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onLogin}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-7 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5"
              >
                <span>Municipal Agency Portal</span>
              </button>
            </div>
          </div>

          {/* Interactive Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gradient-to-tr from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
              
              {/* Fake AI Image Scan simulation */}
              <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center group mb-4">
                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600')" }} />
                
                {/* Visual scan bar */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 animate-[bounce_3s_infinite] shadow-[0_0_10px_#2563eb]" />

                <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-widest flex items-center gap-1 shadow">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> CRITICAL INCIDENT
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur border border-slate-800 text-white p-2.5 rounded-xl max-w-[200px] shadow-lg">
                  <span className="text-[8px] font-mono text-slate-400 block uppercase">Category</span>
                  <span className="text-[11px] font-bold text-slate-200 block">Burst Water Pipe</span>
                  <span className="text-[8px] font-mono text-emerald-400 block mt-1 uppercase">Gemini Match Confidence</span>
                  <span className="text-[11px] font-bold text-emerald-300 block">98.4% Accuracy</span>
                </div>
              </div>

              {/* Fake AI Analytics Status lines */}
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400">Target Dept:</span>
                  </div>
                  <span className="font-semibold text-white">Water Company Dispatch</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-400">Risk Severity:</span>
                  </div>
                  <span className="font-semibold text-red-400 uppercase">Emergency Flood Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Stats Section */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 block">12,480+</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Resolved Reports</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 block">98.7%</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">AI Classification Conf</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 block">&lt; 15s</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Average Processing Time</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 block">340+</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Active Monthly Users</span>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">How CivicEye Works</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Three simple steps to connect community eyes with municipal actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-500/10">
              1
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl w-max mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Snap &amp; Submit</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload a clear photo of the incident (pothole, leakage, fallen tree) from your device. Your browser automatically records accurate GPS coordinates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-emerald-500/10">
              2
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl w-max mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">AI Inspection &amp; Route</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gemini 2.5 Flash reviews the image and description, categorizes the emergency level, formulates instructions, and immediately routes it to the correct department.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-indigo-500/10">
              3
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl w-max mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Municipal Dispatch</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dispatched city crews resolve the report. You receive live SMS and in-app alerts as the status transitions from Pending to Resolved and Closed.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Features Grid Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Smart Civic Features</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Advanced administrative utilities tailored for modern digital municipal infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Image Inspection</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Advanced vision analysis automatically assesses severity risk, confirms evidence veracity, and prevents duplicate report filing.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Interactive Blueprint Maps</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pinpoint exact coordinates easily and visualize city-wide hazard density layers with color-coded status indices.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Agency Dashboards</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Empower municipality dispatchers with search parameters, urgency filters, and rapid state transitions.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start">
              <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Analytical Aggregators</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Visualize reports by categories, priorities, and resolution timescales directly to optimize budget allocations.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start">
              <div className="p-2.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Citizen Chatbot</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Citizens can interact with our smart chatbot to inquire about file states, municipal advice, or local guidance dynamically.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start">
              <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Export &amp; Share Links</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Download high-quality print PDF summaries or share immediate progress statuses with neighbors via QR code scans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Footer */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Ready to Build a Safer, <br />
            Smarter Community Together?
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-lg mx-auto">
            Get started today. File your first incident report anonymously or create a registered profile to track active dispatch progress.
          </p>
          <div className="pt-4">
            <button
              onClick={onGetStarted}
              className="bg-white hover:bg-slate-50 text-blue-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer Credits */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold text-slate-200">CivicEye System</span>
          </div>
          <p className="text-slate-500">&copy; {new Date().getFullYear()} Municipal Smart City Infrastructure Council. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
