/**
 * Hand-written guides for the Pakistan → destination travel corridors (/travel/PK/XX).
 * Deliberately avoids quoting fees, processing times or stay lengths that change often;
 * every guide points readers to the official portal instead. Shared by the React route
 * page, scripts/prerender.mjs and lib/seo/metaEngine.ts.
 */
export interface CorridorLink {
  href: string;
  label: string;
  note?: string;
}

export interface CorridorGuide {
  iso2: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  visaRoutes: { name: string; detail: string }[];
  steps: string[];
  pakistanSide: string[];
  officialLinks: CorridorLink[];
  faqs: { question: string; answer: string }[];
  studySlug?: string;
}

const PK_COMMON_STEPS: string[] = [
  'Check that your passport is valid well beyond your return date (many countries ask for at least six months) and has blank pages.',
  'Read the visa page on the official government portal linked below; ignore social-media posts and agents that promise guaranteed visas.',
  'Prepare documents as clear PDFs: passport bio page, CNIC, bank statements, employment or business proof, and bookings if required.',
  'Get a passport photo in the exact size the destination asks for, and keep file sizes within the upload limit.',
  'Apply and pay only on the official portal or at the authorised visa application centre, and keep every receipt and reference number.',
];

const PK_SIDE_COMMON: string[] = [
  'Going abroad for work? Overseas employment from Pakistan goes through the Bureau of Emigration & Overseas Employment (BE&OE) and licensed Overseas Employment Promoters. Get the protector stamp/registration before you fly; the FIA checks it at departure.',
  'Degree and document attestation (HEC, IBCC, MOFA) is often needed for work and study visas; check whether your destination also needs its own embassy attestation or an apostille.',
  'Never hand your passport or original documents to an unlicensed agent, and never pay for a "guaranteed" visa.',
];

const BEOE: CorridorLink = { href: 'https://beoe.gov.pk', label: 'Bureau of Emigration & Overseas Employment (BE&OE)', note: 'Protector registration for overseas jobs' };
const MOFA: CorridorLink = { href: 'https://mofa.gov.pk', label: 'Ministry of Foreign Affairs, Pakistan', note: 'Document attestation' };

