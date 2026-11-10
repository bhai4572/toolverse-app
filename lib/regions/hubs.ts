export type RegionCode = 'us' | 'uk' | 'ca' | 'au';

export interface RegionHub {
  code: RegionCode;
  name: string;
  flag: string;
  title: string;
  answerFirst: string;
  description: string;
  tools: { slug: string; label: string; blurb: string }[];
}

export const REGION_HUBS: Record<RegionCode, RegionHub> = {
  us: {
    code: 'us',
    name: 'United States',
    flag: '🇺🇸',
    title: 'US Tools Hub — Paycheck, Resume, Sales Tax, PDF & Passport',
    answerFirst:
      'US-focused ToolVerse utilities: build a 1-page US Letter ATS resume, estimate federal + state take-home pay, verify B2B company emails, compress PDFs privately, or size a 2×2 inch passport photo.',
    description:
      'Privacy-first US utility hub for US Letter resume building, paycheck estimates, sales tax math, B2B contact lookup, PDF compress/merge, and 2×2 passport photos.',
    tools: [
      { slug: 'cv-maker', label: 'US Resume Builder (Letter)', blurb: '25 ATS templates · free PDF' },
      { slug: 'us-paycheck-calculator', label: 'US Paycheck Estimator', blurb: 'Lite federal + FICA + state %' },
      { slug: 'b2b-email-finder', label: 'B2B Email Finder', blurb: 'Verified US business emails' },
      { slug: 'us-sales-tax-calculator', label: 'US Sales Tax', blurb: 'State table + custom rate' },
      { slug: 'tip-calculator', label: 'Tip Calculator', blurb: '15–25% + split bill' },
      { slug: 'pdf-compress', label: 'Compress PDF', blurb: 'Email & portal size limits' },
      { slug: 'pdf-merge', label: 'Merge PDF', blurb: 'Combine application packs' },
      { slug: 'passport-photo-maker', label: 'Passport Photo (2×2)', blurb: 'US size preset' },
      { slug: 'wifi-qr-code-generator', label: 'Wi‑Fi QR', blurb: 'Guest network cards' },
      { slug: 'heic-to-jpg', label: 'HEIC to JPG', blurb: 'iPhone → Windows' },
    ],
  },
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    title: 'UK Tools Hub — Take-Home Pay, A4 CV Maker, VAT, PDF & Passport',
    answerFirst:
      'UK-focused tools for PAYE take-home pay estimates, multi-page A4 CV building, 20% VAT math, B2B email lookup, private PDF compress/merge, and 35×45 mm passport photos.',
    description:
      'UK utility hub: PAYE-style take-home lite, A4 Curriculum Vitae builder, VAT presets, PDF tools for GOV.UK-style uploads, and passport photo sizing.',
    tools: [
      { slug: 'cv-maker', label: 'UK A4 CV Maker', blurb: '25 templates · NHS & Grad CVs' },
      { slug: 'uk-take-home-pay-calculator', label: 'UK Take-Home Pay', blurb: 'Tax + NI lite estimate' },
      { slug: 'b2b-email-finder', label: 'B2B Email Finder', blurb: 'Verified UK company emails' },
      { slug: 'vat-gst-calculator', label: 'VAT Calculator', blurb: 'UK 20% / 5% / 0% presets' },
      { slug: 'pdf-compress', label: 'Compress PDF', blurb: 'Shrink for uploads' },
      { slug: 'pdf-merge', label: 'Merge PDF', blurb: 'Combine documents' },
      { slug: 'passport-photo-maker', label: 'UK Passport Photo', blurb: '35×45 mm preset' },
      { slug: 'wifi-qr-code-generator', label: 'Wi‑Fi QR', blurb: 'Guest Wi‑Fi codes' },
      { slug: 'heic-to-jpg', label: 'HEIC to JPG', blurb: 'iPhone photos' },
    ],
  },
  ca: {
    code: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    title: 'Canada Tools Hub — Paycheque, Resume, GST/HST, PDF & Passport',
    answerFirst:
      'Canada-focused tools for federal + provincial paycheque estimates, ATS resume building, GST/HST invoice math, B2B email lookup, IRCC-friendly PDF compression, and 50×70 mm passport photos.',
    description:
      'Canadian utility landing: net pay lite, bilingual-friendly resume templates, GST/HST presets, PDF packs for IRCC applications, and passport sizing.',
    tools: [
      { slug: 'cv-maker', label: 'Canada Resume Builder', blurb: '25 ATS templates · free PDF' },
      { slug: 'canada-paycheque-calculator', label: 'Canada Paycheque', blurb: 'Federal + CPP/EI lite' },
      { slug: 'b2b-email-finder', label: 'B2B Email Finder', blurb: 'Verified CA company emails' },
      { slug: 'vat-gst-calculator', label: 'GST / HST Calculator', blurb: 'Province presets' },
      { slug: 'tip-calculator', label: 'Tip Calculator', blurb: 'Split bills' },
      { slug: 'pdf-compress', label: 'Compress PDF', blurb: 'IRCC-friendly sizes' },
      { slug: 'pdf-merge', label: 'Merge PDF', blurb: 'Application packs' },
      { slug: 'passport-photo-maker', label: 'Canada Passport Photo', blurb: '50×70 mm preset' },
      { slug: 'wifi-qr-code-generator', label: 'Wi‑Fi QR', blurb: 'Guest networks' },
      { slug: 'heic-to-jpg', label: 'HEIC to JPG', blurb: 'iPhone → PC' },
    ],
  },
  au: {
    code: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    title: 'Australia Tools Hub — PAYG, A4 Resume, GST, PDF & Passport',
    answerFirst:
      'Australia-focused tools for PAYG take-home estimates, A4 resume & CV building, 10% GST math, B2B company email lookup, private PDF tools, and 35×45 mm passport photos.',
    description:
      'Australian utility hub: PAYG + Medicare estimate lite, A4 CV maker, GST 10%, PDF compress/merge, and passport photo presets.',
    tools: [
      { slug: 'cv-maker', label: 'AU A4 Resume & CV Maker', blurb: '25 templates · free PDF' },
      { slug: 'australia-pay-calculator', label: 'AU Pay Calculator', blurb: 'PAYG + Medicare lite' },
      { slug: 'b2b-email-finder', label: 'B2B Email Finder', blurb: 'Verified AU company emails' },
      { slug: 'vat-gst-calculator', label: 'GST Calculator', blurb: 'Australia 10% preset' },
      { slug: 'pdf-compress', label: 'Compress PDF', blurb: 'Portal & email limits' },
      { slug: 'pdf-merge', label: 'Merge PDF', blurb: 'Combine files' },
      { slug: 'passport-photo-maker', label: 'AU Passport Photo', blurb: '35×45 mm preset' },
      { slug: 'wifi-qr-code-generator', label: 'Wi‑Fi QR', blurb: 'Guest Wi‑Fi' },
      { slug: 'heic-to-jpg', label: 'HEIC to JPG', blurb: 'iPhone photos' },
    ],
  },
};

export function getRegionHub(code: string): RegionHub | undefined {
  return REGION_HUBS[code as RegionCode];
}
