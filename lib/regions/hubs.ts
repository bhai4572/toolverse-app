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
    title: 'US Tools Hub — Paycheck, Sales Tax, Tip, PDF & Passport',
    answerFirst:
      'US-focused ToolVerse utilities: estimate take-home pay, sales tax, and tips; compress or merge PDFs privately; make a 2×2 passport photo — most tools run in your browser.',
    description:
      'Privacy-first US utility landing for paycheck estimates, sales tax math, tipping, PDF compress/merge, Wi‑Fi QR, and passport photos.',
    tools: [
      { slug: 'us-paycheck-calculator', label: 'US Paycheck Estimator', blurb: 'Lite federal + FICA + state %' },
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
    title: 'UK Tools Hub — Take-Home Pay, VAT, PDF & Passport',
    answerFirst:
      'UK-focused tools for take-home pay estimates, 20% VAT math, private PDF compress/merge, Wi‑Fi QR, and 35×45 mm passport photos — browser-side where possible.',
    description:
      'UK utility hub: PAYE-style take-home lite, VAT presets, PDF tools for GOV.UK-style uploads, and passport photo sizing.',
    tools: [
      { slug: 'uk-take-home-pay-calculator', label: 'UK Take-Home Pay', blurb: 'Tax + NI lite estimate' },
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
    title: 'Canada Tools Hub — Paycheque, GST/HST, PDF & Passport',
    answerFirst:
      'Canada-focused tools for paycheque estimates, GST/HST invoice math, private PDF merge/compress, and 50×70 mm passport photos.',
    description:
      'Canadian utility landing: net pay lite, GST/HST presets, PDF packs for applications, and passport sizing.',
    tools: [
      { slug: 'canada-paycheque-calculator', label: 'Canada Paycheque', blurb: 'Federal + CPP/EI lite' },
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
    title: 'Australia Tools Hub — PAYG, GST, PDF & Passport',
    answerFirst:
      'Australia-focused tools for PAYG-style take-home estimates, 10% GST math, private PDF tools, and 35×45 mm passport photos.',
    description:
      'Australian utility hub: pay estimate lite, GST 10%, PDF compress/merge, and passport photo presets.',
    tools: [
      { slug: 'australia-pay-calculator', label: 'AU Pay Calculator', blurb: 'PAYG + Medicare lite' },
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
