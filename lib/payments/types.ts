/**
 * Phase 2: Centralized, Normalized Payment Directory Database Schema (Entities A–K)
 * Strictly separates Payment Providers (gateways/processors/orchestrators) from Payment Methods
 * (wallets, card networks, local bank rails, BNPL, crypto assets, vouchers) and separates
 * Merchant Eligibility from Customer Payment Coverage.
 */

export type PaymentCategorySlug =
  | 'gateways'
  | 'digital-wallets'
  | 'cards'
  | 'bank-transfers'
  | 'local'
  | 'bnpl'
  | 'crypto-gateways'
  | 'crypto-methods'
  | 'mobile-payments'
  | 'cash-vouchers'
  | 'subscriptions';

export type AvailabilityStatus =
  | 'Supported'
  | 'Limited support'
  | 'Preview/Beta'
  | 'Not supported'
  | 'Restricted'
  | 'Requires verification'
  | 'Discontinued';

export type VerificationConfidenceLevel =
  | 'officially_confirmed'
  | 'third_party_reported'
  | 'unverified'
  | 'historical_discontinued';

export type SourceDocumentType =
  | 'official_docs'
  | 'official_country_matrix'
  | 'official_pricing'
  | 'official_integration'
  | 'official_terms'
  | 'network_documentation';

export type PaymentEntryKind = 'provider' | 'method';

export type ProviderTypeClassification =
  | 'Payment Gateway & Processor'
  | 'Merchant of Record (MoR)'
  | 'Payment Orchestration & Cross-Border Platform'
  | 'Cryptocurrency Payment Gateway'
  | 'Open-Source Self-Hosted Crypto Processor'
  | 'Subscription & Recurring Billing Engine'
  | 'Digital Wallet & Express Checkout'
  | 'Global Card Network'
  | 'Bank Transfer & Real-Time Rail'
  | 'Regional / Local Payment Method'
  | 'Buy Now Pay Later (BNPL) Network'
  | 'Cryptocurrency Asset / Payment Network'
  | 'Mobile Money & QR Payment System'
  | 'Cash & Prepaid Voucher Network';

export interface PaymentSeoMetadata {
  seoTitle: string; // Target <= 60 chars
  metaDescription: string; // Target 150-160 chars
  slug: string;
  canonicalUrl: string;
  h1: string;
  socialTitle: string;
  socialDescription: string;
  imageAlt: string;
  index: boolean;
  follow: boolean;
}

/** Entity K: Verification Sources & Change History */
export interface VerificationSourceRecord {
  id: string;
  entityId: string; // prv_* or pm_* or country code
  claimSummary: string;
  sourceUrl: string;
  sourceType: SourceDocumentType;
  retrievedDate: string;
  verificationDate: string;
  verifiedBy: string;
  confidenceLevel: VerificationConfidenceLevel;
}

