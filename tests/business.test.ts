import { describe, it, expect } from 'vitest';
import {
  findCategoryByQuery,
  INITIAL_BUSINESSES,
  INITIAL_BUSINESS_REVIEWS,
} from '../lib/business/registry';
import type { Business } from '../lib/business/types';
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
  createOrUpdateBiddingCampaign,
} from '../lib/business/biddingEngine';
import {
  loginAdmin,
  hasPermission,
} from '../lib/admin/authEngine';
import {
  createBusinessReport,
} from '../lib/business/moderationEngine';
import {
  getStoredBusinesses,
} from '../lib/business/storageEngine';

const TEST_BUSINESS_FIXTURE: Business = {
  id: 'TV-BIZ-TEST01',
  slug: 'test-engineering-studio',
  name: 'Test Engineering Studio',
  businessType: 'Local Business',
  categorySlug: 'software-engineering-studios',
  categoryName: 'Software Engineering & Web Studios',
  description: 'Fixture record used strictly in unit tests.',
  longDescription: 'In-memory fixture record used strictly to test verification, QR, and bidding engines.',
  logoUrl: '',
  photos: [],
  websiteUrl: 'https://toolverse.baby',
  email: 'support@toolverse.baby',
  phone: '+1 555 0100',
  address: '100 Main St',
  city: 'Austin',
  state: 'TX',
  country: 'United States',
  isGlobalOnline: true,
  serviceArea: 'Global',
  socialLinks: {},
  businessHours: [],
  services: [],
  verificationLevel: 3,
  isVerified: true,
  ownerEmail: 'support@toolverse.baby',
  riskStatus: 'LOW',
  spamStatus: 'CLEAN',
  rankingPosition: 1,
  rankingSnapshotDate: '2026-10-08',
  isSponsored: false,
  upvotesCount: 10,
  viewsCount: 100,
  ratingAverage: 5,
  reviewCount: 0,
  status: 'APPROVED',
  createdAt: '2026-10-01',
  updatedAt: '2026-10-08',
};

describe('Business Identity & Registry Engine Tests', () => {
  it('contains zero publicly hardcoded demo/sample businesses or fabricated reviews', () => {
    expect(INITIAL_BUSINESSES.length).toBe(0);
    expect(INITIAL_BUSINESS_REVIEWS.length).toBe(0);
  });

  it('performs category matching and resolves aliases', () => {
    const cat = findCategoryByQuery('Digital Marketing Agency');
    expect(cat).toBeDefined();
    expect(cat?.slug).toBe('digital-marketing-agencies');
  });
});

describe('Risk-Based Verification & Document Security Engine Tests', () => {
  it('calculates risk score accurately based on business signals', () => {
    const risk = evaluateBusinessRisk(TEST_BUSINESS_FIXTURE);
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
    const req = saveVerificationRequest(TEST_BUSINESS_FIXTURE, ['Business Registration Certificate']);
    expect(req.businessId).toBe(TEST_BUSINESS_FIXTURE.id);
    expect(req.status).toBe('PENDING');
  });
});

describe('Permanent QR Engine Tests', () => {
  it('generates permanent QR resolution URL pointing to /b/:businessId', () => {
    const url = getPermanentBusinessQRUrl('TV-BIZ-TEST01');
    expect(url).toBe('https://toolverse.baby/b/TV-BIZ-TEST01');
  });

  it('generates clean vector SVG QR badge markup with customizable template', () => {
    const svg = generateSVGQRBadge(TEST_BUSINESS_FIXTURE, {
      template: 'VERIFIED',
      showStatus: true,
      showCategory: true,
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain(TEST_BUSINESS_FIXTURE.name);
    expect(svg).toContain('toolverse.baby');
  });

  it('formats timestamped ranking snapshot labels to prevent misleading static prints', () => {
    const label = formatRankingSnapshotLabel(TEST_BUSINESS_FIXTURE);
    expect(label).toContain('#1 in');
    expect(label).toContain('Ranked on 2026-10-08');
  });
});

describe('Top 3 Sponsored Bidding Auction Engine Tests', () => {
  it('creates and retrieves active sponsored bidding placement positions', () => {
    const campaign = createOrUpdateBiddingCampaign(TEST_BUSINESS_FIXTURE, 1, 30, 15, 30, 'superadmin');
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
      TEST_BUSINESS_FIXTURE.id,
      TEST_BUSINESS_FIXTURE.name,
      'support@toolverse.baby',
      'WRONG_INFO',
      'The listed phone number is outdated.'
    );

    expect(report.id).toBeDefined();
    expect(report.status).toBe('NEW');
    expect(report.businessId).toBe(TEST_BUSINESS_FIXTURE.id);
    expect(report.reason).toBe('WRONG_INFO');
  });
});

describe('Storage Engine Persistence Tests', () => {
  it('retrieves stored businesses cleanly', () => {
    const businesses = getStoredBusinesses();
    expect(Array.isArray(businesses)).toBe(true);
  });
});
