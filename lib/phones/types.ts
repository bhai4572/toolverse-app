export type PhoneCategorySlug =
  | 'flagship'
  | '5g-phones'
  | 'mid-range'
  | 'budget-phones'
  | 'camera-phones'
  | 'gaming-phones'
  | 'foldables'
  | 'battery-kings'
  | 'pta-approved-pk'
  | 'upcoming';

export type PhoneReleaseStatus = 'Available' | 'Upcoming' | 'Discontinued';
export type PtaApprovalStatus =
  | 'PTA Approved (Official Warranty)'
  | 'PTA Tax Applicable (Imported)'
  | 'Official Pakistan Market'
  | 'Global / Region Specific';

export interface PhoneBrand {
  slug: string;
  name: string;
  country: string;
  foundedYear: number;
  website: string;
  brandColor: string;
  summary: string;
}

export interface PhoneCategory {
  slug: PhoneCategorySlug;
  name: string;
  shortName: string;
  description: string;
}

export interface PhoneVariantPrice {
  storage: string;
  ram: string;
  priceUsd?: number;
  pricePkr?: number;
}

export interface PhoneSpecs {
  network: {
    technology: string;
    bands2g: string;
    bands3g: string;
    bands4g: string;
    bands5g: string;
    speed: string;
  };
  launch: {
    announced: string;
    status: string;
  };
  body: {
    dimensions: string;
    weight: string;
    build: string;
    sim: string;
    protection: string;
  };
  display: {
    type: string;
    size: string;
    sizeInches: number;
    resolution: string;
    refreshRateHz: number;
    protection: string;
  };
  platform: {
    os: string;
    chipset: string;
    cpu: string;
    gpu: string;
  };
  memory: {
    cardSlot: string;
    internal: string;
    maxRamGb: number;
    maxStorageGb: number;
  };
  mainCamera: {
    modules: string;
    primaryMp: number;
    features: string;
    video: string;
  };
  selfieCamera: {
    modules: string;
    features: string;
    video: string;
  };
  sound: {
    loudspeaker: string;
    jack35mm: string;
  };
  comms: {
    wlan: string;
    bluetooth: string;
    positioning: string;
    nfc: boolean;
    nfcNotes: string;
    infrared: boolean;
    radio: string;
    usb: string;
  };
  features: {
    sensors: string;
  };
  battery: {
    type: string;
    capacityMah: number;
    charging: string;
  };
  misc: {
    colors: string;
    models: string;
  };
}

export interface PhoneRecord {
  id: string;
  slug: string;
  canonicalKey: string; // normalized brandSlug + modelSlug for strict 0-duplicate guarantee
  brandSlug: string;
  brandName: string;
  modelName: string;
  fullName: string;
  releaseStatus: PhoneReleaseStatus;
  releaseYear: number;
  categories: PhoneCategorySlug[];
  is5g: boolean;
  priceUsd: number | null;
  pricePkr: number | null;
  ptaStatus: PtaApprovalStatus;
  variants: PhoneVariantPrice[];
  thumbUrl: string;
  brandColor: string;
  specs: PhoneSpecs;
  originalSummary: string;
  pros: string[];
  cons: string[];
  alternativeSlugs: string[];
  faqs: { question: string; answer: string }[];
  popularityScore: number;
  lastUpdated: string;
  sourceOrigin: 'verified_catalog' | 'csv_import' | 'json_import' | 'admin_manual';
  isArchived?: boolean;
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
}

export interface PhoneFilterState {
  searchQuery: string;
  brandSlug: string;
  categorySlug: PhoneCategorySlug | 'all';
  releaseYear: number | null;
  minPricePkr: number | null;
  maxPricePkr: number | null;
  minPriceUsd: number | null;
  maxPriceUsd: number | null;
  only5g: boolean;
  onlyNfc: boolean;
  onlyPtaApproved: boolean;
  minRamGb: number | null;
  minBatteryMah: number | null;
  sortBy: 'popularity' | 'latest' | 'price_pkr_asc' | 'price_pkr_desc' | 'price_usd_asc' | 'battery_desc' | 'alphabetical';
}

export interface PhoneImportResult {
  added: number;
  updated: number;
  skippedDuplicates: number;
  errors: string[];
}

