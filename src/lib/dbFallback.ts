/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Report, Comment, Notification, UserProfile } from "../types";

// Key definitions for LocalStorage
const KEYS = {
  REPORTS: "civic_eye_reports",
  COMMENTS: "civic_eye_comments",
  NOTIFICATIONS: "civic_eye_notifications",
  USERS: "civic_eye_users",
};

// Realistic initial reports to seed the application
const SAMPLE_REPORTS: Report[] = [
  {
    id: "REP-482019",
    title: "Major Pothole on Main St Crossing",
    description: "A deep, hazardous pothole on Main St right in front of the public library. Cars are swerving to avoid it, creating a high risk of collisions. It is approximately 2 feet wide and 6 inches deep.",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    latitude: 40.7589,
    longitude: -73.9851,
    category: "Road Damage",
    priority: "High",
    confidence: 0.96,
    summary: "Large asphalt pothole detected near central intersection, causing traffic disruption.",
    department: "Roads Department",
    possibleRisk: "Vehicle suspension damage, high collision hazard from swerving.",
    recommendedAction: "Pave and fill asphalt surface with road repair crew.",
    status: "Assigned",
    createdBy: "demo-citizen-uid-123",
    createdByName: "John Citizen",
    createdByEmail: "john@citizen.org",
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "REP-910243",
    title: "Clogged Storm Drain & Flooding",
    description: "The storm drain at Elm Avenue is completely packed with autumn leaves and garbage. Heavy rain this morning is causing water to accumulate, flooding the pedestrian crosswalk and the sidewalk.",
    imageUrl: "https://images.unsplash.com/photo-1541855492-581f618f69a0?auto=format&fit=crop&w=600&q=80",
    latitude: 40.7484,
    longitude: -73.9967,
    category: "Flooding",
    priority: "Medium",
    confidence: 0.92,
    summary: "Debris blockage in storm drain resulting in localized street flooding.",
    department: "Environmental Services",
    possibleRisk: "Pedestrian splashing, safety issues with hydroplaning.",
    recommendedAction: "Clear leaves and garbage from the inlet grate.",
    status: "Under Review",
    createdBy: "demo-citizen-uid-123",
    createdByName: "John Citizen",
    createdByEmail: "john@citizen.org",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "REP-129034",
    title: "Broken Streetlight on 5th Ave",
    description: "The streetlight lamp post #142 has been completely dark for over a week. This stretch of 5th Avenue is extremely dark at night, making residents feel unsafe while walking home.",
    imageUrl: "",
    latitude: 40.7525,
    longitude: -73.9785,
    category: "Broken Streetlight",
    priority: "Low",
    confidence: 0.98,
    summary: "Defective LED luminaire on utility pole #142.",
    department: "Power & Grid Management",
    possibleRisk: "Increased risk of crime, reduced visibility for oncoming drivers.",
    recommendedAction: "Replace defective LED bulb or investigate wiring.",
    status: "Pending",
    createdBy: "demo-citizen-uid-123",
    createdByName: "John Citizen",
    createdByEmail: "john@citizen.org",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: "REP-551203",
    title: "Severe Water Main Leakage",
    description: "Water is continuously gushing out from under the pavement near the fire hydrant. The water flow has been constant since yesterday and is starting to wash away the soil under the curb.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    latitude: 40.7612,
    longitude: -73.9712,
    category: "Water Leakage",
    priority: "Critical",
    confidence: 0.95,
    summary: "Sub-surface pipeline rupture causing pavement erosion.",
    department: "Water & Sewer Authority",
    possibleRisk: "Potential sinkhole formation, loss of potable water pressure.",
    recommendedAction: "Dispatch emergency utility team to shut off water main and repair pipe.",
    status: "Resolved",
    createdBy: "another-citizen-uid",
    createdByName: "Sarah Jenkins",
    createdByEmail: "sarah@citizen.org",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "REP-302912",
    title: "Illegal Trash Dumping in Park Alley",
    description: "Several large bags of construction debris, household trash, and a couple of old mattresses have been dumped in the alleyway bordering Central Park South. It is attracting rodents.",
    imageUrl: "",
    latitude: 40.7644,
    longitude: -73.9734,
    category: "Illegal Dumping",
    priority: "Medium",
    confidence: 0.89,
    summary: "Bulk debris and mattress disposal on public rights of way.",
    department: "Sanitation Department",
    possibleRisk: "Sanitation hazard, pest infestation, blocked public corridor.",
    recommendedAction: "Deploy bulk trash loader crew to clear alleyway.",
    status: "Closed",
    createdBy: "another-citizen-uid",
    createdByName: "Sarah Jenkins",
    createdByEmail: "sarah@citizen.org",
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
  }
];

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: "COM-110",
    reportId: "REP-482019",
    userId: "demo-authority-uid-456",
    userName: "Agent Thompson",
    userRole: "authority",
    text: "Thank you for the report. Our pavement engineer has surveyed the site and a pothole patch truck has been scheduled for tomorrow morning.",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(),
  },
  {
    id: "COM-111",
    reportId: "REP-482019",
    userId: "demo-citizen-uid-123",
    userName: "John Citizen",
    userRole: "citizen",
    text: "Thanks for the quick response! Much appreciated.",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "COM-220",
    reportId: "REP-551203",
    userId: "demo-authority-uid-456",
    userName: "Agent Thompson",
    userRole: "authority",
    text: "Water leak isolated and line repaired. Pavement has been temporarily patched. Full road resurfacing planned for next quarter.",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 6 * 3600 * 1000).toISOString(),
  }
];

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "NOT-001",
    userId: "demo-citizen-uid-123",
    reportId: "REP-482019",
    reportTitle: "Major Pothole on Main St Crossing",
    type: "status_change",
    message: "Your incident report 'Major Pothole on Main St Crossing' has been updated to Assigned.",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "NOT-002",
    userId: "demo-citizen-uid-123",
    reportId: "REP-482019",
    reportTitle: "Major Pothole on Main St Crossing",
    type: "comment",
    message: "Agent Thompson left a comment on 'Major Pothole on Main St Crossing'.",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(),
  }
];

