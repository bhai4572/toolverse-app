import { EmbassyMission } from './types';

/**
 * Global Embassy, Consulate, & Visa Application Center Directory
 */
export const SAMPLE_EMBASSIES: EmbassyMission[] = [
  // UK in Pakistan
  {
    id: 'emb-uk-isb',
    representingCountryIso2: 'GB',
    hostCountryIso2: 'PK',
    city: 'Islamabad',
    type: 'EMBASSY',
    title: 'British High Commission Islamabad',
    address: 'Diplomatic Enclave, Ramna 5, Islamabad, Pakistan',
    phone: '+92 51 201 2000',
    email: 'bhcislamabad@fcdo.gov.uk',
    website: 'https://www.gov.uk/world/organisations/british-high-commission-islamabad',
    appointmentUrl: 'https://pos.tlscontact.com/isb_en/',
    jurisdiction: 'All Pakistan (Visa applications processed via TLScontact centers in Islamabad, Lahore, Karachi)',
    lastVerifiedDate: '2026-10-01',
  },
  {
    id: 'vac-uk-lhr',
    representingCountryIso2: 'GB',
    hostCountryIso2: 'PK',
    city: 'Lahore',
    type: 'VAC',
    title: 'TLScontact UK Visa Application Centre Lahore',
    address: '2nd Floor, Park Lane Tower, 172-Tufail Road, Lahore Cantt, Pakistan',
    phone: '+92 51 201 2000',
    email: 'support@tlscontact.com',
    website: 'https://pos.tlscontact.com/lhr_en/',
    appointmentUrl: 'https://pos.tlscontact.com/lhr_en/',
    jurisdiction: 'Punjab Province',
    lastVerifiedDate: '2026-10-01',
  },
  // Germany in Pakistan
  {
    id: 'emb-de-isb',
    representingCountryIso2: 'DE',
    hostCountryIso2: 'PK',
    city: 'Islamabad',
    type: 'EMBASSY',
    title: 'Embassy of the Federal Republic of Germany Islamabad',
    address: 'Ramna 5, Diplomatic Enclave, Islamabad, Pakistan',
    phone: '+92 51 227 9430',
    email: 'info@islamabad.diplo.de',
    website: 'https://pakistan.diplo.de',
    appointmentUrl: 'https://service2.diplo.de/rktermin/extern/choose_realmList.do?locationCode=isla&realmId=108',
    jurisdiction: 'Islamabad Capital Territory, Punjab, KPK, Gilgit-Baltistan, AJK',
    lastVerifiedDate: '2026-10-01',
  },
  {
    id: 'con-de-khi',
    representingCountryIso2: 'DE',
    hostCountryIso2: 'PK',
    city: 'Karachi',
    type: 'CONSULATE_GENERAL',
    title: 'Consulate General of the Federal Republic of Germany Karachi',
    address: '92 Clifton, Block 5, Karachi, Pakistan',
    phone: '+92 21 3587 3701',
    email: 'info@karachi.diplo.de',
    website: 'https://pakistan.diplo.de/pk-en/vertretungen/generalkonsulat1',
    appointmentUrl: 'https://service2.diplo.de/rktermin/extern/choose_realmList.do?locationCode=kara&realmId=108',
    jurisdiction: 'Sindh and Balochistan Provinces',
    lastVerifiedDate: '2026-10-01',
  },
  // UAE in Pakistan
  {
    id: 'emb-ae-isb',
    representingCountryIso2: 'AE',
    hostCountryIso2: 'PK',
    city: 'Islamabad',
    type: 'EMBASSY',
    title: 'Embassy of the United Arab Emirates Islamabad',
    address: 'Diplomatic Enclave 1, Sector G-5, Islamabad, Pakistan',
    phone: '+92 51 209 9999',
    email: 'islamabademb@mofaic.gov.ae',
    website: 'https://www.mofa.gov.ae/en/Missions/Islamabad',
    appointmentUrl: 'https://smartservices.icp.gov.ae',
    jurisdiction: 'All Pakistan',
    lastVerifiedDate: '2026-10-01',
  },
  // Turkey in Pakistan
  {
    id: 'emb-tr-isb',
    representingCountryIso2: 'TR',
    hostCountryIso2: 'PK',
    city: 'Islamabad',
    type: 'EMBASSY',
    title: 'Embassy of the Republic of Türkiye Islamabad',
    address: 'Street 1, Diplomatic Enclave, Sector G-5, Islamabad, Pakistan',
    phone: '+92 51 835 5200',
    email: 'embassy.islamabad@mfa.gov.tr',
    website: 'http://islamabad.emb.mfa.gov.tr',
    appointmentUrl: 'https://www.visa.gov.tr',
    jurisdiction: 'All Pakistan (Sticker visas processed via Gerry\'s Visa Application Centers)',
    lastVerifiedDate: '2026-10-01',
  }
];

/**
 * Find official diplomatic missions representing a destination country in a host country
 */
export function getEmbassiesForPair(representingCountryIso2: string, hostCountryIso2: string): EmbassyMission[] {
  return SAMPLE_EMBASSIES.filter(
    (e) =>
      e.representingCountryIso2.toUpperCase() === representingCountryIso2.toUpperCase() &&
      e.hostCountryIso2.toUpperCase() === hostCountryIso2.toUpperCase()
  );
}

export function getEmbassiesForRoute(hostCountryIso2: string, representingCountryIso2: string): EmbassyMission[] {
  return getEmbassiesForPair(representingCountryIso2, hostCountryIso2);
}

export function searchEmbassies(query: string): EmbassyMission[] {
  if (!query.trim()) return SAMPLE_EMBASSIES;
  const q = query.trim().toLowerCase();
  return SAMPLE_EMBASSIES.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      e.address.toLowerCase().includes(q) ||
      e.jurisdiction.toLowerCase().includes(q)
  );
}

export function searchEmbassiesByCity(city: string): EmbassyMission[] {
  return searchEmbassies(city);
}
