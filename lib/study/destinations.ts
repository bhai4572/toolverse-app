/**
 * Study-abroad destination guides for Tier-1 markets.
 * Honest ranges + official portals only — no invented university rankings DB.
 */

export type StudySlug = 'usa' | 'uk' | 'canada' | 'australia' | 'new-zealand' | 'europe';

export interface StudyLink {
  label: string;
  href: string;
  note?: string;
  external?: boolean;
}

export interface StudyFaq {
  question: string;
  answer: string;
}

export interface StudyDestination {
  slug: StudySlug;
  name: string;
  flag: string;
  title: string;
  description: string;
  keywords: string[];
  answerFirst: string;
  overview: string;
  pathways: { title: string; body: string }[];
  documents: string[];
  feeYearNote: string;
  feeRanges: { label: string; range: string; note?: string }[];
  visaSummary: string;
  officialLinks: StudyLink[];
  portals: StudyLink[];
  fields: { name: string; why: string }[];
  faqs: StudyFaq[];
  tools: StudyLink[];
  travelHref?: string;
  regionHubHref?: string;
}

const SHARED_TOOLS: StudyLink[] = [
  { href: '/tools/gpa-calculator', label: 'GPA Calculator' },
  { href: '/tools/passport-photo-maker', label: 'Passport Photo Maker' },
  { href: '/passport-photos', label: 'Passport size hub' },
  { href: '/tools/pdf-merge', label: 'Merge application PDFs' },
  { href: '/tools/pdf-compress', label: 'Compress PDF' },
  { href: '/tools/word-counter', label: 'Word / essay counter' },
  { href: '/tools/images-to-pdf', label: 'Images to PDF' },
  { href: '/immigration', label: 'Immigration hub' },
  { href: '/travel', label: 'Visa & travel routes' },
];

const FEE_DISCLAIMER =
  'Ranges are approximate international-student bands for planning only (roughly 2024–2026 market norms). They are not official quotes, not financial advice, and not university-specific. Always verify tuition, living-cost estimates, and visa funds on the institution and government sites linked below.';

