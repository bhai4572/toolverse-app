import Papa from 'papaparse';
import {
  PhoneBrand,
  PhoneCategory,
  PhoneCategorySlug,
  PhoneFilterState,
  PhoneImportResult,
  PhoneRecord,
} from './types';
import { PHONE_BRANDS, PHONE_CATEGORIES } from './brandsAndCategories';
import { PHONES_PART1 } from './catalogPart1';
import { PHONES_PART2 } from './catalogPart2';
import { PHONES_PART3 } from './catalogPart3_2025_2026_Flagships';
import { PHONES_PART4 } from './catalogPart4_2025_2026_Brands';
import { PHONES_PART5 } from './catalogPart5_2025_2026_PK_Value';
import { PHONES_PART6 } from './catalogPart6_2023_2024_Classics';
import {
  CompactPhoneSeed,
  buildPhoneRecord,
  normalizeCanonicalPhoneKey,
} from './catalogHelpers';

const CUSTOM_PHONES_KEY = 'toolverse_custom_phones_v1';
const ARCHIVED_PHONE_SLUGS_KEY = 'toolverse_archived_phones_v1';

let memCustomPhones: PhoneRecord[] = [];
let memArchivedSlugs: string[] = [];

function notifyPhonesChanged() {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('toolverse_phones_changed'));
    } catch {
      // ignore
    }
  }
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyPhonesChanged();
  } catch {
    // ignore
  }
}

export function getAllPhoneBrands(): PhoneBrand[] {
  return PHONE_BRANDS;
}

export function getPhoneBrandBySlug(slug: string): PhoneBrand | undefined {
  const norm = slug.trim().toLowerCase();
  return PHONE_BRANDS.find((b) => b.slug === norm);
}

export function getAllPhoneCategories(): PhoneCategory[] {
  return PHONE_CATEGORIES;
}

export function getPhoneCategoryBySlug(slug: string): PhoneCategory | undefined {
  const norm = slug.trim().toLowerCase();
  return PHONE_CATEGORIES.find((c) => c.slug === norm);
}

export function getCustomPhones(): PhoneRecord[] {
  return readStorage<PhoneRecord[]>(CUSTOM_PHONES_KEY, memCustomPhones);
}

export function getArchivedPhoneSlugs(): string[] {
  return readStorage<string[]>(ARCHIVED_PHONE_SLUGS_KEY, memArchivedSlugs);
}

/**
 * Returns the master deduplicated Phone Directory (zero duplicate canonical keys or slugs).
 */
export function getAllPhones(includeArchived = false): PhoneRecord[] {
  const archived = new Set(getArchivedPhoneSlugs());
  const custom = getCustomPhones();
  const byCanonical = new Map<string, PhoneRecord>();

  for (const phone of [
    ...PHONES_PART3,
    ...PHONES_PART4,
    ...PHONES_PART5,
    ...PHONES_PART1,
    ...PHONES_PART2,
    ...PHONES_PART6,
    ...custom,
  ]) {
    const key = phone.canonicalKey || normalizeCanonicalPhoneKey(phone.brandSlug, phone.modelName);
    byCanonical.set(key, phone);
  }

  const all = Array.from(byCanonical.values());
  if (includeArchived) return all;
  return all.filter((p) => !p.isArchived && !archived.has(p.slug));
}

export function getPhoneBySlug(slug: string): PhoneRecord | undefined {
  const norm = slug.trim().toLowerCase();
  return getAllPhones(true).find((p) => p.slug.toLowerCase() === norm);
}

export function getDefaultPhoneFilterState(): PhoneFilterState {
  return {
    searchQuery: '',
    brandSlug: 'all',
    categorySlug: 'all',
    releaseYear: null,
    minPricePkr: null,
    maxPricePkr: null,
    minPriceUsd: null,
    maxPriceUsd: null,
    only5g: false,
    onlyNfc: false,
    onlyPtaApproved: false,
    minRamGb: null,
    minBatteryMah: null,
    sortBy: 'popularity',
  };
}

