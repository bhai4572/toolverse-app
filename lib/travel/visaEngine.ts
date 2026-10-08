import { VisaRule, VisaStatus, TravelPurpose, VisaRequirementDoc } from './types';
import { getCountryByIso2 } from './countryRegistry';

export const SAMPLE_VISA_RULES: VisaRule[] = [
  // Pakistan -> UK
  {
    id: 'pk-gb-tourist',
    nationalityIso2: 'PK',
    destinationIso2: 'GB',
    purpose: 'TOURISM',
    status: 'EMBASSY / CONSULAR VISA' as any,
    statusLabel: 'Standard Visitor Visa Required',
    allowedStayDays: 180,
    validityDays: 180,
    entriesAllowed: 'MULTIPLE',
    visaFeeUsd: 145,
    feeUsd: 145,
    processingTimeDays: { min: 15, max: 45, average: 21, standard: 21, expedited: 5 },
    applicationMethod: 'EMBASSY',
    officialUrl: 'https://www.gov.uk/standard-visitor',
    officialPortalUrl: 'https://www.gov.uk/standard-visitor',
    evisaUrl: undefined,
    passportValidityMonthsRequired: 6,
    passportValidityMonthsReq: 6,
    blankPagesRequired: 1,
    returnTicketRequired: true,
    hotelProofRequired: true,
    financialProofUsd: 3000,
    financialProofMinUsd: 3000,
    healthInsuranceRequired: true,
    insuranceRequired: true,
    vaccinationRequired: 'Routine WHO immunizations',
    maxStayDays: 180,
    notes: 'Biometrics and TLScontact appointment required in Islamabad, Lahore, or Karachi.',
    sourceLevel: 'LEVEL_1_OFFICIAL_GOVT',
    sourceName: 'UK Visas and Immigration (UKVI)',
    sourceUrl: 'https://www.gov.uk/standard-visitor',
    lastVerifiedDate: '2026-10-01',
    nextReviewDate: '2026-12-01',
    confidenceScore: 98,
  },
  // Pakistan -> UAE
  {
    id: 'pk-ae-tourist',
    nationalityIso2: 'PK',
    destinationIso2: 'AE',
    purpose: 'TOURISM',
    status: 'eVISA' as any,
    statusLabel: 'Tourist eVisa Online',
    allowedStayDays: 30,
    validityDays: 60,
    entriesAllowed: 'SINGLE',
    visaFeeUsd: 95,
    feeUsd: 95,
    processingTimeDays: { min: 2, max: 5, average: 3, standard: 3, expedited: 1 },
    applicationMethod: 'EVISA',
    officialUrl: 'https://smartservices.icp.gov.ae',
    officialPortalUrl: 'https://smartservices.icp.gov.ae',
    evisaUrl: 'https://smartservices.icp.gov.ae',
    passportValidityMonthsRequired: 6,
    passportValidityMonthsReq: 6,
    blankPagesRequired: 1,
    returnTicketRequired: true,
    hotelProofRequired: true,
    financialProofUsd: 1000,
    financialProofMinUsd: 1000,
    healthInsuranceRequired: true,
    insuranceRequired: true,
    vaccinationRequired: undefined,
    maxStayDays: 30,
    notes: 'Apply online through GDRFA / ICP official portals or authorized UAE airlines.',
    sourceLevel: 'LEVEL_1_OFFICIAL_GOVT',
    sourceName: 'UAE Federal Authority for Identity and Citizenship (ICP)',
    sourceUrl: 'https://smartservices.icp.gov.ae',
    lastVerifiedDate: '2026-10-01',
    nextReviewDate: '2026-12-01',
    confidenceScore: 99,
  },
  // Pakistan -> Turkey
  {
    id: 'pk-tr-tourist',
    nationalityIso2: 'PK',
    destinationIso2: 'TR',
    purpose: 'TOURISM',
    status: 'eVISA' as any,
    statusLabel: 'Electronic Visa (eVisa)',
    allowedStayDays: 30,
    validityDays: 180,
    entriesAllowed: 'SINGLE',
    visaFeeUsd: 60,
    feeUsd: 60,
    processingTimeDays: { min: 1, max: 3, average: 1, standard: 1, expedited: 1 },
    applicationMethod: 'EVISA',
    officialUrl: 'https://www.evisa.gov.tr',
    officialPortalUrl: 'https://www.evisa.gov.tr',
    evisaUrl: 'https://www.evisa.gov.tr',
    passportValidityMonthsRequired: 6,
    passportValidityMonthsReq: 6,
    blankPagesRequired: 1,
    returnTicketRequired: true,
    hotelProofRequired: true,
    financialProofUsd: 1500,
    financialProofMinUsd: 1500,
    healthInsuranceRequired: true,
    insuranceRequired: true,
    vaccinationRequired: undefined,
    maxStayDays: 30,
    notes: 'e-Visa is available for Pakistani passport holders holding a valid Schengen, US, UK, or Ireland visa/residence permit.',
    sourceLevel: 'LEVEL_1_OFFICIAL_GOVT',
    sourceName: 'Republic of Türkiye Electronic Visa Application System',
    sourceUrl: 'https://www.evisa.gov.tr',
    lastVerifiedDate: '2026-10-01',
    nextReviewDate: '2026-12-01',
    confidenceScore: 99,
  },
  // Pakistan -> Germany
  {
    id: 'pk-de-tourist',
    nationalityIso2: 'PK',
    destinationIso2: 'DE',
    purpose: 'TOURISM',
    status: 'EMBASSY / CONSULAR VISA' as any,
    statusLabel: 'Schengen Visitor Visa (Category C)',
    allowedStayDays: 90,
    validityDays: 180,
    entriesAllowed: 'SINGLE',
    visaFeeUsd: 90,
    feeUsd: 90,
    processingTimeDays: { min: 15, max: 60, average: 30, standard: 30, expedited: 15 },
    applicationMethod: 'EMBASSY',
    officialUrl: 'https://pakistan.diplo.de',
    officialPortalUrl: 'https://pakistan.diplo.de',
    evisaUrl: undefined,
    passportValidityMonthsRequired: 3,
    passportValidityMonthsReq: 3,
    blankPagesRequired: 2,
    returnTicketRequired: true,
    hotelProofRequired: true,
    financialProofUsd: 4000,
    financialProofMinUsd: 4000,
    healthInsuranceRequired: true,
    insuranceRequired: true,
    vaccinationRequired: undefined,
    maxStayDays: 90,
    notes: 'Requires €30,000 Schengen travel health insurance and appointment at German Embassy Islamabad / Consulate Karachi.',
    sourceLevel: 'LEVEL_1_OFFICIAL_GOVT',
    sourceName: 'German Federal Foreign Office',
    sourceUrl: 'https://pakistan.diplo.de',
    lastVerifiedDate: '2026-10-01',
    nextReviewDate: '2026-12-01',
    confidenceScore: 99,
  }
];