export const STUDY_DESTINATIONS: Record<StudySlug, StudyDestination> = {
  usa: {
    slug: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    title: 'Study in USA — Admission Paths, Documents, Fees & F-1 Visa Overview | ToolVerse',
    description:
      'How studying in the USA works: undergrad/grad pathways, typical documents, honest cost ranges, F-1/SEVIS overview, and official portals (Common App, EducationUSA). Free application tools.',
    keywords: [
      'study in usa',
      'usa university admission',
      'f1 visa documents',
      'us college fees international students',
      'common app',
    ],
    answerFirst:
      'Studying in the USA usually means applying directly to universities (often via Common App for undergrad), receiving an I-20, paying the SEVIS fee, then applying for an F-1 student visa. Tuition for international students commonly runs from roughly $25,000–$55,000+ USD per year at many public/private institutions, with living costs often $12,000–$25,000+ depending on city — always verify on the school and Study in the States / EducationUSA pages.',
    overview:
      'The US higher-education system is decentralized: each university sets its own admissions, deadlines, and fees. There is no single national “ranking list” you must follow. Strong applications combine academic records, English proof (when required), essays/recommendations, and clear funding evidence for the visa interview. Community colleges, state universities, and private research universities are different institution types — compare programs and costs on official school sites, not third-party league tables alone.',
    pathways: [
      {
        title: 'Undergraduate (bachelor’s)',
        body: 'Many students apply through the Common Application or school-specific portals for first-year or transfer entry. Typical pieces: secondary transcripts, English test (TOEFL/IELTS/Duolingo if required), personal essay, recommendations, and sometimes SAT/ACT (often optional — check each school). Deadlines often fall months before the start term.',
      },
      {
        title: 'Graduate (master’s / PhD)',
        body: 'Apply via each university’s graduate portal. Expect transcripts, statement of purpose, CV, recommendations, and program-specific tests (GRE/GMAT) only when listed. Funding (assistantships, scholarships) is competitive and program-dependent — never assume a stipend.',
      },
      {
        title: 'Pathway / English / community college',
        body: 'Some students start at a community college or English pathway, then transfer. Confirm transfer articulation and visa status continuity with the school’s international office before you rely on this route.',
      },
    ],
    documents: [
      'Valid passport (with blank visa pages)',
      'Academic transcripts and degree certificates (certified translations if not in English)',
      'English proficiency score report (if the school requires one)',
      'Admission letter / Form I-20 from a SEVP-certified school',
      'SEVIS I-901 fee payment receipt',
      'DS-160 confirmation and visa appointment documents',
      'Proof of funds covering tuition + living costs for at least the first year (bank statements, sponsor letters, scholarships)',
      'Passport-style photos matching US visa / school specs',
      'CV, essays, and recommendation letters (as required by the program)',
    ],
    feeYearNote: FEE_DISCLAIMER,
    feeRanges: [
      { label: 'Tuition (many public universities, international)', range: '≈ $25,000–$45,000 USD / year', note: 'Out-of-state/international rates; flagship campuses can be higher.' },
      { label: 'Tuition (many private universities)', range: '≈ $40,000–$70,000+ USD / year', note: 'List price before scholarships; STEM/MBA can exceed this.' },
      { label: 'Living costs (housing, food, transport, insurance)', range: '≈ $12,000–$25,000+ USD / year', note: 'Coastal metros and NYC/SF are at the top end.' },
      { label: 'One-time visa / SEVIS-related fees', range: 'Hundreds of USD (varies)', note: 'Confirm current SEVIS I-901 and consular fees on official sites.' },
    ],
    visaSummary:
      'Most full-time degree students use the F-1 visa after a SEVP-certified school issues an I-20. You pay the SEVIS fee, complete DS-160, attend a consular interview, and maintain full-time enrollment and status rules (including work limits). Rules change — use Study in the States and your school DSO as the source of truth, not blog summaries.',
    officialLinks: [
      { label: 'Study in the States (DHS)', href: 'https://studyinthestates.dhs.gov/', external: true, note: 'SEVP / F-1 overview' },
      { label: 'EducationUSA', href: 'https://educationusa.state.gov/', external: true, note: 'US advising network' },
      { label: 'SEVIS I-901 fee', href: 'https://www.fmjfee.com/', external: true },
      { label: 'US visa info (travel.state.gov)', href: 'https://travel.state.gov/content/travel/en/us-visas/study.html', external: true },
    ],
    portals: [
      { label: 'Common App', href: 'https://www.commonapp.org/', external: true, note: 'Undergraduate applications to many colleges' },
      { label: 'School graduate portals', href: 'https://educationusa.state.gov/', external: true, note: 'Apply per university — no single national grad portal' },
    ],
    fields: [
      { name: 'Computer science & engineering', why: 'Large research universities and industry hubs; check OPT/STEM OPT rules on official sites.' },
      { name: 'Business & management', why: 'Wide MBA/MS options; costs are often at the high end of ranges above.' },
      { name: 'Health & life sciences', why: 'Strong labs and clinical pathways — licensing is separate from the student visa.' },
      { name: 'Arts, design & media', why: 'Portfolio-driven admissions at specialized schools and university departments.' },
    ],
    faqs: [
      {
        question: 'Do I need the SAT or ACT to study in the USA?',
        answer:
          'Many universities are test-optional or test-flexible. Check each school’s international admissions page for the term you are applying to — do not assume a national rule.',
      },
      {
        question: 'What is the difference between tuition and the amount on an I-20?',
        answer:
          'The I-20 lists estimated costs the school expects you to show funding for (tuition + living + insurance estimates). Actual billed tuition can differ after scholarships or course load — confirm with the international office.',
      },
      {
        question: 'Can I work on an F-1 visa?',
        answer:
          'On-campus work is limited; off-campus work usually requires authorization (CPT/OPT). Rules are strict — follow your DSO and Study in the States guidance.',
      },
      {
        question: 'Where should I verify fees?',
        answer:
          'On the university’s official tuition page for international students and the funding section of your I-20 instructions. ToolVerse ranges are planning bands only.',
      },
    ],
    tools: [
      ...SHARED_TOOLS,
      { href: '/us', label: 'US tools hub' },
      { href: '/tools/us-paycheck-calculator', label: 'US paycheck estimator (lite)' },
    ],
    travelHref: '/travel/PK/US',
    regionHubHref: '/us',
  },

  uk: {
    slug: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    title: 'Study in UK — UCAS, Documents, Fees & Student Visa Overview | ToolVerse',
    description:
      'How studying in the UK works: UCAS undergrad paths, postgraduate applications, typical documents, honest fee ranges, and Student visa overview with GOV.UK / UCAS links.',
    keywords: [
      'study in uk',
      'ucas admission',
      'uk student visa documents',
      'uk university fees international',
      'study in england scotland',
    ],
    answerFirst:
      'Undergraduate entry to most UK universities goes through UCAS; master’s/PhD applications usually go to each university. After an unconditional offer and CAS, most international students apply for a UK Student visa on GOV.UK. International tuition often falls roughly £12,000–£38,000+ per year (medicine and London often higher), with living costs commonly £9,000–£15,000+ outside vs inside London — verify on UCAS, the university, and GOV.UK.',
    overview:
      'UK degrees are typically three years in England/Wales/Northern Ireland (often four in Scotland for undergrad). Admissions emphasize predicted/achieved grades, personal statement, and sometimes interviews or admissions tests for competitive courses. Scotland, England, Wales, and Northern Ireland share the Student visa framework but have distinct university systems — always read the course page for the campus you want.',
    pathways: [
      {
        title: 'Undergraduate via UCAS',
        body: 'Create a UCAS Hub account, choose up to the allowed number of choices, submit a personal statement and reference, and track offers. Some courses (medicine, Oxbridge, etc.) have earlier deadlines and extra tests — follow UCAS and course pages.',
      },
      {
        title: 'Postgraduate',
        body: 'Apply on university portals with transcripts, references, CV, and a statement. English scores (IELTS/TOEFL/PTE or equivalent) are required unless you qualify for an exemption listed by the school.',
      },
      {
        title: 'Foundation / pathway',
        body: 'Foundation or pre-master’s programs exist when your current qualifications do not map directly. Confirm progression guarantees in writing with the provider.',
      },
    ],
    documents: [
      'Valid passport',
      'CAS (Confirmation of Acceptance for Studies) from a licensed sponsor',
      'Academic transcripts and certificates',
      'English language evidence (as required)',
      'Proof of funds meeting GOV.UK maintenance rules for your course location',
      'TB test certificate if required for your nationality',
      'ATAS certificate if your course/subject requires it',
      'Passport photos for visa/biometrics as instructed',
      'Translation of documents not in English',
    ],
    feeYearNote: FEE_DISCLAIMER,
    feeRanges: [
      { label: 'International undergrad tuition (many courses)', range: '≈ £12,000–£28,000 / year', note: 'Classroom-based subjects often mid-band; lab courses higher.' },
      { label: 'International postgrad taught (many courses)', range: '≈ £14,000–£35,000+ / year', note: 'MBA/medicine/clinical can be substantially higher.' },
      { label: 'Living costs (outside London, planning band)', range: '≈ £9,000–£12,000+ / year', note: 'GOV.UK publishes monthly maintenance figures used for visas — use those for applications.' },
      { label: 'Living costs (London, planning band)', range: '≈ £12,000–£15,000+ / year', note: 'Rent drives most of the gap.' },
    ],
    visaSummary:
      'The UK Student visa is applied for online on GOV.UK after you have a CAS. You must meet maintenance (funds) rules, credibility checks, and biometrics requirements. Work rights during term are limited (commonly up to a set weekly hours for degree students — confirm current GOV.UK text). Do not rely on agents alone; the Home Office pages are authoritative.',
    officialLinks: [
      { label: 'UK Student visa (GOV.UK)', href: 'https://www.gov.uk/student-visa', external: true },
      { label: 'UCAS', href: 'https://www.ucas.com/', external: true, note: 'Undergraduate applications' },
      { label: 'UKCISA advice', href: 'https://www.ukcisa.org.uk/', external: true, note: 'Independent student advice overview' },
      { label: 'Register of licensed sponsors', href: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students', external: true },
    ],
    portals: [
      { label: 'UCAS Hub', href: 'https://www.ucas.com/', external: true, note: 'Primary undergrad route' },
      { label: 'University course pages', href: 'https://www.ucas.com/explore/search/providers', external: true, note: 'Find providers, then apply postgrad on school sites' },
    ],
    fields: [
      { name: 'Business, finance & economics', why: 'London and major cities concentrate employers; living costs rise accordingly.' },
      { name: 'Engineering & computing', why: 'One-year taught master’s options are common — confirm lab/placement terms.' },
      { name: 'Law, social sciences & humanities', why: 'UCAS personal statement and grades carry heavy weight.' },
      { name: 'Medicine & allied health', why: 'Earlier deadlines, interviews, and higher fees — verify NHS/clinical placement rules separately.' },
    ],
    faqs: [
      {
        question: 'Is UCAS required for master’s degrees?',
        answer:
          'Usually no. Most postgraduate taught and research programs use university application portals. UCAS is the main undergrad route.',
      },
      {
        question: 'What is a CAS?',
        answer:
          'A Confirmation of Acceptance for Studies is issued by a licensed student sponsor after you accept an offer and meet their conditions. You need it for the Student visa application.',
      },
      {
        question: 'How much money must I show for a UK Student visa?',
        answer:
          'GOV.UK sets maintenance amounts based on study location and course length. Use the current GOV.UK Student visa page — do not use ToolVerse living-cost bands as visa evidence.',
      },
      {
        question: 'Are scholarships guaranteed?',
        answer:
          'No. University, Chevening, Commonwealth, and other schemes are competitive and have separate deadlines. Apply on official scholarship sites only.',
      },
    ],
    tools: [
      ...SHARED_TOOLS,
      { href: '/uk', label: 'UK tools hub' },
      { href: '/tools/uk-take-home-pay-calculator', label: 'UK take-home pay (lite)' },
      { href: '/tools/vat-gst-calculator', label: 'VAT calculator' },
    ],
    travelHref: '/travel/PK/GB',
    regionHubHref: '/uk',
  },

  canada: {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    title: 'Study in Canada — Admission, Documents, Fees & Study Permit Overview | ToolVerse',
    description:
      'How studying in Canada works: college/university pathways, typical documents, honest fee ranges, study permit overview, and IRCC / EduCanada official links.',
    keywords: [
      'study in canada',
      'canada study permit',
      'canadian university admission',
      'canada tuition international students',
      'IRCC study permit documents',
    ],
    answerFirst:
      'To study in Canada you typically get an offer from a designated learning institution (DLI), prove funds, then apply for a study permit through IRCC (often with biometrics). International undergrad tuition commonly falls around CAD $15,000–$40,000+ per year, with living costs often CAD $15,000–$25,000+ depending on city — verify on the school and Canada.ca / EduCanada.',
    overview:
      'Canada’s system includes universities, colleges, and CEGEPs (Québec). Provinces set education frameworks; immigration is federal (IRCC). “College” in Canada often means applied diploma/certificate pathways, not only university. Always confirm the school is a DLI and whether your program length supports a post-graduation work permit (PGWP) under current IRCC rules.',
    pathways: [
      {
        title: 'Undergraduate university',
        body: 'Apply via university portals or provincial application services where they exist (e.g. OUAC in Ontario for many undergrad programs). Requirements usually include secondary grades, English/French proof, and sometimes program supplements.',
      },
      {
        title: 'College / diploma',
        body: 'Colleges offer career-focused diplomas and certificates. Check DLI status, co-op work terms, and PGWP eligibility for that exact program on IRCC before paying deposits.',
      },
      {
        title: 'Graduate studies',
        body: 'Master’s and PhD applications go to graduate faculties with research/supervisor fit mattering for thesis programs. Funding packages vary widely — read offer letters carefully.',
      },
    ],
    documents: [
      'Valid passport',
      'Letter of acceptance from a DLI',
      'Provincial attestation letter (PAL/TAL) if IRCC requires it for your situation — check current Canada.ca rules',
      'Proof of funds (tuition + living + travel) in formats IRCC accepts',
      'Academic transcripts and credentials',
      'Language test results (IELTS/CELPIP/TEF, etc.) if required',
      'Statement of purpose / study plan (common for visa files)',
      'Passport photos and biometrics appointment docs',
      'Medical exam if requested by IRCC',
    ],
    feeYearNote: FEE_DISCLAIMER,
    feeRanges: [
      { label: 'International undergrad tuition (many programs)', range: '≈ CAD $15,000–$40,000 / year', note: 'Varies heavily by province and program.' },
      { label: 'International graduate tuition (many programs)', range: '≈ CAD $15,000–$45,000+ / year', note: 'MBA and professional programs can be higher.' },
      { label: 'Living costs (planning band)', range: '≈ CAD $15,000–$25,000+ / year', note: 'Toronto/Vancouver sit at the high end; IRCC publishes proof-of-funds figures — use those for applications.' },
      { label: 'Study permit / biometrics fees', range: 'Set by IRCC (hundreds CAD)', note: 'Confirm on Canada.ca fee list.' },
    ],
    visaSummary:
      'A study permit is permission to study in Canada; it is not the same as a visitor visa/eTA, though you may need both entry documents depending on nationality. Apply through IRCC with acceptance, funds, and identity documents. Processing times and PAL rules change — only Canada.ca is authoritative. Working on/off campus has hour caps and eligibility conditions.',
    officialLinks: [
      { label: 'Study permit (IRCC / Canada.ca)', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html', external: true },
      { label: 'EduCanada', href: 'https://www.educanada.ca/', external: true, note: 'Official study-in-Canada information' },
      { label: 'DLI list', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html', external: true },
      { label: 'IRCC account', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html', external: true },
    ],
    portals: [
      { label: 'OUAC (Ontario undergrad)', href: 'https://www.ouac.on.ca/', external: true, note: 'Many Ontario university undergrad applications' },
      { label: 'ApplyAlberta / EducationPlannerBC / others', href: 'https://www.educanada.ca/', external: true, note: 'Use EduCanada or provincial portals for your province' },
    ],
    fields: [
      { name: 'IT, AI & engineering', why: 'Strong college and university pipelines; co-op terms are common — confirm work authorization.' },
      { name: 'Health care & nursing', why: 'Licensing is provincial and separate from the study permit.' },
      { name: 'Business & hospitality', why: 'College diplomas and university degrees both popular; check PGWP rules per program.' },
      { name: 'Natural resources & environment', why: 'Regional strengths in several provinces; research faculty fit for grad study.' },
    ],
    faqs: [
      {
        question: 'What is a DLI?',
        answer:
          'A Designated Learning Institution is a school approved by a province/territory to host international students. Your acceptance should show a DLI number for the study permit.',
      },
      {
        question: 'Is a study permit the same as a visa?',
        answer:
          'No. The study permit authorizes study; you may also need a visitor visa or eTA to enter Canada. IRCC explains both on Canada.ca.',
      },
      {
        question: 'Can I work while studying?',
        answer:
          'Eligible full-time students at DLIs may work limited hours under current IRCC rules. Caps and eligibility change — read the official “work while studying” page before accepting a job.',
      },
      {
        question: 'Where do I verify tuition?',
        answer:
          'On the university or college’s international fees page for your intake year. ToolVerse CAD ranges are planning bands only.',
      },
    ],
    tools: [
      ...SHARED_TOOLS,
      { href: '/ca', label: 'Canada tools hub' },
      { href: '/tools/canada-paycheque-calculator', label: 'Canada paycheque (lite)' },
      { href: '/tools/vat-gst-calculator', label: 'GST/HST calculator' },
    ],
    travelHref: '/travel/PK/CA',
    regionHubHref: '/ca',
  },

  australia: {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    title: 'Study in Australia — Admission, Documents, Fees & Student Visa 500 Overview | ToolVerse',
    description:
      'How studying in Australia works: university pathways, typical documents, honest fee ranges, subclass 500 overview, and Study Australia / Home Affairs official links.',
    keywords: [
      'study in australia',
      'australia student visa 500',
      'australian university admission',
      'australia tuition international',
      'study australia documents',
    ],
    answerFirst:
      'Studying in Australia usually means a direct offer from a CRICOS-registered provider, meeting Genuine Student and funds requirements, then applying for a Student visa (subclass 500) via Home Affairs. International tuition often sits around AUD $20,000–$45,000+ per year for many coursework degrees, with living costs commonly AUD $21,000+ as a planning floor — verify on Study Australia and Home Affairs.',
    overview:
      'Australia’s universities and vocational (VET) providers are regulated with CRICOS registration for international delivery. Admissions look at academic equivalence, English scores, and sometimes portfolios or interviews. Cities differ sharply in rent; regional campuses can be cheaper to live in but have fewer industry networks — weigh both on official course pages.',
    pathways: [
      {
        title: 'Undergraduate',
        body: 'Apply directly to universities or through authorized channels listed by the school. Packaged offers (foundation → degree) appear when you need a pathway year.',
      },
      {
        title: 'Postgraduate coursework / research',
        body: 'Coursework master’s applications are portal-based; research degrees need supervisor alignment and a research proposal. Scholarships (e.g. RTP) are competitive.',
      },
      {
        title: 'VET / TAFE',
        body: 'Vocational programs can lead to skilled pathways in some fields, but visa and migration outcomes are not guaranteed — separate skilled-migration rules apply after study.',
      },
    ],
    documents: [
      'Valid passport',
      'Confirmation of Enrolment (CoE) from a CRICOS provider',
      'Academic transcripts and completion certificates',
      'English test results (IELTS/PTE/TOEFL, etc.) as required',
      'Genuine Student statement / evidence as Home Affairs requires',
      'Proof of funds / GTE-supporting financial documents',
      'Overseas Student Health Cover (OSHC) arrangements',
      'Passport photos and biometrics if requested',
      'Health examinations if Immigrations asks',
    ],
    feeYearNote: FEE_DISCLAIMER,
    feeRanges: [
      { label: 'International undergrad tuition (many degrees)', range: '≈ AUD $20,000–$45,000 / year', note: 'Medicine, veterinary, and some STEM exceed this.' },
      { label: 'International postgraduate coursework', range: '≈ AUD $22,000–$50,000+ / year', note: 'Business/MBA often at the high end.' },
      { label: 'Living costs (planning band)', range: '≈ AUD $21,000+ / year', note: 'Home Affairs publishes funds guidance — use official figures for visa files.' },
      { label: 'OSHC (health cover)', range: 'Hundreds–thousands AUD / year', note: 'Length-dependent; buy from approved providers.' },
    ],
    visaSummary:
      'Subclass 500 is the main student visa. You generally need a CoE, meet the Genuine Student requirement, hold OSHC, and show funds. Work-hour caps during study periods are set by Home Affairs and can change. Apply through ImmiAccount; agent use is optional — you remain responsible for accurate information.',
    officialLinks: [
      { label: 'Student visa subclass 500 (Home Affairs)', href: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', external: true },
      { label: 'Study Australia', href: 'https://www.studyaustralia.gov.au/', external: true },
      { label: 'CRICOS', href: 'https://cricos.education.gov.au/', external: true, note: 'Registered courses/providers' },
      { label: 'ImmiAccount', href: 'https://online.immi.gov.au/', external: true },
    ],
    portals: [
      { label: 'University application portals', href: 'https://www.studyaustralia.gov.au/en/plan-your-studies/find-a-course-and-institution', external: true, note: 'Find courses, then apply on provider sites' },
      { label: 'Study Australia course search', href: 'https://www.studyaustralia.gov.au/', external: true },
    ],
    fields: [
      { name: 'IT, data & engineering', why: 'Strong coursework master’s market; check professional accreditation if you need it for work later.' },
      { name: 'Health & nursing', why: 'Clinical placements and AHPRA registration are separate processes.' },
      { name: 'Business & accounting', why: 'Popular among internationals; living costs in Sydney/Melbourne are high.' },
      { name: 'Environmental & agricultural sciences', why: 'Regional campus strengths; confirm campus location before accepting.' },
    ],
    faqs: [
      {
        question: 'What is a CoE?',
        answer:
          'A Confirmation of Enrolment is issued by your CRICOS provider after you accept an offer and pay any required deposit. Home Affairs uses it for the Student visa.',
      },
      {
        question: 'Do I need OSHC?',
        answer:
          'Yes, Student visa holders generally must maintain Overseas Student Health Cover for the visa duration. Buy from an approved insurer as instructed in your offer/visa grant.',
      },
      {
        question: 'Can I work on a Student visa?',
        answer:
          'Work rights exist with hour limits during scheduled course sessions under current Home Affairs rules. Always check the latest official page before working.',
      },
      {
        question: 'Are migration outcomes guaranteed after study?',
        answer:
          'No. Post-study work visas and skilled migration are separate, points-tested systems. Studying does not automatically grant permanent residency.',
      },
    ],
    tools: [
      ...SHARED_TOOLS,
      { href: '/au', label: 'Australia tools hub' },
      { href: '/tools/australia-pay-calculator', label: 'Australia PAYG (lite)' },
      { href: '/tools/vat-gst-calculator', label: 'GST calculator' },
    ],
    travelHref: '/travel/PK/AU',
    regionHubHref: '/au',
  },

  'new-zealand': {
    slug: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    title: 'Study in New Zealand — Admission, Documents, Fees & Student Visa Overview | ToolVerse',
    description:
      'How studying in New Zealand works: university/ITP pathways, typical documents, honest fee ranges, student visa overview, and Immigration NZ / Study with NZ official links.',
    keywords: [
      'study in new zealand',
      'new zealand student visa',
      'nz university admission',
      'new zealand tuition international',
      'study with new zealand',
    ],
    answerFirst:
      'Studying in New Zealand means an offer from an approved provider, then a student visa through Immigration New Zealand (often online). International tuition for many bachelor’s/master’s programs falls roughly NZD $22,000–$40,000+ per year, with living costs often NZD $15,000–$25,000+ — verify on Study with New Zealand and Immigration NZ.',
    overview:
      'New Zealand’s universities are research-focused; Te Pūkenga / institutes of technology and private training establishments cover applied learning. The sector is smaller than the US/UK, which can mean clearer campus communities but fewer program niches. Admissions emphasize academic equivalence and English proficiency; some programs need portfolios or interviews.',
    pathways: [
      {
        title: 'Undergraduate',
        body: 'Apply on university portals with secondary qualifications assessed against NZ entrance standards (or foundation pathways if needed).',
      },
      {
        title: 'Postgraduate',
        body: 'Taught master’s and research degrees use faculty portals. Research applicants should contact supervisors early with a clear proposal.',
      },
      {
        title: 'Pathway / English',
        body: 'English language and foundation programs can package into degrees. Confirm progression conditions in the offer letter.',
      },
    ],
    documents: [
      'Valid passport',
      'Offer of place from an approved education provider',
      'Evidence of tuition payment or funds as Immigration NZ requires',
      'Living-cost funds evidence',
      'Academic transcripts and certificates',
      'English language results if required',
      'Medical / chest X-ray / police certificates when requested',
      'Passport photos meeting Immigration NZ specs',
      'Return travel funds or onward ticket evidence if asked',
    ],
    feeYearNote: FEE_DISCLAIMER,
    feeRanges: [
      { label: 'International undergrad tuition (many degrees)', range: '≈ NZD $22,000–$38,000 / year', note: 'Specialist degrees can be higher.' },
      { label: 'International postgraduate (many programs)', range: '≈ NZD $25,000–$45,000+ / year', note: 'Verify per faculty.' },
      { label: 'Living costs (planning band)', range: '≈ NZD $15,000–$25,000+ / year', note: 'Auckland is typically the most expensive city.' },
      { label: 'Student visa fees', range: 'Set by Immigration NZ', note: 'Check the current fee finder on immigration.govt.nz.' },
    ],
    visaSummary:
      'Immigration New Zealand issues student visas for full-time study at approved providers. You must show an offer, funds, and intent consistent with study. Work rights (hours during study / full-time in scheduled breaks) follow the visa conditions printed on your label/eVisa — read them. Pathways to work visas after study exist but are not automatic.',
    officialLinks: [
      { label: 'Immigration New Zealand — student visa', href: 'https://www.immigration.govt.nz/new-zealand-visas/visas/visa/student-visa', external: true },
      { label: 'Study with New Zealand', href: 'https://www.studywithnewzealand.govt.nz/', external: true },
      { label: 'NZQA (qualifications)', href: 'https://www.nzqa.govt.nz/', external: true },
      { label: 'Universities New Zealand', href: 'https://www.universitiesnz.ac.nz/', external: true, note: 'Sector overview for the eight universities' },
    ],
    portals: [
      { label: 'Study with NZ course search', href: 'https://www.studywithnewzealand.govt.nz/', external: true },
      { label: 'University portals', href: 'https://www.universitiesnz.ac.nz/universities', external: true, note: 'Apply on each university’s site' },
    ],
    fields: [
      { name: 'Agriculture, environment & earth sciences', why: 'National research strengths; check campus location (not always Auckland).' },
      { name: 'IT & engineering', why: 'Growing coursework master’s options; confirm internship terms.' },
      { name: 'Tourism & hospitality', why: 'Applied programs via institutes; migration outcomes are separate.' },
      { name: 'Health sciences', why: 'Clinical registration is a separate professional process.' },
    ],
    faqs: [
      {
        question: 'How many universities does New Zealand have?',
        answer:
          'There are eight universities plus institutes of technology/polytechnics and other approved providers. Use Study with New Zealand and NZQA to confirm approval — ToolVerse does not publish a scraped rankings database.',
      },
      {
        question: 'Can I work on a NZ student visa?',
        answer:
          'Many student visas allow limited part-time work during the academic year and full-time in scheduled breaks, but conditions vary. Read your visa and Immigration NZ pages.',
      },
      {
        question: 'Is English testing always required?',
        answer:
          'Providers set English requirements. Prior study in English may waive a test — only the offer letter/provider policy counts.',
      },
      {
        question: 'Where do I verify living-cost amounts for the visa?',
        answer:
          'On Immigration New Zealand’s student visa funds requirements for your application date. ToolVerse NZD bands are planning figures only.',
      },
    ],
    tools: SHARED_TOOLS,
    travelHref: undefined,
    regionHubHref: undefined,
  },

  europe: {
    slug: 'europe',
    name: 'Europe',
    flag: '🇪🇺',
    title: 'Study in Europe — Admission Paths, Documents, Fees & Visa Overview | ToolVerse',
    description:
      'How studying in Europe works at a high level: national portals, Bologna bachelor/master paths, typical documents, honest fee patterns by country type, and official Study in Europe links.',
    keywords: [
      'study in europe',
      'european university admission',
      'erasmus',
      'europe student visa',
      'tuition fees europe international students',
    ],
    answerFirst:
      '“Study in Europe” is not one system: each country (and often each university) sets admissions, fees, and visas. Many public universities in Germany, Norway, and some other countries charge low or no tuition (admin fees still apply), while the Netherlands, France, Ireland, and others charge moderate-to-high international fees. Apply via national portals (e.g. uni-assist, Studielink, Campus France) or university sites, then follow that country’s student-residence process — use Study in Europe and national immigration sites.',
    overview:
      'The Bologna Process aligns bachelor’s (usually 3 years) and master’s (usually 1–2 years) structures across much of Europe, but language of instruction, numerus clausus, and fees differ. English-taught programs are common in the Netherlands, Germany, Nordics, and increasingly elsewhere — still confirm language requirements per program. The UK and Ireland are covered partly here for geographic search intent; detailed UK guidance lives on our UK page.',
    pathways: [
      {
        title: 'Bachelor’s (Bologna first cycle)',
        body: 'Apply through national application services or university portals with secondary diplomas recognized for university entrance. Some countries use centralized ranking/selection; others are university-direct.',
      },
      {
        title: 'Master’s / PhD',
        body: 'Master’s admissions check bachelor equivalence and ECTS alignment. PhD routes may be structured programs or individual supervisor contracts — especially in Germany and Nordics.',
      },
      {
        title: 'Exchange / Erasmus+',
        body: 'Short-term mobility usually goes through your home university’s international office, not a fresh degree admission. Degree-seeking students still need a national residence permit for stays beyond visitor limits.',
      },
    ],
    documents: [
      'Valid passport',
      'Secondary or bachelor diploma + transcripts (sworn translations if required)',
      'Proof of language proficiency (English and/or local language)',
      'Motivation letter / CV / references as the program asks',
      'APS or credential verification where required (e.g. some German pathways)',
      'Proof of funds / blocked account / scholarship letters for the visa/residence permit',
      'Health insurance meeting national rules',
      'Passport photos to national biometric specs',
      'Acceptance / enrollment letter from the university',
    ],
    feeYearNote: FEE_DISCLAIMER,
    feeRanges: [
      { label: 'Public low/no-tuition countries (intl. students, many programs)', range: '≈ €0–€3,000 / year admin or semester fees', note: 'Examples often include many German public programs; exceptions exist (Baden-Württemberg non-EU fees, private schools, some master’s).' },
      { label: 'Moderate-fee public systems (many NL/FR/IE programs)', range: '≈ €6,000–€20,000+ / year', note: 'Non-EU rates; check the program page.' },
      { label: 'Private / business / specialized schools', range: '≈ €10,000–€40,000+ / year', note: 'Wide spread — verify per school.' },
      { label: 'Living costs (major EU cities, planning band)', range: '≈ €9,000–€18,000+ / year', note: 'Nordics and major capitals sit higher; smaller cities lower.' },
    ],
    visaSummary:
      'For stays longer than 90 days you generally need a national long-stay student visa or residence permit from the country of study — a Schengen tourist visa is not enough for a degree. Processes differ (Campus France “Études en France”, German consular blocked account, Dutch MVV, etc.). Always follow the destination country’s immigration site and your university’s international office.',
    officialLinks: [
      { label: 'Study in Europe (EU portal)', href: 'https://education.ec.europa.eu/study-in-europe', external: true },
      { label: 'Erasmus+ (European Commission)', href: 'https://erasmus-plus.ec.europa.eu/', external: true },
      { label: 'Germany — DAAD', href: 'https://www.daad.de/en/', external: true },
      { label: 'Netherlands — Study in NL / Studielink', href: 'https://www.studyinnl.org/', external: true },
      { label: 'France — Campus France', href: 'https://www.campusfrance.org/en', external: true },
      { label: 'Ireland — Education in Ireland', href: 'https://www.educationinireland.com/', external: true },
    ],
    portals: [
      { label: 'uni-assist (many German universities)', href: 'https://www.uni-assist.de/en/', external: true },
      { label: 'Studielink (Netherlands)', href: 'https://www.studielink.nl/', external: true },
      { label: 'Campus France', href: 'https://www.campusfrance.org/en', external: true },
      { label: 'UK detail page on ToolVerse', href: '/study/uk', note: 'UCAS + Student visa deep dive' },
    ],
    fields: [
      { name: 'Engineering & applied sciences', why: 'Strong public technical universities across DE/NL/Nordics with English tracks.' },
      { name: 'Business & economics', why: 'Netherlands, France, and private schools are popular; fees vary widely.' },
      { name: 'Design, architecture & arts', why: 'Portfolio-based admissions; check language of instruction for studios.' },
      { name: 'Life sciences & medicine', why: 'Medicine is often local-language and highly restricted — read national rules carefully.' },
    ],
    faqs: [
      {
        question: 'Is university free in Europe for international students?',
        answer:
          'Sometimes at public universities in certain countries, but “free” usually still means semester/admin fees, high living costs, and strict admission rules. Many countries charge non-EU tuition. Always check the exact program.',
      },
      {
        question: 'Can I use one application for all of Europe?',
        answer:
          'No. There is no single Europe-wide degree application. Use national portals (uni-assist, Studielink, Campus France, etc.) or individual universities.',
      },
      {
        question: 'Is a Schengen visa enough for a full degree?',
        answer:
          'No. Degree study typically requires a national long-stay student visa or residence permit for the country where you will live and study.',
      },
      {
        question: 'Where should I start if I want Germany vs Netherlands?',
        answer:
          'Germany: DAAD + uni-assist/university pages. Netherlands: Study in NL + Studielink. Then follow that country’s immigration site for the residence permit.',
      },
    ],
    tools: [
      ...SHARED_TOOLS,
      { href: '/study/uk', label: 'Study in UK (detail)' },
      { href: '/tools/vat-gst-calculator', label: 'VAT calculator (EU presets)' },
      { href: '/travel/PK/DE', label: 'Pakistan → Germany travel route' },
    ],
    travelHref: '/travel/PK/DE',
    regionHubHref: undefined,
  },
};

export const STUDY_SLUGS = Object.keys(STUDY_DESTINATIONS) as StudySlug[];

export function getStudyDestination(slug: string): StudyDestination | undefined {
  return STUDY_DESTINATIONS[slug as StudySlug];
}

export function listStudyDestinations(): StudyDestination[] {
  return STUDY_SLUGS.map((s) => STUDY_DESTINATIONS[s]);
}
