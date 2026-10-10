/**
 * Maintainable car-cost planning data for /cars.
 * Public knowledge ranges + official links only — no scraped dealer inventories.
 */

export const CARS_DISCLAIMER =
  'Ranges are rough planning bands from publicly discussed market norms (roughly 2024–2026). They are not quotes, not insurance underwriting, and not financial advice. Rates vary by age, credit, ZIP/postcode, vehicle, driving record, and coverage. Verify with insurers, DMV/DVLA/provincial sites, and lenders before you buy.';

export interface CostRange {
  label: string;
  range: string;
  note?: string;
}

export interface OfficialLink {
  label: string;
  href: string;
  note?: string;
}

export interface CarsFaq {
  question: string;
  answer: string;
}

/** Default fuel price inputs for the trip-cost calculator (editable by user). */
export const FUEL_DEFAULTS = {
  usGasPerGallonUsd: 3.5,
  ukPetrolPerLitreGbp: 1.45,
  caGasPerLitreCad: 1.6,
  typicalMpgCombined: 28,
  typicalLPer100km: 8.4,
};

/** Typical annual liability / comprehensive bands — planning only. */
export const INSURANCE_RANGES: { region: string; bands: CostRange[] }[] = [
  {
    region: 'United States',
    bands: [
      { label: 'Full coverage (many drivers, mid-risk)', range: '≈ $1,800–$3,500+ USD / year', note: 'Younger drivers and sports cars often sit higher; clean records + older cars can be lower.' },
      { label: 'Minimum liability-only (some states)', range: '≈ $600–$1,500 USD / year', note: 'State minimums differ — check your state DOI and insurer quotes.' },
      { label: 'Monthly cash-flow shorthand', range: '≈ $150–$300+ USD / month', note: 'Budget the annual total ÷ 12; many carriers bill monthly with fees.' },
    ],
  },
  {
    region: 'United Kingdom',
    bands: [
      { label: 'Comprehensive (many private cars)', range: '≈ £600–£1,800+ / year', note: 'Postcode, noughties-group, and no-claims bonus dominate price.' },
      { label: 'New / young drivers', range: 'Often £1,500–£3,000+ / year', note: 'Telematics (“black box”) policies can lower premiums — compare carefully.' },
      { label: 'Monthly shorthand', range: '≈ £50–£150+ / month', note: 'Confirm IPT and admin fees on the quote schedule.' },
    ],
  },
  {
    region: 'Canada',
    bands: [
      { label: 'Private passenger (many provinces)', range: '≈ CAD $1,400–$3,000+ / year', note: 'Ontario and BC structures differ (public vs private markets).' },
      { label: 'High-risk / G1–G2 style new drivers', range: 'Often CAD $2,500–$5,000+ / year', note: 'Province and record matter more than national averages.' },
      { label: 'Monthly shorthand', range: '≈ CAD $120–$250+ / month', note: 'Get quotes from licensed brokers; ToolVerse does not sell insurance.' },
    ],
  },
];

export const REGISTRATION_RANGES: CostRange[] = [
  { label: 'US title / registration / plates (many states)', range: '≈ $50–$400+ USD first year', note: 'Some states add weight, value, or county fees. Confirm on your state DMV site.' },
  { label: 'US annual renewal (many states)', range: '≈ $30–$250+ USD / year', note: 'EV fees and emissions testing can add extras.' },
  { label: 'UK Vehicle Excise Duty (VED / “road tax”)', range: 'Varies by emissions & first registration date', note: 'Use GOV.UK vehicle tax rates — not a flat national fee for every car.' },
  { label: 'UK MOT test fee (cars)', range: 'Up to the max fee set on GOV.UK', note: 'Cars generally need an MOT from the 3rd anniversary of first registration.' },
  { label: 'Canada provincial registration / plates', range: '≈ CAD $50–$300+ / year typical band', note: 'ICBC, ServiceOntario, SAAQ, etc. each set their own schedules.' },
];