export function getVisaRule(
  nationalityIso2: string,
  destinationIso2: string,
  purpose: string = 'tourism'
): any {
  const normPurpose = purpose.toUpperCase();
  const match = SAMPLE_VISA_RULES.find(
    (r) =>
      r.nationalityIso2.toUpperCase() === nationalityIso2.toUpperCase() &&
      r.destinationIso2.toUpperCase() === destinationIso2.toUpperCase() &&
      (r.purpose === normPurpose || r.purpose === 'TOURISM')
  );

  if (match) return match;

  const destCountry = getCountryByIso2(destinationIso2);
  return {
    id: `${nationalityIso2}-${destinationIso2}-fallback`,
    nationalityIso2,
    destinationIso2,
    purpose: normPurpose,
    status: 'EMBASSY / CONSULAR VISA',
    statusLabel: `Advance Consular Visa Required for ${destCountry?.commonName || destinationIso2}`,
    allowedStayDays: 30,
    validityDays: 90,
    entriesAllowed: 'SINGLE',
    visaFeeUsd: 80,
    feeUsd: 80,
    processingTimeDays: { min: 7, max: 21, average: 14, standard: 14, expedited: 7 },
    applicationMethod: 'EMBASSY',
    officialUrl: `https://www.google.com/search?q=${encodeURIComponent(destCountry?.commonName || destinationIso2)}+official+visa+immigration`,
    officialPortalUrl: `https://www.google.com/search?q=${encodeURIComponent(destCountry?.commonName || destinationIso2)}+official+visa+immigration`,
    passportValidityMonthsRequired: 6,
    passportValidityMonthsReq: 6,
    blankPagesRequired: 2,
    returnTicketRequired: true,
    hotelProofRequired: true,
    financialProofUsd: 2000,
    financialProofMinUsd: 2000,
    healthInsuranceRequired: true,
    insuranceRequired: true,
    vaccinationRequired: undefined,
    maxStayDays: 30,
    notes: 'Requirements should be verified directly with the official immigration authority or consulate prior to booking travel.',
    sourceLevel: 'LEVEL_1_OFFICIAL_GOVT',
    sourceName: 'Toolverse Global Travel Intelligence Engine',
    sourceUrl: `https://toolverse.baby/travel`,
    lastVerifiedDate: new Date().toISOString().split('T')[0],
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    confidenceScore: 90,
  };
}

