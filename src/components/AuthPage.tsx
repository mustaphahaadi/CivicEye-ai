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
import { Shield, Eye, EyeOff, User, Mail, Lock, Sparkles, Building2, Globe } from "lucide-react";
import { UserRole } from "../types";

interface AuthPageProps {
  onAuthSuccess: (userProfile: any) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
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
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data();
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
      return newProfile;
    }
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
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
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
      } catch (signInErr) {
        // If demo account doesn't exist yet, register it dynamically!
        creds = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
      }
      
      const profile = await syncUserProfile(creds.user.uid, demoEmail, demoName, type);
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError("Failed to initialize demo credential. Please register a standard email account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        {/* Logo */}
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 mx-auto">
          C
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isLogin ? "Sign in to CivicEye Portal" : "Join CivicEye Citizen Force"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLogin ? "Access smart city analytical reporting dashboards." : "Create your credential to log local hazards with AI verification."}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2 animate-[shake_0.5s_ease-in-out]">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Core Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Display Name for Sign-Up */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
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
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-2xl pl-10 pr-4 py-3 text-sm transition"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
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
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-2xl pl-10 pr-4 py-3 text-sm transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
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
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-2xl pl-10 pr-10 py-3 text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selection for signup */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Portal Role Access</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      role === "citizen"
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("authority")}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      role === "authority"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-500"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs">Authority</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl transition shadow-md shadow-blue-500/10 mt-2"
            >
              {loading ? "Authenticating..." : isLogin ? "Sign In to System" : "Create Citizen Account"}
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs font-mono uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or Continue With</span>
            </div>
          </div>

          {/* Google SSO Popup button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl font-medium text-sm text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-2"
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

          {/* Quick Demo Login Option for Hackathon / Evaluation convenience */}
          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider text-center mb-3 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" /> Developer Quick-Pass Portal
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin("citizen")}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold border border-blue-100 dark:border-blue-900 transition flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>As Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("authority")}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-100 dark:border-emerald-900 transition flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>As Dispatcher</span>
              </button>
            </div>
          </div>

          {/* Toggle login vs register link */}
          <div className="text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
