import React, { useState, useEffect } from 'react';
import { getCurrentAdminSession, logoutAdmin, getAdminAuditLogs, hasPermission } from '@/lib/admin/authEngine';
import { getStoredBusinesses, updateBusinessSpamStatus, getStoredCategories } from '@/lib/business/storageEngine';
import { getStoredVerificationRequests, reviewVerificationRequest } from '@/lib/business/verificationEngine';
import { getStoredBusinessReports, updateReportStatus } from '@/lib/business/moderationEngine';
import { getStoredPolicies, updatePolicyDocument } from '@/lib/business/policyEngine';
import { Business, VerificationRequest, BusinessReport, PolicyDocument } from '@/lib/business/types';
import {
  ShieldCheck,
  Building,
  FileText,
  AlertOctagon,
  CheckCircle,
  XCircle,
  LogOut,
  Search,
  Check,
  X,
  Filter,
  FileCode,
  Lock,
} from 'lucide-react';

export default function AdminControlPanelPage() {
  const [session, setSession] = useState(getCurrentAdminSession());
  const [activeTab, setActiveTab] = useState<'verification' | 'businesses' | 'reports' | 'categories' | 'policies' | 'audit'>('verification');

  // Re-fetch triggers
  const [refreshKey, setRefreshKey] = useState(0);

  // Rejection Reason Modal
  const [rejectionModalReq, setRejectionModalReq] = useState<VerificationRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Policy Edit Modal
  const [editPolicy, setEditPolicy] = useState<PolicyDocument | null>(null);
  const [policyMarkdownInput, setPolicyMarkdownInput] = useState('');

  useEffect(() => {
    const s = getCurrentAdminSession();
    if (!s && typeof window !== 'undefined') {
      window.location.replace('/admin/login');
    } else {
      setSession(s);
    }
  }, [refreshKey]);

  if (!session) return null;

  const businesses = getStoredBusinesses();
  const verRequests = getStoredVerificationRequests();
  const reports = getStoredBusinessReports();
  const categories = getStoredCategories();
  const auditLogs = getAdminAuditLogs();
  const policies = getStoredPolicies();

  const handleApproveVerification = (reqId: string) => {
    reviewVerificationRequest(reqId, 'APPROVE', session.username);
    setRefreshKey((k) => k + 1);
  };

  const handleRejectVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalReq) return;
    reviewVerificationRequest(rejectionModalReq.id, 'REJECT', session.username, rejectionReasonInput);
    setRejectionModalReq(null);
    setRejectionReasonInput('');
    setRefreshKey((k) => k + 1);
  };

  const handleSpamToggle = (bizId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SPAM' ? 'CLEAN' : 'SPAM';
    updateBusinessSpamStatus(bizId, nextStatus as any, session.username);
    setRefreshKey((k) => k + 1);
  };

  const handleReportAction = (reportId: string, status: BusinessReport['status']) => {
    updateReportStatus(reportId, status, session.username);
    setRefreshKey((k) => k + 1);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPolicy) return;
    updatePolicyDocument(editPolicy.slug, policyMarkdownInput, session.username);
    setEditPolicy(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-xs">
      {/* Header Bar */}
      <header className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Toolverse Admin Control Center</h1>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold border border-indigo-400/30">
                {session.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs">Logged in as {session.username} ({session.email})</p>
          </div>
        </div>

        <button
          onClick={() => {
            logoutAdmin();
            window.location.replace('/admin/login');
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 border border-slate-700"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      {/* Real Real-Time Database Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Total Businesses</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{businesses.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Pending Verifications</div>
          <div className="text-2xl font-black text-amber-500">{verRequests.filter((r) => r.status === 'PENDING').length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Spam Flagged</div>
          <div className="text-2xl font-black text-rose-500">{businesses.filter((b) => b.spamStatus === 'SPAM').length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Active Reports</div>
          <div className="text-2xl font-black text-purple-500">{reports.filter((r) => r.status === 'NEW').length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Categories</div>
          <div className="text-2xl font-black text-indigo-500">{categories.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Audit Events</div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{auditLogs.length}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b overflow-x-auto pb-2">
        {(
          [
            { id: 'verification', label: `Verifications (${verRequests.filter((r) => r.status === 'PENDING').length})` },
            { id: 'businesses', label: `Business Manager (${businesses.length})` },
            { id: 'reports', label: `Spam Reports (${reports.filter((r) => r.status === 'NEW').length})` },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'policies', label: 'Policy Center' },
            { id: 'audit', label: 'Admin Audit Logs' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Verification Portal */}
      {activeTab === 'verification' && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Document Verification Portal</h2>

          {verRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-semibold">No pending verification requests in database.</div>
          ) : (
            <div className="space-y-4">
              {verRequests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{req.businessName}</h3>
                      <p className="text-slate-500">{req.ownerEmail} &bull; {req.country} &bull; {req.categoryName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-300">
                    <strong>Required Evidence:</strong> {req.requiredDocuments.join(', ')}
                  </div>

                  {req.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 rounded-lg">
                      <strong>Rejection Reason:</strong> {req.rejectionReason}
                    </div>
                  )}

                  {req.status === 'PENDING' && (
                    <div className="pt-2 flex gap-2 justify-end">
                      <button
                        onClick={() => setRejectionModalReq(req)}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                      >
                        Reject with Reason
                      </button>
                      <button
                        onClick={() => handleApproveVerification(req.id)}
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Approve Verification
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Business Manager */}
      {activeTab === 'businesses' && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">All Registered Businesses</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <th className="p-3">ID / Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Risk Status</th>
                  <th className="p-3">Spam State</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{b.id}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{b.categoryName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{b.city}, {b.country}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${b.riskStatus === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {b.riskStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${b.spamStatus === 'SPAM' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {b.spamStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSpamToggle(b.id, b.spamStatus)}
                        className={`px-3 py-1 rounded font-bold text-[11px] ${
                          b.spamStatus === 'SPAM' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {b.spamStatus === 'SPAM' ? 'Mark Clean' : 'Tag SPAM'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Rejection Modal */}
      {rejectionModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Reject Verification Request</h3>
            <form onSubmit={handleRejectVerificationSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Business registration document is unclear or expired..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalReq(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg shadow">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