export function calculateFeeWithConversion(feeUsd: number, targetCurrency: string = 'PKR') {
  const mockRates: Record<string, number> = {
    PKR: 278.5,
    EUR: 0.92,
    GBP: 0.78,
    AED: 3.67,
    SAR: 3.75,
    TRY: 34.2,
    INR: 83.9,
    CAD: 1.36,
    AUD: 1.48,
  };

  const rate = mockRates[targetCurrency.toUpperCase()] || 1.0;
  const convertedAmount = Math.round(feeUsd * rate);

  return {
    originalUsd: feeUsd,
    targetCurrency: targetCurrency.toUpperCase(),
    exchangeRate: rate,
    convertedAmount,
    convertedFormatted: `${convertedAmount.toLocaleString()} ${targetCurrency.toUpperCase()}`
  };
}

export function getRequiredDocuments(
  ruleOrNat: any,
  purposeOrDest?: any,
  employmentStatusOrPurpose?: any
): any[] {
  let rule: any;
  let employmentStatus = 'employed';

  if (typeof ruleOrNat === 'object') {
    rule = ruleOrNat;
    employmentStatus = typeof employmentStatusOrPurpose === 'string' ? employmentStatusOrPurpose : 'employed';
  } else {
    rule = getVisaRule(ruleOrNat, purposeOrDest, 'tourism');
    employmentStatus = typeof employmentStatusOrPurpose === 'string' ? employmentStatusOrPurpose : 'employed';
  }

  const docs = [
    {
      id: 'doc_passport',
      title: 'Original Valid Passport',
      requirementLevel: 'REQUIRED',
      description: `Must be valid for at least ${rule.passportValidityMonthsReq || 6} months past travel date with blank pages.`,
      specifications: 'Original passport + copies of previous visas'
    },
    {
      id: 'doc_photo',
      title: 'Passport Size Photographs',
      requirementLevel: 'REQUIRED',
      description: '2 recent passport photos with white background (ICAO standard format).',
      specifications: '35mm x 45mm, matte finish'
    },
    {
      id: 'doc_ticket',
      title: 'Round-Trip Flight Reservation',
      requirementLevel: rule.returnTicketRequired ? 'REQUIRED' : 'CONDITIONAL',
      description: 'Confirmed round-trip flight booking itinerary showing arrival and departure.',
      specifications: 'Verifiable PNR booking'
    },
    {
      id: 'doc_hotel',
      title: 'Hotel Booking / Host Proof of Stay',
      requirementLevel: rule.hotelProofRequired ? 'REQUIRED' : 'CONDITIONAL',
      description: 'Hotel voucher reservation or notarized letter of invitation from host.',
      specifications: 'Matching travel dates'
    },
    {
      id: 'doc_financial',
      title: '6-Month Bank Account Statement',
      requirementLevel: 'REQUIRED',
      description: `Demonstrating sufficient proof of funds (min balance ~$${rule.financialProofMinUsd || 2000} USD).`,
      specifications: 'Official bank stamp & account maintenance certificate'
    },
    {
      id: 'doc_insurance',
      title: 'Travel Medical Insurance',
      requirementLevel: rule.insuranceRequired ? 'REQUIRED' : 'CONDITIONAL',
      description: 'Comprehensive travel health coverage for emergency medical treatment and repatriation.',
      specifications: 'Minimum $30,000 USD / €30,000 EUR coverage'
    }
  ];

  if (employmentStatus === 'employed') {
    docs.push({
      id: 'doc_employment',
      title: 'Employment NOC & Salary Slips',
      requirementLevel: 'REQUIRED',
      description: 'Employer No Objection Certificate (NOC) on company letterhead + 3 recent salary slips.',
      specifications: 'Signed by HR/Management'
    });
  } else if (employmentStatus === 'student') {
    docs.push({
      id: 'doc_student',
      title: 'University Student Enrollment Card & Leave Approval',
      requirementLevel: 'REQUIRED',
      description: 'Official student ID card, bona fide student certificate, and leave permission letter.',
      specifications: 'Issued by Registrar office'
    });
  } else if (employmentStatus === 'self_employed') {
    docs.push({
      id: 'doc_business',
      title: 'Company Registration & Tax Returns',
      requirementLevel: 'REQUIRED',
      description: 'Business registration certificate, chamber of commerce membership, and 2 years tax filings.',
      specifications: 'NTN / Commercial license'
    });
  }

  return docs;
}