// Helper to safely load lists from LocalStorage with seed fallbacks
export function getLocalReports(): Report[] {
  try {
    const data = localStorage.getItem(KEYS.REPORTS);
    if (!data) {
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(SAMPLE_REPORTS));
      return SAMPLE_REPORTS;
    }
    return JSON.parse(data);
  } catch {
    return SAMPLE_REPORTS;
  }
}

export function saveLocalReports(reports: Report[]): void {
  try {
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
  } catch (err) {
    console.error("LocalStorage write failed:", err);
  }
}

export function getLocalComments(reportId?: string): Comment[] {
  try {
    const data = localStorage.getItem(KEYS.COMMENTS);
    const comments: Comment[] = data ? JSON.parse(data) : [];
    if (!data) {
      localStorage.setItem(KEYS.COMMENTS, JSON.stringify(SAMPLE_COMMENTS));
      return reportId ? SAMPLE_COMMENTS.filter(c => c.reportId === reportId) : SAMPLE_COMMENTS;
    }
    return reportId ? comments.filter(c => c.reportId === reportId) : comments;
  } catch {
    return reportId ? SAMPLE_COMMENTS.filter(c => c.reportId === reportId) : SAMPLE_COMMENTS;
  }
}

export function addLocalComment(comment: Omit<Comment, "id">): Comment {
  const newComment: Comment = {
    ...comment,
    id: `COM-${Math.floor(100000 + Math.random() * 900000)}`,
  };
  try {
    const comments = getLocalComments();
    comments.push(newComment);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
  } catch (err) {
    console.error("LocalStorage comment write failed:", err);
  }
  return newComment;
}

export function getLocalNotifications(userId: string): Notification[] {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    const notifs: Notification[] = data ? JSON.parse(data) : [];
    if (!data) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(SAMPLE_NOTIFICATIONS));
      return SAMPLE_NOTIFICATIONS.filter(n => n.userId === userId);
    }
    return notifs.filter(n => n.userId === userId);
  } catch {
    return SAMPLE_NOTIFICATIONS.filter(n => n.userId === userId);
  }
}

export function addLocalNotification(notif: Omit<Notification, "id">): Notification {
  const newNotif: Notification = {
    ...notif,
    id: `NOT-${Math.floor(100000 + Math.random() * 900000)}`,
  };
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    const notifs: Notification[] = data ? JSON.parse(data) : [...SAMPLE_NOTIFICATIONS];
    notifs.push(newNotif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (err) {
    console.error("LocalStorage notification write failed:", err);
  }
  return newNotif;
}

export function markLocalNotificationRead(notifId: string): void {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    const notifs: Notification[] = data ? JSON.parse(data) : [...SAMPLE_NOTIFICATIONS];
    const updated = notifs.map(n => n.id === notifId ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch (err) {
    console.error("LocalStorage notification update failed:", err);
  }
}

export function getLocalUserProfile(uid: string): UserProfile | null {
  try {
    const data = localStorage.getItem(`${KEYS.USERS}_${uid}`);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error("LocalStorage user load failed:", err);
  }
  return null;
}

export function saveLocalUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(`${KEYS.USERS}_${profile.uid}`, JSON.stringify(profile));
  } catch (err) {
    console.error("LocalStorage user write failed:", err);
  }
}
