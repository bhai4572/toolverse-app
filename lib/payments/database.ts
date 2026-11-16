import {
  PaymentCategory,
  PaymentCategorySlug,
  PaymentCountry,
  PaymentCurrency,
  PaymentDirectoryEntry,
  PaymentProvider,
  PaymentMethod,
  ProviderCountryAvailability,
  MethodCountryAvailability,
  ProviderMethodRelationship,
  PaymentIntegration,
  ProductPaymentRelationship,
  VerificationSourceRecord,
  PaymentChangeHistoryRecord,
  PaymentDirectoryFilterState,
  AvailabilityStatus,
  PaymentSeoMetadata,
} from './types';
import { PAYMENT_CATEGORIES, PAYMENT_COUNTRIES, PAYMENT_CURRENCIES } from './countriesAndCurrencies';
import { PAYMENT_PROVIDERS } from './providersCatalog';
import { PAYMENT_METHODS } from './methodsCatalog';
import { buildPaymentSvgLogo, fitPaymentSeoTitle, fitPaymentMetaDescription } from './catalogHelpers';

const CUSTOM_PAYMENTS_KEY = 'toolverse_custom_payment_entries_v1';
const ARCHIVED_PAYMENT_IDS_KEY = 'toolverse_archived_payment_ids_v1';
const SEO_OVERRIDES_KEY = 'toolverse_payment_seo_overrides_v1';
const PRODUCT_PAYMENTS_KEY = 'toolverse_product_payment_relationships_v1';
const CHANGE_HISTORY_KEY = 'toolverse_payment_change_history_v1';

let memCustomEntries: PaymentDirectoryEntry[] = [];
let memArchivedIds: string[] = [];
let memSeoOverrides: Record<string, Partial<PaymentSeoMetadata>> = {};
let memProductPayments: Record<string, ProductPaymentRelationship> = {};
let memChangeHistory: PaymentChangeHistoryRecord[] = [];

function notifyPaymentStoreChanged() {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('toolverse_payments_changed'));
    } catch {
      // ignore
    }
  }
}

function readJsonStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyPaymentStoreChanged();
  } catch {
    // ignore
  }
}

