/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getDocs, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile, Report } from "./types";
import { getLocalReports, saveLocalReports, getLocalUserProfile } from "./lib/dbFallback";

import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import CitizenDashboard from "./components/CitizenDashboard";
import ReportIssuePage from "./components/ReportIssuePage";
import AdminDashboard from "./components/AdminDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CitizenProfile from "./components/CitizenProfile";
import AIChatbot from "./components/AIChatbot";

import {
  Globe,
  Building2,
  AlertOctagon,
  TrendingUp,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Bot
} from "lucide-react";

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [authLoading, setAuthLoading] = React.useState(true);

  // Navigation page: 'landing' | 'auth' | 'citizen_dashboard' | 'report_issue' | 'admin_dashboard' | 'analytics' | 'profile'
  const [activePage, setActivePage] = React.useState<string>("landing");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Subscribe to Auth state changed
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch additional profile data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data() as UserProfile;
            setProfile(profileData);
            
            // Route to appropriate dashboard
            if (profileData.role === "authority") {
              setActivePage("admin_dashboard");
            } else {
              setActivePage("citizen_dashboard");
            }
          } else {
            // Check local fallback
            const localProf = getLocalUserProfile(firebaseUser.uid);
            if (localProf) {
              setProfile(localProf);
              setActivePage(localProf.role === "authority" ? "admin_dashboard" : "citizen_dashboard");
            } else {
              // Safe fallback if document hasn't synced yet
              const fallbackProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Citizen",
                role: "citizen",
                createdAt: new Date().toISOString(),
              };
              setProfile(fallbackProfile);
              setActivePage("citizen_dashboard");
            }
          }
        } catch (err) {
          console.error("Failed to restore user profile:", err);
          const localProf = getLocalUserProfile(firebaseUser.uid);
          if (localProf) {
            setProfile(localProf);
            setActivePage(localProf.role === "authority" ? "admin_dashboard" : "citizen_dashboard");
          } else {
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Citizen",
              role: "citizen",
              createdAt: new Date().toISOString(),
            };
            setProfile(fallbackProfile);
            setActivePage("citizen_dashboard");
          }
        }
      } else {
        setUser(null);
        setProfile(null);
        setActivePage("landing");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Reports collection in Firestore in real-time
  React.useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Report[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Report);
      });
      setReports(items);
      saveLocalReports(items);
    }, (error) => {
      console.warn("Real-time reports listener failed, falling back to standard fetch.", error);
      // Fallback without orderBy
      getDocs(collection(db, "reports")).then((snapshot) => {
        const items: Report[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Report);
        });
        const sorted = items.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
        setReports(sorted);
        saveLocalReports(sorted);
      }).catch((fetchErr) => {
        console.warn("Standard fetch for reports failed, using LocalStorage fallback:", fetchErr);
        const localItems = getLocalReports();
        setReports(localItems);
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setActivePage("landing");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const handleAuthSuccess = (userProfile: UserProfile) => {
    setProfile(userProfile);
    if (userProfile.role === "authority") {
      setActivePage("admin_dashboard");
    } else {
      setActivePage("citizen_dashboard");
    }
  };

  // Render navigation lists based on role
  const navLinks = React.useMemo(() => {
    if (!profile) return [];
    if (profile.role === "authority") {
      return [
        { id: "admin_dashboard", label: "Incident Command", icon: Building2 },
        { id: "analytics", label: "Analytical Center", icon: TrendingUp },
        { id: "profile", label: "Profile Settings", icon: User },
      ];
    } else {
      return [
        { id: "citizen_dashboard", label: "Reporter Dashboard", icon: Globe },
        { id: "report_issue", label: "File Incident Pin", icon: PlusCircle },
        { id: "analytics", label: "Analytical Center", icon: TrendingUp },
        { id: "profile", label: "Profile Settings", icon: User },
      ];
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 mx-auto animate-bounce">
            C
          </div>
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading Civic Telemetry...
          </p>
        </div>
      </div>
    );
  }

  // Pure Landing Page View
  if (activePage === "landing" && !user) {
    return (
      <LandingPage
        onGetStarted={() => setActivePage("auth")}
        onLogin={() => setActivePage("auth")}
      />
    );
  }

  // Pure Authentication Panel View
  if (activePage === "auth" && !user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row relative">
      
      {/* 1. Mobile Top Bar Header */}
      <header className="md:hidden bg-[#0F172A] border-b border-slate-800 px-4 py-3 flex justify-between items-center shrink-0 w-full z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Civic<span className="text-blue-500">Eye</span> AI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* 2. Responsive Dashboard Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] border-r border-slate-800/80 text-white flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:block"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Civic<span className="text-blue-500">Eye</span> AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links scroller */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isSelected = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/10 text-blue-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isSelected ? "text-blue-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Identity Profile Badge */}
        {profile && (
          <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold shrink-0 text-white">
                {profile.displayName?.slice(0, 2).toUpperCase() || "JD"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{profile.displayName}</p>
                <p className="text-xs text-slate-400 truncate">
                  {profile.role === "authority" ? "Verified Dispatcher" : "Verified Citizen"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-slate-400 hover:text-red-400 rounded-md flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Portal Logout</span>
          </button>
        </div>
      </aside>

      {/* Side overlay background for mobile menus */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* 3. Main Dashboard Layout Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {activePage === "citizen_dashboard" && profile && (
          <CitizenDashboard
            profile={profile}
            reports={reports}
            onNewReportClick={() => setActivePage("report_issue")}
          />
        )}

        {activePage === "report_issue" && profile && (
          <ReportIssuePage
            profile={profile}
            reports={reports}
            onReportCreated={() => setActivePage("citizen_dashboard")}
            onNavigateToDashboard={() => setActivePage("citizen_dashboard")}
          />
        )}

        {activePage === "admin_dashboard" && profile && (
          <AdminDashboard
            profile={profile}
            reports={reports}
            onReportsUpdated={(updated) => setReports(updated)}
          />
        )}

        {activePage === "analytics" && (
          <AnalyticsDashboard reports={reports} />
        )}

        {activePage === "profile" && profile && (
          <CitizenProfile
            profile={profile}
            reports={reports}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* 4. AI-Powered Chatbot Overlay Integration */}
      {profile && <AIChatbot reports={reports} />}
    </div>
  );
}
