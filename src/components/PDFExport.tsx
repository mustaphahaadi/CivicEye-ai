/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Report } from "../types";

interface PDFExportProps {
  report: Report;
}

export default function PDFExport({ report }: PDFExportProps) {
  const handlePrint = () => {
    // Open a new styled printable window with formal civic formatting
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export the report.");
      return;
    }

    const reportDate = new Date(report.createdAt).toLocaleString();
    const updateDate = new Date(report.updatedAt).toLocaleString();

    printWindow.document.write(`
      <html>
        <head>
          <title>CivicEye Official Report - #${report.id.substring(0, 8)}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .doc-type {
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              font-weight: 600;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #0f172a;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border: 1px solid #e2e8f0;
            }
            .meta-item {
              font-size: 14px;
            }
            .meta-label {
              font-weight: bold;
              color: #475569;
              display: block;
              margin-bottom: 4px;
            }
            .meta-val {
              color: #0f172a;
            }
            .badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .badge-pending { background-color: #fef3c7; color: #d97706; }
            .badge-review { background-color: #dbeafe; color: #2563eb; }
            .badge-assigned { background-color: #f3e8ff; color: #7c3aed; }
            .badge-resolved { background-color: #dcfce7; color: #16a34a; }
            .badge-closed { background-color: #f1f5f9; color: #475569; }

            .badge-low { background-color: #f1f5f9; color: #475569; }
            .badge-medium { background-color: #fef3c7; color: #d97706; }
            .badge-high { background-color: #ffedd5; color: #ea580c; }
            .badge-critical { background-color: #fee2e2; color: #dc2626; }

            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #0f172a;
              border-left: 4px solid #2563eb;
              padding-left: 10px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .content-block {
              margin-bottom: 25px;
            }
            .ai-badge {
              background-color: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 6px;
              padding: 15px;
              font-style: italic;
              color: #1e40af;
              margin-bottom: 25px;
            }
            .image-container {
              margin-top: 25px;
              margin-bottom: 30px;
              text-align: center;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px;
              background-color: #fafafa;
            }
            .report-img {
              max-width: 100%;
              max-height: 350px;
              border-radius: 4px;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 12px;
              color: #64748b;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CivicEye</div>
            <div class="doc-type">Official Infrastructure Incident Report</div>
          </div>

          <div class="title">${report.title}</div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Incident ID</span>
              <span class="meta-val" style="font-family: monospace;">${report.id}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Current Status</span>
              <span class="meta-val">
                <span class="badge badge-${report.status.toLowerCase().replace(" ", "-")}">${report.status}</span>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Category</span>
              <span class="meta-val">${report.category}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Urgency Priority</span>
              <span class="meta-val">
                <span class="badge badge-${report.priority.toLowerCase()}">${report.priority}</span>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Routing Department</span>
              <span class="meta-val">${report.department}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">AI Confidence Match</span>
              <span class="meta-val">${(report.confidence * 100).toFixed(1)}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Submitted On</span>
              <span class="meta-val">${reportDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Last Updated</span>
              <span class="meta-val">${updateDate}</span>
            </div>
            <div class="meta-item" style="grid-column: span 2;">
              <span class="meta-label">GPS Coordinates</span>
              <span class="meta-val" style="font-family: monospace;">LAT: ${report.latitude.toFixed(6)}, LNG: ${report.longitude.toFixed(6)}</span>
            </div>
          </div>

          <div class="section-title">Description</div>
          <div class="content-block">${report.description || "No manual description provided."}</div>

          <div class="section-title">AI Smart City Assessment</div>
          <div class="ai-badge">
            <strong>Incident Summary:</strong><br/>
            ${report.summary}<br/><br/>
            <strong>Identified Public Safety Risk:</strong><br/>
            ${report.possibleRisk}
          </div>

          <div class="section-title">Recommended Dispatch Actions</div>
          <div class="content-block" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0;">
            ${report.recommendedAction}
          </div>

          ${
            report.imageUrl
              ? `
            <div class="section-title">Visual Evidence</div>
            <div class="image-container">
              <img class="report-img" src="${report.imageUrl}" alt="Incident Evidence" />
            </div>
          `
              : ""
          }

          <div class="footer">
            <p>CivicEye Smart City Dispatcher System. This is an official digital record compiled with Gemini AI classification. For inquiries, please contact municipal support.</p>
            <p>&copy; ${new Date().getFullYear()} Municipal Assembly Digital Operations.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
    >
      <Printer className="w-4 h-4" />
      <span>Print / PDF Report</span>
    </button>
  );
}
