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
  Clock,
  Phone,
  ChevronDown
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
      
      {/* A. Professional Top Info Bar (Directly matches the screenshot header) */}
      <div className="bg-[#0B1528] text-slate-200 text-[11px] sm:text-xs py-2.5 px-6 border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 font-bold" />
              <span className="font-medium">Metropolis Civic Center Plaza, Suite 100</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-200">Hotline: 0548367637</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Mon-Sat, 8.00-18.00. Sunday CLOSED</span>
          </div>
        </div>
      </div>

      {/* B. Main Navigation Bar (Matches the exact Elixir navigation bar aesthetic) */}
      <nav className="border-b border-slate-200 bg-white sticky top-[38px] sm:top-[37px] z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          {/* Logo on Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* Elegant Emblem logo structure inspired by reference */}
            <div className="relative flex items-center">
              <span className="text-2xl font-black text-[#0B1528] tracking-tighter flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-cblue-600 to-cblue-800 rounded-sm inline-block mr-1.5" />
                Civic<span className="text-cblue-600">Eye</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8b00] absolute -right-2 top-2 animate-pulse" />
            </div>
          </motion.div>
          
          {/* Menu items with subtle dropdown indicator (Exact match to reference menu style) */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <div className="flex items-center gap-1 hover:text-cblue-600 cursor-pointer transition">
              <span>Home</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 hover:text-cblue-600 cursor-pointer transition">
              <span>Reports Hub</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 hover:text-cblue-600 cursor-pointer transition">
              <span>Live Map</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 hover:text-cblue-600 cursor-pointer transition">
              <span>Agency Panel</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="hover:text-cblue-600 cursor-pointer transition">
              <span>Contact</span>
            </div>
            <div className="flex items-center gap-1 hover:text-cblue-600 cursor-pointer transition">
              <span>Docs</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Outlined Action Button on Right */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <button
              onClick={onGetStarted}
              className="bg-[#0B1528] hover:bg-slate-900 text-white font-bold text-xs py-2 px-4.5 rounded-full transition duration-300 shadow-sm cursor-pointer"
            >
              Report Issue
            </button>
            <button
              onClick={onLogin}
              className="border border-[#0B1528] hover:bg-[#0B1528] hover:text-white text-[#0B1528] font-bold text-xs py-2 px-4.5 rounded-full transition duration-300 cursor-pointer"
            >
              Access Portal
            </button>
          </motion.div>
        </div>
      </nav>

      {/* C. Corporate Hero Section (Exactly inspired by the uploaded visual mockup) */}
      <section className="relative bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Typography & Dual Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cblue-50/80 to-cgreen-50/80 text-cblue-800 border border-cblue-100 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest font-mono shadow-sm">
              <Sparkles className="w-3 h-3 text-[#ff8b00] animate-spin" style={{ animationDuration: "3s" }} /> 
              <span>Multimodal AI Dispatch Engine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold text-[#0B1528] leading-[1.1] tracking-tight">
              Civic Intelligence.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
              Over 98% accuracy in helping municipalities finding comprehensive solutions to public hazards and community issues.
            </p>

            {/* Blocky Corporate Buttons (Read more & Contact us equivalents in layout) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onGetStarted}
                className="bg-[#0B1528] hover:bg-slate-900 text-white font-bold px-7 py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider"
              >
                <span>Report Issue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onLogin}
                className="bg-[#FFC000] hover:bg-[#E5AC00] text-slate-950 font-bold px-7 py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider"
              >
                <span>Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cgreen-600 font-bold" />
                <span>Zero login needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cgreen-600 font-bold" />
                <span>Instant dispatch in &lt;15s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cgreen-600 font-bold" />
                <span>GPS geolocation</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High Quality Administrative Meeting / Consultant Image Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-2xl bg-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=1000" 
                alt="Civic Planners Collaborating" 
                className="w-full h-[380px] md:h-[450px] object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Modern soft layout overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Dynamic live feed widget floating elegantly */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur border border-slate-200/80 p-4 rounded-md shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cblue-50 text-cblue-600 rounded-full flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-[#ff8b00] animate-spin" style={{ animationDuration: "4s" }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Telemetry feed</span>
                    <span className="text-xs font-bold text-slate-800">Metropolis Infrastructure Monitor Active</span>
                  </div>
                </div>
                <span className="bg-cgreen-50 text-cgreen-700 text-[10px] font-bold px-2 py-0.5 rounded border border-cgreen-200">
                  SECURE CONNECTION
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Live Stats Section (Bento Grid Accent) */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-slate-200 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cblue-50 text-cblue-600 mb-1">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-cblue-600 block tracking-tight">12,480+</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Issues Resolved</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-slate-200 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cgreen-50 text-cgreen-600 mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-cgreen-600 block tracking-tight">98.7%</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">AI Accuracy rate</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-slate-200 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-[#ff8b00] mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 block tracking-tight">&lt; 15s</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Response processing</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="space-y-2 text-center p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-slate-200 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 block tracking-tight">340+</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Weekly Active Citizens</span>
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white px-6 py-20 max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1528] tracking-tight">How CivicEye Works</h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
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
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[2px] bg-slate-200 -z-10" />

          {/* Step 1 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-slate-50 border border-slate-200 p-6 rounded-md shadow-sm text-center space-y-5 relative group"
          >
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cblue-500/30 group-hover:text-cblue-500/60 transition-colors">
              PHASE 01
            </div>
            <div className="w-12 h-12 bg-[#0B1528] text-white rounded-sm flex items-center justify-center font-extrabold text-lg mx-auto shadow-md">
              1
            </div>
            <div className="p-4.5 bg-cblue-50 text-cblue-600 rounded-md w-max mx-auto border border-cblue-100/50">
              <Camera className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Snap &amp; Submit</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a clear photo of any street pothole, leakage, blackout, or hazard. Our platform captures accurate device GPS metadata automatically.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-slate-50 border border-slate-200 p-6 rounded-md shadow-sm text-center space-y-5 relative group"
          >
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cgreen-500/30 group-hover:text-cgreen-500/60 transition-colors">
              PHASE 02
            </div>
            <div className="w-12 h-12 bg-cgreen-600 text-white rounded-sm flex items-center justify-center font-extrabold text-lg mx-auto shadow-md">
              2
            </div>
            <div className="p-4.5 bg-cgreen-50 text-cgreen-600 rounded-md w-max mx-auto border border-cgreen-100/50">
              <Zap className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">AI Vision Analysis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gemini model reviews the photo instantly, analyzes risk grade, recommends urgent safety actions, and handles automatic agency routing.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-slate-50 border border-slate-200 p-6 rounded-md shadow-sm text-center space-y-5 relative group"
          >
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-corange-500/30 group-hover:text-corange-500/60 transition-colors">
              PHASE 03
            </div>
            <div className="w-12 h-12 bg-[#FFC000] text-slate-950 rounded-sm flex items-center justify-center font-extrabold text-lg mx-auto shadow-md">
              3
            </div>
            <div className="p-4.5 bg-amber-50 text-amber-600 rounded-md w-max mx-auto border border-amber-100/50">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Resolved &amp; Verified</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              City technicians claim the incident on their task panel. Track live dispatch status and follow comment dialogs until closure.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. Features Grid Section */}
      <section className="bg-slate-100 py-20 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">Smart Civic Features</h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
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
              className="bg-white p-6 rounded-md border border-slate-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cblue-500/10 text-cblue-600 rounded-xl shrink-0">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Vision Guarding</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automatically assesses severity risk, tags department relevance, and prevents mock report uploads.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white p-6 rounded-md border border-slate-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cgreen-500/10 text-cgreen-600 rounded-xl shrink-0">
                <MapPin className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Interactive Geo Map</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pinpoint exact coordinates effortlessly and view hazard density graphs with color-coded markers.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white p-6 rounded-md border border-slate-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cblue-500/10 text-cblue-600 rounded-xl shrink-0">
                <Building className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Municipal Panel</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enables dispatch staff to manage incident statuses, claim actions, and add progress comments easily.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white p-6 rounded-md border border-slate-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-[#FFC000]/10 text-[#E5AC00] rounded-xl shrink-0">
                <TrendingUp className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Analytical Summaries</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Visualize reports sorted by category, urgent priority, and average resolution times dynamically.
                </p>
              </div>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white p-6 rounded-md border border-slate-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-cblue-500/10 text-cblue-650 rounded-xl shrink-0">
                <MessageSquare className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Live Dispatch Chat</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Citizens and authorities discuss details directly on the report view to ensure perfect alignment.
                </p>
              </div>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white p-6 rounded-md border border-slate-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
                <Smartphone className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Real-time alerts</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  In-app updates and notification banners trigger instantly when an assigned dispatcher updates states.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer Credits */}
      <footer className="bg-[#0B1528] text-slate-400 text-xs py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cblue-600 to-cblue-800 rounded-sm flex items-center justify-center text-white font-extrabold text-base shadow-md">
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