// --- Seeded ProductPaymentRelationships (Entity J) for Popular Products ---
const SEEDED_PRODUCT_PAYMENTS: Record<string, ProductPaymentRelationship> = {
  chatgpt: {
    productId: 'prod_chatgpt',
    productSlug: 'chatgpt',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: false,
    startingPrice: '20',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual', 'Usage-Based'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_apple_pay', 'pm_google_pay', 'pm_discover', 'pm_jcb'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: true,
    refundPolicyUrl: 'https://openai.com/policies/terms-of-use',
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'ES', 'SG', 'JP', 'AE', 'BR', 'MX'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  notion: {
    productId: 'prod_notion',
    productSlug: 'notion',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: true,
    startingPrice: '10',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_apple_pay', 'pm_google_pay', 'pm_sepa_debit', 'pm_ach'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: false,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'ES', 'SG', 'JP', 'BR'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  figma: {
    productId: 'prod_figma',
    productSlug: 'figma',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: true,
    startingPrice: '15',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_sepa_debit', 'pm_ach', 'pm_wire_swift'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: false,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'NL', 'FR', 'SG', 'JP', 'IN'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  canva: {
    productId: 'prod_canva',
    productSlug: 'canva',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: true,
    startingPrice: '15',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual', 'One-Time'],
    acceptedGatewayIds: ['prv_stripe', 'prv_adyen', 'prv_paypal', 'prv_ebanx', 'prv_paymongo'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_paypal_wallet', 'pm_apple_pay', 'pm_google_pay', 'pm_ideal', 'pm_bancontact', 'pm_pix', 'pm_gcash', 'pm_upi', 'pm_sofort'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'BRL', 'PHP', 'INR', 'MXN', 'SGD', 'JPY'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: true,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'ES', 'BE', 'BR', 'MX', 'PH', 'SG', 'JP'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  shopify: {
    productId: 'prod_shopify',
    productSlug: 'shopify',
    pricingModel: 'Subscription',
    freePlanAvailable: false,
    freeTrialAvailable: true,
    startingPrice: '39',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual'],
    acceptedGatewayIds: ['prv_stripe', 'prv_paypal', 'prv_adyen', 'prv_coinbase_commerce', 'prv_bitpay', 'prv_mollie', 'prv_razorpay', 'prv_paymongo', 'prv_safepay'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_paypal_wallet', 'pm_apple_pay', 'pm_google_pay', 'pm_klarna', 'pm_afterpay', 'pm_affirm', 'pm_ideal', 'pm_bancontact', 'pm_upi', 'pm_usdc', 'pm_bitcoin', 'pm_solana_pay'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY', 'INR', 'PKR', 'AED'],
    cryptoAccepted: true,
    acceptedCryptoNetworks: ['Solana (SPL)', 'Base', 'Polygon', 'Ethereum (ERC-20)', 'Bitcoin Mainnet'],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: true,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'ES', 'SG', 'JP', 'AE'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  stripe: {
    productId: 'prod_stripe',
    productSlug: 'stripe',
    pricingModel: 'Paid',
    freePlanAvailable: true,
    freeTrialAvailable: false,
    startingPrice: '0',
    billingCurrency: 'USD',
    billingFrequency: ['Usage-Based', 'Monthly'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_apple_pay', 'pm_google_pay', 'pm_ach', 'pm_sepa_debit', 'pm_ideal', 'pm_bancontact', 'pm_blik', 'pm_klarna', 'pm_afterpay', 'pm_affirm', 'pm_pix', 'pm_upi', 'pm_usdc'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD', 'CHF', 'SEK', 'PLN', 'AED', 'BRL', 'MXN', 'INR'],
    cryptoAccepted: true,
    acceptedCryptoNetworks: ['Solana (SPL)', 'Base', 'Ethereum (ERC-20)', 'Polygon'],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: true,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'NL', 'FR', 'ES', 'BE', 'SE', 'CH', 'PL', 'SG', 'JP', 'AE', 'MX', 'BR', 'IN', 'TH'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  supabase: {
    productId: 'prod_supabase',
    productSlug: 'supabase',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: false,
    startingPrice: '25',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Usage-Based'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_ach', 'pm_wire_swift'],
    acceptedCurrencies: ['USD'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: false,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'SG', 'JP', 'BR'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  vercel: {
    productId: 'prod_vercel',
    productSlug: 'vercel',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: true,
    startingPrice: '20',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual', 'Usage-Based'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_ach', 'pm_sepa_debit'],
    acceptedCurrencies: ['USD'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: false,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'SG', 'JP', 'BR'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  linear: {
    productId: 'prod_linear',
    productSlug: 'linear',
    pricingModel: 'Freemium',
    freePlanAvailable: true,
    freeTrialAvailable: true,
    startingPrice: '8',
    billingCurrency: 'USD',
    billingFrequency: ['Monthly', 'Annual'],
    acceptedGatewayIds: ['prv_stripe', 'prv_stripe_billing'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_ach'],
    acceptedCurrencies: ['USD', 'EUR'],
    cryptoAccepted: false,
    acceptedCryptoNetworks: [],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: false,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'NL', 'FR', 'SE', 'SG', 'JP'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
  namecheap: {
    productId: 'prod_namecheap',
    productSlug: 'namecheap',
    pricingModel: 'Paid',
    freePlanAvailable: false,
    freeTrialAvailable: false,
    startingPrice: '9',
    billingCurrency: 'USD',
    billingFrequency: ['One-Time', 'Annual', 'Monthly'],
    acceptedGatewayIds: ['prv_stripe', 'prv_paypal', 'prv_bitpay', 'prv_btcpay_server'],
    acceptedMethodIds: ['pm_visa', 'pm_mastercard', 'pm_american_express', 'pm_discover', 'pm_paypal_wallet', 'pm_bitcoin', 'pm_bitcoin_lightning', 'pm_ethereum', 'pm_usdc', 'pm_usdt', 'pm_litecoin'],
    acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'BTC', 'USDC', 'USDT'],
    cryptoAccepted: true,
    acceptedCryptoNetworks: ['Bitcoin Mainnet', 'Bitcoin Lightning Network', 'Ethereum (ERC-20)', 'Polygon', 'Litecoin Mainnet'],
    subscriptionBillingSupported: true,
    oneTimePurchaseSupported: true,
    supportedBillingCountries: ['US', 'GB', 'CA', 'AU', 'PK', 'IN', 'DE', 'NL', 'FR', 'ES', 'SG', 'NG', 'KE'],
    verificationStatus: 'Confirmed by Official Documentation',
    lastVerifiedDate: '2026-11-10',
  },
};

// --- Core Accessors (Entities A, B, C, D, E) ---
export function getAllPaymentCategories(): (PaymentCategory & { seoTitle: string; metaDescription: string })[] {
  return PAYMENT_CATEGORIES.map((c) => ({
    ...c,
    seoTitle: fitPaymentSeoTitle(`${c.name} Directory | ToolVerse`),
    metaDescription: fitPaymentMetaDescription(c.description),
  }));
}

export function getPaymentCategoryBySlug(slug: string): (PaymentCategory & { seoTitle: string; metaDescription: string }) | undefined {
  const all = getAllPaymentCategories();
  if (slug === 'crypto') {
    return all.find((c) => c.slug === 'crypto-gateways');
  }
  return all.find((c) => c.slug === slug);
}

export function getAllPaymentCountries(): any[] {
  return PAYMENT_COUNTRIES.map((c: any) => ({
    ...c,
    flagEmoji: c.flagEmoji || c.flag || '🌐',
    defaultCurrency: c.defaultCurrency || c.defaultCurrencyCode || 'USD',
    supportedCurrencies: c.supportedCurrencies || [c.defaultCurrencyCode || 'USD', 'USD', 'EUR'],
    regulatorName: c.regulatorName || c.officialCentralBankOrRegulator || 'Central Bank',
    regulatorUrl: c.regulatorUrl || c.officialRegulatorUrl || 'https://www.bis.org',
    marketSummary:
      c.marketSummary ||
      `${c.localBankRailsSummary || ''} ${c.localMobileSystemsSummary || ''} ${c.internationalCardSupportSummary || ''}`.trim(),
    localBankingRails: c.localBankingRails || [c.localBankRailsSummary || 'Domestic Interbank Rail'],
    mobilePaymentSystems: c.mobilePaymentSystems || [c.localMobileSystemsSummary || 'Mobile Wallets'],
    onboardingRequirements:
      c.onboardingRequirements ||
      (Array.isArray(c.merchantOnboardingRequirements)
        ? c.merchantOnboardingRequirements.join('; ')
        : 'Standard KYB business registration and domestic bank account.'),
    restrictionsNote:
      c.restrictionsNote ||
      (Array.isArray(c.relevantRestrictions)
        ? c.relevantRestrictions.join('; ')
        : 'Standard AML/CFT compliance applies.'),
    cryptoRegulatoryNote: c.cryptoRegulatoryNote || c.cryptoRegulatorySummary || 'Subject to domestic VASP regulations.',
  }));
}

export function getPaymentCountryBySlugOrCode(slugOrCode: string): any | undefined {
  const norm = slugOrCode.trim().toLowerCase();
  return getAllPaymentCountries().find(
    (c) => c.slug === norm || c.code.toLowerCase() === norm || c.name.toLowerCase() === norm
  );
}

export function getAllPaymentCurrencies(): PaymentCurrency[] {
  return PAYMENT_CURRENCIES;
}

export function getArchivedPaymentIds(): string[] {
  return readJsonStorage<string[]>(ARCHIVED_PAYMENT_IDS_KEY, memArchivedIds);
}

export function getCustomPaymentEntries(): PaymentDirectoryEntry[] {
  return readJsonStorage<PaymentDirectoryEntry[]>(CUSTOM_PAYMENTS_KEY, memCustomEntries);
}

export function getPaymentSeoOverrides(): Record<string, Partial<PaymentSeoMetadata>> {
  return readJsonStorage<Record<string, Partial<PaymentSeoMetadata>>>(SEO_OVERRIDES_KEY, memSeoOverrides);
}

function applySeoOverrides(entry: PaymentDirectoryEntry, overrides: Record<string, Partial<PaymentSeoMetadata>>): PaymentDirectoryEntry {
  const ov = overrides[entry.id] || overrides[entry.slug];
  if (!ov) return entry;
  return {
    ...entry,
    seo: {
      ...entry.seo,
      ...ov,
    },
  };
}

export function getAllPaymentDirectoryEntries(includeArchived = false): PaymentDirectoryEntry[] {
  const archived = new Set(getArchivedPaymentIds());
  const custom = getCustomPaymentEntries();
  const overrides = getPaymentSeoOverrides();
  const combined: PaymentDirectoryEntry[] = [...PAYMENT_PROVIDERS, ...PAYMENT_METHODS, ...custom];
  const deduped = new Map<string, PaymentDirectoryEntry>();
  for (const item of combined) {
    deduped.set(item.id, applySeoOverrides(item, overrides));
  }
  const list = Array.from(deduped.values());
  if (includeArchived) return list;
  return list.filter((e) => !e.isArchived && !archived.has(e.id));
}

export function getAllPaymentProviders(includeArchived = false): PaymentProvider[] {
  return getAllPaymentDirectoryEntries(includeArchived).filter(
    (e): e is PaymentProvider => e.entryKind === 'provider'
  );
}

export function getAllPaymentMethods(includeArchived = false): PaymentMethod[] {
  return getAllPaymentDirectoryEntries(includeArchived).filter(
    (e): e is PaymentMethod => e.entryKind === 'method'
  );
}

export function getPaymentEntryById(id: string): PaymentDirectoryEntry | undefined {
  return getAllPaymentDirectoryEntries(true).find((e) => e.id === id);
}

export function getPaymentEntryBySlug(slug: string): PaymentDirectoryEntry | undefined {
  const norm = slug.trim().toLowerCase();
  return getAllPaymentDirectoryEntries(true).find((e) => e.slug.toLowerCase() === norm);
}

/**
 * Resolves `/payment-methods/[category]/[slug]` as well as `/payment-methods/crypto/[slug]` alias.
 */
export function getPaymentEntryByCategoryAndSlug(
  categorySlug: string,
  slug: string
): PaymentDirectoryEntry | undefined {
  const normSlug = slug.trim().toLowerCase();
  const normCat = categorySlug.trim().toLowerCase();
  const entry = getPaymentEntryBySlug(normSlug);
  if (!entry) return undefined;
  if (normCat === 'crypto' && (entry.primaryCategorySlug === 'crypto-gateways' || entry.primaryCategorySlug === 'crypto-methods')) {
    return entry;
  }
  if (
    entry.primaryCategorySlug === normCat ||
    entry.secondaryCategorySlugs.includes(normCat as PaymentCategorySlug)
  ) {
    return entry;
  }
  return entry;
}

// --- Entities F, G, H, I, K Relational Builders ---
export function getProviderCountryAvailability(providerId: string): any[] {
  const entry = getPaymentEntryById(providerId);
  if (!entry) return [];
  const merchantSet = new Set(entry.merchantEligibleCountryCodes);
  const customerSet = new Set(entry.customerPaymentCountryCodes);
  return getAllPaymentCountries().map((country: any) => {
    const merchantSupported = merchantSet.has(country.code);
    const customerSupported = customerSet.has(country.code);
    let availabilityStatus: AvailabilityStatus = 'Not supported';
    if (entry.operationalStatus === 'Discontinued') {
      availabilityStatus = 'Discontinued';
    } else if (merchantSupported) {
      availabilityStatus = 'Supported';
    } else if (customerSupported) {
      availabilityStatus = 'Limited support';
    }
    return {
      id: `pca_${entry.id}_${country.code}`,
      providerId: entry.id,
      countryCode: country.code,
      merchantAccountEligible: merchantSupported,
      customerCheckoutSupported: customerSupported,
      localAcquiringSupported: merchantSupported,
      crossBorderSupported: customerSupported,
      availabilityStatus,
      onboardingRequirements: merchantSupported
        ? `${country.onboardingRequirements} (${entry.kycKybRequirements})`
        : `Direct local merchant onboarding not supported in ${country.name}; available via Merchant of Record (Paddle/Lemon Squeezy/Payoneer) or foreign entity.`,
      restrictions: country.restrictionsNote,
      supportedLocalCurrencies: (country.supportedCurrencies || []).filter((c: string) => entry.supportedCurrencies.includes(c)),
      settlementCurrencies: entry.settlementCurrencies,
      sourceUrl: entry.officialWebsite,
      lastVerifiedDate: entry.lastVerifiedDate,
    };
  });
}

export function getMethodCountryAvailability(methodId: string): any[] {
  const entry = getPaymentEntryById(methodId);
  if (!entry) return [];
  const merchantSet = new Set(entry.merchantEligibleCountryCodes);
  const customerSet = new Set(entry.customerPaymentCountryCodes);
  return getAllPaymentCountries().map((country: any) => {
    const merchantSupported = merchantSet.has(country.code);
    const customerSupported = customerSet.has(country.code);
    let availabilityStatus: AvailabilityStatus = 'Not supported';
    if (entry.operationalStatus === 'Discontinued') {
      availabilityStatus = 'Discontinued';
    } else if (customerSupported && merchantSupported) {
      availabilityStatus = 'Supported';
    } else if (customerSupported || merchantSupported) {
      availabilityStatus = 'Limited support';
    }
    return {
      id: `mca_${entry.id}_${country.code}`,
      methodId: entry.id,
      countryCode: country.code,
      merchantAcceptanceSupported: merchantSupported,
      customerUsageSupported: customerSupported,
      availabilityStatus,
      supportedCurrencies: (country.supportedCurrencies || []).filter((c: string) => entry.supportedCurrencies.includes(c)),
      restrictions: country.restrictionsNote,
      sourceUrl: entry.officialWebsite,
      lastVerifiedDate: entry.lastVerifiedDate,
    };
  });
}

export function getProviderMethodRelationships(entryId: string): ProviderMethodRelationship[] {
  const entry = getPaymentEntryById(entryId);
  if (!entry) return [];
  if (entry.entryKind === 'provider') {
    return entry.supportedMethodIds.map((methodId) => ({
      id: `pmr_${entry.id}_${methodId}`,
      providerId: entry.id,
      methodId,
      nativeIntegration: true,
      recurringSupported: entry.recurringPaymentSupport,
      refundSupported: entry.refundSupport !== 'No Native Refund (Manual Transfer)',
      settlementNotes: `Settled via ${entry.brandName} in ${entry.settlementCurrencies.slice(0, 4).join(', ')}.`,
    }));
  }
  return entry.supportedByProviderIds.map((providerId) => ({
    id: `pmr_${providerId}_${entry.id}`,
    providerId,
    methodId: entry.id,
    nativeIntegration: true,
    recurringSupported: entry.recurringPaymentSupport,
    refundSupported: entry.refundSupport !== 'No Native Refund (Manual Transfer)',
    settlementNotes: `Supported natively via ${providerId.replace('prv_', '').toUpperCase()}.`,
  }));
}

export function getPaymentIntegrationsForEntry(entryId: string): PaymentIntegration[] {
  const entry = getPaymentEntryById(entryId);
  if (!entry) return [];
  return [
    {
      id: `int_${entry.id}_api`,
      entityId: entry.id,
      entityKind: entry.entryKind,
      apiAvailable: entry.apiAvailable,
      sdkLanguages: ['JavaScript / TypeScript', 'Node.js', 'Python', 'PHP', 'Go', 'Ruby', 'Java', '.NET'],
      ecommercePlugins: entry.supportedPlatforms,
      hostedCheckoutSupported: true,
      embeddedElementsSupported: true,
      webhooksSupported: true,
      sandboxAvailable: true,
      documentationUrl: entry.documentationUrl,
      apiReferenceUrl: entry.documentationUrl,
    },
  ];
}

export function getCountryPaymentEcosystem(countrySlugOrCode: string) {
  const country = getPaymentCountryBySlugOrCode(countrySlugOrCode);
  if (!country) return null;
  const all = getAllPaymentDirectoryEntries();
  const merchantAvailableProviders = all.filter(
    (e): e is PaymentProvider => e.entryKind === 'provider' && e.merchantEligibleCountryCodes.includes(country.code)
  );
  const customerAvailableProviders = all.filter(
    (e): e is PaymentProvider => e.entryKind === 'provider' && e.customerPaymentCountryCodes.includes(country.code)
  );
  const localAndCustomerMethods = all.filter(
    (e): e is PaymentMethod =>
      e.entryKind === 'method' &&
      (e.customerPaymentCountryCodes.includes(country.code) || e.merchantEligibleCountryCodes.includes(country.code))
  );
  const wallets = localAndCustomerMethods.filter((m) => m.primaryCategorySlug === 'digital-wallets');
  const bankRails = localAndCustomerMethods.filter((m) => m.primaryCategorySlug === 'bank-transfers' || m.secondaryCategorySlugs.includes('bank-transfers'));
  const localMethods = localAndCustomerMethods.filter((m) => m.primaryCategorySlug === 'local');
  const cards = localAndCustomerMethods.filter((m) => m.primaryCategorySlug === 'cards');
  const bnpl = localAndCustomerMethods.filter((m) => m.primaryCategorySlug === 'bnpl');
  const cryptoGateways = all.filter((e) => e.primaryCategorySlug === 'crypto-gateways');

  return {
    country,
    merchantAvailableProviders,
    customerAvailableProviders,
    localAndCustomerMethods,
    wallets,
    bankRails,
    localMethods,
    cards,
    bnpl,
    cryptoGateways,
  };
}

// --- Filtering & Comparison Engine (Phase 4) ---
export function getDefaultPaymentFilterState(): PaymentDirectoryFilterState {
  return {
    searchQuery: '',
    categorySlug: 'all',
    countryCode: 'all',
    countryRoleMode: 'merchant',
    currencyCode: 'all',
    providerType: 'all',
    businessModel: 'all',
    supportsSubscriptions: false,
    supportsOneTime: false,
    supportsCrypto: false,
    supportsCards: false,
    supportsBankTransfer: false,
    supportsDigitalWallets: false,
    supportsBNPL: false,
    supportsLocalMethods: false,
    supportsMobilePayments: false,
    supportsPayouts: false,
    supportsRefunds: false,
    apiAvailable: false,
    pluginAvailable: false,
    freeToIntegrate: false,
    sortBy: 'popularity',
  };
}

export function filterPaymentDirectory(
  entries: PaymentDirectoryEntry[],
  filters: Partial<PaymentDirectoryFilterState>
): PaymentDirectoryEntry[] {
  const f: PaymentDirectoryFilterState = { ...getDefaultPaymentFilterState(), ...filters };
  const q = f.searchQuery.trim().toLowerCase();

  const filtered = entries.filter((e) => {
    if (f.categorySlug !== 'all') {
      const catMatch =
        e.primaryCategorySlug === f.categorySlug ||
        e.secondaryCategorySlugs.includes(f.categorySlug) ||
        (f.categorySlug === ('crypto' as PaymentCategorySlug) &&
          (e.primaryCategorySlug === 'crypto-gateways' || e.primaryCategorySlug === 'crypto-methods'));
      if (!catMatch) return false;
    }

    if (f.countryCode !== 'all') {
      const code = f.countryCode.toUpperCase();
      if (f.countryRoleMode === 'merchant') {
        if (!e.merchantEligibleCountryCodes.includes(code)) return false;
      } else {
        if (!e.customerPaymentCountryCodes.includes(code)) return false;
      }
    }

    if (f.currencyCode !== 'all') {
      const curr = f.currencyCode.toUpperCase();
      if (!e.supportedCurrencies.includes(curr) && !e.settlementCurrencies.includes(curr)) {
        return false;
      }
    }

    if (f.providerType !== 'all' && e.providerType !== f.providerType) return false;
    if (f.businessModel !== 'all' && !e.supportedBusinessModels.includes(f.businessModel as any)) return false;
    if (f.supportsSubscriptions && !e.subscriptionSupport && !e.recurringPaymentSupport) return false;
    if (f.supportsOneTime && !e.oneTimePaymentSupported) return false;
    if (f.supportsCrypto && e.primaryCategorySlug !== 'crypto-gateways' && e.primaryCategorySlug !== 'crypto-methods' && !e.cryptoDetails) return false;
    if (f.supportsCards && e.primaryCategorySlug !== 'cards' && !(e.entryKind === 'provider' && e.supportedMethodIds.some((m) => m.includes('visa') || m.includes('mastercard')))) return false;
    if (f.supportsBankTransfer && e.primaryCategorySlug !== 'bank-transfers' && !e.secondaryCategorySlugs.includes('bank-transfers')) return false;
    if (f.supportsDigitalWallets && e.primaryCategorySlug !== 'digital-wallets' && !e.secondaryCategorySlugs.includes('digital-wallets')) return false;
    if (f.supportsBNPL && e.primaryCategorySlug !== 'bnpl' && !e.secondaryCategorySlugs.includes('bnpl')) return false;
    if (f.supportsLocalMethods && e.primaryCategorySlug !== 'local' && !e.secondaryCategorySlugs.includes('local')) return false;
    if (f.supportsMobilePayments && e.primaryCategorySlug !== 'mobile-payments' && !e.secondaryCategorySlugs.includes('mobile-payments')) return false;
    if (f.supportsPayouts && !e.payoutSupport) return false;
    if (f.supportsRefunds && e.refundSupport === 'No Native Refund (Manual Transfer)') return false;
    if (f.apiAvailable && !e.apiAvailable) return false;
    if (f.pluginAvailable && !e.pluginAvailable) return false;
    if (f.freeToIntegrate && !e.freeIntegrationAvailable) return false;

    if (q) {
      const haystack = [
        e.brandName,
        e.officialName,
        e.slug,
        e.providerType,
        e.shortDescription,
        e.supportedCurrencies.join(' '),
        e.merchantEligibleCountryCodes.join(' '),
        e.supportedPlatforms.join(' '),
        e.cryptoDetails?.supportedAssets.map((a) => `${a.symbol} ${a.networks.join(' ')}`).join(' ') || '',
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (f.sortBy) {
      case 'alphabetical':
        return a.brandName.localeCompare(b.brandName);
      case 'country_coverage':
        return b.merchantEligibleCountryCodes.length - a.merchantEligibleCountryCodes.length;
      case 'currency_coverage':
        return b.supportedCurrencies.length - a.supportedCurrencies.length;
      case 'integration_simplicity': {
        const order = { Low: 1, Medium: 2, High: 3 };
        return order[a.integrationComplexity] - order[b.integrationComplexity];
      }
      case 'recently_verified':
        return b.lastVerifiedDate.localeCompare(a.lastVerifiedDate);
      case 'popularity':
      default:
        return a.popularityRank - b.popularityRank;
    }
  });
}

// --- Product Payment Relationships (Phase 7 & 8) ---
export function getAllProductPaymentRelationships(): Record<string, ProductPaymentRelationship> {
  const stored = readJsonStorage<Record<string, ProductPaymentRelationship>>(PRODUCT_PAYMENTS_KEY, memProductPayments);
  return {
    ...SEEDED_PRODUCT_PAYMENTS,
    ...stored,
  };
}

export function getProductPaymentRelationship(productSlugOrId: string): ProductPaymentRelationship | undefined {
  const all = getAllProductPaymentRelationships();
  const norm = productSlugOrId.trim().toLowerCase();
  return (
    all[norm] ||
    Object.values(all).find(
      (r) => r.productSlug.toLowerCase() === norm || r.productId.toLowerCase() === norm
    )
  );
}

export function saveProductPaymentRelationship(rel: ProductPaymentRelationship): ProductPaymentRelationship {
  const current = readJsonStorage<Record<string, ProductPaymentRelationship>>(PRODUCT_PAYMENTS_KEY, memProductPayments);
  const key = rel.productSlug.toLowerCase();
  const updated = {
    ...current,
    [key]: rel,
  };
  memProductPayments = updated;
  writeJsonStorage(PRODUCT_PAYMENTS_KEY, updated);
  return rel;
}

export function getProductsUsingPaymentEntry(paymentEntryId: string): ProductPaymentRelationship[] {
  const all = Object.values(getAllProductPaymentRelationships());
  return all.filter(
    (r) => r.acceptedGatewayIds.includes(paymentEntryId) || r.acceptedMethodIds.includes(paymentEntryId)
  );
}

// --- SEO Quality Checklist & Admin Operations (Phase 6, 9 & 10) ---
export interface PaymentSeoQualityReport {
  score: number;
  isIndexable: boolean;
  checks: { label: string; passed: boolean; detail: string }[];
}

export function evaluatePaymentSeoQuality(entry: PaymentDirectoryEntry): PaymentSeoQualityReport {
  const titleLen = entry.seo.seoTitle.length;
  const descLen = entry.seo.metaDescription.length;
  const checks = [
    {
      label: 'SEO Title <= 60 characters',
      passed: titleLen >= 20 && titleLen <= 60,
      detail: `${titleLen}/60 chars ("${entry.seo.seoTitle}")`,
    },
    {
      label: 'Meta Description <= 160 characters',
      passed: descLen >= 90 && descLen <= 160,
      detail: `${descLen}/160 chars`,
    },
    {
      label: 'Unique Introduction & Overview',
      passed: entry.uniqueIntroduction.length >= 60 && entry.overview.length >= 40,
      detail: `${entry.uniqueIntroduction.length + entry.overview.length} chars of unique copy`,
    },
    {
      label: 'Merchant vs Customer Country Coverage Defined',
      passed: entry.merchantEligibleCountryCodes.length > 0 && entry.customerPaymentCountryCodes.length > 0,
      detail: `${entry.merchantEligibleCountryCodes.length} merchant / ${entry.customerPaymentCountryCodes.length} customer countries`,
    },
    {
      label: 'Supported Currencies & Fee Structure',
      passed: entry.supportedCurrencies.length > 0 && entry.transactionFees.length > 0,
      detail: `${entry.supportedCurrencies.length} currencies, fee: ${entry.transactionFees}`,
    },
    {
      label: 'Structured FAQs & Official Sources',
      passed: entry.faqs.length >= 3 && entry.officialSources.length >= 1,
      detail: `${entry.faqs.length} FAQs, ${entry.officialSources.length} verified sources`,
    },
    {
      label: 'Internal Linking (Alternatives & Related Entities)',
      passed: entry.alternativeIds.length > 0,
      detail: `${entry.alternativeIds.length} alternative links`,
    },
  ];
  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  return {
    score,
    isIndexable: score >= 80 && !entry.seo.noindex,
    checks,
  };
}

export function getPaymentChangeHistory(): PaymentChangeHistoryRecord[] {
  return readJsonStorage<PaymentChangeHistoryRecord[]>(CHANGE_HISTORY_KEY, memChangeHistory);
}

export function recordPaymentChangeHistory(
  record: Omit<PaymentChangeHistoryRecord, 'id' | 'changedAt'>
): PaymentChangeHistoryRecord {
  const existing = getPaymentChangeHistory();
  const full: PaymentChangeHistoryRecord = {
    ...record,
    id: `chg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    changedAt: new Date().toISOString(),
  };
  const updated = [full, ...existing].slice(0, 200);
  memChangeHistory = updated;
  writeJsonStorage(CHANGE_HISTORY_KEY, updated);
  return full;
}

export function saveCustomPaymentEntry(
  entry: PaymentDirectoryEntry,
  actorEmail = 'admin@toolverse.baby',
  reason = 'Admin Payment Directory Update'
): PaymentDirectoryEntry {
  const existing = getCustomPaymentEntries();
  const idx = existing.findIndex((e) => e.id === entry.id || e.slug === entry.slug);
  const cleaned: PaymentDirectoryEntry = {
    ...entry,
    logoUrl: entry.logoUrl || buildPaymentSvgLogo(entry.brandName, entry.brandColor || '#4F46E5'),
    seo: {
      ...entry.seo,
      seoTitle: fitPaymentSeoTitle(entry.seo.seoTitle),
      metaDescription: fitPaymentMetaDescription(entry.seo.metaDescription),
    },
    lastVerifiedDate: new Date().toISOString().split('T')[0],
  };
  const updated = idx >= 0 ? existing.map((item, i) => (i === idx ? cleaned : item)) : [cleaned, ...existing];
  memCustomEntries = updated;
  writeJsonStorage(CUSTOM_PAYMENTS_KEY, updated);

  recordPaymentChangeHistory({
    entityId: cleaned.id,
    entityName: cleaned.brandName,
    fieldChanged: idx >= 0 ? 'entry_updated' : 'entry_created',
    previousValue: idx >= 0 ? 'Existing record' : 'None',
    newValue: `${cleaned.brandName} (${cleaned.primaryCategorySlug})`,
    changedBy: actorEmail,
    reason,
  });

  return cleaned;
}

export function toggleArchivePaymentEntry(
  entryId: string,
  archive: boolean,
  actorEmail = 'admin@toolverse.baby'
): void {
  const current = new Set(getArchivedPaymentIds());
  if (archive) {
    current.add(entryId);
  } else {
    current.delete(entryId);
  }
  const arr = Array.from(current);
  memArchivedIds = arr;
  writeJsonStorage(ARCHIVED_PAYMENT_IDS_KEY, arr);

  const entry = getPaymentEntryById(entryId);
  if (entry) {
    recordPaymentChangeHistory({
      entityId: entry.id,
      entityName: entry.brandName,
      fieldChanged: 'isArchived',
      previousValue: String(!archive),
      newValue: String(archive),
      changedBy: actorEmail,
      reason: archive ? 'Archived by Administrator' : 'Restored by Administrator',
    });
  }
}

export function updatePaymentSeoMetadata(
  entryId: string,
  seoPatch: Partial<PaymentSeoMetadata>,
  actorEmail = 'admin@toolverse.baby'
): void {
  const current = getPaymentSeoOverrides();
  const nextPatch = {
    ...(current[entryId] || {}),
    ...seoPatch,
  };
  if (nextPatch.seoTitle) nextPatch.seoTitle = fitPaymentSeoTitle(nextPatch.seoTitle);
  if (nextPatch.metaDescription) nextPatch.metaDescription = fitPaymentMetaDescription(nextPatch.metaDescription);

  const updated = {
    ...current,
    [entryId]: nextPatch,
  };
  memSeoOverrides = updated;
  writeJsonStorage(SEO_OVERRIDES_KEY, updated);

  const entry = getPaymentEntryById(entryId);
  if (entry) {
    recordPaymentChangeHistory({
      entityId: entry.id,
      entityName: entry.brandName,
      fieldChanged: 'seo_metadata',
      previousValue: entry.seo.seoTitle,
      newValue: nextPatch.seoTitle || entry.seo.seoTitle,
      changedBy: actorEmail,
      reason: 'SEO Metadata updated in Admin Control Panel',
    });
  }
}