export interface PaymentChangeHistoryRecord {
  id: string;
  entityId: string;
  entityName: string;
  adminUsername: string;
  action: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'VERIFY' | 'SEO_UPDATE' | 'SUBMISSION_REVIEW';
  fieldChanged: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

/** Crypto-specific metadata (required for crypto gateways and crypto payment methods) */
export interface CryptoPaymentMetadata {
  supportedCoinsAndTokens: string[];
  /** Explicit per-asset network support — never assume a ticker implies all networks */
  blockchainNetworks: {
    asset: string;
    networks: string[];
  }[];
  stablecoinSupport: string[];
  custodyModel: 'Custodial' | 'Non-custodial' | 'Hybrid (Custodial & Non-custodial options)' | 'Decentralized Protocol';
  automaticConversionAvailable: boolean;
  fiatSettlementAvailable: boolean;
  fiatSettlementCurrencies: string[];
  walletRequirements: string;
  merchantRestrictions: string[];
  countryAndRegulatoryRestrictions: string[];
}

/** Entity C: Payment Categories */
export interface PaymentCategory {
  id: string;
  slug: PaymentCategorySlug;
  /** Route alias support, e.g. 'crypto' -> 'crypto-gateways' */
  urlAliases?: string[];
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

/** Entity D: Countries */
export interface PaymentCountry {
  code: string; // ISO 3166-1 alpha-2, e.g. 'US', 'GB', 'PK', 'CA', 'AU', 'IN'
  slug: string; // e.g. 'united-states', 'united-kingdom', 'pakistan'
  name: string;
  flag: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'South Asia' | 'Middle East & Africa' | 'Latin America';
  defaultCurrencyCode: string;
  localBankRailsSummary: string;
  localMobileSystemsSummary: string;
  internationalCardSupportSummary: string;
  cryptoRegulatorySummary: string;
  merchantOnboardingRequirements: string[];
  relevantRestrictions: string[];
  officialCentralBankOrRegulator: string;
  officialRegulatorUrl: string;
  lastVerifiedDate: string;
}

/** Entity E: Currencies */
export interface PaymentCurrency {
  code: string; // ISO 4217 or crypto ticker (USD, EUR, GBP, PKR, CAD, AUD, INR, AED, BRL, JPY, SGD, BTC, USDC, USDT)
  name: string;
  symbol: string;
  isCrypto: boolean;
  primaryCountries: string[]; // ISO country codes
}

/** Entity F: Provider-Country Availability (Strictly separates Merchant vs Customer eligibility) */
export interface ProviderCountryAvailability {
  id: string;
  providerId: string;
  countryCode: string;
  merchantStatus: AvailabilityStatus;
  customerPaymentStatus: AvailabilityStatus;
  supportedSettlementCurrencies: string[];
  onboardingNotes: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

/** Entity G: Method-Country Availability */
export interface MethodCountryAvailability {
  id: string;
  methodId: string;
  countryCode: string;
  customerAvailabilityStatus: AvailabilityStatus;
  merchantAcceptanceStatus: AvailabilityStatus;
  localNotes: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

/** Entity H: Provider-Method Relationships */
export interface ProviderMethodRelationship {
  id: string;
  providerId: string;
  methodId: string;
  availabilityStatus: AvailabilityStatus;
  notes?: string;
}

/** Entity I: Payment Integrations */
export interface PaymentIntegration {
  id: string;
  entityId: string; // prv_* or pm_*
  platformName: string; // e.g. 'Shopify', 'WooCommerce', 'Next.js / Node.js', 'iOS / Android SDK'
  integrationType: 'REST API' | 'GraphQL API' | 'Hosted Checkout' | 'Drop-in UI / Elements' | 'Mobile SDK' | 'E-Commerce Plugin' | 'Payment Links / No-Code';
  isFreeIntegration: boolean;
  complexity: 'Low (No-Code / Plugin)' | 'Medium (Hosted Checkout / SDK)' | 'High (Custom Direct API)';
  documentationUrl: string;
}

/**
 * Shared base structure for both Entity A (Payment Providers) and Entity B (Payment Methods)
 * so every entry in the 100+ directory has complete detail page content, verification metadata, and SEO fields.
 */
export interface PaymentBaseRecord {
  id: string; // 'prv_stripe' or 'pm_apple_pay'
  slug: string; // 'stripe', 'apple-pay'
  entryKind: PaymentEntryKind;
  officialName: string;
  brandName: string;
  logoUrl: string;
  brandColor: string;
  shortDescription: string;
  uniqueIntroduction: string;
  overview: string;
  howItWorks: string[];
  providerType: ProviderTypeClassification;
  primaryCategorySlug: PaymentCategorySlug;
  secondaryCategorySlugs?: PaymentCategorySlug[];
  officialWebsite: string;
  signupUrl: string;
  documentationUrl: string;
  pricingUrl: string;
  apiAvailable: boolean;
  sdkAvailable: boolean;
  pluginAvailable: boolean;
  supportedPlatforms: string[];
  supportedIntegrationTypes: string[];
  supportedBusinessModels: ('SaaS' | 'E-Commerce' | 'Marketplace' | 'Digital Downloads' | 'In-Person / POS' | 'Freelance / Agency' | 'Creator / Donations' | 'Enterprise')[];
  /** Countries where a business/merchant can register an account (ISO codes) */
  merchantEligibleCountryCodes: string[];
  merchantEligibilitySummary: string;
  /** Countries where end-customers can pay using this provider/method (ISO codes or 'GLOBAL') */
  customerPaymentCountryCodes: string[];
  customerCoverageSummary: string;
  supportedCurrencies: string[];
  settlementCurrencies: string[];
  transactionFees: string;
  monthlyFees: string;
  setupFees: string;
  minimumTransactionAmount: string;
  refundSupport: 'Full & Partial Refunds' | 'Full Refunds Only' | 'Merchant-Initiated Credit Only' | 'No Native Refund (Manual Transfer)';
  refundDetails: string;
  recurringPaymentSupport: boolean;
  subscriptionSupport: boolean;
  recurringAndSubscriptionDetails: string;
  chargebackSupport: boolean;
  chargebackDetails: string;
  paymentLinksSupport: boolean;
  invoicingSupport: boolean;
  payoutSupport: boolean;
  payoutDetails: string;
  kycKybRequirements: string;
  businessEligibilityDetails: string;
  onlinePaymentSupported: boolean;
  inPersonPaymentSupported: boolean;
  oneTimePaymentSupported: boolean;
  freeIntegrationAvailable: boolean;
  integrationComplexity: 'Low' | 'Medium' | 'High';
  features: string[];
  advantages: string[];
  limitations: string[];
  /** IDs of alternative providers or methods */
  alternativeIds: string[];
  /** IDs of related payment methods (for providers) or supporting gateways (for methods) */
  linkedEntityIds: string[];
  faqs: { question: string; answer: string }[];
  cryptoDetails?: CryptoPaymentMetadata;
  operationalStatus: AvailabilityStatus;
  verificationStatus: VerificationConfidenceLevel;
  lastVerifiedDate: string;
  verifiedBy: string;
  officialSources: {
    label: string;
    url: string;
    sourceType: SourceDocumentType;
    retrievedDate: string;
  }[];
  popularityRank: number;
  isArchived?: boolean;
  seoMetadata: PaymentSeoMetadata;
}

/** Entity A: Payment Provider */
export interface PaymentProvider extends PaymentBaseRecord {
  entryKind: 'provider';
}

/** Entity B: Payment Method */
export interface PaymentMethod extends PaymentBaseRecord {
  entryKind: 'method';
}

export type PaymentDirectoryEntry = PaymentProvider | PaymentMethod;

/**
 * Entity J: Product-Payment Relationships (Phase 7 & Phase 8)
 * Stored by IDs (`prv_*`, `pm_*`), never hardcoded copied strings.
 */
export type ExtendedPricingModel =
  | 'Free'
  | 'Freemium'
  | 'One-time purchase'
  | 'Monthly subscription'
  | 'Annual subscription'
  | 'Usage-based'
  | 'Pay-as-you-go'
  | 'Multiple pricing models'
  | 'Paid'
  | 'Free Trial'
  | 'Open Source';

export interface ProductPaymentRelationship {
  id: string;
  productId: string;
  productSlug: string;
  pricingModel: ExtendedPricingModel;
  acceptedGatewayIds: string[]; // References PaymentProvider.id ('prv_stripe', 'prv_paypal', etc.)
  acceptedMethodIds: string[]; // References PaymentMethod.id ('pm_apple_pay', 'pm_visa', etc.)
  merchantCountryCode: string; // e.g. 'US', 'GB', 'PK'
  customerCountryCodes: string[]; // e.g. ['US', 'GB', 'CA', 'AU', 'GLOBAL']
  supportedCurrencyCodes: string[]; // e.g. ['USD', 'EUR', 'GBP']
  subscriptionAvailable: boolean;
  recurringPaymentAvailable: boolean;
  oneTimeCheckoutAvailable: boolean;
  freeTrialAvailable: boolean;
  refundPolicyUrl?: string;
  pricingPageUrl?: string;
  checkoutUrl?: string;
  additionalPaymentInfo?: string;
  customPaymentMethodNote?: string;
  claimVerificationStatus: 'owner_confirmed' | 'admin_verified' | 'pending_review' | 'rejected';
  lastUpdatedDate: string;
}

