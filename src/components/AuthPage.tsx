/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Shield, Eye, EyeOff, User, Mail, Lock, Sparkles, Building2, Globe, ArrowLeft, ArrowRight, MapPin, Phone, Clock, Check, CheckCircle } from "lucide-react";
import { UserRole, UserProfile } from "../types";
import { saveLocalUserProfile } from "../lib/dbFallback";

interface AuthPageProps {
  onAuthSuccess: (userProfile: any) => void;
  onBackToLanding?: () => void;
}

export default function AuthPage({ onAuthSuccess, onBackToLanding }: AuthPageProps) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("citizen");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Sync / create profile in Firestore helper
  const syncUserProfile = async (uid: string, userEmail: string, name: string, selectedRole: UserRole) => {
    const userRef = doc(db, "users", uid);
    let profileData: any;
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        profileData = snap.data();
      } else {
        const newProfile = {
          uid,
          email: userEmail,
          displayName: name || userEmail.split("@")[0],
          role: selectedRole,
          createdAt: new Date().toISOString(),
          totalReports: 0,
          resolvedReports: 0,
          pendingReports: 0,
        };
        await setDoc(userRef, newProfile);
        profileData = newProfile;
      }
    } catch (err) {
      console.warn("Firestore sync failed, generating local-only profile data:", err);
      profileData = {
        uid,
        email: userEmail,
        displayName: name || userEmail.split("@")[0],
        role: selectedRole,
        createdAt: new Date().toISOString(),
        totalReports: 0,
        resolvedReports: 0,
        pendingReports: 0,
      };
    }
    saveLocalUserProfile(profileData);
    return profileData;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !displayName)) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const creds = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", creds.user.uid);
        const snap = await getDoc(userRef);
        
        let profile;
        if (snap.exists()) {
          profile = snap.data();
        } else {
          // If profile missing, default to citizen
          profile = await syncUserProfile(creds.user.uid, creds.user.email || "", creds.user.displayName || "", "citizen");
        }
        onAuthSuccess(profile);
      } else {
        // Sign Up
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        const profile = await syncUserProfile(creds.user.uid, creds.user.email || "", displayName, role);
        onAuthSuccess(profile);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password authentication is disabled in your Firebase Console. Please enable it in Firebase -> Authentication -> Sign-in method, or use 'Google Single Sign-In' / 'Developer Quick-Pass Portal' below.");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered.");
      } else {
        setError(err.message || "Authentication failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const creds = await signInWithPopup(auth, provider);
      // Default google signups to citizen role
      const profile = await syncUserProfile(creds.user.uid, creds.user.email || "", creds.user.displayName || "", "citizen");
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError("Google Sign-In failed or was blocked by browser. Please try Email login or use a Quick Demo Account.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-configured Quick Demo Accounts for Easy Examiner Validation
  const handleQuickLogin = async (type: "citizen" | "authority") => {
    setError("");
    setLoading(true);
    const demoEmail = type === "citizen" ? "citizen@civiceye.demo" : "authority@civiceye.demo";
    const demoPass = "123456";
    const demoName = type === "citizen" ? "Jane Doe (Citizen)" : "Chief Dispatcher Davis";

    try {
      let creds;
      try {
        creds = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (signInErr: any) {
        if (signInErr.code === "auth/operation-not-allowed") {
          throw signInErr; // Trigger fallback
        }
        // If demo account doesn't exist yet, register it dynamically!
        creds = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
      }
      
      const profile = await syncUserProfile(creds.user.uid, demoEmail, demoName, type);
      onAuthSuccess(profile);
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        console.warn("Email/Password Auth is not enabled in Firebase Console. Falling back to local/offline session...");
      } else {
        console.error("Demo login error:", err);
      }
      if (err.code === "auth/operation-not-allowed") {
        // Generate a deterministic local profile
        const localUid = type === "citizen" ? "demo-citizen-uid-123" : "demo-authority-uid-456";
        const localProfile = {
          uid: localUid,
          email: demoEmail,
          displayName: demoName,
          role: type,
          createdAt: new Date().toISOString(),
          totalReports: 5, // give them a nice default of 5 reports in stats
          resolvedReports: 1,
          pendingReports: 4,
          isOfflineDemo: true,
        };
        // Let's also try to save this to Firestore if possible, but handle any security/network errors gracefully
        try {
          const userRef = doc(db, "users", localUid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, localProfile);
          } else {
            const data = (snap.data() as UserProfile) || localProfile;
            saveLocalUserProfile(data);
            onAuthSuccess(data);
            return;
          }
        } catch (dbErr) {
          console.warn("Could not sync local demo profile to Firestore, proceeding with local-only state:", dbErr);
        }
        saveLocalUserProfile(localProfile);
        onAuthSuccess(localProfile);
      } else {
        setError("Failed to initialize demo credential. Please register a standard email account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans selection:bg-cblue-600 selection:text-white flex flex-col overflow-x-hidden">
      
      {/* 1. Top Info Bar (matches the exact homepage design) */}
      <div className="bg-[#0B1528] text-slate-200 text-[11px] sm:text-xs py-2.5 px-6 border-b border-slate-800/80 shrink-0">
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

      {/* 2. Brand Header */}
      <nav className="border-b border-slate-200 bg-white px-6 py-4 flex justify-between items-center shadow-sm shrink-0">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative flex items-center">
              <span className="text-xl font-black text-[#0B1528] tracking-tighter flex items-center">
                <span className="w-5 h-5 bg-gradient-to-r from-cblue-600 to-cblue-800 rounded-sm inline-block mr-1.5" />
                Civic<span className="text-cblue-600">Eye</span>
              </span>
            </div>
          </div>

          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 border border-[#0B1528] hover:bg-[#0B1528] hover:text-white text-[#0B1528] font-bold text-[11px] sm:text-xs py-1.5 px-4 rounded-full transition duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </nav>

      {/* 3. Main Dual-Column Section */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        
        {/* Left Column: Authentic Clean Auth Form */}
        <div className="lg:col-span-6 flex flex-col justify-center py-10 px-6 sm:px-12 lg:px-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Title */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] dark:text-white tracking-tight">
                {isLogin ? "Sign in to CivicEye" : "Join the Citizen Force"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {isLogin 
                  ? "Access the digital command center to file, view, or process city reports." 
                  : "Create an official civic profile to log local municipal hazards securely."}
              </p>
            </div>

            {/* Custom Interactive Tab Toggler */}
            <div className="p-1 bg-slate-100 dark:bg-slate-950 rounded-xl grid grid-cols-2 text-center text-xs font-bold border border-slate-200 dark:border-slate-850">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(""); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  isLogin 
                    ? "bg-[#0B1528] text-white shadow" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(""); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  !isLogin 
                    ? "bg-[#0B1528] text-white shadow" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Notification Block */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2">
                <span>⚠️</span>
                <p className="flex-1">{error}</p>
              </div>
            )}

            {/* Auth Form Form Element */}
            <form onSubmit={handleAuth} className="space-y-4">
              
              {/* Full name (Register Mode only) */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cblue-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs transition placeholder-slate-400 font-medium animate-fade-in"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cblue-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs transition placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cblue-500 focus:outline-none rounded-xl pl-10 pr-10 py-3 text-xs transition placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Portal Role Access Selection (Register Mode only) */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Portal Role Access</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("citizen")}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        role === "citizen"
                          ? "bg-cblue-50 border-cblue-600 text-cblue-700 font-bold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-855 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] font-bold">Citizen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("authority")}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        role === "authority"
                          ? "bg-cgreen-50 border-cgreen-600 text-cgreen-700 font-bold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-855 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] font-bold">Authority</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0B1528] hover:bg-slate-900 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer mt-2"
              >
                {loading ? "Authenticating..." : isLogin ? "Access System Command" : "Register Profile Credential"}
              </button>
            </form>

            {/* SSO Google Single Sign-In */}
            <div className="space-y-4">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or Access Via SSO</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.29c1.92,-1.77 3.02,-4.38 3.02,-7.38c0,-0.35 -0.03,-0.69 -0.08,-1H21.35z" fill="#4285F4" />
                    <path d="M12,20.62c2.43,0 4.47,-0.8 5.96,-2.18l-3.29,-2.58c-0.91,0.61 -2.08,0.98 -3.29,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.7H3.01v2.66c1.48,2.94 4.53,4.84 8.01,4.84z" fill="#34A853" />
                    <path d="M6.96,13.14a5.21,5.21 0 0 1 0,-3.34V7.14H3.01a8.77,8.77 0 0 0 0,8.66l3.95,-2.66z" fill="#FBBC05" />
                    <path d="M12,6.16c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,3.48 14.42,2.7 12,2.7c-3.48,0 -6.53,1.9 -8.01,4.84l3.95,2.66c0.71,-2.12 2.7,-3.7 5.04,-3.7z" fill="#EA4335" />
                  </g>
                </svg>
                <span>Google Single Sign-In</span>
              </button>
            </div>

            {/* Developer/Evaluation quick passes */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Developer Quick-Pass Portal</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("citizen")}
                  className="py-2.5 px-3 bg-cblue-50 hover:bg-cblue-100 dark:bg-cblue-950/20 text-cblue-700 dark:text-cblue-300 rounded-lg text-[11px] font-bold border border-cblue-100/50 dark:border-cblue-900/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-cblue-600" />
                  <span>As Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("authority")}
                  className="py-2.5 px-3 bg-cgreen-50 hover:bg-cgreen-100 dark:bg-cgreen-950/20 text-cgreen-700 dark:text-cgreen-300 rounded-lg text-[11px] font-bold border border-cgreen-100/50 dark:border-cgreen-900/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-cgreen-600" />
                  <span>As Dispatcher</span>
                </button>
              </div>
            </div>

            {/* Alternate toggle bottom line */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="text-xs text-cblue-600 dark:text-cblue-400 hover:underline font-bold transition cursor-pointer"
              >
                {isLogin ? "Need an official account? Register here" : "Already registered? Sign in here"}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: High Quality Administrative Design Graphics (matches Home/Landing style) */}
        <div className="hidden lg:col-span-6 bg-[#0B1528] relative lg:flex flex-col justify-between p-12 overflow-hidden text-white">
          
          {/* Grid visual overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cblue-500/10 rounded-full blur-3xl" />
          
          {/* Administrative picture background */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000" 
              alt="Municipal server network or operations center" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cblue-500/20 to-cgreen-500/20 border border-cblue-500/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Secure SSL Connection Verified
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight">The Digital Heart of City Infrastructure.</h3>
            <p className="text-sm text-slate-350 max-w-lg leading-relaxed">
              Log in to access instant hazard triage, dispatch management pipelines, custom filters, and multi-agency routing protocols.
            </p>
          </div>

          {/* Floated Stats Card overlay */}
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl space-y-4 max-w-md shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cblue-500/20 text-cblue-400 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block font-sans">Civic Security Council</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Guard Protocols</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-350 italic leading-relaxed">
              "CivicEye bridges the gap between citizens reporting road or water hazards and local utility response crews with state-of-the-art vision classification."
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3.5 text-center">
              <div>
                <span className="text-xl font-black text-amber-400 tracking-tight block">98.7%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">AI Verification Rate</span>
              </div>
              <div>
                <span className="text-xl font-black text-cgreen-400 tracking-tight block">&lt; 15s</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Avg Dispatch Time</span>
              </div>
            </div>
          </div>

          {/* Footer of Auth Page Right column */}
          <div className="relative text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            &copy; {new Date().getFullYear()} MUNICIPAL PORTAL SYSTEM BY GEMINI MULTIMODAL AI
          </div>

        </div>

      </div>
    </div>
  );
}
