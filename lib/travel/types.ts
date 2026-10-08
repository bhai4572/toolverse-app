/**
 * Toolverse Global Travel Intelligence System Types
 * Covers 193 UN Member States, Visa Engine, Embassies, Tourism, Jobs, Cost of Living, and Admin Control.
 */

export type VisaStatus =
  | 'VISA_FREE'
  | 'VISA_REQUIRED'
  | 'VISA_ON_ARRIVAL'
  | 'EVISA'
  | 'ETA_REQUIRED'
  | 'EMBASSY_VISA'
  | 'TRANSIT_VISA'
  | 'CONDITIONAL_ENTRY'
  | 'ENTRY_RESTRICTED'
  | 'SUSPENDED';

export type SourceLevel = 'LEVEL_1_OFFICIAL_GOVT' | 'LEVEL_2_AIRLINE_IATA' | 'LEVEL_3_TRUSTED_PROVIDER' | 'LEVEL_4_COMMUNITY';

export type TravelPurpose =
  | 'TOURISM'
  | 'BUSINESS'
  | 'WORK'
  | 'STUDY'
  | 'FAMILY_VISIT'
  | 'TRANSIT'
  | 'DIGITAL_NOMAD'
  | 'MEDICAL';

export interface Country {
  id: string; // ISO 2 (e.g., PK, US, GB)
  iso2: string;
  iso3: string;
  officialName: string;
  commonName: string;
  name: string; // alias for commonName
  capital: string;
  continent: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Antarctica';
  region: string;
  currencyCode: string;
  currencySymbol: string;
  currency: { code: string; symbol: string };
  callingCode: string;
  languages: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  passportValidityMonths: number; // e.g., 6 months required
  isUnMember: boolean;
  flagEmoji: string;
  flag: string; // alias for flagEmoji
  demonym: string;
}

export interface VisaRequirementDoc {
  id: string;
  name: string;
  status: 'REQUIRED' | 'OPTIONAL' | 'CONDITIONAL';
  description: string;
  category: 'IDENTITY' | 'FINANCIAL' | 'TRAVEL' | 'EMPLOYMENT' | 'MEDICAL';
}

export interface VisaRule {
  id: string;
  nationalityIso2: string;
  destinationIso2: string;
  purpose: TravelPurpose;
  status: VisaStatus;
  statusLabel: string;
  allowedStayDays: number;
  validityDays: number;
  entriesAllowed: 'SINGLE' | 'MULTIPLE' | 'DOUBLE';
  visaFeeUsd: number;
  processingTimeDays: {
    min: number;
    max: number;
    average: number;
  };
  applicationMethod: 'ONLINE' | 'EMBASSY' | 'ON_ARRIVAL' | 'NOT_REQUIRED';
  officialUrl?: string;
  evisaUrl?: string;
  passportValidityMonthsRequired: number;
  blankPagesRequired: number;
  returnTicketRequired: boolean;
  hotelProofRequired: boolean;
  financialProofUsd: number; // Required bank balance estimate
  healthInsuranceRequired: boolean;
  vaccinationRequired?: string[];
  notes: string;
  sourceLevel: SourceLevel;
  sourceName: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  nextReviewDate: string;
  confidenceScore: number; // 0 - 100%
}

export interface EmbassyMission {
  id: string;
  representingCountryIso2: string;
  hostCountryIso2: string;
  city: string;
  type: 'EMBASSY' | 'CONSULATE_GENERAL' | 'CONSULATE' | 'VAC'; // VAC = Visa Application Center (VFS/TLS)
  title: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  appointmentUrl?: string;
  jurisdiction: string;
  lastVerifiedDate: string;
}

export interface TouristAttraction {
  id: string;
  countryIso2: string;
  cityName: string;
  name: string;
  category: 'HISTORICAL' | 'NATURE' | 'BEACH' | 'CITY' | 'CULTURE' | 'FAMILY';
  description: string;
  ticketPriceUsd: number;
  visitDurationHours: number;
  bestSeason: string;
  rating: number;
  imageUrl: string;
}

export interface AccommodationOption {
  id: string;
  countryIso2: string;
  cityName: string;
  name: string;
  type: 'HOTEL' | 'HOSTEL' | 'APARTMENT' | 'LONG_STAY_RENTAL';
  pricePerNightUsd: number;
  monthlyRentUsd?: number;
  rating: number;
  address: string;
  bookingUrl: string;
}

export interface JobOpportunity {
  id: string;
  countryIso2: string;
  cityName: string;
  title: string;
  employer: string;
  category: 'SOFTWARE' | 'ENGINEERING' | 'HEALTHCARE' | 'FINANCE' | 'HOSPITALITY';
  averageAnnualSalaryUsd: number;
  visaSponsorshipConfirmed: boolean;
  requirements: string[];
  applicationUrl: string;
  postedDate: string;
}

export interface CostOfLivingCity {
  cityName: string;
  countryIso2: string;
  monthlyRentBudgetStudioUsd: number;
  monthlyRentApartmentUsd: number;
  mealBudgetUsd: number;
  monthlyTransportPassUsd: number;
  monthlyUtilitiesUsd: number;
  estimatedSingleTotalUsd: number;
  estimatedFamilyTotalUsd: number;
  lifestyleRating: 'CHEAP' | 'MODERATE' | 'EXPENSIVE';
}

export interface TravelAdvisory {
  countryIso2: string;
  riskLevel: 'LOW' | 'EXERCISE_CAUTION' | 'RECONSIDER_TRAVEL' | 'DO_NOT_TRAVEL';
  advisoryText: string;
  issuedBy: string;
  lastUpdated: string;
}

export interface TravelPlan {
  id: string;
  nationalityIso2: string;
  destinationIso2: string;
  purpose: TravelPurpose;
  durationDays: number;
  budgetUsd: number;
  travelersCount: number;
  dailyItinerary: Array<{
    day: number;
    title: string;
    attractions: string[];
    estimatedCostUsd: number;
  }>;
  totalEstimatedCostUsd: number;
}

export interface DataHealthReport {
  totalCountries: number;
  countriesWithVisaData: number;
  countriesWithEmbassyData: number;
  countriesWithTourismData: number;
  coveragePercentage: number;
  unverifiedRecordsCount: number;
  lastUpdated: string;
}
