/**
 * Global 193-Country Higher Education, University Directory & DIY Admission Engine
 * Built on UN_COUNTRIES (lib/travel/countryRegistry.ts) — covers all 193 UN Member States.
 */

import { UN_COUNTRIES } from '@/lib/travel/countryRegistry';
import { Country } from '@/lib/travel/types';

export type ProgramCategorySlug =
  | 'cs-it'
  | 'engineering'
  | 'medicine-health'
  | 'business-mba'
  | 'law-policy'
  | 'natural-sciences'
  | 'arts-design'
  | 'social-humanities'
  | 'agriculture-env';

export type DegreeLevel =
  | 'Bachelor'
  | 'Master'
  | 'PhD'
  | 'MBBS / MD'
  | 'Diploma / Foundation';

export type BudgetTier = 'free-low' | 'affordable' | 'moderate' | 'premium';

export interface ProgramCategoryMeta {
  slug: ProgramCategorySlug;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  sampleMajors: string[];
  typicalRequirements: string;
}

export interface UniversityProgram {
  category: ProgramCategorySlug;
  categoryLabel: string;
  degrees: DegreeLevel[];
  popularMajors: string[];
  durationYears: string;
  annualTuitionUsd: string;
  language: string;
  entryRequirements: string;
}

export interface ScholarshipItem {
  name: string;
  countryIso2: string;
  countryName: string;
  fundingType: 'Fully Funded' | 'Tuition Waiver' | 'Partial Merit' | 'Government Grant';
  coverage: string;
  degrees: DegreeLevel[];
  deadlineWindow: string;
  officialUrl: string;
}

export interface DiyAdmissionStep {
  step: number;
  title: string;
  timeline: string;
  detail: string;
  proTip: string;
  toolHref?: string;
  toolLabel?: string;
}

export interface DocumentCategoryGroup {
  category: 'Academic' | 'Identity & Language' | 'Essays & Recommendations' | 'Financial & Visa';
  title: string;
  items: { id: string; label: string; note: string; requiredFor: string }[];
}

export interface UniversityProfile {
  id: string;
  slug: string;
  name: string;
  countryIso2: string;
  countrySlug: string;
  countryName: string;
  countryFlag: string;
  continent: Country['continent'];
  city: string;
  type: 'Public National' | 'Public Research' | 'Private' | 'Technical & Medical';
  founded: number;
  website: string;
  admissionsPortalUrl: string;
  applicationSystem: string;
  tuitionMinUsd: number;
  tuitionMaxUsd: number;
  tuitionLabel: string;
  budgetTier: BudgetTier;
  applicationFeeUsd: string;
  livingCostPerYearUsd: string;
  acceptanceBand: string;
  intakes: string[];
  languages: string[];
  englishRequirements: string;
  moiAccepted: boolean;
  workRightsStudy: string;
  postStudyWorkVisa: string;
  scholarships: { name: string; coverage: string; eligibility: string }[];
  programs: UniversityProgram[];
  admissionSteps: DiyAdmissionStep[];
  requiredDocuments: DocumentCategoryGroup[];
}

export interface CountryStudySummary {
  iso2: string;
  slug: string;
  name: string;
  officialName: string;
  flag: string;
  capital: string;
  continent: Country['continent'];
  region: string;
  currencyCode: string;
  currencySymbol: string;
  tuitionMinUsd: number;
  tuitionMaxUsd: number;
  tuitionBandLabel: string;
  livingCostYearUsd: string;
  budgetTier: BudgetTier;
  nationalPortalName: string;
  nationalPortalUrl: string;
  visaCategoryName: string;
  visaProcessingWeeks: string;
  bankStatementRequirementUsd: string;
  workHoursAllowed: string;
  postStudyStay: string;
  mainIntakes: string[];
  instructionLanguages: string[];
  moiFriendly: boolean;
  universitiesCount: number;
  universities: UniversityProfile[];
}

export const PROGRAM_CATEGORIES: ProgramCategoryMeta[] = [
  {
    slug: 'cs-it',
    name: 'Computer Science, AI & Data Science',
    shortName: 'CS, AI & IT',
    icon: '💻',
    description: 'Software Engineering, Artificial Intelligence, Cybersecurity, Cloud Computing, and Data Science.',
    sampleMajors: ['Computer Science (BS/MS/PhD)', 'Artificial Intelligence & ML', 'Cybersecurity & Networks', 'Data Science & Analytics', 'Software Engineering', 'Information Systems'],
    typicalRequirements: 'Strong Mathematics background in High School / BS; programming portfolio recommended for MS/PhD.',
  },
  {
    slug: 'engineering',
    name: 'Engineering & Technology',
    shortName: 'Engineering',
    icon: '⚙️',
    description: 'Mechanical, Electrical, Civil, Chemical, Mechatronics, Aerospace, and Renewable Energy Engineering.',
    sampleMajors: ['Electrical & Electronics Engineering', 'Mechanical & Mechatronics Engineering', 'Civil & Structural Engineering', 'Chemical & Process Engineering', 'Aerospace & Automotive Engineering', 'Renewable Energy Systems'],
    typicalRequirements: 'Physics, Chemistry & Mathematics (Pre-Engineering / A-Levels) for Bachelor; relevant BEng/BS for Master/PhD.',
  },
  {
    slug: 'medicine-health',
    name: 'Medicine (MBBS/MD), Nursing & Public Health',
    shortName: 'Medicine & Health',
    icon: '🩺',
    description: 'Clinical Medicine (MBBS/MD), Dentistry (BDS), Pharmacy (PharmD), BSc Nursing, Physiotherapy, and MPH.',
    sampleMajors: ['General Medicine (MBBS / MD)', 'Dental Surgery (BDS / DDS)', 'Bachelor & Master of Nursing (BSN/MSN)', 'Pharmacy & Pharmaceutical Sciences', 'Master of Public Health (MPH)', 'Biomedical & Clinical Sciences'],
    typicalRequirements: 'Biology, Chemistry & Physics in High School (typically 65%–85%+); entrance test (NEET/UCAT/IMAT/MCAT) where applicable.',
  },
  {
    slug: 'business-mba',
    name: 'Business, Finance, Economics & MBA',
    shortName: 'Business & MBA',
    icon: '📈',
    description: 'Business Administration (BBA/MBA), Accounting & Finance, Supply Chain, FinTech, Digital Marketing, and Economics.',
    sampleMajors: ['Business Administration (BBA / MBA)', 'Accounting, Finance & FinTech', 'International Business & Trade', 'Supply Chain & Logistics Management', 'Economics & Econometrics', 'Digital Marketing & Business Analytics'],
    typicalRequirements: 'Open to all academic streams for BBA; 2+ years work experience preferred for Executive/Full-time MBA.',
  },
  {
    slug: 'law-policy',
    name: 'Law, International Relations & Public Policy',
    shortName: 'Law & Policy',
    icon: '⚖️',
    description: 'LLB, LLM, Corporate & International Law, Diplomacy, Political Science, and Public Administration (MPA/MPP).',
    sampleMajors: ['Bachelor of Laws (LLB)', 'Master of Laws (LLM — Corporate / International)', 'International Relations & Diplomacy', 'Public Policy & Governance (MPP/MPA)', 'Human Rights & Maritime Law', 'Criminology & Legal Studies'],
    typicalRequirements: 'Strong analytical writing and English proficiency; LNAT/LSAT only for select UK/US law schools.',
  },
  {
    slug: 'natural-sciences',
    name: 'Natural & Applied Sciences',
    shortName: 'Natural Sciences',
    icon: '🔬',
    description: 'Physics, Chemistry, Biotechnology, Molecular Biology, Mathematics, Statistics, and Material Sciences.',
    sampleMajors: ['Biotechnology & Molecular Biology', 'Physics & Astrophysics', 'Chemistry & Materials Science', 'Pure & Applied Mathematics', 'Microbiology & Genetics', 'Actuarial Science & Statistics'],
    typicalRequirements: 'Science subjects in High School; laboratory coursework and research thesis for MS/PhD.',
  },
  {
    slug: 'arts-design',
    name: 'Arts, Architecture, Design & Media',
    shortName: 'Arts & Architecture',
    icon: '🎨',
    description: 'Architecture (BArch/MArch), Graphic & UI/UX Design, Film & Media, Fashion Design, and Urban Planning.',
    sampleMajors: ['Architecture & Urban Design (BArch/MArch)', 'UI/UX & Interaction Design', 'Media, Film & Journalism', 'Industrial & Product Design', 'Fine Arts & Visual Communication', 'Interior & Fashion Design'],
    typicalRequirements: 'Creative Design Portfolio (10–20 original works) required for Architecture and Design programs.',
  },
  {
    slug: 'social-humanities',
    name: 'Social Sciences, Psychology & Education',
    shortName: 'Social & Education',
    icon: '📚',
    description: 'Clinical & Counseling Psychology, Sociology, Education (BEd/MEd/TESOL), Linguistics, and History.',
    sampleMajors: ['Psychology & Behavioral Sciences', 'Education Leadership & TESOL (BEd/MEd)', 'Sociology & Anthropology', 'Modern Languages & Linguistics', 'Development Studies', 'History & Philosophy'],
    typicalRequirements: 'High school diploma or relevant Bachelor degree; writing sample or SOP required.',
  },
  {
    slug: 'agriculture-env',
    name: 'Agriculture, Food & Environmental Sciences',
    shortName: 'Agriculture & Climate',
    icon: '🌱',
    description: 'Agronomy, Food Science & Nutrition, Climate Change, Forestry, Veterinary Medicine (DVM), and Water Resources.',
    sampleMajors: ['Agricultural Sciences & Agronomy', 'Environmental Science & Climate Policy', 'Food Science & Human Nutrition', 'Veterinary Medicine (DVM)', 'Sustainable Forestry & Ecology', 'Water Resource Management'],
    typicalRequirements: 'Biology/Chemistry background; high scholarship availability under UN SDG & climate research grants.',
  },
];

export const DEGREE_LEVELS: DegreeLevel[] = [
  'Bachelor',
  'Master',
  'PhD',
  'MBBS / MD',
  'Diploma / Foundation',
];

export const GLOBAL_SCHOLARSHIPS: ScholarshipItem[] = [
  {
    name: 'DAAD EPOS & Master/PhD Scholarships',
    countryIso2: 'DE',
    countryName: 'Germany',
    fundingType: 'Fully Funded',
    coverage: '€934–€1,300/month stipend + full health insurance + travel allowance + €0 tuition at public universities',
    degrees: ['Master', 'PhD'],
    deadlineWindow: 'August – November (varies by program)',
    officialUrl: 'https://www.daad.de/en/',
  },
  {
    name: 'Fulbright Foreign Student Program',
    countryIso2: 'US',
    countryName: 'United States',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition, monthly living stipend, round-trip airfare, J-1 visa support, and health insurance',
    degrees: ['Master', 'PhD'],
    deadlineWindow: 'February – May (country-specific)',
    officialUrl: 'https://foreign.fulbrightonline.org/',
  },
  {
    name: 'Chevening UK Government Scholarships',
    countryIso2: 'GB',
    countryName: 'United Kingdom',
    fundingType: 'Fully Funded',
    coverage: '100% UK university tuition + monthly living allowance + return flights + UK visa fee',
    degrees: ['Master'],
    deadlineWindow: 'August – November annually',
    officialUrl: 'https://www.chevening.org/',
  },
  {
    name: 'Commonwealth Master’s & PhD Scholarships',
    countryIso2: 'GB',
    countryName: 'United Kingdom',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition fees, airfare, £1,347–£1,652/month stipend, warm clothing & thesis grant',
    degrees: ['Master', 'PhD'],
    deadlineWindow: 'September – October annually',
    officialUrl: 'https://cscuk.fcdo.gov.uk/',
  },
  {
    name: 'Chinese Government Scholarship (CSC — Type A & B)',
    countryIso2: 'CN',
    countryName: 'China',
    fundingType: 'Fully Funded',
    coverage: '100% tuition waiver + free university dorm + CNY 2,500–3,500/month stipend + medical insurance',
    degrees: ['Bachelor', 'Master', 'PhD'],
    deadlineWindow: 'December – March annually',
    officialUrl: 'https://www.campuschina.org/',
  },
  {
    name: 'Türkiye Bursları (Turkish Government Scholarship)',
    countryIso2: 'TR',
    countryName: 'Turkey',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition + free 1-year Turkish language course + accommodation + monthly stipend + return flight',
    degrees: ['Bachelor', 'Master', 'PhD'],
    deadlineWindow: 'January 10 – February 20 annually',
    officialUrl: 'https://www.turkiyeburslari.gov.tr/',
  },
  {
    name: 'Erasmus Mundus Joint Masters (EMJM)',
    countryIso2: 'FR',
    countryName: 'European Union (Multi-Country)',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition + €1,400/month stipend for 24 months + travel & installation costs across 2–3 EU universities',
    degrees: ['Master'],
    deadlineWindow: 'October – February (per consortium)',
    officialUrl: 'https://erasmus-plus.ec.europa.eu/',
  },
  {
    name: 'Stipendium Hungaricum (Hungary Government)',
    countryIso2: 'HU',
    countryName: 'Hungary',
    fundingType: 'Fully Funded',
    coverage: 'Tuition-free education + dormitory place + monthly HUF stipend + health insurance',
    degrees: ['Bachelor', 'Master', 'PhD', 'MBBS / MD'],
    deadlineWindow: 'November – January 15 annually',
    officialUrl: 'https://stipendiumhungaricum.hu/',
  },
  {
    name: 'MEXT Japanese Government Scholarship',
    countryIso2: 'JP',
    countryName: 'Japan',
    fundingType: 'Fully Funded',
    coverage: '100% tuition exemption + JPY 117,000–145,000/month stipend + round-trip airfare',
    degrees: ['Bachelor', 'Master', 'PhD'],
    deadlineWindow: 'April – June (Embassy Track) / Sept – Nov (University Track)',
    officialUrl: 'https://www.studyinjapan.go.jp/',
  },
  {
    name: 'Global Korea Scholarship (GKS / KGSP)',
    countryIso2: 'KR',
    countryName: 'South Korea',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition + KRW 1,000,000+/month living allowance + airfare + 1-year Korean language training',
    degrees: ['Bachelor', 'Master', 'PhD'],
    deadlineWindow: 'Sept – Oct (Undergrad) / Feb – March (Grad)',
    officialUrl: 'https://www.studyinkorea.go.kr/',
  },
  {
    name: 'Australia Awards & Research Training Program (RTP)',
    countryIso2: 'AU',
    countryName: 'Australia',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition offset + AUD $32,000+/year living stipend + OSHC health cover + flights',
    degrees: ['Master', 'PhD'],
    deadlineWindow: 'February – April (Australia Awards) / Year-round (RTP)',
    officialUrl: 'https://www.studyaustralia.gov.au/',
  },
  {
    name: 'Vanier Canada Graduate & Provincial Scholarships',
    countryIso2: 'CA',
    countryName: 'Canada',
    fundingType: 'Fully Funded',
    coverage: 'CAD $50,000/year for 3 years (PhD) or university RA/TA funding packages ($18k–$35k/yr)',
    degrees: ['Master', 'PhD'],
    deadlineWindow: 'September – November annually',
    officialUrl: 'https://www.educanada.ca/',
  },
  {
    name: 'Italian DSU / EDISU Regional Need-Based Scholarship',
    countryIso2: 'IT',
    countryName: 'Italy',
    fundingType: 'Fully Funded',
    coverage: '100% tuition fee waiver + free canteen meals + €6,000–€7,500/year stipend based on family income (ISEE Parificato)',
    degrees: ['Bachelor', 'Master', 'PhD', 'MBBS / MD'],
    deadlineWindow: 'July – September annually',
    officialUrl: 'https://universitaly.it/',
  },
  {
    name: 'Study in Saudi (KSA Government Unified Portal Scholarship)',
    countryIso2: 'SA',
    countryName: 'Saudi Arabia',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition waiver + free furnished housing + monthly stipend + annual return ticket + free healthcare',
    degrees: ['Bachelor', 'Master', 'PhD'],
    deadlineWindow: 'May – July (Bachelor) / October – December (Postgrad)',
    officialUrl: 'https://studyinsaudi.moe.gov.sa/',
  },
  {
    name: 'Russian Government Quota Scholarship (Open Doors / Education in Russia)',
    countryIso2: 'RU',
    countryName: 'Russia',
    fundingType: 'Tuition Waiver',
    coverage: '100% full state tuition waiver + subsidized university dormitory ($15–$40/month) + preparatory year',
    degrees: ['Bachelor', 'Master', 'PhD', 'MBBS / MD'],
    deadlineWindow: 'September – December annually',
    officialUrl: 'https://education-in-russia.com/',
  },
  {
    name: 'Malaysia International Scholarship (MIS)',
    countryIso2: 'MY',
    countryName: 'Malaysia',
    fundingType: 'Fully Funded',
    coverage: 'Full tuition fees at top Malaysian public/private universities + MYR 1,500/month living allowance',
    degrees: ['Master', 'PhD'],
    deadlineWindow: 'April – June annually',
    officialUrl: 'https://biasiswa.mohe.gov.my/INTER/',
  },
];

