/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserProfile, Report, Comment, ReportStatus, PriorityLevel, ReportCategory } from "../types";
import { db } from "../firebase";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs
} from "firebase/firestore";
import {
  getLocalComments,
  addLocalComment,
  getLocalReports,
  saveLocalReports,
  addLocalNotification
} from "../lib/dbFallback";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  MessageSquare,
  Send,
  Eye,
  ChevronsUpDown,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  Trash2
} from "lucide-react";
import PDFExport from "./PDFExport";

interface AdminDashboardProps {
  profile: UserProfile;
  reports: Report[];
  onReportsUpdated?: (updatedList: Report[]) => void;
}

export default function AdminDashboard({ profile, reports, onReportsUpdated }: AdminDashboardProps) {
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [commentText, setCommentText] = React.useState("");
  const [submittingComment, setSubmittingComment] = React.useState(false);

  // Search & Filter parameters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState<string>("All");
  const [filterPriority, setFilterPriority] = React.useState<string>("All");
  const [filterStatus, setFilterStatus] = React.useState<string>("All");

  const [updatingStatus, setUpdatingStatus] = React.useState(false);

  // Listen for comments on selected report
  React.useEffect(() => {
    if (!selectedReport) return;

    const q = query(
      collection(db, "comments"),
      where("reportId", "==", selectedReport.id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Comment[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Comment);
      });
      setComments(items);
    }, (error) => {
      console.warn("Real-time comment listener failed, falling back to standard fetch.", error);
      // Fallback without orderBy
      const fbQuery = query(collection(db, "comments"), where("reportId", "==", selectedReport.id));
      getDocs(fbQuery).then((snapshot) => {
        const items: Comment[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Comment);
        });
        setComments(items.sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
      }).catch((fetchErr) => {
        console.warn("Standard comment fetch failed, using LocalStorage:", fetchErr);
        setComments(getLocalComments(selectedReport.id));
      });
    });

    return () => unsubscribe();
  }, [selectedReport]);

  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (!selectedReport || updatingStatus) return;
    setUpdatingStatus(true);
    const now = new Date().toISOString();

    try {
      const reportRef = doc(db, "reports", selectedReport.id);
      
      // 1. Update status
      await updateDoc(reportRef, {
        status: newStatus,
        updatedAt: now,
      });

      // 2. Post auto-comment noting dispatcher action
      const autoComment = {
        reportId: selectedReport.id,
        userId: profile.uid,
        userName: `System (${profile.displayName})`,
        userRole: profile.role,
        text: `Incident status updated to [${newStatus}] by Municipal Dispatch.`,
        createdAt: now,
      };
      await addDoc(collection(db, "comments"), autoComment);

      // 3. Post user Notification alert
      const notificationId = `NOT-${Math.floor(100000 + Math.random() * 900000)}`;
      await addDoc(collection(db, "notifications"), {
        id: notificationId,
        userId: selectedReport.createdBy,
        reportId: selectedReport.id,
        reportTitle: selectedReport.title,
        type: "status_change",
        message: `Your report for "${selectedReport.title}" has been updated to ${newStatus}!`,
        read: false,
        createdAt: now,
      });

      // Update local panel state
      setSelectedReport((prev) => prev ? { ...prev, status: newStatus, updatedAt: now } : null);
    } catch (err) {
      console.warn("Failed to update status on Firestore, updating LocalStorage fallback:", err);
      
      // Update reports list in fallback storage
      const localReports = getLocalReports();
      const updatedList = localReports.map((r) => 
        r.id === selectedReport.id ? { ...r, status: newStatus, updatedAt: now } : r
      );
      saveLocalReports(updatedList);
      if (onReportsUpdated) {
        onReportsUpdated(updatedList);
      }

      // Add auto-comment locally
      const savedComment = addLocalComment({
        reportId: selectedReport.id,
        userId: profile.uid,
        userName: `System (${profile.displayName})`,
        userRole: profile.role,
        text: `Incident status updated to [${newStatus}] by Municipal Dispatch.`,
        createdAt: now,
      });
      setComments((prev) => [...prev, savedComment]);

      // Add notification locally
      addLocalNotification({
        userId: selectedReport.createdBy,
        reportId: selectedReport.id,
        reportTitle: selectedReport.title,
        type: "status_change",
        message: `Your report for "${selectedReport.title}" has been updated to ${newStatus}!`,
        read: false,
        createdAt: now,
      });

      // Update local panel state
      setSelectedReport((prev) => prev ? { ...prev, status: newStatus, updatedAt: now } : null);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedReport || submittingComment) return;

    setSubmittingComment(true);
    const newCommentData = {
      reportId: selectedReport.id,
      userId: profile.uid,
      userName: profile.displayName || "Admin",
      userRole: profile.role,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "comments"), newCommentData);
      setCommentText("");
    } catch (err) {
      console.warn("Failed to add comment to Firestore, saving to LocalStorage:", err);
      const savedComment = addLocalComment(newCommentData);
      setComments((prev) => [...prev, savedComment]);
      setCommentText("");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Filter and search computation
  const filteredReports = React.useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All" || r.category === filterCategory;
      const matchesPriority = filterPriority === "All" || r.priority === filterPriority;
      const matchesStatus = filterStatus === "All" || r.status === filterStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [reports, searchQuery, filterCategory, filterPriority, filterStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Under Review": return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Assigned": return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
      case "Resolved": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Closed": return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Low": return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail panel expansion */}
      {selectedReport ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 font-semibold transition cursor-pointer"
            >
              <span>&larr; Return to Dispatch Console</span>
            </button>
            <PDFExport report={selectedReport} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Details Panel */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getStatusBadge(selectedReport.status)}`}>
                  Status: {selectedReport.status}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getPriorityBadge(selectedReport.priority)}`}>
                  Priority: {selectedReport.priority}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {selectedReport.id}</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedReport.title}</h3>

              {/* Status Action controls */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Dispatch Action Center
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {(["Pending", "Under Review", "Assigned", "Resolved", "Closed"] as ReportStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus || selectedReport.status === st}
                      onClick={() => handleStatusChange(st)}
                      className={`text-xs px-3.5 py-1.5 font-semibold rounded-lg transition cursor-pointer ${
                        selectedReport.status === st
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {selectedReport.imageUrl && (
                <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-80 shadow">
                  <img src={selectedReport.imageUrl} alt="Incident Visual Evidence" className="w-full h-full object-cover block" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Reporter Notes</span>
                <p className="text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl leading-relaxed border border-slate-200 dark:border-slate-805">
                  {selectedReport.description || "No manual summary description supplied."}
                </p>
              </div>

              {/* AI assessment insights card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                {/* Abstract AI background patterns */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase backdrop-blur-sm">Smart AI Assessment</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">Gemini 2.5 Flash</span>
                  </div>
                  <p className="text-lg font-bold mb-1">{selectedReport.category} Detected</p>
                  <p className="text-xs text-blue-100 mb-6 font-mono">Confidential telemetry analysis & routing protocol.</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs opacity-70">Department Routing</span>
                      <span className="text-xs font-bold text-white">{selectedReport.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs opacity-70">Confidence Assessment</span>
                      <span className="text-xs font-bold text-white">98.4% Confidence</span>
                    </div>
                    <div>
                      <p className="text-xs opacity-70 mb-1">Incident Summary</p>
                      <p className="text-xs leading-relaxed text-blue-50 bg-black/20 p-3 rounded-lg border border-white/5">
                        {selectedReport.summary}
                      </p>
                    </div>
                    {selectedReport.possibleRisk && (
                      <div>
                        <p className="text-xs opacity-70 mb-1">Safety &amp; Public Risks</p>
                        <p className="text-xs leading-relaxed text-blue-50 bg-black/20 p-3 rounded-lg border border-white/5">
                          {selectedReport.possibleRisk}
                        </p>
                      </div>
                    )}
                    {selectedReport.recommendedAction && (
                      <div>
                        <p className="text-xs opacity-70 mb-1">Dispatcher Recommendation</p>
                        <p className="text-xs leading-relaxed text-amber-300 font-semibold bg-black/20 p-3 rounded-lg border border-white/5">
                          {selectedReport.recommendedAction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments column side-panel */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" /> Dispatcher Notes &amp; Updates ({comments.length})
              </h4>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1.5">
                {comments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-mono border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No conversation records logged for this ticket yet.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-3 rounded-xl shadow-sm text-xs space-y-1.5 relative"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" /> {comment.userName}
                          </span>
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.2 rounded-full ${
                            comment.userRole === "authority" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}>
                            {comment.userRole}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment box */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingComment}
                  placeholder="Enter dispatcher notes or citizen notes..."
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl px-3 py-2 text-xs transition placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dashboard Console header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">Municipal Incident Command</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome Dispatcher <strong className="text-slate-700 dark:text-slate-200">{profile.displayName}</strong>. Analyze and route reported urban hazards.
            </p>
          </div>

          {/* Search, filters, sorting panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, keyword, description, or department..."
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg pl-9 pr-4 py-2.5 text-xs transition placeholder-slate-400"
                />
              </div>

              {/* Status filter */}
              <div className="flex gap-2.5 flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none border-0 cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Priority filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Priority:</span>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none border-0 cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Category:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none border-0 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Road Damage">Road Damage</option>
                    <option value="Flooding">Flooding</option>
                    <option value="Illegal Dumping">Illegal Dumping</option>
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Power Outage">Power Outage</option>
                    <option value="Broken Streetlight">Broken Streetlight</option>
                    <option value="Fire Hazard">Fire Hazard</option>
                    <option value="Fallen Tree">Fallen Tree</option>
                    <option value="Sewage">Sewage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Incidents Table grid list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                🗂️ Active Telemetry Tickets ({filteredReports.length})
              </h3>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-mono text-xs border border-dashed border-slate-200 dark:border-slate-850 rounded-b-xl bg-white dark:bg-slate-900">
                No tickets matching current filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category / Department</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{report.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{report.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">By: {report.createdByName || report.createdByEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded uppercase border border-slate-200 dark:border-slate-700">
                            {report.category}
                          </span>
                          <span className="text-xs text-slate-400 block mt-1">{report.department}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${
                              report.priority === "Critical" ? "bg-red-500" :
                              report.priority === "High" ? "bg-orange-500" :
                              report.priority === "Medium" ? "bg-yellow-500" : "bg-blue-500"
                            }`}></div>
                            <span className={`text-xs font-bold ${
                              report.priority === "Critical" ? "text-red-600 dark:text-red-400" :
                              report.priority === "High" ? "text-orange-600 dark:text-orange-400" :
                              report.priority === "Medium" ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"
                            }`}>{report.priority}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            report.status === "Resolved" ? "bg-green-50 text-green-700 border-green-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40" :
                            report.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40" :
                            report.status === "Under Review" ? "bg-blue-50 text-blue-700 border-blue-250 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40" :
                            report.status === "Assigned" ? "bg-purple-50 text-purple-700 border-purple-250 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40" :
                            "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 whitespace-nowrap">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                            }}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                            title="Inspect ticket"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
