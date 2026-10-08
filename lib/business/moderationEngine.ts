import { BusinessReport, SpamStatus } from './types';
import { logAdminAudit } from '../admin/authEngine';

const BUSINESS_REPORTS_KEY = 'toolverse_business_reports';

export function getStoredBusinessReports(): BusinessReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BUSINESS_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function createBusinessReport(
  businessId: string,
  businessName: string,
  reporterEmail: string,
  reason: BusinessReport['reason'],
  description: string
): BusinessReport {
  const reports = getStoredBusinessReports();
  const newReport: BusinessReport = {
    id: `rep-${Date.now()}`,
    businessId,
    businessName,
    reporterEmail: reporterEmail.trim() || 'anonymous@toolverse.baby',
    reason,
    description,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  reports.unshift(newReport);
  if (typeof window !== 'undefined') {
    localStorage.setItem(BUSINESS_REPORTS_KEY, JSON.stringify(reports));
  }
  return newReport;
}

export function updateReportStatus(
  reportId: string,
  newStatus: BusinessReport['status'],
  adminUsername: string
): BusinessReport | null {
  const reports = getStoredBusinessReports();
  const r = reports.find((item) => item.id === reportId);
  if (!r) return null;

  r.status = newStatus;
  r.resolvedAt = new Date().toISOString();
  r.resolvedBy = adminUsername;

  if (typeof window !== 'undefined') {
    localStorage.setItem(BUSINESS_REPORTS_KEY, JSON.stringify(reports));
    logAdminAudit(adminUsername, 'REPORT_UPDATED', 'REPORT', r.businessId, `Report ${reportId} status changed to ${newStatus}`);
  }

  return r;
}