export const EV_VS_GAS_COMPARE: {
  title: string;
  rows: { factor: string; gas: string; ev: string }[];
} = {
  title: 'EV vs gas — planning ranges (not a verdict)',
  rows: [
    { factor: 'Fuel / energy (≈12k miles / year)', gas: 'Often $1,200–$2,200+ USD at ~28 mpg & ~$3.50/gal', ev: 'Often $400–$900+ USD home charging; public DC fast can cost more' },
    { factor: 'Routine service', gas: 'Oil + filters every 5–10k miles common', ev: 'No oil changes; tires/brakes/cabin filters still apply' },
    { factor: 'Insurance', gas: 'Wide band by model', ev: 'Sometimes higher for newer/heavier EVs — quote both' },
    { factor: 'Upfront price', gas: 'Usually lower for comparable used ICE', ev: 'Higher MSRP; incentives/tax credits change net (check IRS / local)' },
    { factor: 'Best fit', gas: 'Long rural trips with sparse chargers', ev: 'Home charging + mostly local commuting' },
  ],
};

export const MAINTENANCE_BASICS: { interval: string; item: string; note: string }[] = [
  { interval: 'Every 5,000–10,000 miles (or per oil-life monitor)', item: 'Engine oil & filter (ICE)', note: 'Follow the owner’s manual — “severe” schedules are shorter.' },
  { interval: 'Every 6–12 months', item: 'Tire pressure + tread check', note: 'Uneven wear often means alignment; NHTSA tire tips are a good primer.' },
  { interval: 'Every 15,000–30,000 miles', item: 'Cabin / engine air filters', note: 'Dusty climates clog faster.' },
  { interval: 'Every 30,000–60,000 miles', item: 'Transmission / coolant service (as specified)', note: '“Lifetime fill” still has inspection intervals — read the manual.' },
  { interval: 'Every 2–3 years / 20–40k miles', item: 'Brake fluid / pads inspection', note: 'Squeal or soft pedal = shop visit, not a spreadsheet delay.' },
  { interval: 'Battery (12V)', item: 'Test around year 3–5', note: 'EVs still have a 12V battery that can strand you.' },
  { interval: 'UK MOT (from year 3)', item: 'Annual roadworthiness test', note: 'Book on GOV.UK; fails need repair before tax/renewal in many cases.' },
];

export const BUYING_DOCUMENTS: string[] = [
  'Photo ID matching the purchase contract name',
  'Proof of insurance (binder) before you drive off the lot',
  'Bill of sale / purchase agreement with VIN, price, fees itemized',
  'Title (or lienholder paperwork) — never skip VIN match to the dash/door sticker',
  'Odometer disclosure (US used sales) where required',
  'Warranty / service contract terms in writing (what is excluded)',
  'Loan contract APR, term, monthly payment, and total of payments',
  'Registration application / temp tags instructions from dealer or DMV',
  'Maintenance records and prior inspection report (used cars)',
  'Recall check printout (NHTSA VIN lookup in the US)',
];

export const INSPECTION_CHECKLIST: { area: string; checks: string[] }[] = [
  {
    area: 'Paperwork & identity',
    checks: [
      'VIN on dash, door jamb, and title all match',
      'Service history and prior accident disclosure',
      'Open recalls cleared or priced into negotiation (NHTSA.gov VIN tool in the US)',
    ],
  },
  {
    area: 'Outside & tires',
    checks: [
      'Even panel gaps, mismatched paint (respray clue)',
      'Tread depth ≥ ~3–4 mm remaining; same brand/size axle pairs',
      'No wet spots under the car after it sat overnight',
    ],
  },
  {
    area: 'Inside & electrics',
    checks: [
      'All warning lights self-test then clear on start',
      'A/C cold, heater warm, windows/locks work',
      'ODBD-II scan for pending codes (cheap Bluetooth readers work)',
    ],
  },
  {
    area: 'Drive & brakes',
    checks: [
      'Cold start: no knocking, odd smoke, or belt squeal',
      'Straight braking with no pull or grinding',
      'Smooth shifts (auto) / clutch engagement (manual)',
    ],
  },
  {
    area: 'Independent opinion',
    checks: [
      'Pre-purchase inspection at a shop you choose (not only the seller’s friend)',
      'Walk away if the seller blocks a lift inspection — that is a signal',
    ],
  },
];

