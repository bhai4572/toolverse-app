import React, { useState } from 'react';
import { getStoredBusinesses, getQRScanCount } from '@/lib/business/storageEngine';
import { validateDocumentUpload, getStoredVerificationRequests, saveVerificationRequest } from '@/lib/business/verificationEngine';
import { Sparkles, QrCode, ShieldCheck, Star, Eye, Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function BusinessOwnerDashboardPage() {
  const businesses = getStoredBusinesses();
  const [selectedBizId, setSelectedBizId] = useState(businesses[0]?.id || 'TV-BIZ-8F4K2P');

  const biz = businesses.find((b) => b.id === selectedBizId) || businesses[0];
  const scansCount = biz ? getQRScanCount(biz.id) : 0;
  const verRequests = getStoredVerificationRequests().filter((r) => r.businessId === biz?.id);

  // Document Upload State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docError, setDocError] = useState('');
  const [docSuccess, setDocSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateDocumentUpload(file);
    if (!validation.valid) {
      setDocError(validation.error || 'Invalid file.');
      setDocFile(null);
    } else {
      setDocError('');
      setDocFile(file);
    }
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !biz) return;

    saveVerificationRequest(biz, ['Business Registration Certificate', 'Proof of Business Ownership']);
    setDocSuccess(true);
    setDocFile(null);
    setTimeout(() => setDocSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Business Control Center
          </div>
          <h1 className="text-3xl font-black mt-2">Owner Dashboard &amp; Analytics</h1>
          <p className="text-slate-300 text-xs mt-1">Manage profile metadata, QR identity badges, verification, and campaign bidding.</p>
        </div>

        <select
          value={selectedBizId}
          onChange={(e) => setSelectedBizId(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold"
        >
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
          ))}
        </select>
      </header>

      {biz && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Profile Views</span>
                <Eye className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{biz.viewsCount.toLocaleString()}</div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>QR Identity Scans</span>
                <QrCode className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{scansCount + biz.qrScansCount}</div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Customer Rating</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-500">{biz.ratingAverage} / 5.0</div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Verification Level</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Level {biz.verificationLevel}</div>
            </div>
          </div>

          {/* Document Verification Manager */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 text-xs">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Document Verification Center
            </h2>
            <p className="text-slate-500">
              Upload official business registration documents (PDF, JPG, PNG &lt; 10MB) for Admin Review.
            </p>

            {docSuccess && (
              <div className="p-4 bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-emerald-300">
                Document submitted securely for Admin Review.
              </div>
            )}

            {docError && (
              <div className="p-4 bg-rose-50 text-rose-900 font-bold rounded-xl border border-rose-300">
                {docError}
              </div>
            )}

            <form onSubmit={handleDocumentSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Upload Registration Certificate or Proof of Ownership</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={!docFile}
                className="px-5 py-2.5 bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" /> Submit Document to Admin
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
