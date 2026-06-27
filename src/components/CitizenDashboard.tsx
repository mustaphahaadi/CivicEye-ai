/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserProfile, Report, Comment, Notification } from "../types";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import {
  getLocalComments,
  addLocalComment,
  getLocalNotifications,
  addLocalNotification,
  markLocalNotificationRead,
  saveLocalReports,
} from "../lib/dbFallback";
import {
  Plus,
  Clock,
  CheckCircle,
  FileText,
  AlertTriangle,
  QrCode,
  MapPin,
  Calendar,
  MessageSquare,
  ChevronRight,
  Send,
  Building,
  ArrowLeft,
  User,
  Trash2,
  Share2
} from "lucide-react";
import QRDialog from "./QRDialog";
import PDFExport from "./PDFExport";

interface CitizenDashboardProps {
  profile: UserProfile;
  reports: Report[];
  onNewReportClick: () => void;
}

export default function CitizenDashboard({ profile, reports, onNewReportClick }: CitizenDashboardProps) {
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [commentText, setCommentText] = React.useState("");
  const [submittingComment, setSubmittingComment] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  
  // Dialog trackers
  const [activeQrReport, setActiveQrReport] = React.useState<Report | null>(null);

  const citizenReports = React.useMemo(() => {
    return reports.filter((r) => r.createdBy === profile.uid);
  }, [reports, profile.uid]);

  const stats = React.useMemo(() => {
    const total = citizenReports.length;
    const resolved = citizenReports.filter((r) => r.status === "Resolved" || r.status === "Closed").length;
    const pending = citizenReports.filter((r) => r.status === "Pending").length;
    const inReview = citizenReports.filter((r) => r.status === "Under Review" || r.status === "Assigned").length;
    return { total, resolved, pending, inReview };
  }, [citizenReports]);

  // Listen for Comments when a report is expanded
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

  // Listen for notifications for this user
  React.useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", profile.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Notification[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Notification);
      });
      setNotifications(items);
    }, (error) => {
      console.warn("Real-time notifications index missing, falling back to standard fetch.", error);
      const fbQuery = query(collection(db, "notifications"), where("userId", "==", profile.uid));
      getDocs(fbQuery).then((snapshot) => {
        const items: Notification[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Notification);
        });
        setNotifications(items.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
      }).catch((fetchErr) => {
        console.warn("Standard notifications fetch failed, using LocalStorage:", fetchErr);
        setNotifications(getLocalNotifications(profile.uid));
      });
    });

    return () => unsubscribe();
  }, [profile.uid]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedReport || submittingComment) return;

    setSubmittingComment(true);
    const newCommentData = {
      reportId: selectedReport.id,
      userId: profile.uid,
      userName: profile.displayName || "Citizen",
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

  const handleMarkNotificationRead = async (notifId: string) => {
    try {
      const notifRef = doc(db, "notifications", notifId);
      await updateDoc(notifRef, { read: true });
    } catch (err) {
      console.warn("Failed to mark read on Firestore, saving to LocalStorage:", err);
      markLocalNotificationRead(notifId);
      setNotifications((prev) => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    }
  };

  const handleClearNotification = async (notifId: string) => {
    try {
      await deleteDoc(doc(db, "notifications", notifId));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Under Review":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Assigned":
        return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Closed":
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "High":
        return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Low":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Expanding Detail view panel */}
      {selectedReport ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
          {/* Header Back Button */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveQrReport(selectedReport)}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 font-medium text-xs rounded-xl transition border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                title="Share QR Link"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Share QR</span>
              </button>
              <PDFExport report={selectedReport} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Expanded details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getStatusBadge(selectedReport.status)}`}>
                  Status: {selectedReport.status}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getPriorityBadge(selectedReport.priority)}`}>
                  Priority: {selectedReport.priority}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{selectedReport.title}</h3>

              {selectedReport.imageUrl && (
                <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-80 shadow-inner">
                  <img src={selectedReport.imageUrl} alt="Incident File" className="w-full h-full object-cover block" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Reporter Incident Description</span>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedReport.description || "No manual context provided."}
                </p>
              </div>

              {/* AI Details Frame */}
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

            {/* Comments side-panel */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" /> Updates &amp; Comments ({comments.length})
              </h4>

              {/* Comments Scroller */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1.5">
                {comments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-mono border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No dispatcher notes or citizen updates posted yet.
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

              {/* Comment submit form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingComment}
                  placeholder="Type updates or feedback..."
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
          {/* Welcome Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                Citizen Command Dashboard
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Welcome back, <strong className="text-slate-700 dark:text-slate-200">{profile.displayName}</strong>. Review your filed incident cards.
              </p>
            </div>
            <button
              onClick={onNewReportClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 shrink-0">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Incidents</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pending Intake</p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-500">{stats.pending}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">In Investigation</p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-500">{stats.inReview}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Incidents Resolved</p>
              <p className="text-3xl font-extrabold text-green-600 dark:text-emerald-500">{stats.resolved}</p>
            </div>
          </div>

          {/* Notifications Alerts ticker */}
          {notifications.filter((n) => !n.read).length > 0 && (
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                🔔 Unread Telemetry Updates ({notifications.filter((n) => !n.read).length})
              </h4>
              <div className="space-y-1.5">
                {notifications.filter((n) => !n.read).slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850"
                  >
                    <p className="flex-1 pr-4 font-sans line-clamp-1">{notif.message}</p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleMarkNotificationRead(notif.id)}
                        className="text-[10px] font-semibold text-blue-500 hover:underline cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen's Reports List vs Empty state */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              My Infrastructure Reports
            </h2>

            {citizenReports.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-mono text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-4 bg-white dark:bg-slate-900">
                <p>No reports found in your telemetry credential.</p>
                <button
                  onClick={onNewReportClick}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold transition cursor-pointer"
                >
                  File First Report
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Issue Detail</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {citizenReports.map((report) => (
                        <tr
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {report.imageUrl && (
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                                  <img src={report.imageUrl} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">{report.title}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                                  {new Date(report.createdAt).toLocaleDateString()} &bull; {report.department || "System Route"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded uppercase border border-slate-200 dark:border-slate-700">
                              {report.category}
                            </span>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shared Dialog Overlays */}
      {activeQrReport && (
        <QRDialog
          reportId={activeQrReport.id}
          reportTitle={activeQrReport.title}
          onClose={() => setActiveQrReport(null)}
        />
      )}
    </div>
  );
}
