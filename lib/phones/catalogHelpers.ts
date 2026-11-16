import {
  PhoneCategorySlug,
  PhoneRecord,
  PhoneReleaseStatus,
  PhoneVariantPrice,
  PtaApprovalStatus,
} from './types';
import { PHONE_BRANDS } from './brandsAndCategories';

export function normalizeCanonicalPhoneKey(brandSlug: string, modelName: string): string {
  const b = brandSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let m = modelName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (m.startsWith(`${b}-`)) {
    m = m.slice(b.length + 1);
  }
  return `${b}:${m}`;
}

export function buildPhoneSlug(brandSlug: string, modelName: string): string {
  const b = brandSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const m = modelName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return m.startsWith(`${b}-`) ? m : `${b}-${m}`;
}

export function fitPhoneSeoTitle(rawTitle: string): string {
  if (rawTitle.length <= 60) return rawTitle;
  const noBrand = rawTitle.replace(/\s*\|\s*ToolVerse$/i, '').trim();
  if (noBrand.length <= 60) return noBrand;
  return noBrand.slice(0, 57).trim() + '...';
}

export function fitPhoneMetaDescription(rawDesc: string): string {
  if (rawDesc.length <= 160) return rawDesc;
  const cut = rawDesc.slice(0, 157);
  const space = cut.lastIndexOf(' ');
  return (space > 90 ? cut.slice(0, space) : cut).replace(/[.,;:\s]+$/, '') + '...';
}

