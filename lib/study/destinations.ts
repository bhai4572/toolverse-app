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
      'Here is the short version: you apply to schools (often Common App for undergrad), get an I-20, pay SEVIS, then sit the F-1 visa process. International tuition at many places lands around $25k–$55k+ USD a year; living costs often $12k–$25k+ depending on the city. Treat those as planning bands — the school’s page and EducationUSA / Study in the States are the real source.',
    overview:
      'There is no single “apply to America” portal. Each campus sets deadlines, essays, and fees. That freestyle setup is liberating and annoying at once. Build a shortlist from programs you can actually fund, then compare community colleges, state universities, and private research schools on official sites — not a random ranking screenshot alone. Strong files usually mix grades, English proof when required, essays/recommendations, and funding evidence the consular officer can follow.',
    pathways: [
      {
        title: 'Undergraduate (bachelor’s)',
        body: 'Common App covers a huge chunk of undergrad; some schools still want their own portal. Expect transcripts, an essay, recommendations, and English scores if the school asks. SAT/ACT is often optional now — read the page for your term, not a friend’s rumor from 2019. Deadlines sneak up months before classes start.',
      },
      {
        title: 'Graduate (master’s / PhD)',
        body: 'One portal per university. SOP, CV, transcripts, recommenders, and GRE/GMAT only when listed. Assistantships are nice when they exist; never budget as if a stipend is guaranteed.',
      },
      {
        title: 'Pathway / English / community college',
        body: 'A cheaper on-ramp for some students — then transfer. Get transfer articulations and visa continuity in writing from the international office before you wire a deposit.',
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
      'Undergrad? Usually UCAS. Master’s/PhD? Usually the university’s own form. Once you have an unconditional offer and a CAS, the Student visa lives on GOV.UK. Many international fees sit around £12k–£38k+ a year (medicine and central London climb fast); living costs often £9k–£15k+ outside vs inside London. Confirm on UCAS, the course page, and GOV.UK — not on a WhatsApp forward.',
    overview:
      'England/Wales/NI undergrads are often three years; Scotland commonly four. Admissions care about grades, a personal statement that sounds like you, and sometimes interviews or admissions tests for the competitive courses. The Student visa framework is UK-wide, but the campuses are not interchangeable — read the exact course page for the city you want to wake up in.',
    pathways: [
      {
        title: 'Undergraduate via UCAS',
        body: 'Open a UCAS Hub account, pick your allowed choices, write the statement, get the reference, track offers. Medicine, Oxbridge, and a few others run earlier deadlines and extra tests — UCAS and the course page beat any agent brochure.',
      },
      {
        title: 'Postgraduate',
        body: 'University portals. Transcripts, references, CV, statement. English scores unless the school lists a clear exemption for your background.',
      },
      {
        title: 'Foundation / pathway',
        body: 'Useful when your current qualifications do not map cleanly. Get any “progression to year 1” promise in writing before you pay.',
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
      'Typical path: offer from a designated learning institution (DLI), proof of funds, then a study permit via IRCC (biometrics are common). Undergrad tuition for many internationals sits around CAD $15k–$40k+ a year; living costs often CAD $15k–$25k+ by city. Check the school plus Canada.ca / EduCanada before you wire money.',
    overview:
      'Universities, colleges, and Québec CEGEPs are different animals. Provinces run education; IRCC runs immigration. In Canada “college” usually means applied diplomas, not a US-style liberal-arts campus. Confirm DLI status and — if you care about working after — whether that exact program still supports a PGWP under today’s IRCC rules.',
    pathways: [
      {
        title: 'Undergraduate university',
        body: 'School portals or provincial services (OUAC is the big Ontario undergrad example). Grades, English/French proof, and the odd program supplement.',
      },
      {
        title: 'College / diploma',
        body: 'Career-focused and often co-op heavy. Verify DLI + PGWP eligibility for the program code on IRCC before the deposit deadline panic.',
      },
      {
        title: 'Graduate studies',
        body: 'Faculty portals. Thesis routes need supervisor fit. Funding language in the offer letter matters more than Instagram campus tours.',
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
      'Usually: offer from a CRICOS-registered provider, Genuine Student + funds evidence, then Student visa subclass 500 through Home Affairs. Many coursework degrees sit around AUD $20k–$45k+ a year; living costs often AUD $21k+ as a planning floor. Study Australia and Home Affairs beat any agent PDF.',
    overview:
      'Universities and VET providers that teach internationals show up on CRICOS — if they do not, walk away. Admissions care about academic equivalence, English, and sometimes a portfolio. Sydney and Melbourne rent can swallow a stipend; regional campuses are quieter and often cheaper. Pick the trade-off on purpose.',
    pathways: [
      {
        title: 'Undergraduate',
        body: 'Apply on the university’s channels (or ones they list). Foundation → degree packages exist when you need a bridging year — read the progression clause twice.',
      },
      {
        title: 'Postgraduate coursework / research',
        body: 'Coursework is portal-driven. Research needs a supervisor who actually wants the topic. RTP and other scholarships are competitive; apply early.',
      },
      {
        title: 'VET / TAFE',
        body: 'Solid skills training. Migration after study is a separate, points-tested story — never treat a diploma as a PR ticket.',
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
      'Get an offer from an approved provider, then apply for a student visa with Immigration New Zealand (often online). Many bachelor’s/master’s programs land around NZD $22k–$40k+ a year; living costs often NZD $15k–$25k+. Study with New Zealand + Immigration NZ are the bookmarks that matter.',
    overview:
      'Eight universities, plus institutes and other approved providers — smaller than the US/UK, which is either charming or limiting depending on your niche. Admissions look at academic equivalence and English; some creative programs want portfolios. Auckland is the expensive roommate; other cities can be kinder to rent.',
    pathways: [
      {
        title: 'Undergraduate',
        body: 'University portals. Secondary quals mapped to NZ entrance (or a foundation year if you need one).',
      },
      {
        title: 'Postgraduate',
        body: 'Taught master’s vs research — different paperwork. Email supervisors early with a proposal that is not a one-liner.',
      },
      {
        title: 'Pathway / English',
        body: 'Language and foundation packages are common. Progression conditions belong in the offer letter, not a sales call.',
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
      'Europe is not one admissions machine. Germany or Norway public programs can mean low/no tuition (admin fees still bite); the Netherlands, France, Ireland and others often charge real international fees. Apply via national portals (uni-assist, Studielink, Campus France…) or the university, then follow that country’s residence process. Start at Study in Europe, finish on the national immigration site.',
    overview:
      'Bologna keeps bachelor’s (~3 years) and master’s (~1–2) roughly aligned, but language rules, numerus clausus, and rent are wildly local. English-taught options are easy to find in NL, DE, and the Nordics — still read the program language line. Want the UK deep-dive? Use our UK page; this hub stays continental + high-level.',
    pathways: [
      {
        title: 'Bachelor’s (Bologna first cycle)',
        body: 'National application services or direct university portals. Some countries rank centrally; others let each faculty decide. Bring recognized secondary diplomas (and translations when asked).',
      },
      {
        title: 'Master’s / PhD',
        body: 'ECTS equivalence matters. PhDs may be structured cohorts or a handshake with a supervisor — common in Germany and the Nordics.',
      },
      {
        title: 'Exchange / Erasmus+',
        body: 'Usually arranged by your home university’s international office. Degree-seeking stays still need a proper residence permit once you outgrow tourist rules.',
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
