import { describe, it, expect } from 'vitest';
import {
  ALL_COUNTRY_STUDY_SUMMARIES,
  ALL_UNIVERSITIES,
  PROGRAM_CATEGORIES,
  DEGREE_LEVELS,
  GLOBAL_SCHOLARSHIPS,
  getCountryStudyBySlugOrIso,
  getUniversityBySlugs,
  getGlobalStudyStats,
} from '../lib/study/globalUniversityEngine';
import { getStudyDestination } from '../lib/study/destinations';
import { getMetadataForPath } from '../lib/seo/metaEngine';

describe('Global 193-Country University & DIY Admission Engine', () => {
  it('covers all 193 UN Member States with non-empty universities, programs, fees, and DIY steps', () => {
    const stats = getGlobalStudyStats();
    expect(stats.totalCountries).toBe(193);
    expect(ALL_COUNTRY_STUDY_SUMMARIES.length).toBe(193);
    expect(ALL_UNIVERSITIES.length).toBeGreaterThanOrEqual(250);
    expect(PROGRAM_CATEGORIES.length).toBe(9);
    expect(DEGREE_LEVELS.length).toBe(5);
    expect(GLOBAL_SCHOLARSHIPS.length).toBeGreaterThanOrEqual(15);

    for (const country of ALL_COUNTRY_STUDY_SUMMARIES) {
      expect(country.iso2).toMatch(/^[A-Z]{2}$/);
      expect(country.universities.length).toBeGreaterThanOrEqual(1);
      expect(country.tuitionBandLabel.length).toBeGreaterThan(3);

      for (const uni of country.universities) {
        expect(uni.programs.length).toBe(9);
        expect(uni.admissionSteps.length).toBe(6);
        expect(uni.requiredDocuments.length).toBe(4);
        expect(uni.scholarships.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('resolves legacy slugs, country names, and ISO-2 codes via getStudyDestination', () => {
    const usa = getStudyDestination('usa');
    const de = getStudyDestination('germany');
    const pk = getStudyDestination('pakistan');
    const tr = getStudyDestination('tr');
    const europe = getStudyDestination('europe');

    expect(usa?.countryStudy?.iso2).toBe('US');
    expect(de?.countryStudy?.iso2).toBe('DE');
    expect(pk?.countryStudy?.iso2).toBe('PK');
    expect(tr?.countryStudy?.iso2).toBe('TR');
    expect(europe?.slug).toBe('europe');
  });

  it('resolves individual universities and generates valid SEO metadata', () => {
    const tum = getUniversityBySlugs('germany', 'technical-university-of-munich');
    expect(tum).toBeDefined();
    expect(tum?.countryIso2).toBe('DE');

    const nust = getUniversityBySlugs('pakistan', 'national-university-of-sciences-technology');
    expect(nust).toBeDefined();
    expect(nust?.city).toBe('Islamabad');

    const metaCountry = getMetadataForPath('/study/germany');
    expect(metaCountry.title).toContain('Germany');
    expect(metaCountry.canonicalUrl).toBe('https://toolverse.baby/study/germany');

    const metaUni = getMetadataForPath('/study/germany/technical-university-of-munich');
    expect(metaUni.title).toContain('Technical University of Munich');
    expect(metaUni.canonicalUrl).toBe(
      'https://toolverse.baby/study/germany/technical-university-of-munich'
    );
  });
});