export function buildPhoneSvgThumb(brandName: string, modelName: string, hexColor: string): string {
  const cleanColor = hexColor.startsWith('#') ? hexColor : `#${hexColor}`;
  const tag = modelName.slice(0, 12).replace(/[<>&"]/g, '');
  const brand = brandName.slice(0, 10).toUpperCase().replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220" width="180" height="220"><rect x="18" y="10" width="144" height="200" rx="24" fill="#0f172a" stroke="${cleanColor}" stroke-width="5"/><rect x="28" y="22" width="124" height="176" rx="16" fill="${cleanColor}" fill-opacity="0.18"/><circle cx="52" cy="46" r="9" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/><circle cx="74" cy="46" r="9" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/><circle cx="52" cy="68" r="7" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/><text x="90" y="128" text-anchor="middle" fill="#ffffff" font-family="system-ui,-apple-system,sans-serif" font-weight="800" font-size="13">${brand}</text><text x="90" y="148" text-anchor="middle" fill="#cbd5e1" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="11">${tag}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface CompactPhoneSeed {
  slug?: string;
  brandSlug: string;
  modelName: string;
  releaseStatus?: PhoneReleaseStatus;
  releaseYear: number;
  announced: string;
  categories: PhoneCategorySlug[];
  is5g: boolean;
  priceUsd: number | null;
  pricePkr: number | null;
  ptaStatus: PtaApprovalStatus;
  variants?: PhoneVariantPrice[];
  dimensions: string;
  weight: string;
  build: string;
  sim: string;
  protection: string;
  displayType: string;
  displaySize: string;
  sizeInches: number;
  resolution: string;
  refreshRateHz: number;
  displayProtection: string;
  os: string;
  chipset: string;
  cpu: string;
  gpu: string;
  cardSlot: string;
  internalMemory: string;
  maxRamGb: number;
  maxStorageGb: number;
  mainCamera: string;
  primaryMp: number;
  mainCameraFeatures: string;
  mainCameraVideo: string;
  selfieCamera: string;
  selfieVideo: string;
  loudspeaker: string;
  jack35mm: string;
  wlan: string;
  bluetooth: string;
  positioning: string;
  nfc: boolean;
  infrared?: boolean;
  radio?: string;
  usb: string;
  sensors: string;
  batteryType: string;
  capacityMah: number;
  charging: string;
  colors: string;
  models?: string;
  summary: string;
  pros: string[];
  cons: string[];
  alts: string[];
  popularity?: number;
}

export function buildPhoneRecord(
  s: CompactPhoneSeed,
  sourceOrigin: PhoneRecord['sourceOrigin'] = 'verified_catalog'
): PhoneRecord {
  const brand = PHONE_BRANDS.find((b) => b.slug === s.brandSlug);
  const brandName = brand?.name || s.brandSlug.toUpperCase();
  const brandColor = brand?.brandColor || '#2563EB';
  const slug = s.slug || buildPhoneSlug(s.brandSlug, s.modelName);
  const canonicalKey = normalizeCanonicalPhoneKey(s.brandSlug, s.modelName);
  const fullName = s.modelName.toLowerCase().startsWith(brandName.toLowerCase())
    ? s.modelName
    : `${brandName} ${s.modelName}`;

  const pkrText = s.pricePkr ? `PKR ${s.pricePkr.toLocaleString()}` : 'PKR Price Pending';
  const usdText = s.priceUsd ? `$${s.priceUsd}` : 'USD Pending';

  const rawTitle = `${fullName} Price in Pakistan (${pkrText}) & Specs | ToolVerse`;
  const rawDesc = `${fullName} full specifications, price in Pakistan (${pkrText} / ${usdText}), ${s.displaySize} ${s.displayType}, ${s.chipset}, ${s.primaryMp}MP camera, ${s.capacityMah}mAh battery, & PTA status.`;

  const canonicalUrl = `https://toolverse.baby/phones/${slug}`;

  return {
    id: `phn_${slug}`,
    slug,
    canonicalKey,
    brandSlug: s.brandSlug,
    brandName,
    modelName: s.modelName,
    fullName,
    releaseStatus: s.releaseStatus || 'Available',
    releaseYear: s.releaseYear,
    categories: s.categories,
    is5g: s.is5g,
    priceUsd: s.priceUsd,
    pricePkr: s.pricePkr,
    ptaStatus: s.ptaStatus,
    variants: s.variants || [
      {
        storage: `${s.maxStorageGb}GB`,
        ram: `${s.maxRamGb}GB`,
        priceUsd: s.priceUsd || undefined,
        pricePkr: s.pricePkr || undefined,
      },
    ],
    thumbUrl: buildPhoneSvgThumb(brandName, s.modelName, brandColor),
    brandColor,
    specs: {
      network: {
        technology: s.is5g ? 'GSM / HSPA / LTE / 5G' : 'GSM / HSPA / LTE',
        bands2g: 'GSM 850 / 900 / 1800 / 1900 - SIM 1 & SIM 2',
        bands3g: 'HSDPA 850 / 900 / 1900 / 2100',
        bands4g: 'LTE (Global & Pakistan Jazz / Zong / Ufone / Telenor bands)',
        bands5g: s.is5g ? 'SA / NSA Sub-6 5G' : 'Not supported (4G LTE only)',
        speed: s.is5g ? 'HSPA, LTE, 5G' : 'HSPA, LTE',
      },
      launch: {
        announced: s.announced,
        status: `${s.releaseStatus || 'Available'}. Released ${s.releaseYear}`,
      },
      body: {
        dimensions: s.dimensions,
        weight: s.weight,
        build: s.build,
        sim: s.sim,
        protection: s.protection,
      },
      display: {
        type: s.displayType,
        size: s.displaySize,
        sizeInches: s.sizeInches,
        resolution: s.resolution,
        refreshRateHz: s.refreshRateHz,
        protection: s.displayProtection,
      },
      platform: {
        os: s.os,
        chipset: s.chipset,
        cpu: s.cpu,
        gpu: s.gpu,
      },
      memory: {
        cardSlot: s.cardSlot,
        internal: s.internalMemory,
        maxRamGb: s.maxRamGb,
        maxStorageGb: s.maxStorageGb,
      },
      mainCamera: {
        modules: s.mainCamera,
        primaryMp: s.primaryMp,
        features: s.mainCameraFeatures,
        video: s.mainCameraVideo,
      },
      selfieCamera: {
        modules: s.selfieCamera,
        features: 'HDR, Panorama',
        video: s.selfieVideo,
      },
      sound: {
        loudspeaker: s.loudspeaker,
        jack35mm: s.jack35mm,
      },
      comms: {
        wlan: s.wlan,
        bluetooth: s.bluetooth,
        positioning: s.positioning,
        nfc: s.nfc,
        nfcNotes: s.nfc ? 'Yes (region/market dependent)' : 'No',
        infrared: Boolean(s.infrared),
        radio: s.radio || 'No',
        usb: s.usb,
      },
      features: {
        sensors: s.sensors,
      },
      battery: {
        type: s.batteryType,
        capacityMah: s.capacityMah,
        charging: s.charging,
      },
      misc: {
        colors: s.colors,
        models: s.models || `${brandName} ${s.modelName} Global / PK`,
      },
    },
    originalSummary: s.summary,
    pros: s.pros,
    cons: s.cons,
    alternativeSlugs: s.alts,
    faqs: [
      {
        question: `What is the price of ${fullName} in Pakistan and globally?`,
        answer: `${fullName} retails around ${pkrText} in Pakistan (${usdText} USD globally), depending on storage configuration, official PTA warranty status, and city dealers.`,
      },
      {
        question: `Does ${fullName} support 5G, NFC, and PTA approval in Pakistan?`,
        answer: `5G support: ${s.is5g ? 'Yes (5G Sub-6 supported)' : 'No (4G LTE only)'}. NFC: ${s.nfc ? 'Yes' : 'No'}. Pakistan market status: ${s.ptaStatus}.`,
      },
      {
        question: `What processor, camera, and battery does ${fullName} feature?`,
        answer: `${fullName} runs on the ${s.chipset} chipset (${s.os}), paired with a ${s.mainCamera} main camera system and a ${s.capacityMah}mAh battery (${s.charging}).`,
      },
    ],
    popularityScore: s.popularity || 100,
    lastUpdated: '2026-11-12',
    sourceOrigin,
    seo: {
      title: fitPhoneSeoTitle(rawTitle),
      description: fitPhoneMetaDescription(rawDesc),
      canonicalUrl,
    },
  };
}

export interface QuickPhoneSpec {
  b: string; // brandSlug
  m: string; // modelName
  y: number; // releaseYear
  ann: string; // announced
  st?: PhoneReleaseStatus;
  c: PhoneCategorySlug[];
  g5: boolean;
  usd: number | null;
  pkr: number | null;
  pta: PtaApprovalStatus;
  disp: string;
  sz: number;
  res: string;
  hz: number;
  os: string;
  soc: string;
  mem: string;
  ram: number;
  rom: number;
  cam: string;
  mp: number;
  selfie: string;
  mah: number;
  chg: string;
  nfc?: boolean;
  ip?: string;
  col?: string;
  sum: string;
  pros?: string[];
  cons?: string[];
  alts?: string[];
  pop?: number;
}

export function makeCompactPhone(q: QuickPhoneSpec): PhoneRecord {
  return buildPhoneRecord({
    brandSlug: q.b,
    modelName: q.m,
    releaseStatus: q.st || 'Available',
    releaseYear: q.y,
    announced: q.ann,
    categories: q.c,
    is5g: q.g5,
    priceUsd: q.usd,
    pricePkr: q.pkr,
    ptaStatus: q.pta,
    dimensions: 'Standard modern slim chassis',
    weight: '185–225 g',
    build: q.y >= 2025 ? 'Glass front/back, reinforced aluminum or titanium frame' : 'Reinforced glass front, sleek frame',
    sim: 'Dual SIM (Nano-SIM / eSIM region dependent)',
    protection: q.ip || 'Splash and dust resistant',
    displayType: q.disp,
    displaySize: `${q.sz} inches`,
    sizeInches: q.sz,
    resolution: q.res,
    refreshRateHz: q.hz,
    displayProtection: 'Reinforced cover glass',
    os: q.os,
    chipset: q.soc,
    cpu: 'Octa-core / Hexa-core Mobile CPU',
    gpu: 'Integrated Flagship/Mobile GPU',
    cardSlot: q.c.includes('budget-phones') ? 'microSDXC' : 'No',
    internalMemory: q.mem,
    maxRamGb: q.ram,
    maxStorageGb: q.rom,
    mainCamera: q.cam,
    primaryMp: q.mp,
    mainCameraFeatures: 'LED flash, HDR, Panorama, Night Mode',
    mainCameraVideo: q.y >= 2024 && q.usd && q.usd >= 400 ? '4K@30/60fps' : '1080p@30/60fps',
    selfieCamera: q.selfie,
    selfieVideo: q.usd && q.usd >= 500 ? '4K@30/60fps' : '1080p@30fps',
    loudspeaker: 'Yes, stereo speakers',
    jack35mm: q.c.includes('budget-phones') ? 'Yes' : 'No',
    wlan: q.g5 ? 'Wi-Fi 6/6e/7 dual/tri-band' : 'Wi-Fi 5 dual-band',
    bluetooth: q.y >= 2025 ? '5.4' : '5.3',
    positioning: 'GPS, GLONASS, GALILEO, BDS',
    nfc: q.nfc ?? Boolean(q.usd && q.usd >= 200),
    usb: 'USB Type-C',
    sensors: q.b === 'apple' ? 'Face ID, accelerometer, gyro, proximity, compass, barometer' : 'Fingerprint sensor, accelerometer, gyro, proximity, compass',
    batteryType: `${q.mah} mAh non-removable`,
    capacityMah: q.mah,
    charging: q.chg,
    colors: q.col || 'Black, Silver, Titanium, Blue',
    summary: q.sum,
    pros: q.pros || [`${q.soc} performance with ${q.mah}mAh battery`, `${q.sz}-inch ${q.hz}Hz ${q.disp}`],
    cons: q.cons || ['Regional variant pricing & PTA duties vary by market'],
    alts: q.alts || [],
    popularity: q.pop || 85,
  });
}