export const PK_CORRIDOR_GUIDES: Record<string, CorridorGuide> = {
  AE: {
    iso2: 'AE',
    name: 'United Arab Emirates',
    title: 'Pakistan to UAE Visa & Travel Guide (2026): Visit & Work',
    description: 'UAE visit and work visas for Pakistani passport holders: how to apply, documents, official ICP/GDRFA portals, protector rules and free document tools.',
    intro: 'The UAE is the most common destination for Pakistani travellers and workers. Pakistani passport holders generally need a visa issued before travel. Visit visas are usually arranged through a UAE airline, a licensed travel agency, a UAE sponsor or the official federal and Dubai portals; work visas are always sponsored by the employer.',
    visaRoutes: [
      { name: 'Visit / tourist visa', detail: 'Short-stay visa for tourism or visiting family, applied for before travel through an approved channel or a UAE-resident sponsor.' },
      { name: 'Employment (work) visa', detail: 'Sponsored by the UAE employer, who obtains the entry permit; you then complete the medical test, Emirates ID and residence stamping after arrival.' },
      { name: 'Family / residence visa', detail: 'Sponsored by a UAE resident family member who meets the salary and housing conditions.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://icp.gov.ae', label: 'Federal Authority for Identity, Citizenship, Customs & Port Security (ICP)', note: 'Federal visas and residence' },
      { href: 'https://gdrfad.gov.ae', label: 'GDRFA Dubai', note: 'Dubai visas and residence' },
      { href: 'https://u.ae', label: 'UAE government portal (u.ae)', note: 'Official overview of visa types' },
      BEOE,
    ],
    faqs: [
      { question: 'Do Pakistanis get a UAE visa on arrival?', answer: 'In general, no: Pakistani passport holders should have a visa issued before travel. Rules can differ for people holding certain residence permits or visas from other countries, so check the official ICP or GDRFA portal for your situation.' },
      { question: 'Can I go to the UAE on a visit visa and look for work?', answer: 'Working on a visit visa is not allowed. If you get a job offer, the employer must arrange an employment visa. Before leaving Pakistan for work, register with the Bureau of Emigration (protector).' },
      { question: 'How do I check if a UAE visa is genuine?', answer: 'Use the visa or entry-permit verification service on the official ICP or GDRFA Dubai website. Do not rely on a PDF sent on WhatsApp alone.' },
    ],
    studySlug: 'united-arab-emirates',
  },
  SA: {
    iso2: 'SA',
    name: 'Saudi Arabia',
    title: 'Pakistan to Saudi Arabia Visa Guide (2026): Umrah, Visit, Work',
    description: 'Saudi visas for Pakistanis: Umrah via Nusuk, visit and work visas, documents, protector registration and official KSA visa portals.',
    intro: 'Pakistanis travel to Saudi Arabia mainly for Umrah, Hajj, family visits and work. Each purpose has its own visa route, and work visas always start with a Saudi employer. Tourist eVisa eligibility depends on your nationality and whether you hold certain other visas, so confirm on the official KSA visa platform before booking.',
    visaRoutes: [
      { name: 'Umrah visa', detail: 'Arranged through the official Nusuk platform or an authorised Umrah operator. Hajj is handled separately through Pakistan’s Ministry of Religious Affairs schemes.' },
      { name: 'Visit / tourist visa', detail: 'Family-visit visas are requested by the Saudi-resident relative; tourist eVisa eligibility is limited and set by the KSA visa platform.' },
      { name: 'Work visa', detail: 'Issued against a Saudi employer’s visa allocation; you complete medical tests, biometrics and protector registration in Pakistan before travel.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://visa.mofa.gov.sa', label: 'KSA Visa platform (Ministry of Foreign Affairs)', note: 'Official visa services' },
      { href: 'https://www.nusuk.sa', label: 'Nusuk', note: 'Official Umrah and visit platform' },
      { href: 'https://www.mora.gov.pk', label: 'Ministry of Religious Affairs, Pakistan', note: 'Hajj schemes' },
      BEOE,
    ],
    faqs: [
      { question: 'Can Pakistanis get a Saudi tourist eVisa?', answer: 'Eligibility is limited and changes from time to time; it often depends on holding a valid visa or residence permit from certain countries. Check the official KSA Visa platform with your own details rather than relying on agents.' },
      { question: 'How do I apply for Umrah from Pakistan?', answer: 'Use the official Nusuk platform or an authorised Umrah operator, and confirm your package, hotel and transport are registered before paying.' },
      { question: 'What do I need before leaving Pakistan on a Saudi work visa?', answer: 'A valid employment visa, completed medical test, and protector registration with the Bureau of Emigration. Keep copies of your contract and visa.' },
    ],
    studySlug: 'saudi-arabia',
  },
  GB: {
    iso2: 'GB',
    name: 'United Kingdom',
    title: 'Pakistan to UK Visa Guide (2026): Visitor, Student, Work',
    description: 'UK visas for Pakistani citizens: Standard Visitor, Student and Skilled Worker routes, how to apply on GOV.UK, documents, biometrics and free tools.',
    intro: 'Pakistani citizens need a visa for the UK. Applications are made online on GOV.UK, followed by a biometrics appointment at a visa application centre in Pakistan. The most common routes are the Standard Visitor visa, the Student visa and the Skilled Worker visa, each with its own evidence requirements.',
    visaRoutes: [
      { name: 'Standard Visitor visa', detail: 'For tourism, family visits and some business activities. You must show strong ties to Pakistan and enough funds for the trip.' },
      { name: 'Student visa', detail: 'Requires a Confirmation of Acceptance for Studies (CAS) from a licensed UK sponsor, English evidence and maintenance funds.' },
      { name: 'Skilled Worker visa', detail: 'Requires a job offer and Certificate of Sponsorship from a licensed UK employer, meeting salary and skill thresholds.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://www.gov.uk/standard-visitor', label: 'GOV.UK: Standard Visitor visa', note: 'Official rules, fees and application' },
      { href: 'https://www.gov.uk/student-visa', label: 'GOV.UK: Student visa' },
      { href: 'https://www.gov.uk/skilled-worker-visa', label: 'GOV.UK: Skilled Worker visa' },
      { href: 'https://www.gov.uk/guidance/visa-processing-times-applications-outside-the-uk', label: 'GOV.UK: visa processing times' },
    ],
    faqs: [
      { question: 'How much bank balance do I need for a UK visit visa?', answer: 'There is no fixed official amount for visitors. You must show you can pay for the trip without working or public funds, and the money should be consistent with your income history. Large unexplained deposits shortly before applying are a common refusal reason.' },
      { question: 'Can I extend a UK visit visa to study or work?', answer: 'Generally no; switching from visitor to most other routes inside the UK is not allowed. Apply for the correct visa from Pakistan.' },
      { question: 'What photo size does the UK want?', answer: 'UK applications usually take a digital photo at the biometrics appointment or upload; follow the GOV.UK photo rules. Use our passport photo tool if you need a printed photo.' },
    ],
    studySlug: 'uk',
  },
  CA: {
    iso2: 'CA',
    name: 'Canada',
    title: 'Pakistan to Canada Visa Guide (2026): Visitor, Study, Work',
    description: 'Canadian visas for Pakistanis: visitor visa (TRV), study permit and work permits through IRCC, biometrics, documents and official links.',
    intro: 'Pakistani citizens need a visitor visa (temporary resident visa) for Canada, applied for online with Immigration, Refugees and Citizenship Canada (IRCC), plus biometrics at a visa application centre. Study and work permits are separate applications with their own requirements.',
    visaRoutes: [
      { name: 'Visitor visa (TRV)', detail: 'For tourism and family visits. Officers look at ties to Pakistan, travel history, funds and the purpose of the trip.' },
      { name: 'Study permit', detail: 'Needs an acceptance letter from a Designated Learning Institution (DLI), proof of funds and, in most cases, a provincial attestation letter.' },
      { name: 'Work permit / permanent residence', detail: 'Employer-specific work permits usually need an LMIA job offer; Express Entry is the main route to permanent residence.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html', label: 'IRCC: Visit Canada', note: 'Visitor visa rules and application' },
      { href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html', label: 'IRCC: Study in Canada' },
      { href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html', label: 'IRCC: check processing times' },
    ],
    faqs: [
      { question: 'Do I need biometrics for a Canada visa from Pakistan?', answer: 'Most applicants do, at an official visa application centre after submitting online. Biometrics are usually valid for several years, so check whether yours are still valid.' },
      { question: 'Is an agent needed for a Canadian visa?', answer: 'No. You can apply yourself on the IRCC website. If you use a representative, they must be authorised (for example a licensed RCIC); check their licence.' },
      { question: 'Where can I compare Canadian study options?', answer: 'See our Study in Canada guide for admissions, documents and cost bands.' },
    ],
    studySlug: 'canada',
  },
  DE: {
    iso2: 'DE',
    name: 'Germany',
    title: 'Pakistan to Germany Visa Guide (2026): Schengen, Study, Work',
    description: 'German visas for Pakistanis: Schengen visit visa, national D visa for study and work, Opportunity Card, documents and official appointment links.',
    intro: 'Pakistani citizens need a visa for Germany. Short visits (tourism, family, business) use the Schengen C visa; study, work and job-seeking use a German national D visa. Applications go through the German Embassy in Islamabad or the Consulate General in Karachi, by appointment.',
    visaRoutes: [
      { name: 'Schengen visit visa (C)', detail: 'For short stays in the Schengen area. Requires travel insurance, bookings, financial proof and evidence of ties to Pakistan.' },
      { name: 'Student visa (D)', detail: 'Requires university admission (or conditional admission), proof of funds (often via a blocked account) and health insurance.' },
      { name: 'Work visa, EU Blue Card or Opportunity Card', detail: 'Skilled workers need a job offer and recognised qualifications; the Opportunity Card (Chancenkarte) lets qualified people come to look for work.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://pakistan.diplo.de', label: 'German Missions in Pakistan', note: 'Visa types, checklists and appointments' },
      { href: 'https://www.make-it-in-germany.com', label: 'Make it in Germany', note: 'Official portal for skilled workers' },
      { href: 'https://www.daad.de/en/', label: 'DAAD', note: 'Study and scholarships in Germany' },
    ],
    faqs: [
      { question: 'Is a blocked account required for a German student visa?', answer: 'Usually you must prove you can cover living costs, and a blocked account is the most common way. Check the current required amount on the German Missions in Pakistan website.' },
      { question: 'Can I travel to other Schengen countries on a German visa?', answer: 'A Schengen C visa issued by Germany generally lets you travel within the Schengen area, but you should apply to the country of your main stay.' },
      { question: 'Where do I book a German visa appointment in Pakistan?', answer: 'Only through the official links on the German Missions in Pakistan website. Appointment slots should never be bought from third parties.' },
    ],
    studySlug: 'germany',
  },
  QA: {
    iso2: 'QA',
    name: 'Qatar',
    title: 'Pakistan to Qatar Visa & Travel Guide (2026): Visit & Work',
    description: 'Qatar visit and work visas for Pakistani passport holders: official Hayya and Ministry of Interior portals, documents, protector rules and free tools.',
    intro: 'Pakistanis go to Qatar mostly for work and family visits. Entry rules for Pakistani passport holders have changed several times, so always check the current rules on Qatar’s official portals before booking. Work visas are sponsored by the Qatari employer.',
    visaRoutes: [
      { name: 'Visit / tourist entry', detail: 'Arranged through the Hayya platform or other official channels, depending on current rules for Pakistani passport holders.' },
      { name: 'Work visa', detail: 'Sponsored by the employer; medical checks and biometrics are completed before or after arrival depending on the process in force.' },
      { name: 'Family visit / residence', detail: 'Sponsored by a Qatar-resident family member who meets the conditions.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://www.hayya.qa', label: 'Hayya', note: 'Official visit and entry platform' },
      { href: 'https://portal.moi.gov.qa', label: 'Qatar Ministry of Interior', note: 'Visa services and inquiries' },
      { href: 'https://www.visitqatar.com', label: 'Visit Qatar', note: 'Official tourism information' },
      BEOE,
    ],
    faqs: [
      { question: 'Do Pakistanis need a visa for Qatar?', answer: 'Rules for Pakistani passport holders have changed over the years. Check the current requirement on Hayya or the Ministry of Interior portal before booking flights.' },
      { question: 'How do I verify a Qatar work visa?', answer: 'Use the visa inquiry services on the Ministry of Interior portal and confirm the employer details before paying anything.' },
    ],
    studySlug: 'qatar',
  },
  OM: {
    iso2: 'OM',
    name: 'Oman',
    title: 'Pakistan to Oman Visa & Travel Guide (2026): eVisa & Work',
    description: 'Oman visas for Pakistanis: Royal Oman Police eVisa portal, visit and work visas, sponsor rules, documents and protector registration.',
    intro: 'Oman issues visit and work visas through the Royal Oman Police (ROP) eVisa system. Some visit-visa types for Pakistani passport holders need a sponsor such as an Omani company, hotel or tour operator, so check which category you qualify for on the official portal.',
    visaRoutes: [
      { name: 'Visit visa', detail: 'Applied for through the ROP eVisa portal, sometimes requiring a sponsor depending on the category.' },
      { name: 'Employment visa', detail: 'Sponsored by the Omani employer; residence card and medical checks are completed in Oman.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://evisa.rop.gov.om', label: 'Royal Oman Police eVisa', note: 'Official visa applications' },
      { href: 'https://www.rop.gov.om', label: 'Royal Oman Police', note: 'Visa and residence rules' },
      BEOE,
    ],
    faqs: [
      { question: 'Can I apply for an Oman visa online from Pakistan?', answer: 'Yes, through the official Royal Oman Police eVisa portal, subject to the category and sponsor rules that apply to your passport.' },
      { question: 'Do I need protector registration for a job in Oman?', answer: 'Yes. Register with the Bureau of Emigration & Overseas Employment before leaving Pakistan on an employment visa.' },
    ],
    studySlug: 'oman',
  },
  US: {
    iso2: 'US',
    name: 'United States',
    title: 'Pakistan to USA Visa Guide (2026): B1/B2, Student, Interview',
    description: 'US visas for Pakistani citizens: B1/B2 visitor and F-1 student visas, DS-160, interview at Islamabad or Karachi, documents and official links.',
    intro: 'Pakistani citizens need a US visa. The process is the same for most non-immigrant visas: complete the online DS-160 form, pay the application fee, book an interview at the US Embassy in Islamabad or the Consulate General in Karachi, and attend with your documents. Interview wait times can be long, so check them before planning travel.',
    visaRoutes: [
      { name: 'B1/B2 visitor visa', detail: 'For business meetings, tourism and family visits. The interview focuses on your ties to Pakistan and the purpose of the trip.' },
      { name: 'F-1 student visa', detail: 'Requires an I-20 from a SEVP-certified school, SEVIS fee payment and proof of funds.' },
      { name: 'Work and immigrant visas', detail: 'Employment visas (such as H-1B) and immigrant visas start with a petition filed in the US.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://travel.state.gov/content/travel/en/us-visas.html', label: 'U.S. Department of State: visas', note: 'Official rules and fees' },
      { href: 'https://ceac.state.gov/genniv/', label: 'DS-160 online form (CEAC)' },
      { href: 'https://pk.usembassy.gov/visas/', label: 'U.S. Embassy & Consulates in Pakistan: visas' },
    ],
    faqs: [
      { question: 'What photo size is needed for a US visa?', answer: 'The US asks for a square photo, 2 x 2 inches (51 x 51 mm), with specific background and head-size rules. Our passport photo maker has a US preset.' },
      { question: 'How long is the US visa interview wait in Pakistan?', answer: 'It varies a lot. Check the current estimate on the State Department’s appointment wait-time page before booking anything non-refundable.' },
    ],
    studySlug: 'usa',
  },
  TR: {
    iso2: 'TR',
    name: 'Türkiye (Turkey)',
    title: 'Pakistan to Turkey Visa Guide (2026): e-Visa & Sticker Visa',
    description: 'Turkey visas for Pakistanis: who can use the conditional e-Visa, sticker visa via the embassy, documents, official links and free document tools.',
    intro: 'Pakistani citizens need a visa for Türkiye. Some travellers who already hold a valid visa or residence permit from certain countries (such as the US, UK, Ireland or a Schengen state) may qualify for the conditional e-Visa; everyone else applies for a sticker visa through the Turkish missions in Pakistan.',
    visaRoutes: [
      { name: 'Conditional e-Visa', detail: 'Online, only for applicants who meet the extra conditions shown on the official e-Visa site.' },
      { name: 'Sticker visa', detail: 'Applied for through the Turkish Embassy or Consulates in Pakistan or their authorised application centre, with bookings, bank statements and employment proof.' },
      { name: 'Student and work visas', detail: 'Need an admission letter or work permit approval first; apply through the Turkish mission.' },
    ],
    steps: PK_COMMON_STEPS,
    pakistanSide: PK_SIDE_COMMON,
    officialLinks: [
      { href: 'https://www.evisa.gov.tr', label: 'Republic of Türkiye e-Visa', note: 'Official e-Visa and eligibility check' },
      { href: 'https://www.mfa.gov.tr', label: 'Türkiye Ministry of Foreign Affairs', note: 'Visa information' },
      { href: 'https://www.turkiyeburslari.gov.tr', label: 'Türkiye Burslari scholarships' },
    ],
    faqs: [
      { question: 'Can Pakistanis get a Turkey e-Visa?', answer: 'Only if they meet the conditions on the official e-Visa site, typically holding a valid visa or residence permit from certain countries. Otherwise apply for a sticker visa.' },
      { question: 'Avoid fake e-Visa sites', answer: 'The only official e-Visa site is evisa.gov.tr. Look-alike sites charge extra fees.' },
    ],
    studySlug: 'turkey',
  },
};

export const PK_CORRIDOR_CODES = Object.keys(PK_CORRIDOR_GUIDES);

export function getCorridorGuide(nat: string, dest: string): CorridorGuide | undefined {
  if (!nat || !dest || nat.toUpperCase() !== 'PK') return undefined;
  return PK_CORRIDOR_GUIDES[dest.toUpperCase()];
}

/** Free ToolVerse tools useful for any visa file. */
export const CORRIDOR_TOOLS: CorridorLink[] = [
  { href: '/tools/passport-photo-maker', label: 'Passport Photo Maker', note: 'visa photos in country presets' },
  { href: '/passport-photos', label: 'Passport photo size hub', note: 'sizes by country' },
  { href: '/tools/compress-image-target-size', label: 'Compress image to a target size', note: 'meet portal upload limits' },
  { href: '/tools/pdf-merge', label: 'Merge PDF', note: 'one PDF for bank statements or transcripts' },
  { href: '/tools/pdf-compress', label: 'Compress PDF', note: 'shrink scans before upload' },
  { href: '/tools/jpg-to-pdf', label: 'JPG to PDF', note: 'turn phone scans into a PDF' },
  { href: '/cv-maker', label: 'CV Maker', note: 'for work visas and job offers' },
];
