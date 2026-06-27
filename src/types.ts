/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "citizen" | "authority";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  totalReports?: number;
  resolvedReports?: number;
  pendingReports?: number;
}

export type ReportCategory =
  | "Road Damage"
  | "Flooding"
  | "Illegal Dumping"
  | "Water Leakage"
  | "Power Outage"
  | "Broken Streetlight"
  | "Fire Hazard"
  | "Fallen Tree"
  | "Sewage"
  | "Other";

export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

export type ReportStatus =
  | "Pending"
  | "Under Review"
  | "Assigned"
  | "Resolved"
  | "Closed";

export interface Report {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  category: ReportCategory;
  priority: PriorityLevel;
  confidence: number; // e.g., 0.95 (percentage)
  summary: string;
  department: string;
  possibleRisk: string;
  recommendedAction: string;
  status: ReportStatus;
  createdBy: string; // user uid
  createdByName: string;
  createdByEmail: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Notification {
  id: string;
  userId: string; // recipient
  reportId: string;
  reportTitle: string;
  type: "status_change" | "comment" | "created";
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}
