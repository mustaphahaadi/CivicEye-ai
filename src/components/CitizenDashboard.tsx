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
      console.warn("Real-time comment listener failed, falling back to empty. Maybe order-by index missing on firestore.", error);
      // Fallback without orderBy
      const fbQuery = query(collection(db, "comments"), where("reportId", "==", selectedReport.id));
      getDocs(fbQuery).then((snapshot) => {
        const items: Comment[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Comment);
        });
        setComments(items.sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
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
      });
    });

    return () => unsubscribe();
  }, [profile.uid]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedReport || submittingComment) return;

    setSubmittingComment(true);
    try {
      const newComment = {
        reportId: selectedReport.id,
        userId: profile.uid,
        userName: profile.displayName || "Citizen",
        userRole: profile.role,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "comments"), newComment);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    try {
      const notifRef = doc(db, "notifications", notifId);
      await updateDoc(notifRef, { read: true });
    } catch (err) {
      console.error("Failed to mark read:", err);
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
          {/* Header Back Button */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveQrReport(selectedReport)}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 font-medium text-xs rounded-xl transition border border-slate-200 dark:border-slate-700 flex items-center gap-1"
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
                <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-80 shadow-inner">
                  <img src={selectedReport.imageUrl} alt="Incident File" className="w-full h-full object-cover block" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Reporter Incident Description</span>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                  {selectedReport.description || "No manual context provided."}
                </p>
              </div>

              {/* AI Details Frame */}
              <div className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border border-blue-500/10 dark:border-blue-900/30 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  🛡️ Smart City AI Assessment
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Categorized Route</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-4 h-4 text-blue-500" />
                      {selectedReport.category} &rarr; {selectedReport.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Concise Summary</span>
                    <p className="text-slate-500 dark:text-slate-400 leading-normal mt-0.5">{selectedReport.summary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Safety &amp; Public Risks</span>
                    <p className="text-slate-500 dark:text-slate-400 leading-normal mt-0.5">{selectedReport.possibleRisk}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Dispatched Actions</span>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold leading-normal mt-0.5">{selectedReport.recommendedAction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments side-panel */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 p-4 space-y-4">
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/10 hover:-translate-y-0.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center space-y-1">
              <span className="text-2xl font-black text-slate-800 dark:text-white block">{stats.total}</span>
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Total Incidents</span>
            </div>
            <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-950 p-4 rounded-2xl shadow-sm text-center space-y-1">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">{stats.pending}</span>
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Pending Intake</span>
            </div>
            <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950 p-4 rounded-2xl shadow-sm text-center space-y-1">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">{stats.inReview}</span>
              <span className="text-[10px] text-slate-400 font-mono block uppercase">In Investigation</span>
            </div>
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-950 p-4 rounded-2xl shadow-sm text-center space-y-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">{stats.resolved}</span>
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Incidents Resolved</span>
            </div>
          </div>

          {/* Notifications Alerts ticker */}
          {notifications.filter((n) => !n.read).length > 0 && (
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 space-y-2">
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
                        className="text-[10px] font-semibold text-blue-500 hover:underline"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              📁 My Community Report Cards
            </h3>

            {citizenReports.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-mono text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <p>No reports found in your telemetry credential.</p>
                <button
                  onClick={onNewReportClick}
                  className="py-1.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-200 font-semibold"
                >
                  File First Report
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {citizenReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl cursor-pointer transition gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${getPriorityBadge(report.priority)}`}>
                          {report.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{report.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{report.description || report.summary}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 justify-between sm:justify-end">
                      {report.imageUrl && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow">
                          <img src={report.imageUrl} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
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
