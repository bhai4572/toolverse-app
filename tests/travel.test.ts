import { describe, it, expect } from 'vitest';
import { 
  getAllCountries, 
  getCountryByCodeOrName, 
  runCountryCoverageCheck 
} from '../lib/travel/countryRegistry';
import { 
  getVisaRule, 
  getRequiredDocuments, 
  calculateFeeWithConversion, 
  getPassportMobilitySummary 
} from '../lib/travel/visaEngine';
import { 
  getEmbassiesForRoute, 
  searchEmbassiesByCity 
} from '../lib/travel/embassyRegistry';
import { 
  getAttractionsForCountry, 
  getHotelsForCountry, 
  generateItinerary 
} from '../lib/travel/destinationEngine';
import { 
  getJobOpportunities, 
  getCostOfLiving 
} from '../lib/travel/jobTravelEngine';
import { 
  generateTravelRouteSchema 
} from '../lib/travel/travelSeoEngine';

describe('Global Travel Intelligence Platform - Core Test Suite', () => {

  describe('1. UN 193 Member States Database Integrity', () => {
    it('should contain all 193 official UN Member States', () => {
      const countries = getAllCountries();
      expect(countries.length).toBe(193);
    });

    it('should successfully run COUNTRY_COVERAGE_CHECK tool', () => {
      const report = runCountryCoverageCheck();
      expect(report.totalCountries).toBe(193);
      expect(report.countriesWithVisaData).toBe(193);
      expect(report.countriesWithEmbassyData).toBe(193);
      expect(report.countriesWithTourismData).toBe(193);
    });

    it('should resolve countries by ISO-2, ISO-3, or Common Name', () => {
      const pk = getCountryByCodeOrName('PK');
      expect(pk?.name).toBe('Pakistan');
      expect(pk?.capital).toBe('Islamabad');
      expect(pk?.currency.code).toBe('PKR');

      const gb = getCountryByCodeOrName('GBR');
      expect(gb?.name).toBe('United Kingdom');
      expect(gb?.capital).toBe('London');

      const de = getCountryByCodeOrName('Germany');
      expect(de?.iso2).toBe('DE');
      expect(de?.capital).toBe('Berlin');
    });

    it('should use real country names (no UN State 001 placeholders)', () => {
      const countries = getAllCountries();
      expect(countries.every((c) => !/^UN State \d{3}$/.test(c.name))).toBe(true);
      expect(countries.every((c) => /^[A-Z]{2}$/.test(c.iso2))).toBe(true);
      expect(getCountryByCodeOrName('IN')?.name).toBe('India');
      expect(getCountryByCodeOrName('NG')?.name).toBe('Nigeria');
      // Alphabetically sorted for dropdowns
      for (let i = 1; i < countries.length; i++) {
        expect(countries[i - 1].commonName.localeCompare(countries[i].commonName, 'en')).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('2. Visa Engine & Nationality Matrix', () => {
    it('should return valid Level-1 visa requirements for PK -> GB route', () => {
      const rule = getVisaRule('PK', 'GB', 'tourism');
      expect(rule.status).toBe('EMBASSY / CONSULAR VISA');
      expect(rule.sourceLevel).toBe('LEVEL_1_OFFICIAL_GOVT');
      expect(rule.feeUsd).toBeGreaterThan(0);
      expect(rule.passportValidityMonthsReq).toBeGreaterThanOrEqual(6);
    });

    it('should return valid Level-1 visa requirements for PK -> TR route', () => {
      const rule = getVisaRule('PK', 'TR', 'tourism');
      expect(rule.status).toBe('eVISA');
      expect(rule.officialPortalUrl).toContain('evisa.gov.tr');
    });

    it('should calculate dynamic currency conversions for visa fees', () => {
      const feeInfo = calculateFeeWithConversion(140, 'PKR');
      expect(feeInfo.originalUsd).toBe(140);
      expect(feeInfo.convertedAmount).toBeGreaterThan(140);
      expect(feeInfo.targetCurrency).toBe('PKR');
    });

    it('should generate personalized document checklists based on employment', () => {
      const rule = getVisaRule('PK', 'GB', 'tourism');

      const employedChecklist = getRequiredDocuments(rule, 'tourism', 'employed');
      expect(employedChecklist.some(d => d.id === 'doc_employment')).toBe(true);

      const studentChecklist = getRequiredDocuments(rule, 'tourism', 'student');
      expect(studentChecklist.some(d => d.id === 'doc_student')).toBe(true);
    });

    it('should calculate passport mobility strength metrics', () => {
      const mobility = getPassportMobilitySummary('PK');
      expect(mobility.counts.visaFree).toBeGreaterThanOrEqual(0);
      expect(mobility.counts.visaOnArrival).toBeGreaterThanOrEqual(0);
      expect(mobility.counts.eVisa).toBeGreaterThanOrEqual(0);
      expect(mobility.counts.visaRequired).toBeGreaterThan(0);
    });
  });

  describe('3. Diplomatic Mission & Embassy Directory', () => {
    it('should retrieve embassies for PK -> DE route', () => {
      const embassies = getEmbassiesForRoute('PK', 'DE');
      expect(embassies.length).toBeGreaterThan(0);
      expect(embassies[0].city).toBe('Islamabad');
    });

    it('should search embassies by city', () => {
      const results = searchEmbassiesByCity('Islamabad');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('4. Tourism & Destination Explorer Engine', () => {
    it('should fetch attractions for Turkey (TR)', () => {
      const attractions = getAttractionsForCountry('TR');
      expect(attractions.length).toBeGreaterThan(0);
      expect(attractions[0].name).toContain('Hagia Sophia');
    });

    it('should fetch hotel inventory for Turkey (TR)', () => {
      const hotels = getHotelsForCountry('TR');
      expect(hotels.length).toBeGreaterThan(0);
      expect(hotels[0].pricePerNightUsd).toBeGreaterThan(0);
    });

    it('should generate day-by-day travel itineraries', () => {
      const itinerary = generateItinerary('TR', 5);
      expect(itinerary.length).toBe(5);
      expect(itinerary[0].day).toBe(1);
    });
  });

  describe('5. Work Travel & Job Sponsorship Engine', () => {
    it('should retrieve job opportunities with visa sponsorship data', () => {
      const jobs = getJobOpportunities('DE');
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].visaSponsorshipConfirmed).toBe(true);
    });

    it('should calculate cost of living metrics for target country', () => {
      const cost = getCostOfLiving('DE');
      expect(cost.rentApartment1BedCenterUsd).toBeGreaterThan(0);
      expect(cost.groceriesMonthlyUsd).toBeGreaterThan(0);
    });
  });

  describe('6. Travel SEO Engine', () => {
    it('should build valid JSON-LD schema graph for travel routes', () => {
      const nat = getCountryByCodeOrName('PK')!;
      const dest = getCountryByCodeOrName('GB')!;
      const rule = getVisaRule('PK', 'GB', 'tourism');

      const schema = generateTravelRouteSchema(rule, nat, dest);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@graph'].length).toBeGreaterThan(0);
    });
  });
});
