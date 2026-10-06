/** Optional long-form SEO copy for high-intent tool pages. Keep natural — no keyword stuffing. */

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolSeoSection {
  heading: string;
  body: string;
}

export interface ToolPageContent {
  sections: ToolSeoSection[];
  faqs: ToolFaq[];
}

export const TOOL_PAGE_CONTENT: Record<string, ToolPageContent> = {
  'compress-image-target-size': {
    sections: [
      {
        heading: 'Why job portals demand photos under 20KB, 50KB, or 100KB',
        body: 'Government and university portals (PPSC, FPSC, NTS, HEC, NADRA-related forms, and many visa sites) cap photo and signature uploads so servers stay fast. A phone photo is often 2–8 MB, so the form rejects it. This tool shrinks the file to the exact KB limit you type — without uploading your photo to our servers.',
      },
      {
        heading: 'How target-size compression works',
        body: 'Instead of guessing a quality slider, the compressor tries quality and scale combinations until the output is at or under your target (for example 50 KB). Processing runs in your browser with the Canvas API, so CNIC, passport, and exam photos never leave your device.',
      },
      {
        heading: 'Tips for a clear 50KB passport or job photo',
        body: 'Start with a well-lit face photo, crop tightly around the head and shoulders first, then compress. Extremely small targets (under 20 KB) on large images will look softer — that is normal. Prefer JPG for photos; PNG logos may not shrink as much.',
      },
    ],
    faqs: [
      {
        question: 'How do I compress a photo to exactly 50KB for a job application?',
        answer:
          'Upload your image, enter 50 in the target size field (KB), then click compress. Download the result and upload it to the portal. If it is still rejected, crop tighter and try again.',
      },
      {
        question: 'Can I compress to 20KB for a signature upload?',
        answer:
          'Yes. Set the target to 20 KB. Signatures and scanned documents often need lower limits than profile photos.',
      },
      {
        question: 'Is my photo uploaded to ToolVerse servers?',
        answer:
          'No. Compression runs locally in your browser. Your file is not sent to our servers for this tool.',
      },
      {
        question: 'Will compressing to 50KB make my face unreadable?',
        answer:
          'Usually not if you crop first and start from a sharp photo. Very aggressive targets can soften detail — raise the limit slightly if the portal allows it.',
      },
    ],
  },

  'pdf-merge': {
    sections: [
      {
        heading: 'Merge PDFs privately in your browser',
        body: 'Combine cover letters, CVs, certificates, invoices, or scanned pages into one file without uploading documents to a third-party cloud. ToolVerse merges PDFs with a client-side PDF engine so sensitive paperwork stays on your device.',
      },
      {
        heading: 'Common merge workflows',
        body: 'Job seekers often merge a CV + cover letter + degree scan into one application PDF. Freelancers merge monthly invoices for clients. Students combine assignment chapters before submission. Drag files into the order you need, then download a single PDF.',
      },
      {
        heading: 'Before you merge',
        body: 'Unlock password-protected PDFs first. Very large scans may take longer on older phones. After merging, open the file once to confirm page order before you submit it.',
      },
    ],
    faqs: [
      {
        question: 'How do I combine multiple PDF files into one?',
        answer:
          'Upload two or more PDFs, drag them into the correct order, click Merge, then download the combined file.',
      },
      {
        question: 'Are my PDFs uploaded when I merge them?',
        answer:
          'No. Merging runs in your browser. Files are not uploaded to ToolVerse for this tool.',
      },
      {
        question: 'Can I rearrange pages before merging?',
        answer:
          'Yes. Reorder the uploaded files with drag and drop so the final PDF follows the sequence you want.',
      },
      {
        question: 'Why won’t a password-protected PDF merge?',
        answer:
          'Encrypted PDFs must be unlocked first. Remove the password in a PDF reader, then try merging again.',
      },
    ],
  },

  'qr-code-generator': {
    sections: [
      {
        heading: 'Create free QR codes for links, Wi‑Fi, and print',
        body: 'Generate a scannable QR code for a website URL, plain text, or Wi‑Fi credentials. Download PNG for social posts or SVG for print menus, posters, and packaging. Codes are drawn in your browser — nothing is stored on our servers.',
      },
      {
        heading: 'Make QR codes that scan reliably',
        body: 'Use high contrast (dark code on a light background). Leave a quiet margin around the code. Test with your phone camera before printing. For Wi‑Fi posters, double-check SSID and password spelling.',
      },
      {
        heading: 'When to use QR vs barcode',
        body: 'Use QR for URLs, menus, and Wi‑Fi. Use a linear barcode (Code 128, EAN, UPC) for retail SKUs and inventory — try the Barcode Generator for those formats.',
      },
    ],
    faqs: [
      {
        question: 'How do I make a free QR code for a website link?',
        answer:
          'Paste your URL, optionally set size and colors, generate the code, then download PNG or SVG.',
      },
      {
        question: 'Can I create a Wi‑Fi QR code?',
        answer:
          'Yes. Enter your Wi‑Fi details in the tool so guests can scan and connect without typing the password.',
      },
      {
        question: 'Should I download PNG or SVG?',
        answer:
          'PNG is fine for screens and social media. SVG scales cleanly for print (business cards, posters, packaging).',
      },
      {
        question: 'Do QR codes expire on ToolVerse?',
        answer:
          'No. The image you download is yours. It keeps working as long as the destination URL or Wi‑Fi details stay valid.',
      },
    ],
  },

  'pakistan-salary-tax-estimator': {
    sections: [
      {
        heading: 'Estimate FBR salaried income tax in Pakistan',
        body: 'Enter your gross salary to see an estimate of annual tax, monthly deduction, and take-home pay using standard salaried income tax slabs for recent fiscal years. Useful for employees checking payslips and for HR doing quick payroll checks.',
      },
      {
        heading: 'What this calculator includes (and what it does not)',
        body: 'It focuses on standard salaried slab estimates. It does not replace a tax advisor, and it may not cover every surcharge, rebate, or special credit. Always confirm with your HR payroll sheet or a qualified tax professional for filing.',
      },
      {
        heading: 'Monthly vs annual salary input',
        body: 'You can work from monthly or annual figures. Many people start with the amount in their offer letter or bank credit, then compare the estimated monthly tax with their actual deduction.',
      },
    ],
    faqs: [
      {
        question: 'How do I calculate Pakistan salary tax online?',
        answer:
          'Enter your gross monthly or annual salary in PKR. The tool estimates annual tax, monthly tax, and net take-home for standard salaried slabs.',
      },
      {
        question: 'Is this the official FBR calculator?',
        answer:
          'No. It is an independent estimate for planning. Use official FBR resources or a tax professional for filings and audits.',
      },
      {
        question: 'Does it store my salary?',
        answer:
          'No. Calculations run in your browser. Salary figures are not uploaded to ToolVerse.',
      },
      {
        question: 'Why might my payslip differ from this estimate?',
        answer:
          'Employers may apply different allowances, surcharges, or withholding rules. Treat this as a guide, then verify with payroll.',
      },
    ],
  },

  'meta-tag-generator': {
    sections: [
      {
        heading: 'Build title, description, and Open Graph tags',
        body: 'Fill in your page title, meta description, canonical URL, and social image URL to get ready-to-paste HTML for your <head>. A live SERP-style preview helps you stay within practical title and description lengths for Google snippets.',
      },
      {
        heading: 'Practical meta tag guidelines',
        body: 'Aim for a clear title near 50–60 characters and a description near 140–160 characters. Match the title to the real H1 intent of the page. Use an absolute https URL for og:image so Facebook and LinkedIn can fetch the preview.',
      },
      {
        heading: 'Open Graph and Twitter cards',
        body: 'og:title, og:description, og:url, and og:image control how links look when shared. Twitter/X cards reuse similar fields. After publishing, use platform debuggers to refresh cached previews.',
      },
    ],
    faqs: [
      {
        question: 'What is a meta tag generator used for?',
        answer:
          'It helps you write HTML title, description, and social preview tags so search results and link shares look correct.',
      },
      {
        question: 'How long should a meta description be?',
        answer:
          'Around 140–160 characters is a practical target. Focus on a clear benefit; Google may rewrite snippets anyway.',
      },
      {
        question: 'Do I need Open Graph tags if I already have a title tag?',
        answer:
          'Yes for social sharing. Without og:image and og:title, Facebook or LinkedIn may show a weak or missing preview.',
      },
      {
        question: 'Does this tool change my live website automatically?',
        answer:
          'No. It only generates HTML for you to copy into your site’s <head> or CMS SEO fields.',
      },
    ],
  },
};

export function getToolPageContent(slug: string): ToolPageContent | undefined {
  return TOOL_PAGE_CONTENT[slug];
}
