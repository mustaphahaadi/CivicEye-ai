/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Copy, Check, Download } from "lucide-react";

interface QRDialogProps {
  reportId: string;
  reportTitle: string;
  onClose: () => void;
}

export default function QRDialog({ reportId, reportTitle, onClose }: QRDialogProps) {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = `${window.location.origin}/reports/${reportId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamically create a QR API URL using secure QRServer
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Share Civic Report</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
          Scan this QR code or copy the link below to share the status of <span className="font-semibold text-slate-700 dark:text-slate-200">"{reportTitle}"</span>.
        </p>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 mb-6">
          <div className="bg-white p-3 rounded-lg shadow-md border border-slate-100">
            <img
              src={qrCodeUrl}
              alt="CivicEye Report QR Code"
              className="w-48 h-48 block"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback custom SVG QR simulation if API fails
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('qr-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback QR SVG if external API is blocked */}
            <div id="qr-fallback" className="hidden w-48 h-48 flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 font-mono text-xs text-center p-2 rounded border border-dashed border-slate-300">
              <span className="font-bold text-blue-500 mb-2">[QR CODE]</span>
              <span>Scanning links with local sandbox config</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-3">REPORT ID: {reportId.substring(0, 8)}</span>
        </div>

        {/* Link box */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-mono truncate text-slate-600 dark:text-slate-300 flex-1">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition shrink-0"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full mt-4 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2"
        >
          {copied ? "Link Copied!" : "Copy Public Link"}
        </button>
      </div>
    </div>
  );
}
