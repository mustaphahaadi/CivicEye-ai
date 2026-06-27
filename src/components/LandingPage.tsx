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
  Smartphone,
  Check,
  Activity,
  MessageSquare,
  FileText,
  Clock
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans selection:bg-cblue-600 selection:text-white overflow-x-hidden">
      {/* 1. Header Navigation Bar */}
      <nav className="border-b border-slate-200/60 dark:border-slate-900/60 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl shadow-sm">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cblue-600 to-cblue-700 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-cblue-500/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-950 dark:text-white text-lg tracking-tight leading-none">CivicEye</span>
              <span className="w-2 h-2 rounded-full bg-cgreen-500 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-cblue-600 dark:text-cblue-400 uppercase tracking-widest font-bold block mt-0.5">Smart Governance</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={onLogin}
            className="text-slate-600 dark:text-slate-300 hover:text-cblue-600 dark:hover:text-cblue-400 font-semibold text-sm transition py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60"
          >
            Portal Login
          </button>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="bg-cblue-600 hover:bg-cblue-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-cblue-500/15 hover:shadow-cblue-500/25"
          >
            <span>Report Issue</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative px-6 py-12 md:py-20 max-w-7xl mx-auto">
        {/* Subtle, beautiful ambient gradients */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cblue-500/10 dark:bg-cblue-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-cgreen-500/10 dark:bg-cgreen-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cblue-500/10 to-cgreen-500/10 dark:from-cblue-500/20 dark:to-cgreen-500/20 text-cblue-700 dark:text-cblue-300 border border-cblue-200/40 dark:border-cblue-800/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-corange-500 animate-spin" style={{ animationDuration: "3s" }} /> 
              <span>Multimodal AI Dispatch Engine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 dark:text-white leading-[1.1] tracking-tight">
              The AI-Powered Eyes <br />
              Of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cblue-600 to-cgreen-600 dark:from-cblue-400 dark:to-cgreen-400">Smart City</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              CivicEye empowers citizens to log community hazards in real-time. In seconds, our advanced Gemini vision system analyzes photos, checks severity, extracts location details, and dispatches the file directly to city workforces.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="bg-gradient-to-r from-cblue-600 to-cblue-700 hover:from-cblue-700 hover:to-cblue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-cblue-500/20 hover:shadow-cblue-500/30 transition-all flex items-center justify-center gap-3.5 text-base"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogin}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Municipal Portal Login</span>
              </motion.button>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-slate-400 dark:text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cgreen-500" />
                <span>Zero login needed to file</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cgreen-500" />
                <span>Instant routing in &lt;15s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cgreen-500" />
                <span>Precise GPS geolocation</span>
              </div>
            </div>
          </motion.div>

          {/* Elegant Interactive Hero Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Soft decorative blur circles behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cblue-500 to-cgreen-600 rounded-[32px] blur opacity-10 dark:opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            
            <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cblue-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Header inside simulated device */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-corange-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-corange-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-cgreen-500" />
                </div>
                <div className="bg-slate-950 px-3 py-1 rounded-full text-[10px] text-slate-400 font-mono tracking-wider border border-slate-800">
                  CIVIC-AI // MONITOR
                </div>
              </div>

              {/* Fake AI Image Scan simulation */}
              <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center mb-4 group">
                {/* Background high-quality hazard image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-all duration-700" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600')" }} 
                />
                
                {/* Scanner scanline effect */}
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-cblue-500 via-cgreen-400 to-corange-500 animate-[bounce_3.5s_infinite] shadow-[0_0_8px_#0052cc] z-10" />

                <div className="absolute top-3 left-3 bg-corange-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-widest flex items-center gap-1 shadow-lg z-10">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> CRITICAL INCIDENT DETECTED
                </div>

                {/* Target box */}
                <div className="absolute border-2 border-dashed border-corange-500/80 w-32 h-32 rounded-lg flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-mono bg-corange-600 text-white px-1.5 py-0.5 rounded absolute -top-4 font-bold">WATER_BURST</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur border border-slate-800 text-white p-3 rounded-xl max-w-[210px] shadow-lg z-10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-corange-500" />
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block">Vision Classification</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-100 block">Main Water Pipeline Leakage</span>
                  <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-slate-800/80">
                    <span className="text-[9px] font-mono text-cgreen-400 font-bold">98.4% Confidence</span>
                  </div>
                </div>
              </div>

              {/* Fake AI Analytics Status lines */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-cblue-400" />
                    <span className="text-slate-400">Assigned Department:</span>
                  </div>
                  <span className="font-semibold text-white">Water Authority Dispatch</span>
                </div>
                <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-corange-500 animate-pulse" />
                    <span className="text-slate-400">Risk Severity Rank:</span>
                  </div>
                  <span className="font-semibold text-corange-500 uppercase tracking-tight">Level 5 (Severe)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Live Stats Section (Bento Grid Accent) */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/60 py-12 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cblue-50 dark:bg-cblue-950/40 text-cblue-600 dark:text-cblue-400 mb-1">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-cblue-600 dark:text-cblue-400 block tracking-tight">12,480+</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Issues Resolved</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cgreen-50 dark:bg-cgreen-800/10 text-cgreen-600 dark:text-cgreen-400 mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-cgreen-600 dark:text-cgreen-400 block tracking-tight">98.7%</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">AI Accuracy rate</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-corange-100/50 dark:bg-corange-900/10 text-corange-500 mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-corange-600 block tracking-tight">&lt; 15s</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Response processing</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 block tracking-tight">340+</span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Weekly Active Citizens</span>
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">How CivicEye Works</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Connecting community eyes with municipal actions in three high-speed steps.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Elegant connecting line for desktop flow */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[2px] bg-slate-200 dark:bg-slate-800/80 -z-10" />

          {/* Step 1 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm text-center space-y-5 relative group"
          >
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cblue-500/30 dark:text-cblue-400/20 group-hover:text-cblue-500/60 transition-colors">
              PHASE 01
            </div>
            <div className="w-12 h-12 bg-cblue-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto shadow-lg shadow-cblue-500/20">
              1
            </div>
            <div className="p-4.5 bg-cblue-50 dark:bg-cblue-950/40 text-cblue-600 dark:text-cblue-400 rounded-2xl w-max mx-auto border border-cblue-100/50 dark:border-cblue-900/30">
              <Camera className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Snap &amp; Submit</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload a clear photo of any street pothole, leakage, blackout, or hazard. Our platform captures accurate device GPS metadata automatically.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm text-center space-y-5 relative group"
          >
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cgreen-500/30 dark:text-cgreen-400/20 group-hover:text-cgreen-500/60 transition-colors">
              PHASE 02
            </div>
            <div className="w-12 h-12 bg-cgreen-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto shadow-lg shadow-cgreen-500/20">
              2
            </div>
            <div className="p-4.5 bg-cgreen-50 dark:bg-cgreen-950/40 text-cgreen-600 dark:text-cgreen-400 rounded-2xl w-max mx-auto border border-cgreen-100/50 dark:border-cgreen-900/30">
              <Zap className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">AI Vision Analysis</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gemini model reviews the photo instantly, analyzes risk grade, recommends urgent safety actions, and handles automatic agency routing.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm text-center space-y-5 relative group"
          >
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-corange-500/30 dark:text-corange-400/20 group-hover:text-corange-500/60 transition-colors">
              PHASE 03
            </div>
            <div className="w-12 h-12 bg-corange-500 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto shadow-lg shadow-corange-500/20">
              3
            </div>
            <div className="p-4.5 bg-corange-50 dark:bg-corange-950/40 text-corange-600 dark:text-corange-400 rounded-2xl w-max mx-auto border border-corange-100/50 dark:border-corange-900/30">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Resolved &amp; Verified</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              City technicians claim the incident on their task panel. Track live dispatch status and follow comment dialogs until closure.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. Features Grid Section */}
      <section className="bg-slate-100 dark:bg-slate-900/30 py-20 px-6 border-t border-slate-200/60 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">Smart Civic Features</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Advanced administrative widgets tailored for modern digital municipal infrastructure.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cblue-500/10 text-cblue-600 dark:text-cblue-400 rounded-xl shrink-0">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Vision Guarding</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Automatically assesses severity risk, tags department relevance, and prevents mock report uploads.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cgreen-500/10 text-cgreen-600 dark:text-cgreen-400 rounded-xl shrink-0">
                <MapPin className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Interactive Geo Map</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pinpoint exact coordinates effortlessly and view hazard density graphs with color-coded markers.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cblue-500/10 text-cblue-600 dark:text-cblue-400 rounded-xl shrink-0">
                <Building className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Municipal Panel</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enables dispatch staff to manage incident statuses, claim actions, and add progress comments easily.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-corange-500/10 text-corange-500 dark:text-corange-400 rounded-xl shrink-0">
                <TrendingUp className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Analytical Summaries</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Visualize reports sorted by category, urgent priority, and average resolution times dynamically.
                </p>
              </div>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-corange-500/10 text-corange-650 dark:text-corange-400 rounded-xl shrink-0">
                <MessageSquare className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Live Dispatch Chat</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Citizens and authorities discuss details directly on the report view to ensure perfect alignment.
                </p>
              </div>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-corange-500/10 text-corange-500 dark:text-corange-400 rounded-xl shrink-0">
                <Smartphone className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Real-time alerts</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  In-app updates and notification banners trigger instantly when an assigned dispatcher updates states.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6. CTA Footer */}
      <section className="bg-gradient-to-r from-cblue-700 via-cblue-800 to-cblue-900 text-white py-20 px-6 text-center relative overflow-hidden">
        {/* Modern decorative background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cblue-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Build a Safer, <br />
            Smarter Community Together?
          </h2>
          <p className="text-cblue-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto opacity-90">
            Submit your first report in seconds without creating an account, or log in to track updates in real-time.
          </p>
          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="bg-white hover:bg-slate-50 text-cblue-700 font-extrabold px-10 py-4 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-2.5 mx-auto text-base"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 7. Footer Credits */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cblue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base shadow-md">
              C
            </div>
            <div>
              <span className="font-extrabold text-slate-200 tracking-tight block text-sm">CivicEye System</span>
              <span className="text-[9px] font-mono text-slate-500">MUNICIPAL HUB</span>
            </div>
          </div>
          <p className="text-slate-500 text-center md:text-right">&copy; {new Date().getFullYear()} Municipal Smart City Infrastructure Council. Built with Gemini Multimodal AI.</p>
        </div>
      </footer>
    </div>
  );
}