/**
 * Legacy and friendly slug aliases mapped to ISO-2 codes so `/study/usa`, `/study/uk`,
 * `/study/united-states`, `/study/germany`, `/study/de` all resolve cleanly.
 */
export const COUNTRY_SLUG_ALIASES: Record<string, string> = {
  usa: 'US',
  'united-states': 'US',
  'united-states-of-america': 'US',
  uk: 'GB',
  'united-kingdom': 'GB',
  britain: 'GB',
  england: 'GB',
  uae: 'AE',
  'united-arab-emirates': 'AE',
  'south-korea': 'KR',
  'republic-of-korea': 'KR',
  korea: 'KR',
  'north-korea': 'KP',
  russia: 'RU',
  'russian-federation': 'RU',
  turkiye: 'TR',
  turkey: 'TR',
  czechia: 'CZ',
  'czech-republic': 'CZ',
  vietnam: 'VN',
  'viet-nam': 'VN',
  iran: 'IR',
  syria: 'SY',
  laos: 'LA',
  bolivia: 'BO',
  venezuela: 'VE',
  tanzania: 'TZ',
  moldova: 'MD',
  brunei: 'BN',
  eswatini: 'SZ',
  'cape-verde': 'CV',
  'cabo-verde': 'CV',
  'ivory-coast': 'CI',
  'cote-divoire': 'CI',
  'timor-leste': 'TL',
  'east-timor': 'TL',
  micronesia: 'FM',
};