export const OFFICIAL_LINKS: OfficialLink[] = [
  { label: 'NHTSA (US) — recalls, safety ratings, VIN lookup', href: 'https://www.nhtsa.gov/', note: 'Safety + recall source of truth' },
  { label: 'fuelconomy.gov (US DOE/EPA)', href: 'https://www.fueleconomy.gov/', note: 'Official MPG / MPGe labels' },
  { label: 'GOV.UK — vehicle tax rates', href: 'https://www.gov.uk/vehicle-tax-rate-tables', note: 'UK VED / road tax' },
  { label: 'GOV.UK — MOT check & booking', href: 'https://www.gov.uk/getting-an-mot', note: 'MOT rules and max fees' },
  { label: 'GOV.UK — check MOT history', href: 'https://www.gov.uk/check-mot-history', note: 'Mileage & advisory history' },
  { label: 'Transport Canada — recalls', href: 'https://tc.canada.ca/en/road-transportation/defects-recalls-vehicles-tires-child-car-seats', note: 'Canadian recall lookup' },
  { label: 'FTC — buying a car (US consumer tips)', href: 'https://consumer.ftc.gov/articles/buying-car', note: 'Dealer/financing consumer basics' },
];

export const CARS_FAQS: CarsFaq[] = [
  {
    question: 'Does ToolVerse list cars for sale?',
    answer:
      'No. We publish planning calculators, cost ranges, and checklists. We do not scrape dealer sites or invent a fake inventory of millions of cars. Shop on dealer sites, classifieds you trust, or manufacturer configurators.',
  },
  {
    question: 'Are insurance and registration numbers exact quotes?',
    answer:
      'No. They are rough public-knowledge bands so you can size a monthly budget. Get real quotes from licensed insurers and your DMV/DVLA/provincial agency.',
  },
  {
    question: 'How do I estimate a car loan payment?',
    answer:
      'Use the Car Loan / Payment Calculator: price minus down payment and trade-in, then rate and term. Pair it with the Loan Payoff tool if you want to model extra principal payments.',
  },
  {
    question: 'MPG or L/100km — which should I use?',
    answer:
      'Use whatever is on your fuel receipt habit. The Fuel Trip Cost Calculator supports both US miles-per-gallon and metric litres per 100 km.',
  },
  {
    question: 'Where do I verify UK road tax and MOT?',
    answer:
      'GOV.UK vehicle tax rate tables and Getting an MOT pages. Our blog is a high-level overview with those official links — not a substitute for your V5C details.',
  },
];

export const FIRST_CAR_BUDGET_LINES: CostRange[] = [
  { label: 'Purchase (used compact / reliable daily)', range: '≈ $6,000–$18,000 USD', note: 'Depends on year/miles; leave room for immediate repairs.' },
  { label: 'Sales tax / title fees', range: '≈ 0–10%+ of price', note: 'Use the US Sales Tax calculator as a rough state pass, then confirm with DMV.' },
  { label: 'Insurance (first-year young driver)', range: 'Often $2,000–$4,000+ USD / year', note: 'Get quotes before you fall in love with a V8.' },
  { label: 'Emergency maintenance reserve', range: '≈ $500–$1,500 cash', note: 'Brakes, battery, tires — the stuff that fails the week after purchase.' },
  { label: 'Fuel (first month)', range: '≈ $120–$250', note: 'Commute-dependent; run the fuel trip calculator on your real route.' },
];
