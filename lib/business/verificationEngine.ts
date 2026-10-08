import { Business, VerificationRequest, BusinessDocument, VerificationLevel, RiskStatus } from './types';
import { logAdminAudit } from '../admin/authEngine';

const VERIFICATION_REQUESTS_KEY = 'toolverse_verification_requests';

/**
 * Risk-Based Verification Scoring Engine
 * Evaluates business profile completeness, domain authority, and suspicious patterns.
 */
export function evaluateBusinessRisk(business: Partial<Business>): { riskStatus: RiskStatus; signals: string[] } {
  const signals: string[] = [];
  let score = 0; // Higher score = higher risk

  if (!business.websiteUrl || !business.websiteUrl.startsWith('http')) {
    score += 20;
    signals.push('Missing or invalid website domain');
  }

  if (!business.email || business.email.endsWith('@gmail.com') || business.email.endsWith('@yahoo.com') || business.email.endsWith('@hotmail.com')) {
    score += 15;
    signals.push('Generic free email address instead of corporate domain');
  }

  if (!business.address && !business.isGlobalOnline) {
    score += 15;
    signals.push('Local business listed without physical address');
  }

  if (business.description && business.description.length < 50) {
    score += 10;
    signals.push('Short profile description (< 50 characters)');
  }

  let riskStatus: RiskStatus = 'LOW';
  if (score >= 35) riskStatus = 'HIGH';
  else if (score >= 15) riskStatus = 'MEDIUM';

  return { riskStatus, signals };
}

/** Validate document file upload security (MIME type, file size limit) */
export function validateDocumentUpload(file: { name: string; type: string; size: number }): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds maximum 10MB limit.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Invalid document file type. Only PDF, JPG, JPEG, and PNG files are accepted.' };
  }

  return { valid: true };
}

export function getStoredVerificationRequests(): VerificationRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VERIFICATION_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVerificationRequest(
  business: Business,
  requiredDocs: string[] = ['Business Registration Certificate', 'Proof of Ownership', 'Address Utility Evidence']
): VerificationRequest {
  const list = getStoredVerificationRequests();
  const existing = list.find((r) => r.businessId === business.id);

  if (existing) {
    existing.status = 'PENDING';
    existing.requiredDocuments = requiredDocs;
    existing.createdAt = new Date().toISOString();
    if (typeof window !== 'undefined') {
      localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(list));
    }
    return existing;
  }

  const req: VerificationRequest = {
    id: `ver-${Date.now()}`,
    businessId: business.id,
    businessName: business.name,
    ownerEmail: business.ownerEmail || business.email,
    country: business.country,
    categoryName: business.categoryName,
    status: 'PENDING',
    requiredDocuments: requiredDocs,
    submittedDocuments: [],
    createdAt: new Date().toISOString(),
  };

  list.unshift(req);
  if (typeof window !== 'undefined') {
    localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(list));
  }
  return req;
}

export function reviewVerificationRequest(
  requestId: string,
  action: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO',
  adminUsername: string,
  rejectionReason?: string
): VerificationRequest | null {
  const list = getStoredVerificationRequests();
  const req = list.find((r) => r.id === requestId);
  if (!req) return null;

  req.reviewedAt = new Date().toISOString();
  req.reviewedBy = adminUsername;

  if (action === 'APPROVE') {
    req.status = 'APPROVED';
    logAdminAudit(adminUsername, 'VERIFICATION_APPROVED', 'VERIFICATION', req.businessId, `Approved verification request for ${req.businessName}`);
  } else if (action === 'REJECT') {
    req.status = 'REJECTED';
    req.rejectionReason = rejectionReason || 'Submitted documentation is insufficient or unclear.';
    logAdminAudit(adminUsername, 'VERIFICATION_REJECTED', 'VERIFICATION', req.businessId, `Rejected verification request for ${req.businessName}: ${rejectionReason}`);
  } else if (action === 'REQUEST_MORE_INFO') {
    req.status = 'MORE_INFO_NEEDED';
    req.rejectionReason = rejectionReason || 'Additional evidence required.';
    logAdminAudit(adminUsername, 'VERIFICATION_MORE_INFO', 'VERIFICATION', req.businessId, `Requested more info for ${req.businessName}: ${rejectionReason}`);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(list));
  }
  return req;
}
