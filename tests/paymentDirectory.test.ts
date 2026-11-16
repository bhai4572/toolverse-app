import { describe, it, expect } from 'vitest';
import {
  getAllPaymentDirectoryEntries,
  getAllPaymentProviders,
  getAllPaymentMethods,
  getAllPaymentCategories,
  getAllPaymentCountries,
  getAllPaymentCurrencies,
  getPaymentEntryByCategoryAndSlug,
  getCountryPaymentEcosystem,
  getProviderCountryAvailability,
  getMethodCountryAvailability,
  filterPaymentDirectory,
  saveProductPaymentRelationship,
  getProductPaymentRelationship,
  getProductsUsingPaymentEntry,
  evaluatePaymentSeoQuality,
  saveCustomPaymentEntry,
  toggleArchivePaymentEntry,
  updatePaymentSeoMetadata,
  getPaymentChangeHistory,
} from '../lib/payments/database';
import { buildPaymentEntry } from '../lib/payments/catalogHelpers';
import { getMetadataForPath } from '../lib/seo/metaEngine';
import { hasPermission } from '../lib/admin/authEngine';

describe('ToolVerse 100+ Payment Methods & Payment Gateways Directory', () => {
  it('1. contains at least 100 genuinely distinct, non-duplicate payment entries across all 11 categories', () => {
    const entries = getAllPaymentDirectoryEntries();
    const providers = getAllPaymentProviders();
    const methods = getAllPaymentMethods();
    const categories = getAllPaymentCategories();

    expect(entries.length).toBeGreaterThanOrEqual(115);
    expect(providers.length).toBeGreaterThanOrEqual(35);
    expect(methods.length).toBeGreaterThanOrEqual(75);
    expect(categories.length).toBe(11);

    // Ensure every ID and slug is strictly unique
    const ids = new Set(entries.map((e) => e.id));
    const slugs = new Set(entries.map((e) => e.slug));
    expect(ids.size).toBe(entries.length);
    expect(slugs.size).toBe(entries.length);

    // Ensure every category has entries
    for (const cat of categories) {
      const catEntries = filterPaymentDirectory(entries, { categorySlug: cat.slug });
      expect(catEntries.length).toBeGreaterThan(0);
    }
  });

  it('2. strictly separates merchant onboarding eligibility from customer payment coverage by country', () => {
    const entries = getAllPaymentDirectoryEntries();

    // Merchant mode in Pakistan (PK): Stripe & PayPal do NOT onboard local Pakistani merchants directly
    const pkMerchantEntries = filterPaymentDirectory(entries, {
      countryCode: 'PK',
      countryRoleMode: 'merchant',
    });
    const pkMerchantSlugs = pkMerchantEntries.map((e) => e.slug);
    expect(pkMerchantSlugs).toContain('safepay');
    expect(pkMerchantSlugs).toContain('payfast-pakistan');
    expect(pkMerchantSlugs).toContain('payoneer-checkout');
    expect(pkMerchantSlugs).toContain('paddle');
    expect(pkMerchantSlugs).toContain('jazzcash');
    expect(pkMerchantSlugs).toContain('easypaisa');
    expect(pkMerchantSlugs).toContain('raast');
    expect(pkMerchantSlugs).not.toContain('stripe');
    expect(pkMerchantSlugs).not.toContain('paypal');

    // Customer mode in Pakistan (PK): Pakistani cardholders CAN pay overseas Stripe merchants
    const pkCustomerEntries = filterPaymentDirectory(entries, {
      countryCode: 'PK',
      countryRoleMode: 'customer',
    });
    expect(pkCustomerEntries.map((e) => e.slug)).toContain('stripe');
  });

  it('3. resolves country payment ecosystems and evidence-based availability statuses (including Giropay Discontinued)', () => {
    const pkEco = getCountryPaymentEcosystem('pakistan');
    expect(pkEco).not.toBeNull();
    expect(pkEco?.country.code).toBe('PK');
    expect(pkEco?.country.defaultCurrency).toBe('PKR');
    expect(pkEco?.merchantAvailableProviders.length).toBeGreaterThanOrEqual(5);

    const usEco = getCountryPaymentEcosystem('united-states');
    expect(usEco?.country.code).toBe('US');
    expect(usEco?.merchantAvailableProviders.some((p) => p.slug === 'stripe')).toBe(true);

    // Giropay was officially discontinued on Dec 31, 2024
    const giropay = getPaymentEntryByCategoryAndSlug('local', 'giropay');
    expect(giropay).toBeDefined();
    expect(giropay?.operationalStatus).toBe('Discontinued');
    const giropayMatrix = getMethodCountryAvailability('pm_giropay');
    expect(giropayMatrix.every((m) => m.availabilityStatus === 'Discontinued')).toBe(true);

    const stripeMatrix = getProviderCountryAvailability('prv_stripe');
    const stripeUS = stripeMatrix.find((r) => r.countryCode === 'US');
    const stripePK = stripeMatrix.find((r) => r.countryCode === 'PK');
    expect(stripeUS?.availabilityStatus).toBe('Supported');
    expect(stripePK?.merchantAccountEligible).toBe(false);
    expect(stripePK?.availabilityStatus).toBe('Limited support');
  });

  it('4. records explicit blockchain networks per cryptocurrency asset', () => {
    const nowpayments = getPaymentEntryByCategoryAndSlug('crypto', 'nowpayments');
    expect(nowpayments).toBeDefined();
    expect(nowpayments?.cryptoDetails).toBeDefined();
    const usdtAsset = nowpayments?.cryptoDetails?.supportedAssets.find((a: any) => a.symbol === 'USDT');
    expect(usdtAsset?.networks.some((n: string) => n.toLowerCase().includes('trc-20'))).toBe(true);
    expect(usdtAsset?.networks).toContain('Ethereum (ERC-20)');

    const lightning = getPaymentEntryByCategoryAndSlug('crypto-methods', 'bitcoin-lightning');
    expect(lightning?.cryptoDetails?.supportedAssets[0].networks).toContain('Bitcoin Lightning Network');
  });

  it('5. supports combinable search, currency, capability, and sorting filters', () => {
    const entries = getAllPaymentDirectoryEntries();
    const allCurrencies = getAllPaymentCurrencies();
    const allCountries = getAllPaymentCountries();
    expect(allCurrencies.length).toBeGreaterThanOrEqual(25);
    expect(allCountries.length).toBeGreaterThanOrEqual(25);

    const brlResults = filterPaymentDirectory(entries, {
      currencyCode: 'BRL',
      supportsLocalMethods: true,
    });
    expect(brlResults.some((e) => e.slug === 'pix')).toBe(true);

    const searchRes = filterPaymentDirectory(entries, {
      searchQuery: 'Solana',
      supportsCrypto: true,
    });
    expect(searchRes.some((e) => e.slug === 'solana-pay' || e.slug === 'usdc')).toBe(true);
  });

  it('6. enforces strict SEO title (<= 60 chars) and meta description (<= 160 chars) across all 117+ entries', () => {
    const entries = getAllPaymentDirectoryEntries();
    for (const entry of entries) {
      expect(entry.seo.seoTitle.length).toBeLessThanOrEqual(60);
      expect(entry.seo.metaDescription.length).toBeLessThanOrEqual(160);
      expect(entry.seo.canonicalUrl).toBe(
        `https://toolverse.baby/payment-methods/${entry.primaryCategorySlug}/${entry.slug}`
      );
      const report = evaluatePaymentSeoQuality(entry);
      expect(report.score).toBeGreaterThanOrEqual(85);
      expect(report.isIndexable).toBe(true);
    }

    const hubMeta = getMetadataForPath('/payment-methods');
    expect(hubMeta.title.length).toBeLessThanOrEqual(60);
    expect(hubMeta.canonicalUrl).toBe('https://toolverse.baby/payment-methods');

    const stripeMeta = getMetadataForPath('/payment-methods/gateways/stripe');
    expect(stripeMeta.title.length).toBeLessThanOrEqual(60);
    expect(stripeMeta.canonicalUrl).toBe('https://toolverse.baby/payment-methods/gateways/stripe');

    const countryMeta = getMetadataForPath('/payment-methods/countries/pakistan');
    expect(countryMeta.title.length).toBeLessThanOrEqual(60);
    expect(countryMeta.canonicalUrl).toBe('https://toolverse.baby/payment-methods/countries/pakistan');
  });

  it('7. stores relational ProductPaymentRelationships and links products to payment pages', () => {
    saveProductPaymentRelationship({
      productId: 'prod_test_saas',
      productSlug: 'test-saas-tool',
      pricingModel: 'Subscription',
      freePlanAvailable: true,
      freeTrialAvailable: true,
      startingPrice: '19',
      billingCurrency: 'USD',
      billingFrequency: ['Monthly', 'Annual'],
      acceptedGatewayIds: ['prv_stripe', 'prv_paddle'],
      acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_apple_pay', 'pm_usdc'],
      acceptedCurrencies: ['USD', 'EUR'],
      cryptoAccepted: true,
      acceptedCryptoNetworks: ['Solana (SPL)', 'Base'],
      subscriptionBillingSupported: true,
      oneTimePurchaseSupported: false,
      supportedBillingCountries: ['US', 'GB', 'PK'],
      verificationStatus: 'Confirmed by Official Documentation',
      lastVerifiedDate: '2026-11-11',
    });

    const rel = getProductPaymentRelationship('test-saas-tool');
    expect(rel).toBeDefined();
    expect(rel?.acceptedGatewayIds).toContain('prv_paddle');

    const paddleProds = getProductsUsingPaymentEntry('prv_paddle');
    expect(paddleProds.some((p) => p.productSlug === 'test-saas-tool')).toBe(true);
  });

  it('8. supports Admin CRUD, SEO overrides, archiving, audit history, and RBAC permission checks', () => {
    expect(hasPermission('SUPER_ADMIN', 'MANAGE_PAYMENTS')).toBe(true);
    expect(hasPermission('VERIFICATION_REVIEWER', 'MANAGE_PAYMENTS')).toBe(true);
    expect(hasPermission('MODERATOR', 'MANAGE_PAYMENTS')).toBe(false);

    const customEntry = buildPaymentEntry({
      id: 'prv_custom_test',
      slug: 'custom-test-gateway',
      entryKind: 'provider',
      officialName: 'Custom Test Gateway Ltd.',
      brandName: 'CustomTestPay',
      brandColor: '#10B981',
      primaryCategorySlug: 'gateways',
      providerType: 'Payment Gateway',
      shortDescription: 'Test payment gateway for automated admin verification.',
      uniqueIntroduction: 'CustomTestPay is a test payment gateway entry created in the admin suite with full documentation.',
      overview: 'Provides REST API checkout and multi-currency settlement for global SaaS.',
      howItWorks: ['Connect API', 'Accept checkout', 'Settle funds'],
      officialWebsite: 'https://example.com',
      documentationUrl: 'https://example.com/docs',
      apiAvailable: true,
      sdkAvailable: true,
      pluginAvailable: true,
      supportedPlatforms: ['Web'],
      supportedIntegrationTypes: ['REST API'],
      supportedBusinessModels: ['SaaS'],
      merchantEligibleCountryCodes: ['US', 'GB'],
      merchantEligibilitySummary: 'US and UK merchants.',
      customerPaymentCountryCodes: ['US', 'GB'],
      customerCoverageSummary: 'Global payers.',
      supportedCurrencies: ['USD', 'GBP'],
      settlementCurrencies: ['USD', 'GBP'],
      transactionFees: '2.5% + $0.20',
      refundSupport: 'Full & Partial Refunds',
      refundDetails: 'API refunds supported.',
      recurringPaymentSupport: true,
      subscriptionSupport: true,
      recurringAndSubscriptionDetails: 'Recurring billing supported.',
      chargebackSupport: true,
      chargebackDetails: 'Standard dispute handling.',
      paymentLinksSupport: true,
      invoicingSupport: true,
      payoutSupport: true,
      payoutDetails: 'T+2 bank payout.',
      kycKybRequirements: 'Standard KYB.',
      businessEligibilityDetails: 'Registered entity.',
      onlinePaymentSupported: true,
      inPersonPaymentSupported: false,
      oneTimePaymentSupported: true,
      freeIntegrationAvailable: true,
      integrationComplexity: 'Low',
      features: ['API Webhooks'],
      advantages: ['Low fees'],
      limitations: ['US/UK only'],
      alternativeIds: ['prv_stripe'],
      linkedEntityIds: ['pm_visa'],
      popularityRank: 99,
    });

    saveCustomPaymentEntry(customEntry, 'superadmin@toolverse.baby', 'Unit test creation');
    expect(getPaymentEntryByCategoryAndSlug('gateways', 'custom-test-gateway')).toBeDefined();

    updatePaymentSeoMetadata(
      'prv_custom_test',
      { seoTitle: 'CustomTestPay Gateway Fees & Countries | ToolVerse' },
      'superadmin@toolverse.baby'
    );
    const updated = getPaymentEntryByCategoryAndSlug('gateways', 'custom-test-gateway');
    expect(updated?.seo.seoTitle).toBe('CustomTestPay Gateway Fees & Countries | ToolVerse');

    toggleArchivePaymentEntry('prv_custom_test', true, 'superadmin@toolverse.baby');
    expect(
      getAllPaymentDirectoryEntries(false).some((e) => e.id === 'prv_custom_test')
    ).toBe(false);

    const history = getPaymentChangeHistory();
    expect(history.length).toBeGreaterThanOrEqual(3);
  });
});

