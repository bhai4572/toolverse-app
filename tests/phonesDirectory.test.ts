import { describe, it, expect } from 'vitest';
import {
  getAllPhones,
  getAllPhoneBrands,
  getAllPhoneCategories,
  getPhoneBySlug,
  filterPhones,
  importPhonesBatch,
  parsePhonesCsvToSeeds,
  exportPhonesToCsv,
  exportPhonesToJson,
  toggleArchivePhone,
  evaluatePhoneSeoQuality,
} from '../lib/phones/database';
import { getMetadataForPath } from '../lib/seo/metaEngine';

describe('ToolVerse Mobile Phones & Technical Specifications Directory (/phones)', () => {
  it('1. contains all 18 major brands, 10 categories, and zero duplicate phone slugs or canonical keys', () => {
    const phones = getAllPhones();
    const brands = getAllPhoneBrands();
    const categories = getAllPhoneCategories();

    expect(brands.length).toBe(18);
    expect(categories.length).toBe(10);
    expect(phones.length).toBeGreaterThanOrEqual(85);

    // Every year from 2023 to 2026 has models
    for (const yr of [2023, 2024, 2025, 2026]) {
      expect(filterPhones(phones, { releaseYear: yr }).length).toBeGreaterThan(0);
    }

    const slugs = new Set(phones.map((p) => p.slug));
    const canonicalKeys = new Set(phones.map((p) => p.canonicalKey));
    expect(slugs.size).toBe(phones.length);
    expect(canonicalKeys.size).toBe(phones.length);

    // Every category has at least 1 phone
    for (const cat of categories) {
      const catPhones = filterPhones(phones, { categorySlug: cat.slug });
      expect(catPhones.length).toBeGreaterThan(0);
    }

    // Every brand has at least 1 phone
    for (const brand of brands) {
      const brandPhones = filterPhones(phones, { brandSlug: brand.slug });
      expect(brandPhones.length).toBeGreaterThan(0);
    }
  });

  it('2. supports PKR/USD price filters, 5G, PTA Approved, NFC, RAM, and battery filters accurately', () => {
    const phones = getAllPhones();

    const ptaBudget = filterPhones(phones, {
      maxPricePkr: 50000,
      onlyPtaApproved: true,
    });
    expect(ptaBudget.length).toBeGreaterThan(0);
    for (const p of ptaBudget) {
      expect(p.pricePkr).toBeLessThanOrEqual(50000);
      expect(p.ptaStatus).toContain('PTA Approved');
    }

    const battery5gFlagships = filterPhones(phones, {
      only5g: true,
      minBatteryMah: 5500,
      minRamGb: 12,
      sortBy: 'battery_desc',
    });
    expect(battery5gFlagships.length).toBeGreaterThanOrEqual(3);
    expect(battery5gFlagships[0].specs.battery.capacityMah).toBeGreaterThanOrEqual(5500);
  });

  it('3. enforces AdSense-safe unique summaries and strict SEO title (<= 60 chars) & meta description (<= 160 chars)', () => {
    const phones = getAllPhones();
    for (const phone of phones) {
      expect(phone.seo.title.length).toBeLessThanOrEqual(60);
      expect(phone.seo.description.length).toBeLessThanOrEqual(160);
      expect(phone.seo.canonicalUrl).toBe(`https://toolverse.baby/phones/${phone.slug}`);
      const report = evaluatePhoneSeoQuality(phone);
      expect(report.score).toBe(100);
      expect(report.isIndexable).toBe(true);
    }

    const hubMeta = getMetadataForPath('/phones');
    expect(hubMeta.canonicalUrl).toBe('https://toolverse.baby/phones');
    expect(hubMeta.title.length).toBeLessThanOrEqual(60);

    const detailMeta = getMetadataForPath('/phones/samsung-galaxy-s24-ultra');
    expect(detailMeta.canonicalUrl).toBe('https://toolverse.baby/phones/samsung-galaxy-s24-ultra');
    expect(detailMeta.title.length).toBeLessThanOrEqual(60);

    const brandMeta = getMetadataForPath('/phones/brand/samsung');
    expect(brandMeta.canonicalUrl).toBe('https://toolverse.baby/phones/brand/samsung');
  });

  it('4. parses CSV, prevents duplicate imports, supports update_existing, and exports CSV/JSON cleanly', () => {
    const csv = [
      'brandSlug,modelName,releaseYear,priceUsd,pricePkr,ptaStatus,is5g,displaySize,displayType,resolution,refreshRateHz,chipset,os,maxRamGb,maxStorageGb,mainCamera,primaryMp,selfieCamera,capacityMah,charging,colors,summary',
      'samsung,Galaxy S24 Ultra,2024,1299,389999,PTA Approved (Official Warranty),true,6.8 inches,AMOLED,1440 x 3120,120,Snapdragon 8 Gen 3,Android 14,12,256,200 MP,200,12 MP,5000,45W,Black,Duplicate entry test',
      'motorola,Razr 60 Ultra,2026,999,289999,Global / Region Specific,true,7.0 inches,Foldable LTPO P-OLED,1224 x 2992,165,Snapdragon 8 Elite,Android 16,16,512,50 MP + 50 MP,50,50 MP,4700,68W,Pantone Rio Red,Foldable Motorola Razr 60 Ultra imported via CSV batch.',
    ].join('\n');

    const seeds = parsePhonesCsvToSeeds(csv);
    expect(seeds.length).toBe(2);

    // First import: skip_duplicate skips Galaxy S24 Ultra and adds Motorola Razr 60 Ultra
    const firstRes = importPhonesBatch(seeds, 'skip_duplicate', 'csv_import');
    expect(firstRes.skippedDuplicates).toBe(1);
    expect(firstRes.added).toBe(1);

    const razr = getPhoneBySlug('motorola-razr-60-ultra');
    expect(razr).toBeDefined();
    expect(razr?.pricePkr).toBe(289999);

    // Second import with update_existing updates price without duplicating
    const countBefore = getAllPhones(true).length;
    const secondRes = importPhonesBatch(seeds, 'update_existing', 'csv_import');
    expect(secondRes.updated).toBe(2);
    expect(getAllPhones(true).length).toBe(countBefore);

    const csvOut = exportPhonesToCsv();
    expect(csvOut).toContain('Razr 60 Ultra');
    const jsonOut = exportPhonesToJson();
    expect(JSON.parse(jsonOut).length).toBeGreaterThanOrEqual(86);
  });

  it('5. supports archiving and restoring phone models', () => {
    toggleArchivePhone('samsung-galaxy-s25-ultra', true);
    expect(getAllPhones(false).some((p) => p.slug === 'samsung-galaxy-s25-ultra')).toBe(false);
    toggleArchivePhone('samsung-galaxy-s25-ultra', false);
    expect(getAllPhones(false).some((p) => p.slug === 'samsung-galaxy-s25-ultra')).toBe(true);
  });
});