/** Canonical URL slug for a country */
export function getCanonicalCountrySlug(country: Country): string {
  if (country.iso2 === 'US') return 'usa';
  if (country.iso2 === 'GB') return 'uk';
  return country.commonName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Real Flagship National Universities for all 193 UN Member Countries
 * Format: ISO2 -> Array of [University Name, City, Official Domain, FoundedYear, Type]
 */
const FLAGSHIP_UNIVERSITIES_BY_ISO2: Record<
  string,
  readonly [name: string, city: string, domain: string, founded: number, type: UniversityProfile['type']][]
> = {
  AF: [
    ['Kabul University', 'Kabul', 'ku.edu.af', 1931, 'Public National'],
    ['Kabul Polytechnic University', 'Kabul', 'kpu.edu.af', 1963, 'Technical & Medical'],
    ['American University of Afghanistan', 'Kabul', 'auaf.edu.af', 2006, 'Private'],
  ],
  AL: [
    ['University of Tirana', 'Tirana', 'unitir.edu.al', 1957, 'Public National'],
    ['Polytechnic University of Tirana', 'Tirana', 'upt.al', 1951, 'Technical & Medical'],
    ['Epoka University', 'Tirana', 'epoka.edu.al', 2007, 'Private'],
  ],
  DZ: [
    ['University of Algiers 1 (Benyoucef Benkhedda)', 'Algiers', 'univ-alger.dz', 1909, 'Public National'],
    ['University of Science and Technology Houari Boumediene (USTHB)', 'Algiers', 'usthb.dz', 1974, 'Technical & Medical'],
    ['University of Constantine 1', 'Constantine', 'umc.edu.dz', 1969, 'Public Research'],
  ],
  AD: [
    ['University of Andorra (Universitat d’Andorra)', 'Sant Julià de Lòria', 'uda.ad', 1997, 'Public National'],
  ],
  AO: [
    ['Agostinho Neto University', 'Luanda', 'uan.ao', 1962, 'Public National'],
    ['Catholic University of Angola (UCAN)', 'Luanda', 'ucan.edu', 1997, 'Private'],
  ],
  AG: [
    ['University of the West Indies Five Islands Campus', 'St. John’s', 'uwi.edu/fiveislands', 2019, 'Public National'],
    ['American University of Antigua (College of Medicine)', 'St. John’s', 'auamed.org', 2004, 'Technical & Medical'],
  ],
  AR: [
    ['University of Buenos Aires (UBA)', 'Buenos Aires', 'uba.ar', 1821, 'Public National'],
    ['National University of La Plata (UNLP)', 'La Plata', 'unlp.edu.ar', 1905, 'Public Research'],
    ['Universidad Austral', 'Buenos Aires', 'austral.edu.ar', 1991, 'Private'],
  ],
  AM: [
    ['Yerevan State University (YSU)', 'Yerevan', 'ysu.am', 1919, 'Public National'],
    ['Yerevan State Medical University (YSMU)', 'Yerevan', 'ysmu.am', 1920, 'Technical & Medical'],
    ['American University of Armenia (AUA)', 'Yerevan', 'aua.am', 1991, 'Private'],
  ],
  AU: [
    ['University of Melbourne', 'Melbourne', 'unimelb.edu.au', 1853, 'Public Research'],
    ['University of Sydney', 'Sydney', 'sydney.edu.au', 1850, 'Public Research'],
    ['Australian National University (ANU)', 'Canberra', 'anu.edu.au', 1946, 'Public National'],
    ['Monash University', 'Melbourne', 'monash.edu', 1958, 'Public Research'],
    ['University of Queensland (UQ)', 'Brisbane', 'uq.edu.au', 1909, 'Public Research'],
    ['UNSW Sydney', 'Sydney', 'unsw.edu.au', 1949, 'Public Research'],
  ],
  AT: [
    ['University of Vienna (Universität Wien)', 'Vienna', 'univie.ac.at', 1365, 'Public National'],
    ['Vienna University of Technology (TU Wien)', 'Vienna', 'tuwien.at', 1815, 'Technical & Medical'],
    ['Medical University of Vienna', 'Vienna', 'meduniwien.ac.at', 2004, 'Technical & Medical'],
  ],
  AZ: [
    ['Baku State University', 'Baku', 'bsu.edu.az', 1919, 'Public National'],
    ['ADA University', 'Baku', 'ada.edu.az', 2006, 'Public Research'],
    ['Azerbaijan Medical University', 'Baku', 'amu.edu.az', 1930, 'Technical & Medical'],
  ],
  BS: [
    ['University of The Bahamas', 'Nassau', 'ub.edu.bs', 1974, 'Public National'],
  ],
  BH: [
    ['University of Bahrain', 'Sakhir', 'uob.edu.bh', 1986, 'Public National'],
    ['Arabian Gulf University', 'Manama', 'agu.edu.bh', 1979, 'Technical & Medical'],
  ],
  BD: [
    ['University of Dhaka', 'Dhaka', 'du.ac.bd', 1921, 'Public National'],
    ['Bangladesh University of Engineering and Technology (BUET)', 'Dhaka', 'buet.ac.bd', 1962, 'Technical & Medical'],
    ['North South University (NSU)', 'Dhaka', 'northsouth.edu', 1992, 'Private'],
  ],
  BB: [
    ['University of the West Indies Cave Hill Campus', 'Bridgetown', 'cavehill.uwi.edu', 1963, 'Public National'],
  ],
  BY: [
    ['Belarusian State University (BSU)', 'Minsk', 'bsu.by', 1921, 'Public National'],
    ['Belarusian State Medical University (BSMU)', 'Minsk', 'bsmu.by', 1921, 'Technical & Medical'],
  ],
  BE: [
    ['KU Leuven', 'Leuven', 'kuleuven.be', 1425, 'Public Research'],
    ['Ghent University (UGent)', 'Ghent', 'ugent.be', 1817, 'Public Research'],
    ['Université libre de Bruxelles (ULB)', 'Brussels', 'ulb.be', 1834, 'Public Research'],
  ],
  BZ: [
    ['University of Belize', 'Belmopan', 'ub.edu.bz', 2000, 'Public National'],
  ],
  BJ: [
    ['University of Abomey-Calavi (UAC)', 'Cotonou', 'uac.bj', 1970, 'Public National'],
  ],
  BT: [
    ['Royal University of Bhutan', 'Thimphu', 'rub.edu.bt', 2003, 'Public National'],
  ],
  BO: [
    ['Higher University of San Andrés (UMSA)', 'La Paz', 'umsa.bo', 1830, 'Public National'],
  ],
  BA: [
    ['University of Sarajevo', 'Sarajevo', 'unsa.ba', 1949, 'Public National'],
    ['International Burch University', 'Sarajevo', 'ibu.edu.ba', 2008, 'Private'],
  ],
  BW: [
    ['University of Botswana', 'Gaborone', 'ub.bw', 1982, 'Public National'],
  ],
  BR: [
    ['University of São Paulo (USP)', 'São Paulo', 'usp.br', 1934, 'Public Research'],
    ['State University of Campinas (Unicamp)', 'Campinas', 'unicamp.br', 1966, 'Public Research'],
    ['Federal University of Rio de Janeiro (UFRJ)', 'Rio de Janeiro', 'ufrj.br', 1920, 'Public National'],
  ],
  BN: [
    ['Universiti Brunei Darussalam (UBD)', 'Bandar Seri Begawan', 'ubd.edu.bn', 1985, 'Public National'],
    ['Universiti Teknologi Brunei (UTB)', 'Bandar Seri Begawan', 'utb.edu.bn', 1986, 'Technical & Medical'],
  ],
  BG: [
    ['Sofia University St. Kliment Ohridski', 'Sofia', 'uni-sofia.bg', 1888, 'Public National'],
    ['Medical University of Sofia', 'Sofia', 'mu-sofia.bg', 1917, 'Technical & Medical'],
    ['American University in Bulgaria (AUBG)', 'Blagoevgrad', 'aubg.edu', 1991, 'Private'],
  ],
  BF: [
    ['Joseph Ki-Zerbo University', 'Ouagadougou', 'ujkz.bf', 1974, 'Public National'],
  ],
  BI: [
    ['University of Burundi', 'Bujumbura', 'ub.edu.bi', 1964, 'Public National'],
  ],
  CV: [
    ['University of Cape Verde (Uni-CV)', 'Praia', 'unicv.edu.cv', 2006, 'Public National'],
  ],
  KH: [
    ['Royal University of Phnom Penh (RUPP)', 'Phnom Penh', 'rupp.edu.kh', 1960, 'Public National'],
    ['Institute of Technology of Cambodia (ITC)', 'Phnom Penh', 'itc.edu.kh', 1964, 'Technical & Medical'],
  ],
  CM: [
    ['University of Yaoundé I', 'Yaoundé', 'uy1.uninet.cm', 1962, 'Public National'],
    ['University of Buea', 'Buea', 'ubuea.cm', 1993, 'Public Research'],
  ],
  CA: [
    ['University of Toronto', 'Toronto', 'utoronto.ca', 1827, 'Public Research'],
    ['University of British Columbia (UBC)', 'Vancouver', 'ubc.ca', 1908, 'Public Research'],
    ['McGill University', 'Montreal', 'mcgill.ca', 1821, 'Public Research'],
    ['University of Waterloo', 'Waterloo', 'uwaterloo.ca', 1957, 'Public Research'],
    ['University of Alberta', 'Edmonton', 'ualberta.ca', 1908, 'Public Research'],
    ['Memorial University of Newfoundland', 'St. John’s', 'mun.ca', 1925, 'Public National'],
  ],
  CF: [
    ['University of Bangui', 'Bangui', 'univ-bangui.org', 1969, 'Public National'],
  ],
  TD: [
    ['University of N’Djamena', 'N’Djamena', 'universite-ndjamena.td', 1971, 'Public National'],
  ],
  CL: [
    ['University of Chile (Universidad de Chile)', 'Santiago', 'uchile.cl', 1842, 'Public National'],
    ['Pontifical Catholic University of Chile (UC)', 'Santiago', 'uc.cl', 1888, 'Private'],
  ],
  CN: [
    ['Tsinghua University', 'Beijing', 'tsinghua.edu.cn', 1911, 'Public National'],
    ['Peking University', 'Beijing', 'pku.edu.cn', 1898, 'Public National'],
    ['Zhejiang University', 'Hangzhou', 'zju.edu.cn', 1897, 'Public Research'],
    ['Fudan University', 'Shanghai', 'fudan.edu.cn', 1905, 'Public Research'],
    ['Shanghai Jiao Tong University (SJTU)', 'Shanghai', 'sjtu.edu.cn', 1896, 'Public Research'],
  ],
  CO: [
    ['National University of Colombia (UNAL)', 'Bogotá', 'unal.edu.co', 1867, 'Public National'],
    ['Universidad de los Andes (Uniandes)', 'Bogotá', 'uniandes.edu.co', 1948, 'Private'],
  ],
  KM: [
    ['University of the Comoros', 'Moroni', 'univ-comores.km', 2003, 'Public National'],
  ],
  CG: [
    ['Marien Ngouabi University', 'Brazzaville', 'umng.cg', 1971, 'Public National'],
  ],
  CD: [
    ['University of Kinshasa (UNIKIN)', 'Kinshasa', 'unikin.ac.cd', 1954, 'Public National'],
  ],
  CR: [
    ['University of Costa Rica (UCR)', 'San José', 'ucr.ac.cr', 1940, 'Public National'],
  ],
  CI: [
    ['Félix Houphouët-Boigny University', 'Abidjan', 'univ-fhb.edu.ci', 1964, 'Public National'],
  ],
  HR: [
    ['University of Zagreb', 'Zagreb', 'unizg.hr', 1669, 'Public National'],
    ['University of Split', 'Split', 'unist.hr', 1974, 'Public Research'],
  ],
  CU: [
    ['University of Havana (Universidad de La Habana)', 'Havana', 'uh.cu', 1728, 'Public National'],
    ['Latin American School of Medicine (ELAM)', 'Havana', 'sld.cu', 1999, 'Technical & Medical'],
  ],
  CY: [
    ['University of Cyprus', 'Nicosia', 'ucy.ac.cy', 1989, 'Public National'],
    ['University of Nicosia', 'Nicosia', 'unic.ac.cy', 1980, 'Private'],
    ['Eastern Mediterranean University', 'Famagusta', 'emu.edu.tr', 1979, 'Public Research'],
  ],
  CZ: [
    ['Charles University (Univerzita Karlova)', 'Prague', 'cuni.cz', 1348, 'Public National'],
    ['Czech Technical University in Prague (CTU)', 'Prague', 'cvut.cz', 1707, 'Technical & Medical'],
    ['Masaryk University', 'Brno', 'muni.cz', 1919, 'Public Research'],
  ],
  DK: [
    ['University of Copenhagen', 'Copenhagen', 'ku.dk', 1479, 'Public National'],
    ['Technical University of Denmark (DTU)', 'Lyngby', 'dtu.dk', 1829, 'Technical & Medical'],
    ['Aarhus University', 'Aarhus', 'au.dk', 1928, 'Public Research'],
  ],
  DJ: [
    ['University of Djibouti', 'Djibouti City', 'univ.edu.dj', 2006, 'Public National'],
  ],
  DM: [
    ['Dominica State College', 'Roseau', 'dsc.dm', 2002, 'Public National'],
  ],
  DO: [
    ['Autonomous University of Santo Domingo (UASD)', 'Santo Domingo', 'uasd.edu.do', 1538, 'Public National'],
  ],
  EC: [
    ['Central University of Ecuador (UCE)', 'Quito', 'uce.edu.ec', 1620, 'Public National'],
    ['Universidad San Francisco de Quito (USFQ)', 'Quito', 'usfq.edu.ec', 1988, 'Private'],
  ],
  EG: [
    ['Cairo University', 'Giza / Cairo', 'cu.edu.eg', 1908, 'Public National'],
    ['Ain Shams University', 'Cairo', 'asu.edu.eg', 1950, 'Public Research'],
    ['Al-Azhar University', 'Cairo', 'azhar.edu.eg', 970, 'Public National'],
    ['American University in Cairo (AUC)', 'New Cairo', 'aucegypt.edu', 1919, 'Private'],
  ],
  SV: [
    ['University of El Salvador (UES)', 'San Salvador', 'ues.edu.sv', 1841, 'Public National'],
  ],
  GQ: [
    ['National University of Equatorial Guinea (UNGE)', 'Malabo', 'unge.education', 1995, 'Public National'],
  ],
  ER: [
    ['Mai-Nefhi College of Engineering and Technology', 'Asmara', 'nbhea.org', 2004, 'Public National'],
  ],
  EE: [
    ['University of Tartu', 'Tartu', 'ut.ee', 1632, 'Public National'],
    ['Tallinn University of Technology (TalTech)', 'Tallinn', 'taltech.ee', 1918, 'Technical & Medical'],
  ],
  SZ: [
    ['University of Eswatini (UNESWA)', 'Kwaluseni', 'uneswa.ac.sz', 1982, 'Public National'],
  ],
  ET: [
    ['Addis Ababa University', 'Addis Ababa', 'aau.edu.et', 1950, 'Public National'],
    ['Jimma University', 'Jimma', 'ju.edu.et', 1999, 'Public Research'],
  ],
  FJ: [
    ['University of the South Pacific (USP)', 'Suva', 'usp.ac.fj', 1968, 'Public National'],
    ['Fiji National University (FNU)', 'Suva', 'fnu.ac.fj', 2010, 'Technical & Medical'],
  ],
  FI: [
    ['University of Helsinki', 'Helsinki', 'helsinki.fi', 1640, 'Public National'],
    ['Aalto University', 'Espoo / Helsinki', 'aalto.fi', 2010, 'Technical & Medical'],
    ['University of Oulu', 'Oulu', 'oulu.fi', 1958, 'Public Research'],
  ],
  FR: [
    ['Sorbonne University', 'Paris', 'sorbonne-universite.fr', 1257, 'Public National'],
    ['Université PSL (Paris Sciences & Lettres)', 'Paris', 'psl.eu', 2010, 'Public Research'],
    ['Institut Polytechnique de Paris', 'Palaiseau / Paris', 'ip-paris.fr', 2019, 'Technical & Medical'],
    ['Sciences Po', 'Paris', 'sciencespo.fr', 1872, 'Public Research'],
  ],
  GA: [
    ['Omar Bongo University', 'Libreville', 'uob.ga', 1970, 'Public National'],
  ],
  GM: [
    ['University of The Gambia (UTG)', 'Banjul / Brikama', 'utg.edu.gm', 1999, 'Public National'],
  ],
  GE: [
    ['Ivane Javakhishvili Tbilisi State University (TSU)', 'Tbilisi', 'tsu.ge', 1918, 'Public National'],
    ['Tbilisi State Medical University (TSMU)', 'Tbilisi', 'tsmu.edu', 1918, 'Technical & Medical'],
    ['Ilia State University', 'Tbilisi', 'iliauni.edu.ge', 2006, 'Public Research'],
  ],
  DE: [
    ['Technical University of Munich (TUM)', 'Munich', 'tum.de', 1868, 'Technical & Medical'],
    ['Ludwig Maximilian University of Munich (LMU)', 'Munich', 'lmu.de', 1472, 'Public Research'],
    ['Heidelberg University', 'Heidelberg', 'uni-heidelberg.de', 1386, 'Public Research'],
    ['RWTH Aachen University', 'Aachen', 'rwth-aachen.de', 1870, 'Technical & Medical'],
    ['Humboldt University of Berlin', 'Berlin', 'hu-berlin.de', 1810, 'Public National'],
    ['Free University of Berlin (FU Berlin)', 'Berlin', 'fu-berlin.de', 1948, 'Public Research'],
  ],
  GH: [
    ['University of Ghana', 'Accra (Legon)', 'ug.edu.gh', 1948, 'Public National'],
    ['Kwame Nkrumah University of Science and Technology (KNUST)', 'Kumasi', 'knust.edu.gh', 1952, 'Technical & Medical'],
  ],
  GR: [
    ['National and Kapodistrian University of Athens', 'Athens', 'uoa.gr', 1837, 'Public National'],
    ['Aristotle University of Thessaloniki', 'Thessaloniki', 'auth.gr', 1925, 'Public Research'],
  ],
  GD: [
    ['St. George’s University (SGU)', 'St. George’s', 'sgu.edu', 1976, 'Technical & Medical'],
  ],
  GT: [
    ['University of San Carlos of Guatemala (USAC)', 'Guatemala City', 'usac.edu.gt', 1676, 'Public National'],
  ],
  GN: [
    ['Gamal Abdel Nasser University of Conakry', 'Conakry', 'uganc.edu.gn', 1962, 'Public National'],
  ],
  GW: [
    ['Amílcar Cabral University', 'Bissau', 'uac.gw', 2003, 'Public National'],
  ],
  GY: [
    ['University of Guyana', 'Georgetown', 'uog.edu.gy', 1963, 'Public National'],
  ],
  HT: [
    ['State University of Haiti (UEH)', 'Port-au-Prince', 'ueh.edu.ht', 1960, 'Public National'],
  ],
  HN: [
    ['National Autonomous University of Honduras (UNAH)', 'Tegucigalpa', 'unah.edu.hn', 1847, 'Public National'],
  ],
  HU: [
    ['Eötvös Loránd University (ELTE)', 'Budapest', 'elte.hu', 1635, 'Public National'],
    ['University of Debrecen', 'Debrecen', 'edu.unideb.hu', 1538, 'Public Research'],
    ['Semmelweis University (Medical & Health)', 'Budapest', 'semmelweis.hu', 1769, 'Technical & Medical'],
    ['Budapest University of Technology and Economics (BME)', 'Budapest', 'bme.hu', 1782, 'Technical & Medical'],
  ],
  IS: [
    ['University of Iceland (Háskóli Íslands)', 'Reykjavík', 'hi.is', 1911, 'Public National'],
    ['Reykjavik University', 'Reykjavík', 'ru.is', 1998, 'Private'],
  ],
  IN: [
    ['Indian Institute of Technology Bombay (IIT Bombay)', 'Mumbai', 'iitb.ac.in', 1958, 'Technical & Medical'],
    ['Indian Institute of Science (IISc)', 'Bengaluru', 'iisc.ac.in', 1909, 'Public Research'],
    ['University of Delhi (DU)', 'New Delhi', 'du.ac.in', 1922, 'Public National'],
    ['All India Institute of Medical Sciences (AIIMS)', 'New Delhi', 'aiims.edu', 1956, 'Technical & Medical'],
  ],
  ID: [
    ['Universitas Indonesia (UI)', 'Depok / Jakarta', 'ui.ac.id', 1849, 'Public National'],
    ['Gadjah Mada University (UGM)', 'Yogyakarta', 'ugm.ac.id', 1949, 'Public Research'],
    ['Bandung Institute of Technology (ITB)', 'Bandung', 'itb.ac.id', 1920, 'Technical & Medical'],
  ],
  IR: [
    ['University of Tehran', 'Tehran', 'ut.ac.ir', 1934, 'Public National'],
    ['Sharif University of Technology', 'Tehran', 'sharif.ir', 1966, 'Technical & Medical'],
    ['Tehran University of Medical Sciences (TUMS)', 'Tehran', 'tums.ac.ir', 1934, 'Technical & Medical'],
  ],
  IQ: [
    ['University of Baghdad', 'Baghdad', 'uobaghdad.edu.iq', 1957, 'Public National'],
    ['American University of Iraq, Sulaimani (AUIS)', 'Sulaymaniyah', 'auis.edu.krd', 2007, 'Private'],
  ],
  IE: [
    ['Trinity College Dublin (TCD)', 'Dublin', 'tcd.ie', 1592, 'Public National'],
    ['University College Dublin (UCD)', 'Dublin', 'ucd.ie', 1854, 'Public Research'],
    ['University of Galway', 'Galway', 'universityofgalway.ie', 1845, 'Public Research'],
    ['University College Cork (UCC)', 'Cork', 'ucc.ie', 1845, 'Public Research'],
  ],
  IL: [
    ['Hebrew University of Jerusalem', 'Jerusalem', 'huji.ac.il', 1918, 'Public National'],
    ['Tel Aviv University', 'Tel Aviv', 'tau.ac.il', 1956, 'Public Research'],
    ['Technion – Israel Institute of Technology', 'Haifa', 'technion.ac.il', 1912, 'Technical & Medical'],
  ],
  IT: [
    ['University of Bologna (Alma Mater Studiorum)', 'Bologna', 'unibo.it', 1088, 'Public National'],
    ['Sapienza University of Rome', 'Rome', 'uniroma1.it', 1303, 'Public National'],
    ['Politecnico di Milano', 'Milan', 'polimi.it', 1863, 'Technical & Medical'],
    ['University of Padua (Università di Padova)', 'Padua', 'unipd.it', 1222, 'Public Research'],
    ['University of Milan (Statale)', 'Milan', 'unimi.it', 1924, 'Public Research'],
  ],
  JM: [
    ['University of the West Indies Mona Campus', 'Kingston', 'mona.uwi.edu', 1948, 'Public National'],
    ['University of Technology, Jamaica', 'Kingston', 'utech.edu.jm', 1958, 'Technical & Medical'],
  ],
  JP: [
    ['University of Tokyo (UTokyo)', 'Tokyo', 'u-tokyo.ac.jp', 1877, 'Public National'],
    ['Kyoto University', 'Kyoto', 'kyoto-u.ac.jp', 1897, 'Public National'],
    ['Osaka University', 'Osaka', 'osaka-u.ac.jp', 1931, 'Public Research'],
    ['Tohoku University', 'Sendai', 'tohoku.ac.jp', 1907, 'Public Research'],
    ['Waseda University', 'Tokyo', 'waseda.jp', 1882, 'Private'],
  ],
  JO: [
    ['University of Jordan', 'Amman', 'ju.edu.jo', 1962, 'Public National'],
    ['Jordan University of Science and Technology (JUST)', 'Irbid', 'just.edu.jo', 1986, 'Technical & Medical'],
  ],
  KZ: [
    ['Al-Farabi Kazakh National University (KazNU)', 'Almaty', 'kaznu.kz', 1934, 'Public National'],
    ['Nazarbayev University', 'Astana', 'nu.edu.kz', 2010, 'Public Research'],
    ['Asfendiyarov Kazakh National Medical University', 'Almaty', 'kaznmu.edu.kz', 1930, 'Technical & Medical'],
  ],
  KE: [
    ['University of Nairobi', 'Nairobi', 'uonbi.ac.ke', 1970, 'Public National'],
    ['Kenyatta University', 'Nairobi', 'ku.ac.ke', 1985, 'Public Research'],
    ['Strathmore University', 'Nairobi', 'strathmore.edu', 1961, 'Private'],
  ],
  KI: [
    ['University of the South Pacific Kiribati Campus', 'Tarawa', 'usp.ac.fj', 1976, 'Public National'],
  ],
  KP: [
    ['Kim Il Sung University', 'Pyongyang', 'ryongnamsan.edu.kp', 1946, 'Public National'],
  ],
  KR: [
    ['Seoul National University (SNU)', 'Seoul', 'snu.ac.kr', 1946, 'Public National'],
    ['KAIST (Korea Advanced Institute of Science & Tech)', 'Daejeon', 'kaist.ac.kr', 1971, 'Technical & Medical'],
    ['Yonsei University', 'Seoul', 'yonsei.ac.kr', 1885, 'Private'],
    ['Korea University', 'Seoul', 'korea.edu', 1905, 'Private'],
    ['Sungkyunkwan University (SKKU)', 'Seoul / Suwon', 'skku.edu', 1398, 'Private'],
  ],
  KW: [
    ['Kuwait University', 'Kuwait City', 'ku.edu.kw', 1966, 'Public National'],
    ['American University of Kuwait (AUK)', 'Salmiya', 'auk.edu.kw', 2004, 'Private'],
  ],
  KG: [
    ['Kyrgyz National University (KNU)', 'Bishkek', 'knu.kg', 1925, 'Public National'],
    ['Kyrgyz State Medical Academy (KSMA)', 'Bishkek', 'kgma.kg', 1939, 'Technical & Medical'],
    ['American University of Central Asia (AUCA)', 'Bishkek', 'auca.kg', 1993, 'Private'],
  ],
  LA: [
    ['National University of Laos (NUOL)', 'Vientiane', 'nuol.edu.la', 1996, 'Public National'],
  ],
  LV: [
    ['University of Latvia', 'Riga', 'lu.lv', 1919, 'Public National'],
    ['Riga Technical University (RTU)', 'Riga', 'rtu.lv', 1862, 'Technical & Medical'],
    ['Riga Stradiņš University (Medical)', 'Riga', 'rsu.lv', 1950, 'Technical & Medical'],
  ],
  LB: [
    ['American University of Beirut (AUB)', 'Beirut', 'aub.edu.lb', 1866, 'Private'],
    ['Lebanese University', 'Beirut', 'ul.edu.lb', 1951, 'Public National'],
  ],
  LS: [
    ['National University of Lesotho (NUL)', 'Roma / Maseru', 'nul.ls', 1945, 'Public National'],
  ],
  LR: [
    ['University of Liberia', 'Monrovia', 'ul.edu.lr', 1862, 'Public National'],
  ],
  LY: [
    ['University of Tripoli', 'Tripoli', 'uot.edu.ly', 1957, 'Public National'],
    ['University of Benghazi', 'Benghazi', 'uob.edu.ly', 1955, 'Public Research'],
  ],
  LI: [
    ['University of Liechtenstein', 'Vaduz', 'uni.li', 1961, 'Public National'],
  ],
  LT: [
    ['Vilnius University', 'Vilnius', 'vu.lt', 1579, 'Public National'],
    ['Kaunas University of Technology (KTU)', 'Kaunas', 'ktu.edu', 1922, 'Technical & Medical'],
  ],
  LU: [
    ['University of Luxembourg', 'Esch-sur-Alzette / Luxembourg', 'uni.lu', 2003, 'Public National'],
  ],
  MG: [
    ['University of Antananarivo', 'Antananarivo', 'univ-antananarivo.mg', 1961, 'Public National'],
  ],
  MW: [
    ['University of Malawi (UNIMA)', 'Zomba', 'unima.ac.mw', 1964, 'Public National'],
  ],
  MY: [
    ['Universiti Malaya (UM)', 'Kuala Lumpur', 'um.edu.my', 1905, 'Public National'],
    ['Universiti Putra Malaysia (UPM)', 'Serdang', 'upm.edu.my', 1931, 'Public Research'],
    ['Universiti Kebangsaan Malaysia (UKM)', 'Bangi', 'ukm.my', 1970, 'Public Research'],
    ['Universiti Sains Malaysia (USM)', 'Penang', 'usm.my', 1969, 'Public Research'],
    ['Taylor’s University', 'Subang Jaya', 'taylors.edu.my', 1969, 'Private'],
    ['Asia Pacific University of Technology & Innovation (APU)', 'Kuala Lumpur', 'apu.edu.my', 1993, 'Private'],
  ],
  MV: [
    ['Maldives National University (MNU)', 'Malé', 'mnu.edu.mv', 1973, 'Public National'],
  ],
  ML: [
    ['University of Bamako (USTTB)', 'Bamako', 'usttb.edu.ml', 1996, 'Public National'],
  ],
  MT: [
    ['University of Malta', 'Msida', 'um.edu.mt', 1592, 'Public National'],
  ],
  MH: [
    ['College of the Marshall Islands', 'Majuro', 'cmi.edu', 1993, 'Public National'],
  ],
  MR: [
    ['University of Nouakchott Al Aasriya', 'Nouakchott', 'una.mr', 1981, 'Public National'],
  ],
  MU: [
    ['University of Mauritius', 'Réduit', 'uom.ac.mu', 1965, 'Public National'],
  ],
  MX: [
    ['National Autonomous University of Mexico (UNAM)', 'Mexico City', 'unam.mx', 1551, 'Public National'],
    ['Tecnológico de Monterrey (ITESM)', 'Monterrey', 'tec.mx', 1943, 'Private'],
  ],
  FM: [
    ['College of Micronesia-FSM', 'Palikir', 'comfsm.fm', 1993, 'Public National'],
  ],
  MD: [
    ['Moldova State University (USM)', 'Chișinău', 'usm.md', 1946, 'Public National'],
    ['Nicolae Testemițanu State University of Medicine and Pharmacy', 'Chișinău', 'usmf.md', 1945, 'Technical & Medical'],
  ],
  MC: [
    ['International University of Monaco (IUM)', 'Monte Carlo', 'monaco.edu', 1986, 'Private'],
  ],
  MN: [
    ['National University of Mongolia (NUM)', 'Ulaanbaatar', 'num.edu.mn', 1942, 'Public National'],
  ],
  ME: [
    ['University of Montenegro', 'Podgorica', 'ucg.ac.me', 1974, 'Public National'],
  ],
  MA: [
    ['Mohammed V University in Rabat', 'Rabat', 'um5.ac.ma', 1957, 'Public National'],
    ['Cadi Ayyad University', 'Marrakesh', 'uca.ma', 1978, 'Public Research'],
    ['Al Akhawayn University', 'Ifrane', 'aui.ma', 1995, 'Private'],
  ],
  MZ: [
    ['Eduardo Mondlane University', 'Maputo', 'uem.mz', 1962, 'Public National'],
  ],
  MM: [
    ['University of Yangon', 'Yangon', 'uy.edu.mm', 1878, 'Public National'],
  ],
  NA: [
    ['University of Namibia (UNAM)', 'Windhoek', 'unam.edu.na', 1992, 'Public National'],
  ],
  NR: [
    ['University of the South Pacific Nauru Campus', 'Yaren', 'usp.ac.fj', 1987, 'Public National'],
  ],
  NP: [
    ['Tribhuvan University', 'Kathmandu', 'tu.edu.np', 1959, 'Public National'],
    ['Kathmandu University', 'Dhulikhel', 'ku.edu.np', 1991, 'Public Research'],
  ],
  NL: [
    ['University of Amsterdam (UvA)', 'Amsterdam', 'uva.nl', 1632, 'Public Research'],
    ['Delft University of Technology (TU Delft)', 'Delft', 'tudelft.nl', 1842, 'Technical & Medical'],
    ['Utrecht University', 'Utrecht', 'uu.nl', 1636, 'Public Research'],
    ['Leiden University', 'Leiden', 'universiteitleiden.nl', 1575, 'Public Research'],
  ],
  NZ: [
    ['University of Auckland', 'Auckland', 'auckland.ac.nz', 1883, 'Public National'],
    ['University of Otago', 'Dunedin', 'otago.ac.nz', 1869, 'Public Research'],
    ['Victoria University of Wellington', 'Wellington', 'wgtn.ac.nz', 1899, 'Public Research'],
    ['University of Canterbury', 'Christchurch', 'canterbury.ac.nz', 1873, 'Public Research'],
  ],
  NI: [
    ['National Autonomous University of Nicaragua (UNAN)', 'Managua / León', 'unan.edu.ni', 1812, 'Public National'],
  ],
  NE: [
    ['Abdou Moumouni University', 'Niamey', 'uam.edu.ne', 1971, 'Public National'],
  ],
  NG: [
    ['University of Ibadan', 'Ibadan', 'ui.edu.ng', 1948, 'Public National'],
    ['University of Lagos (UNILAG)', 'Lagos', 'unilag.edu.ng', 1962, 'Public Research'],
    ['Covenant University', 'Ota', 'covenantuniversity.edu.ng', 2002, 'Private'],
  ],
  MK: [
    ['Ss. Cyril and Methodius University in Skopje', 'Skopje', 'ukim.edu.mk', 1949, 'Public National'],
  ],
  NO: [
    ['University of Oslo (UiO)', 'Oslo', 'uio.no', 1811, 'Public National'],
    ['Norwegian University of Science and Technology (NTNU)', 'Trondheim', 'ntnu.edu', 1910, 'Technical & Medical'],
    ['University of Bergen (UiB)', 'Bergen', 'uib.no', 1946, 'Public Research'],
  ],
  OM: [
    ['Sultan Qaboos University (SQU)', 'Muscat', 'squ.edu.om', 1986, 'Public National'],
    ['German University of Technology in Oman (GUtech)', 'Muscat', 'gutech.edu.om', 2007, 'Private'],
  ],
  PK: [
    ['National University of Sciences & Technology (NUST)', 'Islamabad', 'nust.edu.pk', 1991, 'Technical & Medical'],
    ['Quaid-i-Azam University (QAU)', 'Islamabad', 'qau.edu.pk', 1967, 'Public National'],
    ['Lahore University of Management Sciences (LUMS)', 'Lahore', 'lums.edu.pk', 1984, 'Private'],
    ['Aga Khan University (AKU)', 'Karachi', 'aku.edu', 1983, 'Technical & Medical'],
    ['University of the Punjab (PU)', 'Lahore', 'pu.edu.pk', 1882, 'Public National'],
    ['COMSATS University Islamabad (CUI)', 'Islamabad', 'comsats.edu.pk', 1998, 'Public Research'],
  ],
  PW: [
    ['Palau Community College', 'Koror', 'palau.edu', 1969, 'Public National'],
  ],
  PA: [
    ['University of Panama (Universidad de Panamá)', 'Panama City', 'up.ac.pa', 1935, 'Public National'],
  ],
  PG: [
    ['University of Papua New Guinea (UPNG)', 'Port Moresby', 'upng.ac.pg', 1965, 'Public National'],
  ],
  PY: [
    ['National University of Asunción (UNA)', 'San Lorenzo / Asunción', 'una.py', 1889, 'Public National'],
  ],
  PE: [
    ['National University of San Marcos (UNMSM)', 'Lima', 'unmsm.edu.pe', 1551, 'Public National'],
    ['Pontifical Catholic University of Peru (PUCP)', 'Lima', 'pucp.edu.pe', 1917, 'Private'],
  ],
  PH: [
    ['University of the Philippines Diliman (UP)', 'Quezon City / Manila', 'up.edu.ph', 1908, 'Public National'],
    ['Ateneo de Manila University', 'Quezon City', 'ateneo.edu', 1859, 'Private'],
    ['University of Santo Tomas (UST)', 'Manila', 'ust.edu.ph', 1611, 'Private'],
  ],
  PL: [
    ['University of Warsaw', 'Warsaw', 'uw.edu.pl', 1816, 'Public National'],
    ['Jagiellonian University', 'Kraków', 'uj.edu.pl', 1364, 'Public Research'],
    ['Warsaw University of Technology', 'Warsaw', 'pw.edu.pl', 1826, 'Technical & Medical'],
  ],
  PT: [
    ['University of Lisbon (ULisboa)', 'Lisbon', 'ulisboa.pt', 1290, 'Public National'],
    ['University of Porto', 'Porto', 'up.pt', 1911, 'Public Research'],
    ['University of Coimbra', 'Coimbra', 'uc.pt', 1290, 'Public Research'],
  ],
  QA: [
    ['Qatar University', 'Doha', 'qu.edu.qa', 1973, 'Public National'],
    ['Hamad Bin Khalifa University (HBKU)', 'Doha (Education City)', 'hbku.edu.qa', 2010, 'Public Research'],
  ],
  RO: [
    ['Babeș-Bolyai University', 'Cluj-Napoca', 'ubbcluj.ro', 1581, 'Public Research'],
    ['University of Bucharest', 'Bucharest', 'unibuc.ro', 1864, 'Public National'],
    ['Carol Davila University of Medicine and Pharmacy', 'Bucharest', 'umfcd.ro', 1857, 'Technical & Medical'],
  ],
  RU: [
    ['Lomonosov Moscow State University (MSU)', 'Moscow', 'msu.ru', 1755, 'Public National'],
    ['Saint Petersburg State University', 'Saint Petersburg', 'spbu.ru', 1724, 'Public Research'],
    ['HSE University (Higher School of Economics)', 'Moscow', 'hse.ru', 1992, 'Public Research'],
    ['Sechenov First Moscow State Medical University', 'Moscow', 'sechenov.ru', 1758, 'Technical & Medical'],
    ['Kazan Federal University', 'Kazan', 'kpfu.ru', 1804, 'Public Research'],
  ],
  RW: [
    ['University of Rwanda', 'Kigali', 'ur.ac.rw', 2013, 'Public National'],
    ['Carnegie Mellon University Africa (CMU-Africa)', 'Kigali', 'africa.engineering.cmu.edu', 2011, 'Private'],
  ],
  KN: [
    ['Ross University School of Veterinary Medicine', 'Basseterre', 'veterinary.rossu.edu', 1982, 'Technical & Medical'],
  ],
  LC: [
    ['Sir Arthur Lewis Community College', 'Castries', 'salcc.edu.lc', 1985, 'Public National'],
  ],
  VC: [
    ['Saint Vincent and the Grenadines Community College', 'Kingstown', 'svgcc.vc', 1996, 'Public National'],
  ],
  WS: [
    ['National University of Samoa', 'Apia', 'nus.edu.ws', 1984, 'Public National'],
  ],
  SM: [
    ['University of the Republic of San Marino', 'City of San Marino', 'unirsm.sm', 1985, 'Public National'],
  ],
  ST: [
    ['University of São Tomé and Príncipe (USTP)', 'São Tomé', 'ustp.st', 2014, 'Public National'],
  ],
  SA: [
    ['King Saud University (KSU)', 'Riyadh', 'ksu.edu.sa', 1957, 'Public National'],
    ['King Abdulaziz University (KAU)', 'Jeddah', 'kau.edu.sa', 1967, 'Public Research'],
    ['King Fahd University of Petroleum & Minerals (KFUPM)', 'Dhahran', 'kfupm.edu.sa', 1963, 'Technical & Medical'],
    ['King Abdullah University of Science & Technology (KAUST)', 'Thuwal', 'kaust.edu.sa', 2009, 'Public Research'],
    ['Islamic University of Madinah', 'Madinah', 'iu.edu.sa', 1961, 'Public National'],
  ],
  SN: [
    ['Cheikh Anta Diop University (UCAD)', 'Dakar', 'ucad.sn', 1957, 'Public National'],
  ],
  RS: [
    ['University of Belgrade', 'Belgrade', 'bg.ac.rs', 1808, 'Public National'],
    ['University of Novi Sad', 'Novi Sad', 'uns.ac.rs', 1960, 'Public Research'],
  ],
  SC: [
    ['University of Seychelles (UniSey)', 'Anse Royale', 'unisey.ac.sc', 2009, 'Public National'],
  ],
  SL: [
    ['Fourah Bay College (University of Sierra Leone)', 'Freetown', 'usl.edu.sl', 1827, 'Public National'],
  ],
  SG: [
    ['National University of Singapore (NUS)', 'Singapore', 'nus.edu.sg', 1905, 'Public National'],
    ['Nanyang Technological University (NTU)', 'Singapore', 'ntu.edu.sg', 1981, 'Technical & Medical'],
    ['Singapore Management University (SMU)', 'Singapore', 'smu.edu.sg', 2000, 'Public Research'],
  ],
  SK: [
    ['Comenius University in Bratislava', 'Bratislava', 'uniba.sk', 1919, 'Public National'],
    ['Slovak University of Technology in Bratislava', 'Bratislava', 'stuba.sk', 1937, 'Technical & Medical'],
  ],
  SI: [
    ['University of Ljubljana', 'Ljubljana', 'uni-lj.si', 1919, 'Public National'],
    ['University of Maribor', 'Maribor', 'um.si', 1975, 'Public Research'],
  ],
  SB: [
    ['Solomon Islands National University (SINU)', 'Honiara', 'sinu.edu.sb', 2013, 'Public National'],
  ],
  SO: [
    ['Somali National University', 'Mogadishu', 'snu.edu.so', 1954, 'Public National'],
    ['SIMAD University', 'Mogadishu', 'simad.edu.so', 1999, 'Private'],
  ],
  ZA: [
    ['University of Cape Town (UCT)', 'Cape Town', 'uct.ac.za', 1829, 'Public Research'],
    ['University of the Witwatersrand (Wits)', 'Johannesburg', 'wits.ac.za', 1922, 'Public Research'],
    ['Stellenbosch University', 'Stellenbosch', 'sun.ac.za', 1918, 'Public Research'],
    ['University of Pretoria', 'Pretoria', 'up.ac.za', 1908, 'Public National'],
  ],
  SS: [
    ['University of Juba', 'Juba', 'uoj.edu.ss', 1975, 'Public National'],
  ],
  ES: [
    ['University of Barcelona (UB)', 'Barcelona', 'ub.edu', 1450, 'Public National'],
    ['Autonomous University of Madrid (UAM)', 'Madrid', 'uam.es', 1968, 'Public Research'],
    ['Complutense University of Madrid (UCM)', 'Madrid', 'ucm.es', 1293, 'Public National'],
    ['IE University', 'Madrid / Segovia', 'ie.edu', 1973, 'Private'],
  ],
  LK: [
    ['University of Colombo', 'Colombo', 'cmb.ac.lk', 1921, 'Public National'],
    ['University of Peradeniya', 'Peradeniya', 'pdn.ac.lk', 1942, 'Public Research'],
  ],
  SD: [
    ['University of Khartoum', 'Khartoum', 'uofk.edu', 1902, 'Public National'],
  ],
  SR: [
    ['Anton de Kom University of Suriname', 'Paramaribo', 'uvs.edu', 1968, 'Public National'],
  ],
  SE: [
    ['KTH Royal Institute of Technology', 'Stockholm', 'kth.se', 1827, 'Technical & Medical'],
    ['Lund University', 'Lund', 'lu.se', 1666, 'Public Research'],
    ['Uppsala University', 'Uppsala', 'uu.se', 1477, 'Public Research'],
    ['Karolinska Institutet', 'Stockholm', 'ki.se', 1810, 'Technical & Medical'],
  ],
  CH: [
    ['ETH Zurich (Swiss Federal Institute of Technology)', 'Zurich', 'ethz.ch', 1855, 'Technical & Medical'],
    ['EPFL (École Polytechnique Fédérale de Lausanne)', 'Lausanne', 'epfl.ch', 1853, 'Technical & Medical'],
    ['University of Zurich (UZH)', 'Zurich', 'uzh.ch', 1833, 'Public Research'],
    ['University of Geneva', 'Geneva', 'unige.ch', 1559, 'Public Research'],
  ],
  SY: [
    ['Damascus University', 'Damascus', 'damascusuniversity.edu.sy', 1923, 'Public National'],
  ],
  TJ: [
    ['Tajik National University', 'Dushanbe', 'tnu.tj', 1947, 'Public National'],
    ['Avicenna Tajik State Medical University', 'Dushanbe', 'tajmedun.tj', 1939, 'Technical & Medical'],
  ],
  TZ: [
    ['University of Dar es Salaam (UDSM)', 'Dar es Salaam', 'udsm.ac.tz', 1961, 'Public National'],
  ],
  TH: [
    ['Chulalongkorn University', 'Bangkok', 'chula.ac.th', 1917, 'Public National'],
    ['Mahidol University', 'Bangkok / Nakhon Pathom', 'mahidol.ac.th', 1888, 'Public Research'],
    ['Chiang Mai University', 'Chiang Mai', 'cmu.ac.th', 1964, 'Public Research'],
  ],
  TL: [
    ['National University of East Timor (UNTL)', 'Dili', 'untl.edu.tl', 2000, 'Public National'],
  ],
  TG: [
    ['University of Lomé', 'Lomé', 'univ-lome.tg', 1970, 'Public National'],
  ],
  TO: [
    ['Tonga National University', 'Nukuʻalofa', 'tnu.to', 2023, 'Public National'],
  ],
  TT: [
    ['University of the West Indies St. Augustine Campus', 'St. Augustine', 'sta.uwi.edu', 1960, 'Public National'],
  ],
  TN: [
    ['University of Tunis El Manar', 'Tunis', 'utm.rnu.tn', 1987, 'Public National'],
    ['University of Carthage', 'Tunis', 'ucar.rnu.tn', 1988, 'Public Research'],
  ],
  TR: [
    ['Middle East Technical University (METU / ODTÜ)', 'Ankara', 'metu.edu.tr', 1956, 'Technical & Medical'],
    ['Boğaziçi University', 'Istanbul', 'boun.edu.tr', 1863, 'Public Research'],
    ['Istanbul Technical University (İTÜ)', 'Istanbul', 'itu.edu.tr', 1773, 'Technical & Medical'],
    ['Koç University', 'Istanbul', 'ku.edu.tr', 1993, 'Private'],
    ['Bilkent University', 'Ankara', 'bilkent.edu.tr', 1984, 'Private'],
    ['Istanbul University', 'Istanbul', 'istanbul.edu.tr', 1453, 'Public National'],
  ],
  TM: [
    ['Magtymguly Turkmen State University', 'Ashgabat', 'tdu.edu.tm', 1950, 'Public National'],
  ],
  TV: [
    ['University of the South Pacific Tuvalu Campus', 'Funafuti', 'usp.ac.fj', 1980, 'Public National'],
  ],
  UG: [
    ['Makerere University', 'Kampala', 'mak.ac.ug', 1922, 'Public National'],
  ],
  UA: [
    ['Taras Shevchenko National University of Kyiv', 'Kyiv', 'knu.ua', 1834, 'Public National'],
    ['Igor Sikorsky Kyiv Polytechnic Institute', 'Kyiv', 'kpi.ua', 1898, 'Technical & Medical'],
  ],
  AE: [
    ['United Arab Emirates University (UAEU)', 'Al Ain', 'uaeu.ac.ae', 1976, 'Public National'],
    ['Khalifa University of Science and Technology', 'Abu Dhabi', 'ku.ac.ae', 2007, 'Technical & Medical'],
    ['American University of Sharjah (AUS)', 'Sharjah', 'aus.edu', 1997, 'Private'],
    ['University of Birmingham Dubai', 'Dubai', 'birmingham.ac.uk/dubai', 2018, 'Private'],
    ['Heriot-Watt University Dubai', 'Dubai', 'hw.ac.uk/dubai', 2005, 'Private'],
  ],
  GB: [
    ['University of Oxford', 'Oxford', 'ox.ac.uk', 1096, 'Public Research'],
    ['University of Cambridge', 'Cambridge', 'cam.ac.uk', 1209, 'Public Research'],
    ['Imperial College London', 'London', 'imperial.ac.uk', 1907, 'Technical & Medical'],
    ['University College London (UCL)', 'London', 'ucl.ac.uk', 1826, 'Public Research'],
    ['University of Edinburgh', 'Edinburgh', 'ed.ac.uk', 1583, 'Public Research'],
    ['University of Manchester', 'Manchester', 'manchester.ac.uk', 1824, 'Public Research'],
    ['King’s College London (KCL)', 'London', 'kcl.ac.uk', 1829, 'Public Research'],
  ],
  US: [
    ['Massachusetts Institute of Technology (MIT)', 'Cambridge, MA', 'mit.edu', 1861, 'Private'],
    ['Stanford University', 'Stanford, CA', 'stanford.edu', 1885, 'Private'],
    ['Harvard University', 'Cambridge, MA', 'harvard.edu', 1636, 'Private'],
    ['University of California, Berkeley (UC Berkeley)', 'Berkeley, CA', 'berkeley.edu', 1868, 'Public Research'],
    ['University of California, Los Angeles (UCLA)', 'Los Angeles, CA', 'ucla.edu', 1919, 'Public Research'],
    ['Georgia Institute of Technology (Georgia Tech)', 'Atlanta, GA', 'gatech.edu', 1885, 'Technical & Medical'],
    ['Arizona State University (ASU)', 'Tempe, AZ', 'asu.edu', 1885, 'Public Research'],
    ['University of Texas at Austin (UT Austin)', 'Austin, TX', 'utexas.edu', 1883, 'Public Research'],
  ],
  UY: [
    ['University of the Republic (Udelar)', 'Montevideo', 'udelar.edu.uy', 1849, 'Public National'],
  ],
  UZ: [
    ['National University of Uzbekistan', 'Tashkent', 'nuu.uz', 1918, 'Public National'],
    ['Tashkent Medical Academy', 'Tashkent', 'tma.uz', 1919, 'Technical & Medical'],
    ['Westminster International University in Tashkent', 'Tashkent', 'wiut.uz', 2002, 'Private'],
  ],
  VU: [
    ['University of the South Pacific Emalus Campus', 'Port Vila', 'usp.ac.fj', 1989, 'Public National'],
  ],
  VE: [
    ['Central University of Venezuela (UCV)', 'Caracas', 'ucv.ve', 1721, 'Public National'],
  ],
  VN: [
    ['Vietnam National University, Hanoi (VNU)', 'Hanoi', 'vnu.edu.vn', 1906, 'Public National'],
    ['Hanoi University of Science and Technology (HUST)', 'Hanoi', 'hust.edu.vn', 1956, 'Technical & Medical'],
    ['RMIT University Vietnam', 'Ho Chi Minh City', 'rmit.edu.vn', 2000, 'Private'],
  ],
  YE: [
    ['Sana’a University', 'Sana’a', 'su.edu.ye', 1970, 'Public National'],
    ['University of Aden', 'Aden', 'aden-univ.net', 1970, 'Public Research'],
  ],
  ZM: [
    ['University of Zambia (UNZA)', 'Lusaka', 'unza.zm', 1965, 'Public National'],
  ],
  ZW: [
    ['University of Zimbabwe (UZ)', 'Harare', 'uz.ac.zw', 1952, 'Public National'],
  ],
};

/**
 * Country-level overrides for tuition bands, portals, visas, and work rights
 */
interface CountryStudyPolicy {
  tuitionMinUsd: number;
  tuitionMaxUsd: number;
  livingCostYearUsd: string;
  nationalPortalName: string;
  nationalPortalUrl: string;
  visaCategoryName: string;
  visaProcessingWeeks: string;
  bankStatementRequirementUsd: string;
  workHoursAllowed: string;
  postStudyStay: string;
  mainIntakes: string[];
  instructionLanguages: string[];
  moiFriendly: boolean;
}

const COUNTRY_POLICIES: Partial<Record<string, CountryStudyPolicy>> = {
  US: {
    tuitionMinUsd: 18000,
    tuitionMaxUsd: 58000,
    livingCostYearUsd: '$12,000 – $22,000 / year',
    nationalPortalName: 'Common App & EducationUSA',
    nationalPortalUrl: 'https://educationusa.state.gov/',
    visaCategoryName: 'F-1 Academic Student Visa (Form I-20 + SEVIS)',
    visaProcessingWeeks: '3–8 weeks (interview-based)',
    bankStatementRequirementUsd: '$28,000 – $55,000 (1st year I-20 total)',
    workHoursAllowed: '20 hrs/week on-campus during semester',
    postStudyStay: '12 months OPT (36 months for STEM degrees)',
    mainIntakes: ['Fall (August/September)', 'Spring (January)', 'Summer (May)'],
    instructionLanguages: ['English'],
    moiFriendly: false,
  },
  GB: {
    tuitionMinUsd: 15000,
    tuitionMaxUsd: 42000,
    livingCostYearUsd: '$12,500 – $18,500 / year (£1,023–£1,334/month)',
    nationalPortalName: 'UCAS (Undergrad) & Direct University Portal (Postgrad)',
    nationalPortalUrl: 'https://www.ucas.com/',
    visaCategoryName: 'UK Student Visa (CAS via GOV.UK)',
    visaProcessingWeeks: '3 weeks standard (5 days priority)',
    bankStatementRequirementUsd: '1 year unpaid tuition + £9,207–£12,006 living funds held for 28 days',
    workHoursAllowed: '20 hrs/week during term time, full-time in holidays',
    postStudyStay: '2 years Graduate Route Visa (3 years for PhD)',
    mainIntakes: ['September / October (Main)', 'January / February (Winter)'],
    instructionLanguages: ['English'],
    moiFriendly: true,
  },
  CA: {
    tuitionMinUsd: 14000,
    tuitionMaxUsd: 38000,
    livingCostYearUsd: '$15,000 – $20,000 USD (CAD $20,635+ IRCC rule)',
    nationalPortalName: 'EduCanada & Provincial Portals (OUAC / EducationPlannerBC)',
    nationalPortalUrl: 'https://www.educanada.ca/',
    visaCategoryName: 'Canadian Study Permit (LOA + PAL/TAL)',
    visaProcessingWeeks: '6–12 weeks',
    bankStatementRequirementUsd: '1st year tuition + CAD $20,635 living funds',
    workHoursAllowed: 'Up to 24 hrs/week off-campus during academic sessions',
    postStudyStay: 'Up to 3 years Post-Graduation Work Permit (PGWP)',
    mainIntakes: ['Fall (September)', 'Winter (January)', 'Spring/Summer (May)'],
    instructionLanguages: ['English', 'French'],
    moiFriendly: false,
  },
  AU: {
    tuitionMinUsd: 18000,
    tuitionMaxUsd: 40000,
    livingCostYearUsd: '$18,000 – $22,000 USD (AUD $29,710 Home Affairs requirement)',
    nationalPortalName: 'Study Australia & Direct University/UAC/VTAC Portals',
    nationalPortalUrl: 'https://www.studyaustralia.gov.au/',
    visaCategoryName: 'Student Visa (Subclass 500 — CoE + Genuine Student GS)',
    visaProcessingWeeks: '4–10 weeks',
    bankStatementRequirementUsd: '1 year tuition + AUD $29,710 living cost + return airfare',
    workHoursAllowed: '48 hours per fortnight during study terms, unlimited in breaks',
    postStudyStay: '2–4 years Temporary Graduate Visa (Subclass 485)',
    mainIntakes: ['Semester 1 (February/March)', 'Semester 2 (July)', 'Trimester 3 (Oct/Nov)'],
    instructionLanguages: ['English'],
    moiFriendly: false,
  },
  DE: {
    tuitionMinUsd: 0,
    tuitionMaxUsd: 3500,
    livingCostYearUsd: '$12,900 / year (€11,904 Blocked Account / Sperrkonto)',
    nationalPortalName: 'DAAD & uni-assist Portal',
    nationalPortalUrl: 'https://www.uni-assist.de/',
    visaCategoryName: 'German National Student Visa (Category D)',
    visaProcessingWeeks: '6–12 weeks',
    bankStatementRequirementUsd: '€11,904 (~$12,900 USD) in German Blocked Account (Expatrio/Fintiba)',
    workHoursAllowed: '20 hrs/week (140 full days or 280 half days/year)',
    postStudyStay: '18 months Job Seeker Residence Permit after graduation',
    mainIntakes: ['Winter Semester (October)', 'Summer Semester (April)'],
    instructionLanguages: ['English', 'German'],
    moiFriendly: true,
  },
  IT: {
    tuitionMinUsd: 500,
    tuitionMaxUsd: 4000,
    livingCostYearUsd: '$7,500 – $11,000 / year (often covered by DSU scholarship)',
    nationalPortalName: 'Universitaly Pre-Enrollment Portal',
    nationalPortalUrl: 'https://www.universitaly.it/',
    visaCategoryName: 'Italy National Study Visa (Type D via Universitaly)',
    visaProcessingWeeks: '4–10 weeks',
    bankStatementRequirementUsd: '€6,079.45 (~$6,600 USD) minimum annual financial proof',
    workHoursAllowed: '20 hrs/week (up to 1,040 hours/year)',
    postStudyStay: '12 months Permesso di Soggiorno per Attesa Occupazione',
    mainIntakes: ['September / October (Single Main Intake)'],
    instructionLanguages: ['English', 'Italian'],
    moiFriendly: true,
  },
  TR: {
    tuitionMinUsd: 600,
    tuitionMaxUsd: 8000,
    livingCostYearUsd: '$4,000 – $6,500 / year',
    nationalPortalName: 'Study in Türkiye & Türkiye Bursları',
    nationalPortalUrl: 'https://www.studyinturkiye.gov.tr/',
    visaCategoryName: 'Turkish Student Visa + İkamet (Student Residence Permit)',
    visaProcessingWeeks: '3–6 weeks',
    bankStatementRequirementUsd: '$5,000 – $7,000 USD bank statement',
    workHoursAllowed: 'Part-time allowed for Master/PhD & after 1st year undergrad',
    postStudyStay: 'Short-term residence or work permit transition',
    mainIntakes: ['Fall (September)', 'Spring (February)'],
    instructionLanguages: ['English', 'Turkish'],
    moiFriendly: true,
  },
  CN: {
    tuitionMinUsd: 2200,
    tuitionMaxUsd: 6500,
    livingCostYearUsd: '$3,000 – $5,500 / year',
    nationalPortalName: 'Campus China (CSC) & University International Portals',
    nationalPortalUrl: 'https://www.campuschina.org/',
    visaCategoryName: 'X1 Student Visa (JW201 / JW202 Form)',
    visaProcessingWeeks: '2–4 weeks',
    bankStatementRequirementUsd: '$3,500 – $6,000 USD (or CSC Scholarship award letter)',
    workHoursAllowed: 'Part-time work/internships allowed with university & PSB endorsement',
    postStudyStay: 'Entrepreneurship / Z-Work Visa pathway for top graduates',
    mainIntakes: ['September (Main)', 'March (Spring)'],
    instructionLanguages: ['English', 'Mandarin'],
    moiFriendly: true,
  },
  MY: {
    tuitionMinUsd: 2800,
    tuitionMaxUsd: 9000,
    livingCostYearUsd: '$3,800 – $5,500 / year',
    nationalPortalName: 'Education Malaysia Global Services (EMGS)',
    nationalPortalUrl: 'https://educationmalaysia.gov.my/',
    visaCategoryName: 'Electronic Visa Approval Letter (eVAL) + Student Pass',
    visaProcessingWeeks: '4–6 weeks via EMGS portal',
    bankStatementRequirementUsd: '$4,000 – $6,000 USD',
    workHoursAllowed: '20 hrs/week during semester breaks',
    postStudyStay: 'Graduate Pass (12 months for eligible nationalities) or Employment Pass',
    mainIntakes: ['February/March', 'July', 'September/October'],
    instructionLanguages: ['English'],
    moiFriendly: true,
  },
  AE: {
    tuitionMinUsd: 9000,
    tuitionMaxUsd: 26000,
    livingCostYearUsd: '$8,500 – $14,000 / year',
    nationalPortalName: 'Direct University Portal & UAE Ministry of Education',
    nationalPortalUrl: 'https://www.moe.gov.ae/',
    visaCategoryName: 'UAE Student Residence Visa (University Sponsored)',
    visaProcessingWeeks: '2–4 weeks (100% digital eVisa)',
    bankStatementRequirementUsd: '$8,000 – $12,000 USD (when required by campus)',
    workHoursAllowed: 'Part-time work allowed with MOHRE permit',
    postStudyStay: '5–10 year Golden Visa for High GPA graduates (3.8+ GPA)',
    mainIntakes: ['September (Fall)', 'January (Spring)', 'May (Summer)'],
    instructionLanguages: ['English', 'Arabic'],
    moiFriendly: true,
  },
  SA: {
    tuitionMinUsd: 0,
    tuitionMaxUsd: 12000,
    livingCostYearUsd: '$4,500 – $8,000 / year (Free dorms on government scholarship)',
    nationalPortalName: 'Study in Saudi Unified Government Portal',
    nationalPortalUrl: 'https://studyinsaudi.moe.gov.sa/',
    visaCategoryName: 'Saudi Educational Visa (via Study in Saudi platform)',
    visaProcessingWeeks: '4–8 weeks after Ministry approval',
    bankStatementRequirementUsd: 'Exempt on government scholarship; ~$6,000 for self-funded',
    workHoursAllowed: 'On-campus research/teaching assistantships',
    postStudyStay: 'Premium Residency for PhD/specialized graduates or Iqama work transfer',
    mainIntakes: ['August/September', 'January'],
    instructionLanguages: ['English', 'Arabic'],
    moiFriendly: true,
  },
  FR: {
    tuitionMinUsd: 300,
    tuitionMaxUsd: 4500,
    livingCostYearUsd: '$8,500 – $12,000 / year (€615/month Campus France rule)',
    nationalPortalName: 'Campus France (Études en France) & Parcoursup',
    nationalPortalUrl: 'https://www.campusfrance.org/en',
    visaCategoryName: 'VLS-TS Long-Stay Student Visa',
    visaProcessingWeeks: '3–6 weeks after Campus France interview',
    bankStatementRequirementUsd: '€7,380 (~$8,000 USD) per year (€615/month minimum)',
    workHoursAllowed: '964 hours/year (~20 hrs/week)',
    postStudyStay: '12–24 months APS / RECE Job Search & Business Creation Permit',
    mainIntakes: ['September (Fall)', 'January/February (Spring for select business schools)'],
    instructionLanguages: ['English', 'French'],
    moiFriendly: true,
  },
  JP: {
    tuitionMinUsd: 3600,
    tuitionMaxUsd: 9500,
    livingCostYearUsd: '$7,500 – $11,000 / year',
    nationalPortalName: 'Study in Japan (JASSO) & Direct University Portals',
    nationalPortalUrl: 'https://www.studyinjapan.go.jp/en/',
    visaCategoryName: 'Japan Student Visa (Certificate of Eligibility — CoE)',
    visaProcessingWeeks: '6–10 weeks (CoE issued in Japan + Embassy stamping)',
    bankStatementRequirementUsd: 'JPY 2,000,000 (~$13,500 USD) sponsor bank balance',
    workHoursAllowed: '28 hrs/week (up to 40 hrs/week during holidays)',
    postStudyStay: '12 months Designated Activities (Job Hunting) Visa',
    mainIntakes: ['April (Spring)', 'September/October (Fall — English Track)'],
    instructionLanguages: ['English', 'Japanese'],
    moiFriendly: true,
  },
  KR: {
    tuitionMinUsd: 3500,
    tuitionMaxUsd: 9000,
    livingCostYearUsd: '$6,500 – $10,000 / year',
    nationalPortalName: 'Study in Korea (Korean Ministry of Education)',
    nationalPortalUrl: 'https://www.studyinkorea.go.kr/',
    visaCategoryName: 'D-2 Academic Degree Student Visa',
    visaProcessingWeeks: '3–6 weeks',
    bankStatementRequirementUsd: '$10,000 – $15,000 USD (KRW 16M–20M)',
    workHoursAllowed: '20–25 hrs/week (with TOPIK / English approval)',
    postStudyStay: 'Up to 2 years D-10 Job Seeking Visa',
    mainIntakes: ['March (Spring)', 'September (Fall)'],
    instructionLanguages: ['English', 'Korean'],
    moiFriendly: true,
  },
  HU: {
    tuitionMinUsd: 3500,
    tuitionMaxUsd: 8500,
    livingCostYearUsd: '$5,500 – $8,000 / year',
    nationalPortalName: 'Study in Hungary & DreamApply / Stipendium Hungaricum',
    nationalPortalUrl: 'https://studyinhungary.hu/',
    visaCategoryName: 'Schengen Type D Study Residence Permit',
    visaProcessingWeeks: '4–8 weeks',
    bankStatementRequirementUsd: '~$7,000 – $9,000 USD (or Stipendium Hungaricum award letter)',
    workHoursAllowed: '30 hrs/week during term, 90 days full-time outside term',
    postStudyStay: '9 months Study-to-Work / Job Search Residence Permit',
    mainIntakes: ['September (Fall)', 'February (Spring)'],
    instructionLanguages: ['English', 'Hungarian'],
    moiFriendly: true,
  },
  PL: {
    tuitionMinUsd: 2200,
    tuitionMaxUsd: 6000,
    livingCostYearUsd: '$5,500 – $8,000 / year',
    nationalPortalName: 'Study in Poland (NAWA)',
    nationalPortalUrl: 'https://study.gov.pl/',
    visaCategoryName: 'Polish National Type D Student Visa',
    visaProcessingWeeks: '3–6 weeks',
    bankStatementRequirementUsd: '~$6,000 – $8,500 USD',
    workHoursAllowed: 'Full-time work allowed for full-time degree students with valid TRC',
    postStudyStay: '9–12 months graduate job-search temporary residence permit',
    mainIntakes: ['October (Fall)', 'February/March (Spring)'],
    instructionLanguages: ['English', 'Polish'],
    moiFriendly: true,
  },
  RU: {
    tuitionMinUsd: 2000,
    tuitionMaxUsd: 6500,
    livingCostYearUsd: '$3,000 – $5,000 / year',
    nationalPortalName: 'Education in Russia Official Portal',
    nationalPortalUrl: 'https://education-in-russia.com/',
    visaCategoryName: 'Russian Student Visa (Ministry of Interior Official Invitation)',
    visaProcessingWeeks: '4–7 weeks (including 30-day official invitation issuance)',
    bankStatementRequirementUsd: '$3,500 – $5,000 USD',
    workHoursAllowed: 'Allowed during free study hours with simplified student permit',
    postStudyStay: 'IT & Red-Diploma fast-track residence permit (RVPO / VNZh)',
    mainIntakes: ['September (Main)', 'October/November (Preparatory Faculty)'],
    instructionLanguages: ['English', 'Russian'],
    moiFriendly: true,
  },
  NZ: {
    tuitionMinUsd: 16000,
    tuitionMaxUsd: 32000,
    livingCostYearUsd: '$12,500 – $15,000 USD (NZD $20,000 INZ rule)',
    nationalPortalName: 'Study with New Zealand (Education NZ)',
    nationalPortalUrl: 'https://www.studywithnewzealand.govt.nz/',
    visaCategoryName: 'Fee Paying Student Visa (Immigration New Zealand)',
    visaProcessingWeeks: '4–8 weeks',
    bankStatementRequirementUsd: '1 year tuition + NZD $20,000 living proof',
    workHoursAllowed: '20 hrs/week during semester, full-time in scheduled holidays',
    postStudyStay: 'Up to 3 years Post-Study Work Visa',
    mainIntakes: ['February (Semester 1)', 'July (Semester 2)'],
    instructionLanguages: ['English'],
    moiFriendly: false,
  },
  IE: {
    tuitionMinUsd: 11000,
    tuitionMaxUsd: 28000,
    livingCostYearUsd: '$11,000 – $15,000 / year (€10,000 ISD rule)',
    nationalPortalName: 'Education in Ireland & CAO / PAC',
    nationalPortalUrl: 'https://www.educationinireland.com/',
    visaCategoryName: 'Stamp 2 Long Stay Study Visa (D Study)',
    visaProcessingWeeks: '4–8 weeks',
    bankStatementRequirementUsd: '€10,000 (~$10,900 USD) + tuition fee payment proof',
    workHoursAllowed: '20 hrs/week during term, 40 hrs/week in June–Sept & Dec–Jan',
    postStudyStay: '12–24 months Stamp 1G Third Level Graduate Programme',
    mainIntakes: ['September (Main)', 'January (Select Masters)'],
    instructionLanguages: ['English'],
    moiFriendly: false,
  },
  NL: {
    tuitionMinUsd: 9500,
    tuitionMaxUsd: 22000,
    livingCostYearUsd: '$11,500 – $15,000 / year (€1,225/month IND requirement)',
    nationalPortalName: 'Studielink & Study in NL',
    nationalPortalUrl: 'https://www.studyinnl.org/',
    visaCategoryName: 'MVV Entry Visa + VVR Student Residence Permit (University-Applied)',
    visaProcessingWeeks: '3–5 weeks via university IND fast-track',
    bankStatementRequirementUsd: '€14,700 (~$16,000 USD) annual living proof',
    workHoursAllowed: '16 hrs/week year-round OR full-time in June, July, August',
    postStudyStay: '12 months Zoekjaar (Orientation Year) Visa',
    mainIntakes: ['September (Main)', 'February (Select Masters)'],
    instructionLanguages: ['English', 'Dutch'],
    moiFriendly: false,
  },
  SE: {
    tuitionMinUsd: 9000,
    tuitionMaxUsd: 16500,
    livingCostYearUsd: '$10,000 – $12,500 / year (SEK 10,314/month Migrationsverket rule)',
    nationalPortalName: 'Universityadmissions.se (Central National Portal)',
    nationalPortalUrl: 'https://www.universityadmissions.se/',
    visaCategoryName: 'Residence Permit for Higher Education (Migrationsverket)',
    visaProcessingWeeks: '4–10 weeks',
    bankStatementRequirementUsd: 'SEK 10,314/month (~$10,000 USD/year) in personal bank account',
    workHoursAllowed: 'No official hour cap (must maintain full-time study progress)',
    postStudyStay: '12 months Residence Permit to Look for Work',
    mainIntakes: ['Autumn (August — Apply by Jan 15)', 'Spring (January)'],
    instructionLanguages: ['English', 'Swedish'],
    moiFriendly: true,
  },
  FI: {
    tuitionMinUsd: 8000,
    tuitionMaxUsd: 18000,
    livingCostYearUsd: '$9,000 – $11,500 / year (€800/month Migri rule)',
    nationalPortalName: 'Studyinfo.fi (Opintopolku Official Portal)',
    nationalPortalUrl: 'https://studyinfo.fi/',
    visaCategoryName: 'Student Residence Permit (Migri EnterFinland)',
    visaProcessingWeeks: '3–6 weeks',
    bankStatementRequirementUsd: '€9,600 (~$10,400 USD) for 1 year',
    workHoursAllowed: '30 hrs/week average',
    postStudyStay: '2 years Job Search / Entrepreneurship Residence Permit',
    mainIntakes: ['August/September (Joint Application in January)', 'January'],
    instructionLanguages: ['English', 'Finnish'],
    moiFriendly: true,
  },
  NO: {
    tuitionMinUsd: 0,
    tuitionMaxUsd: 16000,
    livingCostYearUsd: '$13,500 / year (NOK 151,690 UDI deposit)',
    nationalPortalName: 'Study in Norway (Søknadsweb)',
    nationalPortalUrl: 'https://studyinnorway.no/',
    visaCategoryName: 'Norwegian Study Permit (UDI)',
    visaProcessingWeeks: '4–8 weeks',
    bankStatementRequirementUsd: 'NOK 151,690 (~$13,800 USD) transferred to Norwegian student deposit account',
    workHoursAllowed: '20 hrs/week during semester, full-time in holidays',
    postStudyStay: '12 months Job Seeker Permit',
    mainIntakes: ['August (Single Annual Intake — Apply Nov–Dec)'],
    instructionLanguages: ['English', 'Norwegian'],
    moiFriendly: false,
  },
  AT: {
    tuitionMinUsd: 1500,
    tuitionMaxUsd: 2000,
    livingCostYearUsd: '$9,000 – $13,000 / year (€747/month under 24 yrs; €1,350/month 24+ yrs)',
    nationalPortalName: 'Study in Austria (OeAD)',
    nationalPortalUrl: 'https://studyinaustria.at/',
    visaCategoryName: 'Aufenthaltsbewilligung – Studierender (Student Residence Permit)',
    visaProcessingWeeks: '6–12 weeks',
    bankStatementRequirementUsd: '€9,000 – €16,200 depending on age + accommodation cost',
    workHoursAllowed: '20 hrs/week (with AMS work permit)',
    postStudyStay: '12 months Red-White-Red Card Job Seeker extension',
    mainIntakes: ['October (Winter)', 'March (Summer)'],
    instructionLanguages: ['English', 'German'],
    moiFriendly: true,
  },
  PK: {
    tuitionMinUsd: 600,
    tuitionMaxUsd: 3500,
    livingCostYearUsd: '$1,800 – $3,200 / year',
    nationalPortalName: 'Higher Education Commission (HEC) & Direct University Portals',
    nationalPortalUrl: 'https://www.hec.gov.pk/',
    visaCategoryName: 'Pakistan Online Student Visa (NADRA + HEC NOC)',
    visaProcessingWeeks: '4–6 weeks',
    bankStatementRequirementUsd: '$2,500 – $4,000 USD',
    workHoursAllowed: 'On-campus internships & research assistantships',
    postStudyStay: 'Work visa conversion upon employer sponsorship',
    mainIntakes: ['Fall (September)', 'Spring (February)'],
    instructionLanguages: ['English', 'Urdu'],
    moiFriendly: true,
  },
};

function computeBudgetTier(minUsd: number, maxUsd: number): BudgetTier {
  const avg = (minUsd + maxUsd) / 2;
  if (minUsd <= 1500 || avg <= 3000) return 'free-low';
  if (avg <= 9500) return 'affordable';
  if (avg <= 22000) return 'moderate';
  return 'premium';
}

function getDefaultPolicyForCountry(country: Country): CountryStudyPolicy {
  const override = COUNTRY_POLICIES[country.iso2];
  if (override) return override;

  // Regional realistic defaults for any UN country without an explicit override
  switch (country.continent) {
    case 'Europe':
      return {
        tuitionMinUsd: 1800,
        tuitionMaxUsd: 6500,
        livingCostYearUsd: '$6,000 – $10,000 / year',
        nationalPortalName: `${country.commonName} Ministry of Higher Education & Direct University Portals`,
        nationalPortalUrl: `https://www.google.com/search?q=${encodeURIComponent('study in ' + country.commonName + ' official ministry higher education')}`,
        visaCategoryName: `${country.commonName} National Type D Student Visa / Residence Permit`,
        visaProcessingWeeks: '4–8 weeks',
        bankStatementRequirementUsd: '$6,500 – $9,500 USD',
        workHoursAllowed: '20 hrs/week during academic semester',
        postStudyStay: '9–12 months graduate job-search extension',
        mainIntakes: ['Fall (September/October)', 'Spring (February)'],
        instructionLanguages: [...new Set(['English', ...country.languages])],
        moiFriendly: true,
      };
    case 'Asia':
      return {
        tuitionMinUsd: 1500,
        tuitionMaxUsd: 5500,
        livingCostYearUsd: '$3,000 – $6,000 / year',
        nationalPortalName: `${country.commonName} Higher Education Admission Portal`,
        nationalPortalUrl: `https://www.google.com/search?q=${encodeURIComponent('study in ' + country.commonName + ' international students admissions')}`,
        visaCategoryName: `${country.commonName} Student Entry Visa & Study Residence Pass`,
        visaProcessingWeeks: '3–6 weeks',
        bankStatementRequirementUsd: '$4,000 – $6,500 USD',
        workHoursAllowed: 'Part-time on-campus / internship with university approval',
        postStudyStay: 'Work visa conversion upon local job offer',
        mainIntakes: ['Fall (September)', 'Spring (February/March)'],
        instructionLanguages: [...new Set(['English', ...country.languages])],
        moiFriendly: true,
      };
    case 'Africa':
      return {
        tuitionMinUsd: 1000,
        tuitionMaxUsd: 4000,
        livingCostYearUsd: '$2,500 – $4,800 / year',
        nationalPortalName: `${country.commonName} National Higher Education Council & University Portals`,
        nationalPortalUrl: `https://www.google.com/search?q=${encodeURIComponent(country.commonName + ' national university international admission')}`,
        visaCategoryName: `${country.commonName} Student Study Permit / Residence Pass`,
        visaProcessingWeeks: '3–6 weeks',
        bankStatementRequirementUsd: '$3,000 – $5,000 USD',
        workHoursAllowed: 'Part-time academic & campus internships',
        postStudyStay: 'Work permit application upon graduation',
        mainIntakes: ['September / October', 'January / February'],
        instructionLanguages: [...new Set(['English', ...country.languages])],
        moiFriendly: true,
      };
    case 'South America':
    case 'North America':
      return {
        tuitionMinUsd: 1200,
        tuitionMaxUsd: 5500,
        livingCostYearUsd: '$4,000 – $7,500 / year',
        nationalPortalName: `${country.commonName} Ministry of Education & University International Office`,
        nationalPortalUrl: `https://www.google.com/search?q=${encodeURIComponent('study in ' + country.commonName + ' university admission')}`,
        visaCategoryName: `${country.commonName} Temporary Student Resident Visa`,
        visaProcessingWeeks: '3–6 weeks',
        bankStatementRequirementUsd: '$4,500 – $7,500 USD',
        workHoursAllowed: 'Part-time allowed with student residence authorization',
        postStudyStay: 'Temporary to permanent residence pathway available',
        mainIntakes: ['February / March', 'August / September'],
        instructionLanguages: [...new Set(['English', 'Spanish', ...country.languages])],
        moiFriendly: true,
      };
    default:
      return {
        tuitionMinUsd: 2000,
        tuitionMaxUsd: 7000,
        livingCostYearUsd: '$4,500 – $8,000 / year',
        nationalPortalName: `${country.commonName} Higher Education Commission`,
        nationalPortalUrl: `https://www.google.com/search?q=${encodeURIComponent('study in ' + country.commonName + ' university admissions')}`,
        visaCategoryName: `${country.commonName} Student Visa`,
        visaProcessingWeeks: '4–6 weeks',
        bankStatementRequirementUsd: '$5,000 – $8,000 USD',
        workHoursAllowed: '20 hrs/week during study session',
        postStudyStay: 'Graduate work permit pathway',
        mainIntakes: ['February', 'July / September'],
        instructionLanguages: ['English'],
        moiFriendly: true,
      };
  }
}

function buildProgramsForUniversity(
  uniName: string,
  uniType: UniversityProfile['type'],
  policy: CountryStudyPolicy
): UniversityProgram[] {
  const min = policy.tuitionMinUsd;
  const max = policy.tuitionMaxUsd;
  const baseLang = policy.instructionLanguages.join(' / ');
  const engNote = policy.moiFriendly
    ? 'IELTS 6.0 / TOEFL 79 / PTE 55 OR Medium of Instruction (MOI) Certificate'
    : 'IELTS 6.5 (no band < 6.0) / TOEFL iBT 85+ / PTE 60+';

  return PROGRAM_CATEGORIES.map((cat) => {
    let catMin = min;
    let catMax = max;
    let degrees: DegreeLevel[] = ['Bachelor', 'Master', 'PhD'];
    let duration = 'BS: 3–4 yrs | MS: 1.5–2 yrs | PhD: 3–4 yrs';

    if (cat.slug === 'medicine-health') {
      catMin = min === 0 ? 0 : Math.round(min * 1.25);
      catMax = Math.round(max * 1.4);
      degrees = ['MBBS / MD', 'Bachelor', 'Master', 'PhD'];
      duration = 'MBBS/MD: 5–6 yrs | BSc Nursing/Pharm: 4 yrs | MPH/MS: 2 yrs';
    } else if (cat.slug === 'business-mba') {
      degrees = ['Bachelor', 'Master', 'PhD', 'Diploma / Foundation'];
      duration = 'BBA: 3–4 yrs | MBA/MS: 1–2 yrs | PhD: 3–4 yrs';
    } else if (cat.slug === 'cs-it' || cat.slug === 'engineering') {
      degrees = ['Bachelor', 'Master', 'PhD', 'Diploma / Foundation'];
    }

    const tuitionStr =
      catMin === 0
        ? `$0 (Tuition-Free Public) – $${catMax.toLocaleString()} USD / yr`
        : `$${catMin.toLocaleString()} – $${catMax.toLocaleString()} USD / yr`;

    return {
      category: cat.slug,
      categoryLabel: cat.name,
      degrees,
      popularMajors: cat.sampleMajors,
      durationYears: duration,
      annualTuitionUsd: tuitionStr,
      language: baseLang,
      entryRequirements: `${cat.typicalRequirements} Language: ${engNote}.`,
    };
  });
}

function buildDiyStepsForUniversity(
  uniName: string,
  countryName: string,
  website: string,
  policy: CountryStudyPolicy
): DiyAdmissionStep[] {
  return [
    {
      step: 1,
      title: 'Select Your Program & Check Eligibility',
      timeline: '6–9 Months Before Intake',
      detail: `Visit the official ${uniName} international catalogue (${website}) and pick 2–3 programs matching your previous academic background. Check minimum GPA/percentage (typically 60%+ for standard programs, 75%+ for competitive scholarships) and intake deadlines (${policy.mainIntakes.join(', ')}).`,
      proTip: 'Never pay an agent just to “find” a university — every official course curriculum and fee table is free on the university website.',
      toolHref: '/tools/gpa-calculator',
      toolLabel: 'Calculate Your GPA',
    },
    {
      step: 2,
      title: 'Prepare, Attest & Scan Academic Documents',
      timeline: '5–7 Months Before Intake',
      detail: `Gather your High School (Matric/O-Level & Inter/A-Level) certificates and Bachelor/Master transcripts + degree certificates. Get them attested by your Education Board / HEC / Ministry of Foreign Affairs (MOFA) or Apostille as required by ${countryName}. Scan all pages in clear 300 DPI color PDF format.`,
      proTip: 'Most university portals reject uploads larger than 2 MB or 5 MB per file. Merge multi-page transcripts into one clean PDF and compress it.',
      toolHref: '/tools/pdf-merge',
      toolLabel: 'Merge & Compress Transcripts',
    },
    {
      step: 3,
      title: 'Write Your SOP, Academic CV & Request LORs',
      timeline: '4–6 Months Before Intake',
      detail: `Draft a 500–800 word Statement of Purpose (SOP) / Motivation Letter explaining why you chose this specific program at ${uniName}, your academic projects, and your career plan. Prepare a 1–2 page Europass or Academic CV, and collect 2 signed Letters of Recommendation (LORs) on official university letterhead with your professors’ institutional emails.`,
      proTip: 'Avoid generic copy-paste AI templates — mention 2 real courses or research labs from the university department to stand out immediately.',
      toolHref: '/tools/word-counter',
      toolLabel: 'SOP Word & Readability Counter',
    },
    {
      step: 4,
      title: 'Fulfill Language Proof (IELTS / TOEFL / PTE or MOI)',
      timeline: '4–5 Months Before Intake',
      detail: policy.moiFriendly
        ? `${uniName} and many institutions in ${countryName} accept IELTS (6.0–6.5), TOEFL iBT, PTE, OR an official Medium of Instruction (MOI / English Proficiency Certificate) issued by your previous university registrar if your prior degree was taught 100% in English.`
        : `Take your English proficiency test (IELTS Academic 6.0–6.5, TOEFL iBT 80+, or PTE Academic) and download the official TRF score report for portal upload.`,
      proTip: 'Even where MOI is accepted for university admission, check whether the local embassy in your country asks for IELTS/PTE for visa processing.',
    },
    {
      step: 5,
      title: 'Submit DIY Application on Official Portal',
      timeline: '3–5 Months Before Intake',
      detail: `Create your applicant account directly on ${website} or via ${policy.nationalPortalName}. Fill in personal and academic details yourself, use your own personal email address (never let an agent use their email!), upload your PDFs, and pay the official application fee (if applicable) via debit/credit card.`,
      proTip: 'Save your Application ID and portal login credentials. Check the portal weekly for conditional offer updates or interview invites.',
    },
    {
      step: 6,
      title: 'Accept Offer, Prepare Bank Statement & File Student Visa',
      timeline: '1–3 Months Before Intake',
      detail: `Once you receive your Unconditional Offer / Admission Letter (e.g., I-20 / CAS / LOA / eVAL / Visa Invitation), pay the official tuition deposit ONLY to the university’s official IBAN/Flywire account. Prepare your financial proof (${policy.bankStatementRequirementUsd}) and apply for the ${policy.visaCategoryName} (${policy.visaProcessingWeeks}).`,
      proTip: 'Size your biometric visa photo to exact embassy specifications before your consular appointment.',
      toolHref: '/tools/passport-photo-maker',
      toolLabel: 'Make Visa Passport Photo',
    },
  ];
}

function buildRequiredDocuments(
  countryName: string,
  policy: CountryStudyPolicy
): DocumentCategoryGroup[] {
  return [
    {
      category: 'Academic',
      title: '1. Academic Transcripts & Certificates',
      items: [
        {
          id: 'doc-hs',
          label: 'High School / Secondary & Higher Secondary Certificates (Matric / O-Levels & Inter / A-Levels / 12th Grade)',
          note: 'Both mark sheets and passing certificates attested by board & MOFA/Apostille.',
          requiredFor: 'All Degrees (Bachelor, Master, MBBS, PhD)',
        },
        {
          id: 'doc-bachelor',
          label: 'Bachelor’s Degree & Official Semester-by-Semester Transcripts',
          note: 'Must show grading scale / CGPA conversion on the back or via official registrar sheet.',
          requiredFor: 'Master’s & PhD Applicants',
        },
        {
          id: 'doc-master',
          label: 'Master’s Degree, Transcript & Thesis Abstract',
          note: 'Required when applying for Doctoral (PhD) research programs.',
          requiredFor: 'PhD Applicants',
        },
      ],
    },
    {
      category: 'Essays & Recommendations',
      title: '2. SOP, CV, Recommendations & Research Proposal',
      items: [
        {
          id: 'doc-sop',
          label: 'Statement of Purpose (SOP) / Personal Statement / Motivation Letter (500–1,000 words)',
          note: 'Tailored to the specific program, career goals, and why you selected ' + countryName + '.',
          requiredFor: 'All Degrees',
        },
        {
          id: 'doc-cv',
          label: 'Academic CV / Europass Resume (1–2 Pages PDF)',
          note: 'Highlight education, final-year thesis/projects, internships, publications, and technical skills.',
          requiredFor: 'All Degrees (Mandatory for MS/MBA/PhD)',
        },
        {
          id: 'doc-lor',
          label: '2 Letters of Recommendation (LORs) / Academic References',
          note: 'On university letterhead with professor’s signature, stamp, and official institutional email.',
          requiredFor: 'Master’s, PhD & Competitive Bachelor’s',
        },
        {
          id: 'doc-proposal',
          label: 'Research Proposal (1,500–2,500 words) / Design Portfolio',
          note: 'Research proposal for MS by Research / PhD; Creative Portfolio for Architecture/Design.',
          requiredFor: 'PhD / Research MS / Architecture & Arts',
        },
      ],
    },
    {
      category: 'Identity & Language',
      title: '3. Passport, Photos & Language Proficiency',
      items: [
        {
          id: 'doc-passport',
          label: 'Valid International Passport (First & Signature Pages Scan)',
          note: 'Must be valid for at least 12–18 months beyond your intended program start date.',
          requiredFor: 'All Applicants',
        },
        {
          id: 'doc-english',
          label: policy.moiFriendly
            ? 'IELTS / TOEFL / PTE Score Report OR Official English Proficiency (MOI) Certificate'
            : 'Official IELTS Academic / TOEFL iBT / PTE Academic Score Report',
          note: policy.moiFriendly
            ? 'MOI letter from previous university registrar accepted at many institutions; IELTS 6.0+ recommended for faster visa.'
            : 'Direct standardized score report required for both admission and student visa.',
          requiredFor: 'All English-Taught Programs',
        },
        {
          id: 'doc-photo',
          label: 'Biometric Passport-Size Photographs (White Background, ICAO Standard)',
          note: 'Both digital JPEG/PNG for portal upload and printed copies for embassy submission.',
          requiredFor: 'Admission Portal & Visa',
        },
      ],
    },
    {
      category: 'Financial & Visa',
      title: '4. Financial Proof & Student Visa File',
      items: [
        {
          id: 'doc-offer',
          label: 'Official Unconditional Offer Letter & Visa Confirmation (' + policy.visaCategoryName + ')',
          note: 'Issued by the university after admission acceptance and tuition deposit (if applicable).',
          requiredFor: 'Student Visa Stage',
        },
        {
          id: 'doc-bank',
          label: 'Bank Statement (Last 3–6 Months) / Blocked Account / Scholarship Award Letter',
          note: `Required financial coverage: ${policy.bankStatementRequirementUsd} + signed Account Maintenance Letter.`,
          requiredFor: 'Student Visa Stage',
        },
        {
          id: 'doc-sponsor',
          label: 'Notarized Affidavit of Financial Support + Sponsor Income/Tax Proof + Family Registration (FRC)',
          note: 'Required if parents/blood relative are sponsoring your education and living costs.',
          requiredFor: 'Self/Family-Funded Applicants',
        },
        {
          id: 'doc-medical',
          label: 'Medical Fitness Certificate / TB Clearance + Police Character Certificate + Health Insurance',
          note: 'Issued by approved clinics/police authority within 3–6 months of visa filing.',
          requiredFor: 'Student Visa Stage',
        },
      ],
    },
  ];
}

function buildCountryStudySummaries(): CountryStudySummary[] {
  return UN_COUNTRIES.map((country) => {
    const slug = getCanonicalCountrySlug(country);
    const policy = getDefaultPolicyForCountry(country);
    const budgetTier = computeBudgetTier(policy.tuitionMinUsd, policy.tuitionMaxUsd);
    const rawUnis = FLAGSHIP_UNIVERSITIES_BY_ISO2[country.iso2] || [
      [`National University of ${country.commonName}`, country.capital, `google.com/search?q=National+University+of+${encodeURIComponent(country.commonName)}`, 1960, 'Public National'],
    ];

    const countryScholarships = GLOBAL_SCHOLARSHIPS.filter(
      (s) => s.countryIso2 === country.iso2 || (country.continent === 'Europe' && s.countryIso2 === 'FR' && s.name.includes('Erasmus'))
    );

    const universities: UniversityProfile[] = rawUnis.map(([uName, city, domain, founded, uType], idx) => {
      const uSlug = uName
        .toLowerCase()
        .replace(/\([^)]*\)/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const websiteUrl = domain.startsWith('http') ? domain : `https://www.${domain.replace(/^www\./, '')}`;

      // Differentiate public vs private tuition slightly for realism
      const uMin = uType === 'Private' ? Math.max(2500, Math.round(policy.tuitionMinUsd * 1.3)) : policy.tuitionMinUsd;
      const uMax = uType === 'Private' ? Math.round(policy.tuitionMaxUsd * 1.25) : policy.tuitionMaxUsd;
      const tuitionLabel =
        uMin === 0
          ? `$0 – $${uMax.toLocaleString()} USD / year`
          : `$${uMin.toLocaleString()} – $${uMax.toLocaleString()} USD / year`;

      const defaultScholarships = [
        ...countryScholarships.map((s) => ({
          name: s.name,
          coverage: s.coverage,
          eligibility: `Open to international ${s.degrees.join('/')} applicants (${s.deadlineWindow}).`,
        })),
        {
          name: `${uName} International Merit & Need Scholarship`,
          coverage: '20% to 100% Tuition Fee Waiver / Graduate Research Assistantship',
          eligibility: 'Automatic or separate application with strong GPA (3.2+/4.0 or 75%+) and early submission.',
        },
      ];

      return {
        id: `${country.iso2.toLowerCase()}-${idx + 1}`,
        slug: uSlug,
        name: uName,
        countryIso2: country.iso2,
        countrySlug: slug,
        countryName: country.commonName,
        countryFlag: country.flagEmoji,
        continent: country.continent,
        city,
        type: uType,
        founded,
        website: websiteUrl,
        admissionsPortalUrl: websiteUrl,
        applicationSystem: policy.nationalPortalName,
        tuitionMinUsd: uMin,
        tuitionMaxUsd: uMax,
        tuitionLabel,
        budgetTier: computeBudgetTier(uMin, uMax),
        applicationFeeUsd: uMin === 0 ? '$0 – $80 USD' : '$30 – $120 USD (waivers available)',
        livingCostPerYearUsd: policy.livingCostYearUsd,
        acceptanceBand: idx === 0 ? 'Competitive (20%–45%)' : 'Moderate / Accessible (45%–70%)',
        intakes: policy.mainIntakes,
        languages: policy.instructionLanguages,
        englishRequirements: policy.moiFriendly
          ? 'IELTS 6.0 / TOEFL 79 / PTE 55 OR Medium of Instruction (MOI) Certificate'
          : 'IELTS 6.5 / TOEFL iBT 85+ / PTE 60+',
        moiAccepted: policy.moiFriendly,
        workRightsStudy: policy.workHoursAllowed,
        postStudyWorkVisa: policy.postStudyStay,
        scholarships: defaultScholarships,
        programs: buildProgramsForUniversity(uName, uType, {
          ...policy,
          tuitionMinUsd: uMin,
          tuitionMaxUsd: uMax,
        }),
        admissionSteps: buildDiyStepsForUniversity(uName, country.commonName, websiteUrl, policy),
        requiredDocuments: buildRequiredDocuments(country.commonName, policy),
      };
    });

    const tuitionBandLabel =
      policy.tuitionMinUsd === 0
        ? `$0 (Public) – $${policy.tuitionMaxUsd.toLocaleString()} USD / yr`
        : `$${policy.tuitionMinUsd.toLocaleString()} – $${policy.tuitionMaxUsd.toLocaleString()} USD / yr`;

    return {
      iso2: country.iso2,
      slug,
      name: country.commonName,
      officialName: country.officialName,
      flag: country.flagEmoji,
      capital: country.capital,
      continent: country.continent,
      region: country.region,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      tuitionMinUsd: policy.tuitionMinUsd,
      tuitionMaxUsd: policy.tuitionMaxUsd,
      tuitionBandLabel,
      livingCostYearUsd: policy.livingCostYearUsd,
      budgetTier,
      nationalPortalName: policy.nationalPortalName,
      nationalPortalUrl: policy.nationalPortalUrl,
      visaCategoryName: policy.visaCategoryName,
      visaProcessingWeeks: policy.visaProcessingWeeks,
      bankStatementRequirementUsd: policy.bankStatementRequirementUsd,
      workHoursAllowed: policy.workHoursAllowed,
      postStudyStay: policy.postStudyStay,
      mainIntakes: policy.mainIntakes,
      instructionLanguages: policy.instructionLanguages,
      moiFriendly: policy.moiFriendly,
      universitiesCount: universities.length,
      universities,
    };
  });
}

export const ALL_COUNTRY_STUDY_SUMMARIES: CountryStudySummary[] = buildCountryStudySummaries();

export const ALL_UNIVERSITIES: UniversityProfile[] = ALL_COUNTRY_STUDY_SUMMARIES.flatMap(
  (c) => c.universities
);

export function getCountryStudyBySlugOrIso(slugOrIso: string): CountryStudySummary | undefined {
  if (!slugOrIso) return undefined;
  const clean = slugOrIso.trim().toLowerCase();
  const aliasIso = COUNTRY_SLUG_ALIASES[clean];
  if (aliasIso) {
    return ALL_COUNTRY_STUDY_SUMMARIES.find((c) => c.iso2 === aliasIso);
  }
  return ALL_COUNTRY_STUDY_SUMMARIES.find(
    (c) =>
      c.slug === clean ||
      c.iso2.toLowerCase() === clean ||
      c.name.toLowerCase() === clean.replace(/-/g, ' ')
  );
}

export function getUniversityBySlugs(
  countrySlugOrIso: string,
  uniSlug: string
): UniversityProfile | undefined {
  const country = getCountryStudyBySlugOrIso(countrySlugOrIso);
  if (!country) return undefined;
  const cleanUni = uniSlug.trim().toLowerCase();
  return country.universities.find((u) => u.slug === cleanUni || u.id.toLowerCase() === cleanUni);
}

export function getGlobalStudyStats() {
  return {
    totalCountries: ALL_COUNTRY_STUDY_SUMMARIES.length,
    totalUniversities: ALL_UNIVERSITIES.length,
    totalProgramCategories: PROGRAM_CATEGORIES.length,
    totalScholarships: GLOBAL_SCHOLARSHIPS.length,
    moiFriendlyCountries: ALL_COUNTRY_STUDY_SUMMARIES.filter((c) => c.moiFriendly).length,
    lowCostCountries: ALL_COUNTRY_STUDY_SUMMARIES.filter((c) => c.budgetTier === 'free-low' || c.budgetTier === 'affordable').length,
  };
}

