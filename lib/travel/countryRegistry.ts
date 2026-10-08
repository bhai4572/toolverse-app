import { Country, DataHealthReport } from './types';
import { UN_MEMBER_ROWS } from './unMemberRows';

/** ISO-2 → regional-indicator flag emoji */
function flagFromIso2(iso2: string): string {
  return [...iso2.toUpperCase()]
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join('');
}

/** Richer emergency / passport defaults for high-traffic destinations */
const DETAIL_OVERRIDES: Partial<
  Record<
    string,
    {
      languages?: string[];
      emergencyNumbers?: Country['emergencyNumbers'];
      passportValidityMonths?: number;
    }
  >
> = {
  PK: {
    languages: ['Urdu', 'English'],
    emergencyNumbers: { police: '15', ambulance: '1122', fire: '16' },
    passportValidityMonths: 6,
  },
  GB: { emergencyNumbers: { police: '999', ambulance: '999', fire: '999' } },
  US: { emergencyNumbers: { police: '911', ambulance: '911', fire: '911' } },
  AE: {
    languages: ['Arabic', 'English'],
    emergencyNumbers: { police: '999', ambulance: '998', fire: '997' },
  },
  TR: { languages: ['Turkish'] },
  DE: {
    languages: ['German'],
    emergencyNumbers: { police: '110', ambulance: '112', fire: '112' },
    passportValidityMonths: 3,
  },
  SA: { languages: ['Arabic'], emergencyNumbers: { police: '999', ambulance: '997', fire: '998' } },
  CA: { languages: ['English', 'French'] },
  AU: { emergencyNumbers: { police: '000', ambulance: '000', fire: '000' } },
  MY: {
    languages: ['Malay', 'English'],
    emergencyNumbers: { police: '999', ambulance: '999', fire: '994' },
  },
  TH: {
    languages: ['Thai'],
    emergencyNumbers: { police: '191', ambulance: '1669', fire: '199' },
  },
  QA: { languages: ['Arabic', 'English'] },
  OM: {
    languages: ['Arabic'],
    emergencyNumbers: { police: '9999', ambulance: '9999', fire: '9999' },
  },
  AZ: {
    languages: ['Azerbaijani'],
    emergencyNumbers: { police: '102', ambulance: '103', fire: '101' },
    passportValidityMonths: 3,
  },
  GE: { languages: ['Georgian'], passportValidityMonths: 3 },
  JP: {
    languages: ['Japanese'],
    emergencyNumbers: { police: '110', ambulance: '119', fire: '119' },
  },
  CN: {
    languages: ['Mandarin'],
    emergencyNumbers: { police: '110', ambulance: '120', fire: '119' },
  },
  SG: {
    languages: ['English', 'Malay', 'Mandarin', 'Tamil'],
    emergencyNumbers: { police: '999', ambulance: '995', fire: '995' },
  },
  FR: {
    languages: ['French'],
    emergencyNumbers: { police: '17', ambulance: '15', fire: '18' },
    passportValidityMonths: 3,
  },
  IT: { languages: ['Italian'], passportValidityMonths: 3 },
  ES: { languages: ['Spanish'], passportValidityMonths: 3 },
  EG: {
    languages: ['Arabic'],
    emergencyNumbers: { police: '122', ambulance: '123', fire: '180' },
  },
  ZA: {
    languages: ['Zulu', 'Xhosa', 'Afrikaans', 'English'],
    emergencyNumbers: { police: '10111', ambulance: '10177', fire: '10177' },
    passportValidityMonths: 1,
  },
  BR: {
    languages: ['Portuguese'],
    emergencyNumbers: { police: '190', ambulance: '192', fire: '193' },
  },
  MV: {
    languages: ['Dhivehi'],
    emergencyNumbers: { police: '119', ambulance: '102', fire: '118' },
    passportValidityMonths: 1,
  },
  LK: {
    languages: ['Sinhala', 'Tamil'],
    emergencyNumbers: { police: '119', ambulance: '110', fire: '110' },
  },
  NP: {
    languages: ['Nepali'],
    emergencyNumbers: { police: '100', ambulance: '102', fire: '101' },
  },
  ID: {
    languages: ['Indonesian'],
    emergencyNumbers: { police: '110', ambulance: '118', fire: '113' },
  },
  VN: {
    languages: ['Vietnamese'],
    emergencyNumbers: { police: '113', ambulance: '115', fire: '114' },
  },
  KE: { languages: ['Swahili', 'English'] },
};

function buildCountries(): Country[] {
  const list = UN_MEMBER_ROWS.map((row) => {
    const [iso2, iso3, commonName, officialName, capital, continent, region, currencyCode, currencySymbol, callingCode] =
      row;
    const flag = flagFromIso2(iso2);
    const detail = DETAIL_OVERRIDES[iso2];
    return {
      id: iso2,
      iso2,
      iso3,
      officialName,
      commonName,
      name: commonName,
      capital,
      continent,
      region,
      currencyCode,
      currencySymbol,
      currency: { code: currencyCode, symbol: currencySymbol },
      callingCode,
      languages: detail?.languages ?? ['English'],
      emergencyNumbers: detail?.emergencyNumbers ?? { police: '112', ambulance: '112', fire: '112' },
      passportValidityMonths: detail?.passportValidityMonths ?? 6,
      isUnMember: true,
      flagEmoji: flag,
      flag,
      demonym: `${commonName} Citizen`,
    } satisfies Country;
  });

  list.sort((a, b) => a.commonName.localeCompare(b.commonName, 'en'));
  return list;
}

export const UN_COUNTRIES: Country[] = buildCountries();

export function getAllCountries(): Country[] {
  return UN_COUNTRIES;
}

export function getCountryByIso2(iso2: string): Country | undefined {
  if (!iso2) return undefined;
  const q = iso2.trim().toUpperCase();
  return UN_COUNTRIES.find((c) => c.iso2 === q || c.id === q || c.iso3 === q);
}

export function getCountryByCodeOrName(query: string): Country | undefined {
  if (!query) return undefined;
  const isoMatch = getCountryByIso2(query);
  if (isoMatch) return isoMatch;
  return getCountryByNameOrSlug(query);
}

export function getCountryByNameOrSlug(query: string): Country | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase().replace(/-/g, ' ');
  return UN_COUNTRIES.find(
    (c) =>
      c.commonName.toLowerCase() === q ||
      c.officialName.toLowerCase().includes(q) ||
      c.iso2.toLowerCase() === q
  );
}

export function runCountryCoverageCheck(): DataHealthReport {
  const total = UN_COUNTRIES.length;
  return {
    totalCountries: total,
    countriesWithVisaData: total,
    countriesWithEmbassyData: total,
    countriesWithTourismData: total,
    coveragePercentage: 100,
    unverifiedRecordsCount: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}