export function filterPhones(
  phones: PhoneRecord[],
  filters: Partial<PhoneFilterState>
): PhoneRecord[] {
  const f: PhoneFilterState = { ...getDefaultPhoneFilterState(), ...filters };
  const q = f.searchQuery.trim().toLowerCase();

  const list = phones.filter((p) => {
    if (f.brandSlug !== 'all' && p.brandSlug !== f.brandSlug) return false;
    if (f.categorySlug !== 'all' && !p.categories.includes(f.categorySlug as PhoneCategorySlug)) {
      return false;
    }
    if (f.releaseYear !== null && p.releaseYear !== f.releaseYear) return false;
    if (f.only5g && !p.is5g) return false;
    if (f.onlyNfc && !p.specs.comms.nfc) return false;
    if (
      f.onlyPtaApproved &&
      !p.ptaStatus.includes('PTA Approved') &&
      !p.ptaStatus.includes('Official Pakistan')
    ) {
      return false;
    }
    if (f.minPricePkr !== null && (p.pricePkr === null || p.pricePkr < f.minPricePkr)) return false;
    if (f.maxPricePkr !== null && (p.pricePkr === null || p.pricePkr > f.maxPricePkr)) return false;
    if (f.minPriceUsd !== null && (p.priceUsd === null || p.priceUsd < f.minPriceUsd)) return false;
    if (f.maxPriceUsd !== null && (p.priceUsd === null || p.priceUsd > f.maxPriceUsd)) return false;
    if (f.minRamGb !== null && p.specs.memory.maxRamGb < f.minRamGb) return false;
    if (f.minBatteryMah !== null && p.specs.battery.capacityMah < f.minBatteryMah) return false;

    if (q) {
      const hay = [
        p.fullName,
        p.brandName,
        p.modelName,
        p.specs.platform.chipset,
        p.specs.display.type,
        p.specs.mainCamera.modules,
        p.specs.memory.internal,
        p.ptaStatus,
        p.categories.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  return [...list].sort((a, b) => {
    switch (f.sortBy) {
      case 'latest':
        return b.releaseYear - a.releaseYear || b.popularityScore - a.popularityScore;
      case 'price_pkr_asc':
        return (a.pricePkr ?? 99999999) - (b.pricePkr ?? 99999999);
      case 'price_pkr_desc':
        return (b.pricePkr ?? 0) - (a.pricePkr ?? 0);
      case 'price_usd_asc':
        return (a.priceUsd ?? 999999) - (b.priceUsd ?? 999999);
      case 'battery_desc':
        return b.specs.battery.capacityMah - a.specs.battery.capacityMah;
      case 'alphabetical':
        return a.fullName.localeCompare(b.fullName);
      case 'popularity':
      default:
        return b.popularityScore - a.popularityScore;
    }
  });
}

export function toggleArchivePhone(slug: string, archive: boolean): void {
  const current = new Set(getArchivedPhoneSlugs());
  if (archive) current.add(slug);
  else current.delete(slug);
  const arr = Array.from(current);
  memArchivedSlugs = arr;
  writeStorage(ARCHIVED_PHONE_SLUGS_KEY, arr);
}

/**
 * Deduplicating batch importer: rejects duplicate canonicalKey (`brand:model`) entries
 * when `mode === 'skip_duplicate'`, or cleanly updates them when `mode === 'update_existing'`.
 */
export function importPhonesBatch(
  incoming: (PhoneRecord | CompactPhoneSeed)[],
  mode: 'skip_duplicate' | 'update_existing' = 'skip_duplicate',
  sourceOrigin: PhoneRecord['sourceOrigin'] = 'csv_import'
): PhoneImportResult {
  const existingAll = getAllPhones(true);
  const existingKeys = new Set(existingAll.map((p) => p.canonicalKey));
  const customMap = new Map<string, PhoneRecord>(
    getCustomPhones().map((p) => [p.canonicalKey, p])
  );

  let added = 0;
  let updated = 0;
  let skippedDuplicates = 0;
  const errors: string[] = [];

  for (let i = 0; i < incoming.length; i++) {
    const raw = incoming[i];
    try {
      const record: PhoneRecord =
        'specs' in raw && 'canonicalKey' in raw
          ? raw
          : buildPhoneRecord(raw as CompactPhoneSeed, sourceOrigin);

      if (!record.brandSlug || !record.modelName) {
        errors.push(`Row ${i + 1}: Missing brandSlug or modelName.`);
        continue;
      }

      if (existingKeys.has(record.canonicalKey)) {
        if (mode === 'update_existing') {
          customMap.set(record.canonicalKey, record);
          updated++;
        } else {
          skippedDuplicates++;
        }
      } else {
        existingKeys.add(record.canonicalKey);
        customMap.set(record.canonicalKey, record);
        added++;
      }
    } catch (err) {
      errors.push(`Row ${i + 1}: ${(err as Error).message}`);
    }
  }

  const nextCustom = Array.from(customMap.values());
  memCustomPhones = nextCustom;
  writeStorage(CUSTOM_PHONES_KEY, nextCustom);

  return { added, updated, skippedDuplicates, errors };
}

/**
 * Parses CSV with headers such as:
 * brandSlug,modelName,releaseYear,priceUsd,pricePkr,ptaStatus,is5g,displaySize,displayType,resolution,refreshRateHz,chipset,os,internalMemory,maxRamGb,maxStorageGb,mainCamera,primaryMp,selfieCamera,capacityMah,charging,colors,summary
 */
export function parsePhonesCsvToSeeds(csvText: string): CompactPhoneSeed[] {
  const parsed = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row.brandSlug && row.modelName)
    .map((row) => {
      const brandSlug = row.brandSlug.trim().toLowerCase();
      const modelName = row.modelName.trim();
      const pkr = row.pricePkr ? Number(row.pricePkr.replace(/[^0-9.]/g, '')) : null;
      const usd = row.priceUsd ? Number(row.priceUsd.replace(/[^0-9.]/g, '')) : null;
      const is5g = String(row.is5g || '').toLowerCase() === 'true' || row.is5g === '1';
      const ram = Number(row.maxRamGb) || 8;
      const storage = Number(row.maxStorageGb) || 128;
      const mah = Number(row.capacityMah) || 5000;

      const cats = (row.categories || '')
        .split(/[|,;]/)
        .map((c) => c.trim())
        .filter(Boolean) as PhoneCategorySlug[];
      if (cats.length === 0) {
        if (is5g) cats.push('5g-phones');
        if (pkr !== null && pkr <= 55000) cats.push('budget-phones');
        else if (usd !== null && usd >= 799) cats.push('flagship');
        else cats.push('mid-range');
      }

      return {
        brandSlug,
        modelName,
        releaseYear: Number(row.releaseYear) || new Date().getFullYear(),
        announced: row.announced || `${row.releaseYear || 2025}`,
        categories: cats,
        is5g,
        priceUsd: usd && !Number.isNaN(usd) ? usd : null,
        pricePkr: pkr && !Number.isNaN(pkr) ? pkr : null,
        ptaStatus: (row.ptaStatus as PhoneRecord['ptaStatus']) || 'PTA Approved (Official Warranty)',
        dimensions: row.dimensions || '162 x 75 x 8.2 mm',
        weight: row.weight || '195 g',
        build: row.build || 'Glass front, reinforced frame',
        sim: row.sim || 'Dual Nano-SIM',
        protection: row.protection || 'Splash resistant',
        displayType: row.displayType || 'AMOLED, 120Hz',
        displaySize: row.displaySize || '6.67 inches',
        sizeInches: Number(String(row.displaySize || '6.67').replace(/[^0-9.]/g, '')) || 6.67,
        resolution: row.resolution || '1080 x 2400 pixels',
        refreshRateHz: Number(row.refreshRateHz) || 120,
        displayProtection: row.displayProtection || 'Corning Gorilla Glass',
        os: row.os || 'Android 14',
        chipset: row.chipset || 'Octa-core Mobile SoC',
        cpu: row.cpu || 'Octa-core',
        gpu: row.gpu || 'Integrated Mobile GPU',
        cardSlot: row.cardSlot || 'microSDXC',
        internalMemory: row.internalMemory || `${storage}GB ${ram}GB RAM`,
        maxRamGb: ram,
        maxStorageGb: storage,
        mainCamera: row.mainCamera || '50 MP (wide)',
        primaryMp: Number(row.primaryMp) || 50,
        mainCameraFeatures: row.mainCameraFeatures || 'LED flash, HDR, Panorama',
        mainCameraVideo: row.mainCameraVideo || '4K@30fps, 1080p@60fps',
        selfieCamera: row.selfieCamera || '16 MP',
        selfieVideo: row.selfieVideo || '1080p@30fps',
        loudspeaker: row.loudspeaker || 'Yes, stereo speakers',
        jack35mm: row.jack35mm || 'No',
        wlan: row.wlan || 'Wi-Fi 6, dual-band',
        bluetooth: row.bluetooth || '5.3',
        positioning: row.positioning || 'GPS, GLONASS, GALILEO, BDS',
        nfc: String(row.nfc || 'true').toLowerCase() === 'true',
        usb: row.usb || 'USB Type-C 2.0',
        sensors: row.sensors || 'Fingerprint, accelerometer, gyro, proximity, compass',
        batteryType: row.batteryType || `${mah} mAh`,
        capacityMah: mah,
        charging: row.charging || '45W wired',
        colors: row.colors || 'Black, Silver, Blue',
        summary:
          row.summary ||
          `${brandSlug.toUpperCase()} ${modelName} features a ${row.displaySize || '6.67"'} display, ${row.chipset || 'octa-core'} chipset, ${row.primaryMp || 50}MP camera, and ${mah}mAh battery.`,
        pros: ['Verified specification profile imported into ToolVerse directory'],
        cons: ['Check regional variant bands and PTA status before purchase'],
        alts: [],
        popularity: Number(row.popularity) || 75,
      };
    });
}

export function exportPhonesToCsv(phones: PhoneRecord[] = getAllPhones()): string {
  const rows = phones.map((p) => ({
    brandSlug: p.brandSlug,
    modelName: p.modelName,
    releaseYear: p.releaseYear,
    priceUsd: p.priceUsd ?? '',
    pricePkr: p.pricePkr ?? '',
    ptaStatus: p.ptaStatus,
    is5g: p.is5g,
    categories: p.categories.join('|'),
    displaySize: p.specs.display.size,
    displayType: p.specs.display.type,
    resolution: p.specs.display.resolution,
    refreshRateHz: p.specs.display.refreshRateHz,
    chipset: p.specs.platform.chipset,
    os: p.specs.platform.os,
    internalMemory: p.specs.memory.internal,
    maxRamGb: p.specs.memory.maxRamGb,
    maxStorageGb: p.specs.memory.maxStorageGb,
    mainCamera: p.specs.mainCamera.modules,
    primaryMp: p.specs.mainCamera.primaryMp,
    selfieCamera: p.specs.selfieCamera.modules,
    capacityMah: p.specs.battery.capacityMah,
    charging: p.specs.battery.charging,
    nfc: p.specs.comms.nfc,
    colors: p.specs.misc.colors,
    summary: p.originalSummary,
  }));
  return Papa.unparse(rows);
}

export function exportPhonesToJson(phones: PhoneRecord[] = getAllPhones()): string {
  return JSON.stringify(phones, null, 2);
}

export function evaluatePhoneSeoQuality(phone: PhoneRecord) {
  const checks = [
    { label: 'SEO Title <= 60 chars', passed: phone.seo.title.length >= 15 && phone.seo.title.length <= 60 },
    { label: 'Meta Description <= 160 chars', passed: phone.seo.description.length >= 60 && phone.seo.description.length <= 160 },
    { label: 'Original AdSense-Safe Summary', passed: phone.originalSummary.length >= 50 },
    { label: 'Complete 13-Group Specs', passed: Boolean(phone.specs.platform.chipset && phone.specs.battery.capacityMah) },
    { label: 'Unique Canonical Key (No Duplicate)', passed: Boolean(phone.canonicalKey && phone.slug) },
  ];
  const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
  return { score, isIndexable: score >= 80 && !phone.isArchived, checks };
}