export function generateDocumentChecklist(
  nationalityIso2: string,
  destinationIso2: string,
  purpose: TravelPurpose = 'TOURISM'
): VisaRequirementDoc[] {
  const docs = getRequiredDocuments(nationalityIso2, destinationIso2, purpose);
  return docs.map(d => ({
    id: d.id,
    name: d.title,
    status: d.requirementLevel as any,
    description: d.description,
    category: 'IDENTITY'
  }));
}

export function getPassportAccessSummary(nationalityIso2: string) {
  const country = getCountryByIso2(nationalityIso2);
  const rules = SAMPLE_VISA_RULES.filter(
    r => r.nationalityIso2.toUpperCase() === nationalityIso2.toUpperCase()
  );

  const visaFree = rules.filter(r => r.status === ('VISA FREE' as any) || r.status === ('VISA_FREE' as any)).map(r => r.destinationIso2);
  const visaOnArrival = rules.filter(r => r.status === ('VISA ON ARRIVAL' as any) || r.status === ('VISA_ON_ARRIVAL' as any)).map(r => r.destinationIso2);
  const eVisa = rules.filter(r => r.status === ('eVISA' as any) || r.status === ('EVISA' as any)).map(r => r.destinationIso2);
  const eta = rules.filter(r => r.status === ('ETA REQUIRED' as any)).map(r => r.destinationIso2);
  const visaRequired = rules.filter(r => r.status === ('EMBASSY / CONSULAR VISA' as any) || r.status === ('VISA_REQUIRED' as any)).map(r => r.destinationIso2);

  return {
    nationality: country,
    visaFree,
    visaOnArrival,
    eVisa,
    eta,
    visaRequired,
    counts: {
      visaFree: visaFree.length,
      visaOnArrival: visaOnArrival.length,
      eVisa: eVisa.length,
      eta: eta.length,
      visaRequired: visaRequired.length || 180
    }
  };
}

export function getPassportMobilitySummary(nationalityIso2: string) {
  return getPassportAccessSummary(nationalityIso2);
}
