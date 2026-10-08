import React, { useState } from 'react';
import { getStoredBusinesses } from '@/lib/business/storageEngine';
import { generateSVGQRBadge, QRTemplate } from '@/lib/business/qrEngine';
import { Sparkles, QrCode, Download, Copy, Check, Printer, ShieldCheck, Trophy } from 'lucide-react';

export default function BusinessQRGeneratorPage() {
  const businesses = getStoredBusinesses();
  const [selectedBusinessId, setSelectedBusinessId] = useState(businesses[0]?.id || 'TV-BIZ-8F4K2P');
  const [template, setTemplate] = useState<QRTemplate>('Verified');
  const [showStatus, setShowStatus] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectedBiz = businesses.find((b) => b.id === selectedBusinessId) || businesses[0];

  const svgContent = selectedBiz
    ? generateSVGQRBadge(selectedBiz, { template, showStatus, showCategory })
    : '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedBiz.slug}-toolverse-qr-badge.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
          <QrCode className="w-3.5 h-3.5" /> Printable Digital Identity Badge System
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">Toolverse Business QR Badge Generator</h1>
        <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
          Generate high-resolution printable QR identity badges for store windows, counters, menus, receipts, and business cards.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 text-xs">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b pb-2">Badge Customization</h2>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Business Profile</label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Design Template</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Verified', 'Leader', 'Dark', 'Light', 'Minimal', 'Premium'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    template === t
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showStatus}
                onChange={(e) => setShowStatus(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show Ranking / Verification Status
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showCategory}
                onChange={(e) => setShowCategory(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show Category Name
            </label>
          </div>

          <div className="pt-4 border-t space-y-2">
            <button
              onClick={handleDownloadSVG}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 text-xs"
            >
              <Download className="w-4 h-4" /> Download Printable SVG
            </button>
            <button
              onClick={handleCopyCode}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl border flex items-center justify-center gap-2 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'SVG Copied!' : 'Copy Vector SVG Code'}
            </button>
          </div>
        </div>

        {/* Live Vector SVG Preview */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live High-Res Preview</h2>
          <div
            className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border flex justify-center max-w-md w-full shadow-inner"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          <p className="text-xs text-slate-400 text-center">
            Print size target: 10x10cm counter badge or A4 window display. High error correction Level H ensures scanability even when laminated.
          </p>
        </div>
      </div>
    </div>
  );
}
