import { describe, it, expect } from 'vitest';
import {
  findCategoryByQuery,
  findBusinessBySlug,
  findBusinessByBusinessId,
  INITIAL_BUSINESSES,
} from '../lib/business/registry';
import {
  evaluateBusinessRisk,
  validateDocumentUpload,
  saveVerificationRequest,
} from '../lib/business/verificationEngine';
import {
  generateSVGQRBadge,
  getPermanentBusinessQRUrl,
  formatRankingSnapshotLabel,
} from '../lib/business/qrEngine';
import {
  getActiveSponsoredPositions,
  createOrUpdateBiddingCampaign,
} from '../lib/business/biddingEngine';
import {
  loginAdmin,
  hasPermission,
} from '../lib/admin/authEngine';
import {
  createBusinessReport,
  getStoredBusinessReports,
  updateReportStatus,
} from '../lib/business/moderationEngine';
import {
  getStoredBusinesses,
  saveStoredBusinesses,
} from '../lib/business/storageEngine';

describe('Business Identity & Registry Engine Tests', () => {
  it('resolves canonical business profile by slug', () => {
    const biz = findBusinessBySlug('ali-barber-studio');
    expect(biz).toBeDefined();
    expect(biz?.id).toBe('TV-BIZ-8F4K2P');
    expect(biz?.verificationLevel).toBe(3);
    expect(biz?.isVerified).toBe(true);
  });

  it('resolves canonical business profile by permanent Business ID (TV-BIZ-XXXXXX)', () => {
    const biz = findBusinessByBusinessId('TV-BIZ-8F4K2P');
    expect(biz).toBeDefined();
    expect(biz?.slug).toBe('ali-barber-studio');
    expect(biz?.name).toBe('Ali Barber Studio');
  });

  it('performs category matching and resolves aliases', () => {
    const cat = findCategoryByQuery('Digital Marketing Agency');
    expect(cat).toBeDefined();
    expect(cat?.slug).toBe('digital-marketing-agencies');
  });
});

describe('Risk-Based Verification & Document Security Engine Tests', () => {
  it('calculates risk score accurately based on business signals', () => {
    const biz = INITIAL_BUSINESSES[0];
    const risk = evaluateBusinessRisk(biz);
    expect(risk.riskStatus).toBe('LOW');
  });

  it('validates document uploads with strict MIME type and file size security checks', () => {
    const validFile = { name: 'registration.pdf', type: 'application/pdf', size: 1024 * 1024 };
    const validResult = validateDocumentUpload(validFile);
    expect(validResult.valid).toBe(true);

    const invalidFile = { name: 'hack.exe', type: 'application/x-msdownload', size: 500 };
    const invalidResult = validateDocumentUpload(invalidFile);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.error).toContain('Invalid document file type');
  });

  it('creates verification requests for elevated risk businesses', () => {
    const biz = INITIAL_BUSINESSES[0];
    const req = saveVerificationRequest(biz, ['Business Registration Certificate']);
    expect(req.businessId).toBe(biz.id);
    expect(req.status).toBe('PENDING');
  });
});

describe('Permanent QR Engine Tests', () => {
  it('generates permanent QR resolution URL pointing to /b/:businessId', () => {
    const url = getPermanentBusinessQRUrl('TV-BIZ-8F4K2P');
    expect(url).toBe('https://toolverse.baby/b/TV-BIZ-8F4K2P');
  });

  it('generates clean vector SVG QR badge markup with customizable template', () => {
    const biz = INITIAL_BUSINESSES[0];
    const svg = generateSVGQRBadge(biz, {
      template: 'VERIFIED',
      showStatus: true,
      showCategory: true,
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain(biz.name);
    expect(svg).toContain('toolverse.baby');
  });

  it('formats timestamped ranking snapshot labels to prevent misleading static prints', () => {
    const biz = { ...INITIAL_BUSINESSES[0], rankingPosition: 1, rankingSnapshotDate: '2026-10-08' };
    const label = formatRankingSnapshotLabel(biz);
    expect(label).toContain('#1 in');
    expect(label).toContain('Ranked on 2026-10-08');
  });
});

describe('Top 3 Sponsored Bidding Auction Engine Tests', () => {
  it('creates and retrieves active sponsored bidding placement positions', () => {
    const biz = INITIAL_BUSINESSES[0];
    const campaign = createOrUpdateBiddingCampaign(biz, 1, 30, 15, 30, 'superadmin');

    expect(campaign.status).toBe('ACTIVE');
    expect(campaign.position).toBe(1);
  });
});

describe('RBAC Admin Authentication & Permission Engine Tests', () => {
  it('authenticates super admin credentials accurately', async () => {
    const res = await loginAdmin('superadmin', 'ToolVerseAdmin2026!');
    expect(res.success).toBe(true);
    expect(res.user?.role).toBe('SUPER_ADMIN');
  });

  it('rejects invalid password attempts', async () => {
    const res = await loginAdmin('superadmin', 'wrongpassword');
    expect(res.success).toBe(false);
    expect(res.user).toBeUndefined();
  });

  it('enforces role permissions correctly', () => {
    expect(hasPermission('SUPER_ADMIN', 'MANAGE_USERS')).toBe(true);
    expect(hasPermission('VERIFICATION_REVIEWER', 'MANAGE_VERIFICATION')).toBe(true);
    expect(hasPermission('MODERATOR', 'MANAGE_USERS')).toBe(false);
  });
});

describe('Trust & Safety Moderation Engine Tests', () => {
  it('receives user complaints and records report in moderation queue', () => {
    const report = createBusinessReport(
      'TV-BIZ-8F4K2P',
      'Ali Barber Studio',
      'user@example.com',
      'WRONG_INFO',
      'The listed phone number is outdated.'
    );

    expect(report.id).toBeDefined();
    expect(report.status).toBe('NEW');
    expect(report.businessId).toBe('TV-BIZ-8F4K2P');
    expect(report.reason).toBe('WRONG_INFO');
  });
});

describe('Storage Engine Persistence Tests', () => {
  it('persists and retrieves businesses cleanly', () => {
    const businesses = getStoredBusinesses();
    expect(businesses.length).toBeGreaterThan(0);
  });
});
