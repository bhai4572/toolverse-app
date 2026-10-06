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
  /** Short answer-first definition for AEO (shown above the tool). */
  answerFirst?: string;
  /** Optional unique title override (keep under ~60 chars when possible). */
  seoTitle?: string;
  seoDescription?: string;
  sections: ToolSeoSection[];
  faqs: ToolFaq[];
}

export const TOOL_PAGE_CONTENT: Record<string, ToolPageContent> = {
  'compress-image-target-size': {
    answerFirst:
      'Compress Image to Target Size shrinks a photo to an exact KB or MB limit (for example 20 KB, 50 KB, or 100 KB) in your browser — useful for job portals and form uploads that reject large files.',
    seoTitle: 'Compress Image to 20KB / 50KB / 100KB Online | ToolVerse',
    seoDescription:
      'Shrink JPG or PNG photos to an exact target size like 20KB, 50KB, or 100KB for job and visa forms. Runs locally in your browser — no upload.',
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
    answerFirst:
      'Merge PDF Files combines two or more PDFs into one document in your browser, so cover letters, CVs, and scans stay on your device.',
    seoTitle: 'Merge PDF Files Online Free (Private Browser Merge) | ToolVerse',
    seoDescription:
      'Combine multiple PDFs into one file without uploading. Drag to reorder pages, then download. Client-side merge on ToolVerse.',
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
    answerFirst:
      'QR Code Generator creates a free scannable QR image for a URL, text, or Wi‑Fi details, then lets you download PNG or SVG from your browser.',
    seoTitle: 'Free QR Code Generator (PNG & SVG) | ToolVerse',
    seoDescription:
      'Make a QR code for website links, text, or Wi‑Fi. Download PNG for screens or SVG for print. Generated locally in your browser.',
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
    answerFirst:
      'The Pakistan Salary Income Tax Calculator estimates annual tax, monthly deduction, and take-home pay from your gross salary using standard salaried slab estimates — for planning, not official filing.',
    seoTitle: 'Pakistan Salary Tax Calculator (FBR Slabs Estimate) | ToolVerse',
    seoDescription:
      'Estimate Pakistan salaried income tax and take-home pay from monthly or annual salary. Independent slab-based estimate — verify with FBR or a tax advisor.',
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
    answerFirst:
      'SEO Meta Tag Generator builds ready-to-paste title, description, canonical, and Open Graph tags with a simple SERP-style preview.',
    seoTitle: 'SEO Meta Tag Generator & SERP Preview | ToolVerse',
    seoDescription:
      'Generate title, meta description, canonical, and Open Graph tags. Preview how a search snippet may look, then copy the HTML.',
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

  'image-compressor': {
    answerFirst:
      'Image Compressor reduces JPG, PNG, and WebP file size with a quality slider so pages and emails load faster — processing stays in your browser.',
    seoTitle: 'Free Image Compressor (JPG, PNG, WebP) | ToolVerse',
    seoDescription:
      'Compress images online without uploading. Balance quality and file size for web, email, and faster page loads.',
    sections: [
      {
        heading: 'When to use quality compression vs target KB',
        body: 'Use this compressor when you want a smaller file and can accept a quality trade-off. If a form demands an exact limit (20 KB / 50 KB), use Compress Image to Target Size instead.',
      },
      {
        heading: 'Web and email workflows',
        body: 'Large hero images slow Core Web Vitals. Compress before uploading to CMS or attaching to email. Prefer WebP for modern sites when your stack supports it — convert with JPG/PNG to WebP after compressing if needed.',
      },
      {
        heading: 'Privacy note',
        body: 'Photos are read and rewritten locally with browser APIs. They are not sent to ToolVerse servers for this tool.',
      },
    ],
    faqs: [
      {
        question: 'How do I compress a JPG without uploading it?',
        answer:
          'Choose your file, lower the quality until the size looks right, compress, then download. Everything runs in your browser.',
      },
      {
        question: 'Will compression ruin print quality?',
        answer:
          'Heavy compression softens detail. Keep quality higher for print; use stronger compression for web thumbnails and email.',
      },
      {
        question: 'What if I need exactly 50KB?',
        answer:
          'Use the Compress Image to Target Size tool and enter 50 KB as the limit.',
      },
    ],
  },

  'heic-to-jpg': {
    answerFirst:
      'HEIC to JPG Converter turns iPhone HEIC/HEIF photos into standard JPG files in your browser so Windows apps and web forms can open them.',
    seoTitle: 'HEIC to JPG Converter Online (iPhone Photos) | ToolVerse',
    seoDescription:
      'Convert iPhone HEIC photos to JPG without iCloud or desktop installs. Private browser conversion for Windows and web uploads.',
    sections: [
      {
        heading: 'Why HEIC breaks on many Windows PCs and forms',
        body: 'iPhones often save photos as HEIC. Older Windows apps, email clients, and upload forms expect JPG or PNG. Converting once saves repeated “unsupported format” errors.',
      },
      {
        heading: 'Convert without cloud uploads',
        body: 'This tool decodes HEIC locally and exports JPG. Useful when you do not want personal photos sitting on a random converter server.',
      },
      {
        heading: 'After conversion',
        body: 'If a portal still rejects the file for size, run the JPG through Image Compressor or Compress Image to Target Size.',
      },
    ],
    faqs: [
      {
        question: 'How do I convert iPhone HEIC to JPG online?',
        answer:
          'Upload the .HEIC file, click convert, then download the JPG. Processing runs in your browser.',
      },
      {
        question: 'Does conversion delete EXIF data?',
        answer:
          'Some metadata may change during re-encode. Treat the download as a new image file for forms and sharing.',
      },
      {
        question: 'Can I convert multiple HEIC files?',
        answer:
          'Convert one file at a time for reliability on phones. On desktop, repeat for each photo or batch offline if you have many.',
      },
    ],
  },

  'pdf-split': {
    answerFirst:
      'Split PDF File extracts single pages or page ranges into new PDFs in your browser — handy for sharing one chapter or one payslip from a larger document.',
    seoTitle: 'Split PDF Online Free (Extract Pages Privately) | ToolVerse',
    seoDescription:
      'Split a PDF into separate pages or extract a custom range without uploading. Download single PDFs or a ZIP from your browser.',
    sections: [
      {
        heading: 'Extract pages without uploading the full document',
        body: 'Need one invoice from a multi-page pack, or pages 3–5 of a report? Split locally so the rest of the file never leaves your device.',
      },
      {
        heading: 'Split every page vs custom ranges',
        body: 'Use “every page” when each page should become its own file. Use custom ranges when you want a contiguous extract (for example 1–3 or 8–10).',
      },
      {
        heading: 'Pair with merge and reorder',
        body: 'After extracting, merge related extracts with PDF Merge, or fix order with Reorder PDF Pages before you send the file.',
      },
    ],
    faqs: [
      {
        question: 'How do I extract specific pages from a PDF?',
        answer:
          'Upload the PDF, choose custom ranges, enter the pages you need, then download the result.',
      },
      {
        question: 'Is the PDF uploaded to a server?',
        answer:
          'No. Splitting runs in your browser for this tool.',
      },
      {
        question: 'Why can’t I split a locked PDF?',
        answer:
          'Password-protected files must be unlocked first in a PDF reader, then split again.',
      },
    ],
  },

  'jpg-to-pdf': {
    answerFirst:
      'JPG to PDF Converter turns one or more photos into a single PDF with orientation and margin options — all in your browser.',
    seoTitle: 'JPG to PDF Converter Online Free | ToolVerse',
    seoDescription:
      'Convert JPG, PNG, or WebP images into a PDF document privately. Set orientation and margins, then download.',
    sections: [
      {
        heading: 'Photo scans into submit-ready PDFs',
        body: 'Phone photos of IDs, signed forms, or whiteboard notes often need to be a PDF for email or portals. Convert locally instead of uploading scans to a cloud converter.',
      },
      {
        heading: 'One image vs many',
        body: 'Use this tool for a clean single-document convert with layout controls. For bulk photo packs into one PDF, Multiple Images to PDF is often faster.',
      },
      {
        heading: 'Quality tip',
        body: 'Start from a sharp, well-lit photo. Compress oversized camera files first if the portal has a max PDF size.',
      },
    ],
    faqs: [
      {
        question: 'Can I convert PNG as well as JPG?',
        answer:
          'Yes. PNG and WebP are supported alongside JPG for this converter.',
      },
      {
        question: 'Are my images uploaded?',
        answer:
          'No. PDF creation runs in your browser.',
      },
      {
        question: 'How do I put many photos into one PDF?',
        answer:
          'Use Multiple Images to PDF, or convert then merge with PDF Merge if you already have separate PDFs.',
      },
    ],
  },

  'barcode-generator': {
    answerFirst:
      'Barcode Generator creates Code 128, Code 39, EAN-13, EAN-8, UPC-A, and ITF-14 barcodes as downloadable images in your browser.',
    seoTitle: 'Free Barcode Generator (Code 128, EAN, UPC) | ToolVerse',
    seoDescription:
      'Generate retail and inventory barcodes (Code 128, EAN-13, UPC, and more) with custom size and colors. No account required.',
    sections: [
      {
        heading: 'Pick the right symbology',
        body: 'Code 128 fits most warehouse SKUs and alphanumeric labels. EAN-13 and UPC-A are retail product formats with fixed digit lengths. ITF-14 is common on cartons. Match the format your scanner and marketplace expect.',
      },
      {
        heading: 'Print tips that scan',
        body: 'Keep bars dark on a light background. Do not shrink below what your printer can resolve. Test with the same scanner your warehouse or checkout uses.',
      },
      {
        heading: 'QR vs barcode',
        body: 'Need a URL or Wi‑Fi code? Use QR Code Generator. Need shelf and product barcodes? Stay on this tool.',
      },
    ],
    faqs: [
      {
        question: 'How many digits does EAN-13 need?',
        answer:
          'EAN-13 expects 13 digits (including check digit rules for your product data). Invalid lengths will not encode correctly.',
      },
      {
        question: 'Can I use barcodes commercially?',
        answer:
          'The image is yours to print. Product identifier assignment (GS1 numbers) is separate from generating the graphic.',
      },
      {
        question: 'Is barcode data stored on ToolVerse?',
        answer:
          'No. Graphics are rendered locally in your browser.',
      },
    ],
  },

  'password-generator': {
    answerFirst:
      'Secure Password Generator creates high-entropy passwords with the Web Crypto API in your browser — nothing is sent to a server.',
    seoTitle: 'Strong Password Generator (Browser Crypto) | ToolVerse',
    seoDescription:
      'Generate strong random passwords with custom length and character sets. Uses Web Crypto locally — copy into your password manager.',
    sections: [
      {
        heading: 'Why local generation matters',
        body: 'A password typed into a questionable website may be logged. This tool uses crypto.getRandomValues in your browser so the string never needs to leave your device.',
      },
      {
        heading: 'Length and character sets',
        body: 'Longer is stronger. Prefer 16+ characters for important accounts. Include mixed case, numbers, and symbols unless a site forbids them — then increase length to compensate.',
      },
      {
        heading: 'Store safely',
        body: 'Copy once into a trusted password manager. Do not paste production secrets into shared docs or chat.',
      },
    ],
    faqs: [
      {
        question: 'Are generated passwords stored?',
        answer:
          'No. They are created in your browser session. Clear the page when finished if you are on a shared computer.',
      },
      {
        question: 'Is this better than a memorable passphrase?',
        answer:
          'Both can be strong. Random high-entropy strings are excellent when a password manager fills them. Passphrases help when you must memorize one master secret.',
      },
      {
        question: 'Can I generate API keys here?',
        answer:
          'You can generate random strings for staging secrets. Prefer your cloud provider’s official key tooling for production credentials when required.',
      },
    ],
  },

  'word-counter': {
    answerFirst:
      'Word & Character Counter shows live word, character, sentence, and paragraph counts plus a reading-time estimate as you type or paste.',
    seoTitle: 'Word Counter Online (Characters & Reading Time) | ToolVerse',
    seoDescription:
      'Count words and characters instantly for essays, captions, and articles. Includes sentence count and reading time — private in-browser.',
    sections: [
      {
        heading: 'Essay limits and publisher caps',
        body: 'Students check assignment word limits; writers track blog length; social managers watch caption budgets. Counts update as you edit so you do not re-paste into another site.',
      },
      {
        heading: 'Words vs characters',
        body: 'This tool focuses on writing stats (words, sentences, reading time). For platform-specific character ceilings (SMS, tweets, meta titles), use Character Counter.',
      },
      {
        heading: 'Privacy',
        body: 'Your draft stays in the browser. It is not uploaded for counting.',
      },
    ],
    faqs: [
      {
        question: 'How are words counted?',
        answer:
          'Counts use whitespace and punctuation rules typical of online counters. Different style guides may disagree on hyphenated compounds.',
      },
      {
        question: 'Does it count characters with spaces?',
        answer:
          'Yes — you get character stats alongside word count. For strict social limits, open Character Counter.',
      },
      {
        question: 'Is my text stored?',
        answer:
          'No. Analysis runs locally in your browser.',
      },
    ],
  },

  'zakat-calculator': {
    answerFirst:
      'Zakat Calculator estimates 2.5% Zakat on eligible wealth (such as cash, gold, silver, and investments) for planning — confirm edge cases with a qualified advisor.',
    seoTitle: 'Zakat Calculator Online (2.5% Estimate) | ToolVerse',
    seoDescription:
      'Estimate Islamic Zakat on gold, silver, cash, and investments. Educational calculator — verify nisab and rulings with a trusted scholar.',
    sections: [
      {
        heading: 'What this estimate covers',
        body: 'Enter asset values to see a straightforward 2.5% style estimate. Rules around nisab, lunar year ownership, debts, and business inventory can vary — treat the result as a planning aid.',
      },
      {
        heading: 'When to get personal advice',
        body: 'Complex holdings, business stock, or agricultural produce may need a scholar or accountant familiar with your school of thought and local practice.',
      },
      {
        heading: 'Privacy of financial figures',
        body: 'Numbers are calculated in your browser and are not uploaded to ToolVerse for this tool.',
      },
    ],
    faqs: [
      {
        question: 'Is Zakat always 2.5%?',
        answer:
          'Many common cash and gold scenarios use 2.5%, but eligibility, nisab, and asset types matter. Confirm with a qualified advisor.',
      },
      {
        question: 'Does this replace a fatwa or accountant?',
        answer:
          'No. It is an educational estimator for quick planning.',
      },
      {
        question: 'Are my asset values stored?',
        answer:
          'No. Calculations stay in your browser.',
      },
    ],
  },

  'emi-calculator': {
    answerFirst:
      'Loan EMI Calculator estimates monthly Equated Monthly Installments from loan amount, interest rate, and tenure, plus total interest payable.',
    seoTitle: 'EMI Calculator — Loan Monthly Payment Estimate | ToolVerse',
    seoDescription:
      'Calculate home, car, or personal loan EMI from amount, rate, and tenure. See total interest and payment estimates privately in your browser.',
    sections: [
      {
        heading: 'How EMI estimates work',
        body: 'Standard EMI formulas spread principal and interest across the tenure. Banks may add processing fees, insurance, or floating-rate changes that this simple model does not include.',
      },
      {
        heading: 'Compare offers before you sign',
        body: 'Run the same principal with each bank’s rate and tenure to compare monthly outflow. A slightly lower rate over a long tenure can still mean more total interest — check both EMI and total cost.',
      },
      {
        heading: 'Privacy',
        body: 'Loan figures stay on your device. Nothing is uploaded for this calculator.',
      },
    ],
    faqs: [
      {
        question: 'What inputs do I need for EMI?',
        answer:
          'Loan amount, annual interest rate, and tenure in months or years.',
      },
      {
        question: 'Why does my bank EMI differ?',
        answer:
          'Fees, insurance, rate type, and day-count conventions can change the real payment. Use this as an estimate, then confirm with the lender’s schedule.',
      },
      {
        question: 'Is this a credit application?',
        answer:
          'No. It is a local calculator only.',
      },
    ],
  },

  'passport-photo-maker': {
    answerFirst:
      'Passport & Visa Photo Maker helps crop and size a photo toward common passport dimensions (such as 2×2 in or 35×45 mm) in your browser.',
    seoTitle: 'Passport Photo Maker Online (2x2 & 35x45mm) | ToolVerse',
    seoDescription:
      'Create passport and visa sized photos from a selfie or studio shot. Crop to common sizes privately, then compress if the portal has a KB limit.',
    sections: [
      {
        heading: 'Size first, then file size',
        body: 'Governments care about dimensions and background rules. Portals also enforce KB limits. Crop to the required size here, then use Compress Image to Target Size if the upload still fails.',
      },
      {
        heading: 'Photo quality tips',
        body: 'Use even lighting, a plain background when required, and a recent forward-facing photo. Soft phone filters can cause rejections.',
      },
      {
        heading: 'Always check the official checklist',
        body: 'Each country and visa type has its own rules (ears visible, glasses, smile). This tool helps with sizing — it does not certify compliance.',
      },
    ],
    faqs: [
      {
        question: 'Does this guarantee embassy acceptance?',
        answer:
          'No. It helps you size a photo. Follow the official photo guide for your passport or visa type.',
      },
      {
        question: 'What if the portal rejects for file size?',
        answer:
          'Compress the finished JPG to the stated KB limit with Compress Image to Target Size.',
      },
      {
        question: 'Is my face photo uploaded?',
        answer:
          'No. Editing runs in your browser for this tool.',
      },
    ],
  },

  'invoice-generator': {
    answerFirst:
      'PDF Invoice Generator builds a downloadable invoice PDF from your business details, line items, and totals — useful for freelancers who need a clean bill fast.',
    seoTitle: 'Free PDF Invoice Generator Online | ToolVerse',
    seoDescription:
      'Create a professional PDF invoice in your browser. Add line items and totals, then download — no account required for basic use.',
    sections: [
      {
        heading: 'Freelance and small-business billing',
        body: 'Send a clear invoice with your name, client, dates, and itemized work. Keep numbering consistent so accounting stays tidy.',
      },
      {
        heading: 'What to include',
        body: 'Business identity, client details, invoice number, issue date, due date, line items, tax if applicable, and payment instructions. Local tax rules vary — confirm with your accountant.',
      },
      {
        heading: 'Privacy',
        body: 'Invoice data is assembled in your browser for PDF download. Prefer not to enter secrets you would not put on the PDF itself.',
      },
    ],
    faqs: [
      {
        question: 'Can I reuse invoices later?',
        answer:
          'Download and archive the PDF in your own folders or accounting app. ToolVerse is not a full invoicing SaaS with cloud history.',
      },
      {
        question: 'Does this calculate sales tax automatically for every country?',
        answer:
          'Enter tax amounts that match your jurisdiction. Pair with VAT/GST Calculator if you need a quick rate estimate.',
      },
      {
        question: 'Is client data stored on ToolVerse?',
        answer:
          'The PDF is generated in your browser session for this tool.',
      },
    ],
  },

  'utm-builder': {
    answerFirst:
      'UTM Campaign Link Builder appends standard utm_source, utm_medium, utm_campaign (and optional content/term) parameters to a URL for analytics tracking.',
    seoTitle: 'UTM Builder — Campaign URL Generator | ToolVerse',
    seoDescription:
      'Build clean Google Analytics UTM links with source, medium, and campaign fields. Copy a tracking URL without messy manual editing.',
    sections: [
      {
        heading: 'Consistent naming beats clever naming',
        body: 'Pick a simple convention (for example email / newsletter / launch_april) and stick to it. Mixed casing and spaces make reports harder to read.',
      },
      {
        heading: 'Where UTMs help',
        body: 'Email blasts, influencer bios, paid social, partner posts, and QR destinations that should attribute traffic in analytics.',
      },
      {
        heading: 'Do not UTM internal links',
        body: 'Adding campaign parameters on your own nav links can overwrite session attribution. Use UTMs on promotional entry points.',
      },
    ],
    faqs: [
      {
        question: 'What is utm_source vs utm_medium?',
        answer:
          'Source is where traffic comes from (google, newsletter, linkedin). Medium is the channel type (cpc, email, social).',
      },
      {
        question: 'Will UTMs break my page?',
        answer:
          'Most sites ignore unknown query params. Avoid reserved characters; the builder encodes values for you.',
      },
      {
        question: 'Is this only for Google Analytics?',
        answer:
          'UTM names are a de-facto standard many analytics tools understand, including GA-style reports.',
      },
    ],
  },

  'json-formatter': {
    answerFirst:
      'JSON Formatter & Validator beautifies or minifies JSON and flags syntax errors so API payloads are easier to read and debug — locally in your browser.',
    seoTitle: 'JSON Formatter & Validator Online | ToolVerse',
    seoDescription:
      'Pretty-print, minify, and validate JSON in your browser. Useful for API debugging without pasting secrets into unknown sites.',
    sections: [
      {
        heading: 'Debug APIs without leaking tokens',
        body: 'Staging responses often contain tokens or PII. Format them locally instead of pasting into a hosted beautifier that may log input.',
      },
      {
        heading: 'Beautify vs minify',
        body: 'Beautify for humans. Minify when you need a compact single-line payload for certain forms or config fields.',
      },
      {
        heading: 'Related conversions',
        body: 'Need tabular data? Convert with JSON to CSV after the JSON is valid.',
      },
    ],
    faqs: [
      {
        question: 'Why is my JSON invalid?',
        answer:
          'Common causes: trailing commas, single quotes, or comments. Strict JSON allows none of those.',
      },
      {
        question: 'Is my JSON uploaded?',
        answer:
          'No. Formatting and validation run in your browser.',
      },
      {
        question: 'Can it fix JSON automatically?',
        answer:
          'It validates and formats valid JSON. Structural errors must be corrected in the source text.',
      },
    ],
  },

  'age-calculator': {
    answerFirst:
      'Age Calculator computes exact age in years, months, and days from a date of birth to today (or another end date).',
    seoTitle: 'Age Calculator — Exact Years, Months, Days | ToolVerse',
    seoDescription:
      'Find exact age from date of birth. See years, months, and days for forms, milestones, and quick checks.',
    sections: [
      {
        heading: 'More than “how old am I?”',
        body: 'Useful for school age cutoffs, contest eligibility, and HR forms that ask for precise age rather than birth year alone.',
      },
      {
        heading: 'Leap years and end dates',
        body: 'The calculator accounts for calendar differences between birth date and the end date you choose. Always double-check legal age rules for contracts and visas.',
      },
    ],
    faqs: [
      {
        question: 'Can I calculate age on a future date?',
        answer:
          'Yes if the tool allows a custom end date — set the date you care about (for example a school admission cutoff).',
      },
      {
        question: 'Is my date of birth stored?',
        answer:
          'No. The calculation runs locally in your browser.',
      },
    ],
  },

  'percentage-calculator': {
    answerFirst:
      'Percentage Calculator finds percent of a number, percent increase/decrease, and percent difference for quick school, shopping, and business math.',
    seoTitle: 'Percentage Calculator Online (Increase & Difference) | ToolVerse',
    seoDescription:
      'Calculate percentages, percent change, and percent difference instantly in your browser — no spreadsheet required.',
    sections: [
      {
        heading: 'Everyday percentage problems',
        body: 'What is 18% of 2,450? What is the percent increase from last month’s sales? This tool covers the common variants without opening a spreadsheet.',
      },
      {
        heading: 'Related calculators',
        body: 'For sale prices use Discount Calculator. For loan payments use EMI Calculator. For markup use Profit Margin Calculator.',
      },
    ],
    faqs: [
      {
        question: 'How do I calculate percent increase?',
        answer:
          'Enter the original and new values in the increase mode. The tool returns the percentage change.',
      },
      {
        question: 'Is percent difference the same as percent change?',
        answer:
          'Not always. Percent change is directional from an old value; percent difference often compares two values relative to their average. Use the mode that matches your formula.',
      },
    ],
  },

  'images-to-pdf': {
    answerFirst:
      'Multiple Images to PDF combines several photos into one PDF document in your browser — useful for evidence packs and photo sets.',
    seoTitle: 'Images to PDF Converter (Bulk Photos) | ToolVerse',
    seoDescription:
      'Turn multiple JPG or PNG files into one PDF without uploading. Ideal for scanned page sets and photo bundles.',
    sections: [
      {
        heading: 'Bulk photos, one attachment',
        body: 'Portals and email threads often want a single PDF. Order images carefully before converting so page sequence matches your narrative.',
      },
      {
        heading: 'When to use JPG to PDF instead',
        body: 'For one image with margin/orientation controls, JPG to PDF may be simpler. For many files, this bulk tool is faster.',
      },
    ],
    faqs: [
      {
        question: 'Is there a limit on how many images?',
        answer:
          'Browser memory is the practical limit. Very large phone photo sets may need compressing first.',
      },
      {
        question: 'Are photos uploaded?',
        answer:
          'No. PDF assembly runs in your browser.',
      },
    ],
  },

  'pdf-rotate': {
    answerFirst:
      'Rotate PDF Pages turns selected pages 90°, 180°, or 270° in your browser so sideways scans become readable before you send or print.',
    seoTitle: 'Rotate PDF Pages Online Free | ToolVerse',
    seoDescription:
      'Rotate PDF pages left or right without uploading. Fix phone scans and landscape pages privately in your browser.',
    sections: [
      {
        heading: 'Fix sideways phone scans',
        body: 'Camera-captured PDFs often land sideways. Rotate pages before merging into an application pack or emailing a client.',
      },
      {
        heading: 'Combine with reorder and merge',
        body: 'After rotation, use Reorder PDF Pages or Merge PDF if you still need a different sequence or a multi-file pack.',
      },
    ],
    faqs: [
      {
        question: 'Can I rotate only some pages?',
        answer:
          'Yes — select the pages that need rotation, choose the angle, then download the updated PDF.',
      },
      {
        question: 'Is the PDF uploaded?',
        answer: 'No. Rotation runs in your browser for this tool.',
      },
    ],
  },

  'pdf-reorder-pages': {
    answerFirst:
      'Reorder PDF Pages lets you drag pages into a new sequence and download a fixed PDF — useful when scans or merges landed out of order.',
    seoTitle: 'Reorder PDF Pages Online | ToolVerse',
    seoDescription:
      'Rearrange PDF page order in your browser. Drag pages into place, then download — no cloud upload for this tool.',
    sections: [
      {
        heading: 'When merge order was wrong',
        body: 'If you merged files in the wrong sequence, reorder pages here instead of starting over from scratch.',
      },
      {
        heading: 'Check once before submitting',
        body: 'Open the downloaded PDF and flip through quickly — page order mistakes are common on multi-scan jobs.',
      },
    ],
    faqs: [
      {
        question: 'Does reordering upload my file?',
        answer: 'No. Page order is updated locally in your browser.',
      },
      {
        question: 'Can I delete pages here?',
        answer:
          'This tool focuses on order. To drop pages, extract what you need with Split PDF, then merge.',
      },
    ],
  },

  'image-resizer': {
    answerFirst:
      'Image Resizer changes width and height of a photo or graphic in your browser — for thumbnails, banners, and dimension-limited uploads.',
    seoTitle: 'Image Resizer Online — Width & Height | ToolVerse',
    seoDescription:
      'Resize images to exact pixel dimensions without uploading. Keep aspect ratio or set custom width and height.',
    sections: [
      {
        heading: 'Pixels vs file size',
        body: 'Resizing dimensions and compressing bytes are different jobs. Shrink pixels here first, then use Image Compressor or Target Size if a portal still rejects the file for KB limits.',
      },
      {
        heading: 'Social presets',
        body: 'For Instagram, YouTube, or LinkedIn sizes, Social Media Image Resizer applies common presets faster than typing pixels each time.',
      },
    ],
    faqs: [
      {
        question: 'Will resizing crop my image?',
        answer:
          'Resizing scales dimensions. For a tight crop first, use Image Cropper, then resize.',
      },
      {
        question: 'Is my image uploaded?',
        answer: 'No. Resizing runs in your browser.',
      },
    ],
  },

  'social-media-image-resizer': {
    answerFirst:
      'Social Media Image Resizer scales images to common platform sizes (Instagram, YouTube, TikTok, LinkedIn, Facebook) so posts are not awkward-cropped after upload.',
    seoTitle: 'Social Media Image Resizer (IG, YouTube, LinkedIn) | ToolVerse',
    seoDescription:
      'Resize creatives to Instagram, YouTube, TikTok, LinkedIn, and Facebook dimensions in your browser — free presets, no account.',
    sections: [
      {
        heading: 'Match the platform canvas',
        body: 'Each network crops differently. Presets reduce trial-and-error when exporting from a phone camera roll or design export.',
      },
      {
        heading: 'Export then compress if needed',
        body: 'Large PNG exports can still be heavy. After resizing, compress for faster uploads when quality allows.',
      },
    ],
    faqs: [
      {
        question: 'Are presets exact forever?',
        answer:
          'Platforms change recommended sizes occasionally. Treat presets as practical defaults and confirm in the latest creator docs if a launch is critical.',
      },
      {
        question: 'Do you store my creatives?',
        answer: 'No. Processing stays in your browser for this tool.',
      },
    ],
  },

  'image-cropper': {
    answerFirst:
      'Image Cropper trims a photo to the area you select — useful before compression, passport sizing, or social uploads.',
    seoTitle: 'Crop Image Online Free | ToolVerse',
    seoDescription:
      'Crop photos in your browser without uploading. Trim to a subject or square frame, then download the result.',
    sections: [
      {
        heading: 'Crop before aggressive compression',
        body: 'Removing empty background first means fewer pixels to encode — target-KB tools produce clearer faces when you crop tightly first.',
      },
      {
        heading: 'Square and profile frames',
        body: 'For profile-style squares, crop to the face area, then resize if a platform expects a specific pixel size.',
      },
    ],
    faqs: [
      {
        question: 'Is cropping lossless?',
        answer:
          'You download a new image of the selected region. Re-encoding format depends on the export type.',
      },
      {
        question: 'Are photos uploaded?',
        answer: 'No. Cropping runs locally in your browser.',
      },
    ],
  },

  'jpg-to-webp': {
    answerFirst:
      'JPG/PNG to WebP Converter creates smaller WebP images for modern websites while conversion stays in your browser.',
    seoTitle: 'JPG/PNG to WebP Converter Online | ToolVerse',
    seoDescription:
      'Convert JPG or PNG to WebP for faster pages. Private browser conversion — download and use in your CMS.',
    sections: [
      {
        heading: 'Why WebP for the web',
        body: 'WebP often beats JPEG at similar visual quality for photos on the web, which helps page weight and load time.',
      },
      {
        heading: 'Fallback formats',
        body: 'Some email clients and older apps still prefer JPG. Keep a JPG copy when interoperability matters more than bytes.',
      },
    ],
    faqs: [
      {
        question: 'Will every browser open WebP?',
        answer:
          'Modern browsers do. If you must support very old clients, keep JPG/PNG alternatives.',
      },
      {
        question: 'Is the image uploaded?',
        answer: 'No. Conversion runs in your browser.',
      },
    ],
  },

  'webp-to-jpg': {
    answerFirst:
      'WebP to JPG Converter turns WebP images into widely compatible JPG files for forms, email, and older software.',
    seoTitle: 'WebP to JPG Converter Online | ToolVerse',
    seoDescription:
      'Convert WebP images to JPG in your browser when a portal or app rejects WebP uploads.',
    sections: [
      {
        heading: 'When portals reject WebP',
        body: 'Many government and ATS forms still whitelist JPG/PNG only. Convert once, then compress if a KB cap applies.',
      },
    ],
    faqs: [
      {
        question: 'Does conversion reduce quality?',
        answer:
          'JPG is lossy. Use a high-quality setting when you need clarity for ID-style photos.',
      },
      {
        question: 'Is my file uploaded?',
        answer: 'No. Conversion is local in the browser.',
      },
    ],
  },

  'character-counter': {
    answerFirst:
      'Character Counter tracks exact character counts (with and without spaces) against common caps like SMS, tweets, and meta titles.',
    seoTitle: 'Character Counter Online (SMS, Tweets, Meta) | ToolVerse',
    seoDescription:
      'Count characters for SMS, social captions, and SEO titles. Live totals in your browser — private and free.',
    sections: [
      {
        heading: 'Platform limits vs word count',
        body: 'Social ads and SMS care about characters, not words. Use this tool for hard caps; use Word Counter for essays and articles.',
      },
      {
        heading: 'Emojis and special characters',
        body: 'Some platforms count emojis as more than one unit. Treat the counter as a guide and preview in the target app when the limit is tight.',
      },
    ],
    faqs: [
      {
        question: 'Does this count words too?',
        answer:
          'It focuses on characters and common platform limits. For full writing stats, open Word Counter.',
      },
      {
        question: 'Is my copy stored?',
        answer: 'No. Counting runs locally in your browser.',
      },
    ],
  },

  'text-case-converter': {
    answerFirst:
      'Text Case Converter switches text between UPPERCASE, lowercase, Title Case, and related styles without retyping.',
    seoTitle: 'Text Case Converter (Upper, Lower, Title) | ToolVerse',
    seoDescription:
      'Convert text to upper, lower, or title case instantly in your browser. Handy for headlines and messy pasted copy.',
    sections: [
      {
        heading: 'Cleanup for headlines and data',
        body: 'Paste messy ALL CAPS lists or lowercase titles, convert once, then copy into docs or CMS fields.',
      },
    ],
    faqs: [
      {
        question: 'Does Title Case follow a style guide?',
        answer:
          'It applies a practical title-style transform. Publishing houses may still want manual tweaks for short words.',
      },
      {
        question: 'Is text uploaded?',
        answer: 'No. Conversion stays in your browser.',
      },
    ],
  },

  'remove-duplicate-lines': {
    answerFirst:
      'Remove Duplicate Lines dedupes pasted lists so each line appears once — useful for emails, SKUs, and messy exports.',
    seoTitle: 'Remove Duplicate Lines Online | ToolVerse',
    seoDescription:
      'Deduplicate text lines in your browser. Clean email lists, SKUs, and exports without a spreadsheet.',
    sections: [
      {
        heading: 'Lists without spreadsheet churn',
        body: 'Paste a column of values, remove duplicates, and copy the unique set back — faster than filtering in Excel for small jobs.',
      },
    ],
    faqs: [
      {
        question: 'Is matching case-sensitive?',
        answer:
          'Follow the tool options if available. When in doubt, normalize case first with Text Case Converter.',
      },
      {
        question: 'Is my list uploaded?',
        answer: 'No. Deduping runs locally.',
      },
    ],
  },

  'discount-calculator': {
    answerFirst:
      'Discount & Sale Price Calculator turns a list price and discount percent into the final price and amount saved.',
    seoTitle: 'Discount Calculator — Sale Price & Savings | ToolVerse',
    seoDescription:
      'Calculate sale price and savings from a discount percent. Quick shopping and promo math in your browser.',
    sections: [
      {
        heading: 'Stacking and tax',
        body: 'This tool handles a straightforward discount. Stacked coupons or tax-inclusive pricing may need an extra step — pair with VAT/GST Calculator when tax is separate.',
      },
    ],
    faqs: [
      {
        question: 'How do I find the sale price?',
        answer:
          'Enter the original price and discount percent. The tool returns the discounted price and savings.',
      },
      {
        question: 'Are amounts stored?',
        answer: 'No. Math runs in your browser.',
      },
    ],
  },

  'compound-interest-calculator': {
    answerFirst:
      'Compound Interest Calculator estimates future value from principal, rate, compounding frequency, and time — for planning, not investment advice.',
    seoTitle: 'Compound Interest Calculator Online | ToolVerse',
    seoDescription:
      'Estimate compound growth from principal, rate, and time. Educational calculator — verify with your bank or advisor for real products.',
    sections: [
      {
        heading: 'What compounding assumes',
        body: 'Results assume the rate and schedule you enter. Real products may change rates, charge fees, or compound on different day-count rules.',
      },
      {
        heading: 'Loans vs investments',
        body: 'For monthly loan payments, use EMI Calculator. This tool focuses on growth-style compound interest estimates.',
      },
    ],
    faqs: [
      {
        question: 'Is this financial advice?',
        answer:
          'No. It is an educational estimate. Confirm product terms with your provider.',
      },
      {
        question: 'Are my numbers stored?',
        answer: 'No. Calculations stay in your browser.',
      },
    ],
  },

  'gpa-calculator': {
    answerFirst:
      'GPA & CGPA Calculator converts course grades and credit hours into a grade-point average for semester planning.',
    seoTitle: 'GPA & CGPA Calculator Online | ToolVerse',
    seoDescription:
      'Calculate GPA or CGPA from grades and credits. Student planning tool — confirm scale rules with your school.',
    sections: [
      {
        heading: 'Know your scale',
        body: 'Schools use 4.0, 4.3, percentage, or letter maps differently. Enter grades the way your transcript defines them, or convert first.',
      },
    ],
    faqs: [
      {
        question: 'Does this match my university formula?',
        answer:
          'It follows a standard credit-weighted approach. Always verify against your registrar’s rules.',
      },
      {
        question: 'Is my data stored?',
        answer: 'No. Calculations run locally.',
      },
    ],
  },

  'url-shortener': {
    answerFirst:
      'Privacy URL Shortener creates shorter links for sharing when you need a compact URL for bios, print, or QR destinations.',
    seoTitle: 'URL Shortener Online | ToolVerse',
    seoDescription:
      'Shorten long links for sharing. Use with UTM Builder and QR Code Generator for campaign-friendly URLs.',
    sections: [
      {
        heading: 'Short links and tracking',
        body: 'Build campaign parameters with UTM Builder first, then shorten the full tracking URL if you need a compact form for print or social bios.',
      },
      {
        heading: 'Trust and destinations',
        body: 'Only shorten URLs you control or trust. Recipients should know where a short link leads.',
      },
    ],
    faqs: [
      {
        question: 'Do short links expire?',
        answer:
          'Retention depends on how the shortener stores mappings. Keep your own backup of the destination URL for important campaigns.',
      },
      {
        question: 'Can I QR a short link?',
        answer:
          'Yes — paste the short URL into QR Code Generator for posters and packaging.',
      },
    ],
  },

  'vat-gst-calculator': {
    answerFirst:
      'VAT & GST Calculator adds or removes tax from a net or gross amount using the rate you enter — handy for invoices and quotes.',
    seoTitle: 'VAT & GST Calculator Online | ToolVerse',
    seoDescription:
      'Add or remove VAT/GST from prices with a custom rate. Useful for quotes and invoices — confirm your local tax rules.',
    sections: [
      {
        heading: 'Net vs gross',
        body: 'Some prices are tax-exclusive; others already include tax. Choose the direction that matches how you quote clients.',
      },
      {
        heading: 'Not a filing tool',
        body: 'Rates and rules differ by country and product type. Use this for arithmetic, then confirm with your accountant or tax authority.',
      },
    ],
    faqs: [
      {
        question: 'Which VAT rate should I use?',
        answer:
          'Enter the rate that applies to your jurisdiction and goods/services. The calculator does not pick the legal rate for you.',
      },
      {
        question: 'Are figures stored?',
        answer: 'No. Math runs in your browser.',
      },
    ],
  },

  'hash-generator': {
    answerFirst:
      'Hash Generator creates checksums (such as SHA-256) from text in your browser — useful for quick integrity checks and learning hashes.',
    seoTitle: 'Hash Generator (SHA) Online | ToolVerse',
    seoDescription:
      'Generate cryptographic hashes from text locally with Web Crypto. Handy for checksums and developer workflows.',
    sections: [
      {
        heading: 'Hashes are one-way',
        body: 'A hash verifies integrity or compares values; it is not encryption. Never hash passwords with a raw SHA alone for storage — use a proper password hashing scheme in your app.',
      },
    ],
    faqs: [
      {
        question: 'Is my text uploaded?',
        answer: 'No. Hashing uses browser crypto APIs locally.',
      },
      {
        question: 'Can I reverse a hash?',
        answer:
          'Not practically for strong algorithms. Hashes are designed to be one-way.',
      },
    ],
  },

  'uuid-generator': {
    answerFirst:
      'UUID / GUID Generator creates random version-4 UUIDs individually or in bulk for IDs, tests, and correlation keys.',
    seoTitle: 'UUID Generator (GUID v4) Online | ToolVerse',
    seoDescription:
      'Generate RFC 4122 UUID v4 values in your browser — single or bulk — with Web Crypto randomness.',
    sections: [
      {
        heading: 'Good for keys, not secrets alone',
        body: 'UUIDs are unique identifiers. For passwords or API secrets, prefer Password Generator or your platform’s secret tooling.',
      },
    ],
    faqs: [
      {
        question: 'Are UUIDs stored on ToolVerse?',
        answer: 'No. They are generated in your browser session.',
      },
      {
        question: 'Is UUID v4 safe for database primary keys?',
        answer:
          'Many systems use v4 UUIDs successfully. Consider index and storage trade-offs for your database.',
      },
    ],
  },

  'profit-margin-calculator': {
    answerFirst:
      'Profit Margin Calculator estimates margin and markup from cost and selling price — useful for pricing drafts and freelance quotes.',
    seoTitle: 'Profit Margin Calculator Online | ToolVerse',
    seoDescription:
      'Calculate profit margin and markup from cost and price. Quick pricing math for shops and freelancers.',
    sections: [
      {
        heading: 'Margin vs markup',
        body: 'Margin is profit divided by selling price; markup is profit divided by cost. Mixing them up leads to underpricing — check which your team uses.',
      },
      {
        heading: 'Pair with invoices',
        body: 'Once price is set, generate a PDF invoice for the client with Invoice Generator.',
      },
    ],
    faqs: [
      {
        question: 'Does this include tax?',
        answer:
          'Enter amounts consistently (tax-in or tax-out). Use VAT/GST Calculator when you need to separate tax.',
      },
      {
        question: 'Are numbers stored?',
        answer: 'No. Calculations run locally.',
      },
    ],
  },

  'jpg-to-png': {
    answerFirst:
      'JPG to PNG Converter turns JPEG photos into PNG files when you need transparency support or a lossless-style export for graphics workflows.',
    seoTitle: 'JPG to PNG Converter Online Free | ToolVerse',
    seoDescription:
      'Convert JPG/JPEG images to PNG in your browser. Useful before editing graphics — no upload required for this tool.',
    sections: [
      {
        heading: 'When PNG helps',
        body: 'PNG is better for flat graphics, screenshots with text, and workflows that expect PNG. Photos often stay smaller as JPG or WebP.',
      },
      {
        heading: 'Size trade-off',
        body: 'PNG from a photo can be larger than the original JPG. Compress or convert to WebP if page weight matters more than format.',
      },
    ],
    faqs: [
      {
        question: 'Does JPG to PNG improve photo quality?',
        answer:
          'No. You cannot recover detail lost in JPG compression. PNG mainly changes the container/format.',
      },
      {
        question: 'Is my image uploaded?',
        answer: 'No. Conversion runs in your browser.',
      },
    ],
  },

  'png-to-jpg': {
    answerFirst:
      'PNG to JPG Converter creates JPEG files from PNGs for smaller photo uploads and forms that reject PNG.',
    seoTitle: 'PNG to JPG Converter Online Free | ToolVerse',
    seoDescription:
      'Convert PNG images to JPG privately in your browser. Handy for portals and email that prefer JPEG.',
    sections: [
      {
        heading: 'Transparency becomes a background',
        body: 'JPG has no alpha channel. Transparent PNG areas typically flatten to a solid background during conversion.',
      },
      {
        heading: 'After conversion',
        body: 'If a portal caps file size, run the JPG through Image Compressor or Compress Image to Target Size.',
      },
    ],
    faqs: [
      {
        question: 'Will text look softer as JPG?',
        answer:
          'Heavy JPEG compression can blur sharp edges. Keep quality high for screenshots with text.',
      },
      {
        question: 'Is the file uploaded?',
        answer: 'No. Conversion is local in your browser.',
      },
    ],
  },

  'json-to-csv': {
    answerFirst:
      'JSON to CSV Converter turns JSON arrays/objects into spreadsheet-friendly CSV so you can open data in Excel or Sheets.',
    seoTitle: 'JSON to CSV Converter Online | ToolVerse',
    seoDescription:
      'Convert JSON to CSV in your browser for Excel/Sheets. Validate messy JSON first with JSON Formatter if needed.',
    sections: [
      {
        heading: 'Nested JSON caveats',
        body: 'Deeply nested objects may need flattening. Start with valid JSON — use JSON Formatter if parse errors appear.',
      },
      {
        heading: 'Privacy for API dumps',
        body: 'Staging payloads can contain tokens. Convert locally instead of pasting into hosted converters you do not trust.',
      },
    ],
    faqs: [
      {
        question: 'Can every JSON become CSV?',
        answer:
          'Arrays of similar objects work best. Irregular trees may need cleanup before a clean table export.',
      },
      {
        question: 'Is my JSON uploaded?',
        answer: 'No. Conversion runs in your browser.',
      },
    ],
  },

  'adsense-revenue-calculator': {
    answerFirst:
      'AdSense & Website Revenue Calculator estimates earnings from traffic, CTR, and CPC/RPM inputs — directional planning, not a payout guarantee.',
    seoTitle: 'AdSense Revenue Calculator (Estimate) | ToolVerse',
    seoDescription:
      'Estimate website or AdSense revenue from pageviews, CTR, and CPC/RPM. Educational only — real earnings vary by niche and geo.',
    sections: [
      {
        heading: 'RPM vs CPC models',
        body: 'Some publishers think in RPM (revenue per thousand pageviews); others model clicks × CPC. Use the inputs that match how you review Analytics.',
      },
      {
        heading: 'Why estimates miss real payouts',
        body: 'Seasonality, geo mix, ad viewability, and policy issues change results. Treat this as a scenario tool, then compare with your AdSense reports.',
      },
    ],
    faqs: [
      {
        question: 'Is this official Google AdSense math?',
        answer:
          'No. It is an independent estimate for planning. Your AdSense dashboard is the source of truth.',
      },
      {
        question: 'Are my traffic numbers stored?',
        answer: 'No. Calculations run locally in your browser.',
      },
    ],
  },

  'youtube-earnings-estimator': {
    answerFirst:
      'YouTube Earnings Estimator sketches income ranges from views and assumed CPM — useful for rough planning, not a promise of AdSense payouts.',
    seoTitle: 'YouTube Earnings Estimator (CPM Range) | ToolVerse',
    seoDescription:
      'Estimate YouTube revenue from views and CPM assumptions. Educational ranges only — actual RPM depends on niche, geo, and season.',
    sections: [
      {
        heading: 'CPM is not take-home',
        body: 'Creators are paid a share after Google’s cut, and RPM differs from advertiser CPM. Memberships, Super Thanks, and brand deals are separate.',
      },
      {
        heading: 'Use ranges, not single numbers',
        body: 'Try low/mid/high CPM assumptions. Compare with your YouTube Analytics revenue tab when monetized.',
      },
    ],
    faqs: [
      {
        question: 'Can I rely on this for taxes?',
        answer:
          'No. Use official payout statements and a tax professional for filings.',
      },
      {
        question: 'Are channel stats uploaded?',
        answer: 'No. Estimates run in your browser.',
      },
    ],
  },

  'text-diff-checker': {
    answerFirst:
      'Text & Code Diff Checker compares two text blocks and highlights differences — useful for drafts, configs, and code snippets.',
    seoTitle: 'Text Diff Checker Online (Compare Two Texts) | ToolVerse',
    seoDescription:
      'Compare two texts side by side and spot changes instantly. Private in-browser diff for writing and code snippets.',
    sections: [
      {
        heading: 'Draft revisions without Word trackers',
        body: 'Paste an old paragraph and a new one to see what changed before you publish or submit.',
      },
      {
        heading: 'Config and JSON peeks',
        body: 'For structured JSON, format both sides with JSON Formatter first so diffs are readable.',
      },
    ],
    faqs: [
      {
        question: 'Is my text uploaded?',
        answer: 'No. Diffing runs locally in your browser.',
      },
      {
        question: 'Does it support file upload?',
        answer:
          'Paste text directly. For large files, copy the sections you need to compare.',
      },
    ],
  },

  'readability-score': {
    answerFirst:
      'Readability Score Checker estimates how easy a passage is to read (for example Flesch-style metrics) so you can simplify dense drafts.',
    seoTitle: 'Readability Score Checker Online | ToolVerse',
    seoDescription:
      'Check reading ease and grade-level style scores for your text. Private browser analysis for clearer writing.',
    sections: [
      {
        heading: 'Scores are guides, not grades',
        body: 'Academic papers and legal text score “hard” on purpose. Match readability to your audience instead of chasing one number.',
      },
      {
        heading: 'Pair with sentence length checks',
        body: 'If scores look tough, Sentence Length Checker and Simple English Converter help you find long or dense lines to revise.',
      },
    ],
    faqs: [
      {
        question: 'Which formula do you use?',
        answer:
          'The tool reports common readability-style metrics from your text. Formulas vary slightly by implementation.',
      },
      {
        question: 'Is my essay stored?',
        answer: 'No. Analysis runs in your browser.',
      },
    ],
  },

  'repeated-word-finder': {
    answerFirst:
      'Repeated Word & Frequency Finder lists words you reuse often so you can vary vocabulary in essays and posts.',
    seoTitle: 'Repeated Word Finder Online | ToolVerse',
    seoDescription:
      'Find overused words and frequency counts in your draft. Browser-private helper for clearer writing.',
    sections: [
      {
        heading: 'Frequency is a signal, not a rule',
        body: 'Some repetition is normal (articles, topic nouns). Focus on content words that make prose feel stuck.',
      },
      {
        heading: 'Phrases vs words',
        body: 'For multi-word echoes, use Duplicate Phrase Finder after you clean single-word overuse.',
      },
    ],
    faqs: [
      {
        question: 'Does it ignore stop words?',
        answer:
          'Behavior depends on the tool filters. Skim the list and ignore tiny function words if they dominate.',
      },
      {
        question: 'Is text uploaded?',
        answer: 'No. Counting runs locally.',
      },
    ],
  },

  'duplicate-phrase-finder': {
    answerFirst:
      'Duplicate Phrase Finder highlights repeated multi-word phrases so you can tighten essays and reports.',
    seoTitle: 'Duplicate Phrase Finder Online | ToolVerse',
    seoDescription:
      'Detect repeated phrases in your writing. Useful for essays and reports — private in-browser scan.',
    sections: [
      {
        heading: 'Catch copy-paste leftovers',
        body: 'Long drafts often reuse the same transition phrases. Spot them here, then rewrite once.',
      },
    ],
    faqs: [
      {
        question: 'Is this a plagiarism checker?',
        answer:
          'No. It finds repetition inside your own text. It does not search the open web.',
      },
      {
        question: 'Is my draft uploaded?',
        answer: 'No. Scanning runs in your browser.',
      },
    ],
  },

  'passive-voice-finder': {
    answerFirst:
      'Passive Voice Finder highlights likely passive constructions so you can decide where active voice reads clearer.',
    seoTitle: 'Passive Voice Finder Online | ToolVerse',
    seoDescription:
      'Highlight passive voice in your draft. A writing aid — not every passive sentence needs changing.',
    sections: [
      {
        heading: 'Passive is sometimes correct',
        body: 'Methods sections and formal reports use passive voice on purpose. Change sentences only when clarity improves.',
      },
    ],
    faqs: [
      {
        question: 'Is detection perfect?',
        answer:
          'Heuristics can miss or over-flag edge cases. Use matches as review prompts.',
      },
      {
        question: 'Is text stored?',
        answer: 'No. Analysis is local in your browser.',
      },
    ],
  },

  'sentence-length-checker': {
    answerFirst:
      'Sentence Length Checker flags long sentences so you can split dense lines for readability.',
    seoTitle: 'Sentence Length Checker Online | ToolVerse',
    seoDescription:
      'Find long sentences in your draft and tighten them. Pairs well with Readability Score Checker.',
    sections: [
      {
        heading: 'Length vs clarity',
        body: 'A long sentence can still be clear. Use the list to spot piles of clauses that slow readers down.',
      },
    ],
    faqs: [
      {
        question: 'What counts as “long”?',
        answer:
          'The tool uses practical length thresholds. Adjust your rewriting to audience and genre.',
      },
      {
        question: 'Is my text uploaded?',
        answer: 'No. Checking runs in your browser.',
      },
    ],
  },

  'academic-tone-checker': {
    answerFirst:
      'Academic Tone Checker flags casual phrasing that may not fit formal essays so you can revise toward a more academic style.',
    seoTitle: 'Academic Tone Checker Online | ToolVerse',
    seoDescription:
      'Review your draft for casual tone vs academic style. Educational writing helper — follow your school’s guide.',
    sections: [
      {
        heading: 'Tone is contextual',
        body: 'Blog posts and reflective journals allow a warmer voice. Coursework often wants a more formal register — match the assignment.',
      },
      {
        heading: 'Next steps',
        body: 'Try Formal Tone Converter for phrasing experiments, then re-check readability so sentences do not become bloated.',
      },
    ],
    faqs: [
      {
        question: 'Will this guarantee a higher grade?',
        answer:
          'No. It is a revision aid. Rubrics, sources, and argument quality matter more.',
      },
      {
        question: 'Is my essay uploaded?',
        answer: 'No. Analysis runs locally.',
      },
    ],
  },

  'citation-generator': {
    answerFirst:
      'Citation Generator builds draft reference entries (for example APA-style fields) from the details you enter — always verify against your style guide.',
    seoTitle: 'Citation Generator Online (APA-Style Draft) | ToolVerse',
    seoDescription:
      'Generate draft citations from source details. Verify punctuation and rules with your required style manual.',
    sections: [
      {
        heading: 'Draft, then verify',
        body: 'Style manuals change and edge cases abound. Use the output as a starting point, then check your handbook or librarian guidance.',
      },
      {
        heading: 'Alphabetize the list',
        body: 'After you collect entries, Reference List Alphabetizer helps sort a bibliography draft.',
      },
    ],
    faqs: [
      {
        question: 'Do you support every citation style?',
        answer:
          'Focus on common academic formats available in the tool. Confirm required style with your instructor.',
      },
      {
        question: 'Is source data stored?',
        answer: 'No. Generation runs in your browser session.',
      },
    ],
  },

  'citation-checklist': {
    answerFirst:
      'Citation Checklist helps you spot missing citation elements before you submit a paper.',
    seoTitle: 'Citation Checklist for Essays | ToolVerse',
    seoDescription:
      'Walk through a practical citation checklist so drafts are less likely to miss authors, dates, or links.',
    sections: [
      {
        heading: 'Common misses',
        body: 'Forgotten access dates, missing DOIs, and mismatched in-text vs reference list entries cause avoidable revision rounds.',
      },
    ],
    faqs: [
      {
        question: 'Is this plagiarism detection?',
        answer:
          'No. It is a completeness checklist for your own sources.',
      },
      {
        question: 'Are my notes uploaded?',
        answer: 'No. The checklist runs in your browser.',
      },
    ],
  },

  'reference-list-alphabetizer': {
    answerFirst:
      'Reference List Alphabetizer sorts bibliography lines A–Z so your reference list is easier to finish.',
    seoTitle: 'Alphabetize Reference List Online | ToolVerse',
    seoDescription:
      'Sort bibliography or reference lines alphabetically in your browser before final formatting.',
    sections: [
      {
        heading: 'Sort then style',
        body: 'Alphabetize first, then fix hanging indents and italics in your word processor per your style guide.',
      },
    ],
    faqs: [
      {
        question: 'Does it format APA hanging indents?',
        answer:
          'It focuses on order. Apply hanging indents in Word/Docs afterward.',
      },
      {
        question: 'Is my list uploaded?',
        answer: 'No. Sorting is local.',
      },
    ],
  },

  'formal-tone-converter': {
    answerFirst:
      'Formal Tone Converter suggests a more formal rewrite of casual sentences for emails and academic drafts.',
    seoTitle: 'Formal Tone Converter Online | ToolVerse',
    seoDescription:
      'Rewrite casual text toward a more formal tone. Review suggestions before you send or submit.',
    sections: [
      {
        heading: 'Keep your meaning',
        body: 'Automatic tone shifts can sound stiff. Edit for your voice and the relationship with the reader.',
      },
    ],
    faqs: [
      {
        question: 'Is output ready to submit as-is?',
        answer:
          'Treat it as a draft. Proofread for accuracy and natural phrasing.',
      },
      {
        question: 'Is my text uploaded?',
        answer: 'No. Conversion runs in your browser for this tool.',
      },
    ],
  },

  'simple-english-converter': {
    answerFirst:
      'Simple English Converter helps simplify dense wording so more readers can follow your point.',
    seoTitle: 'Simple English Converter Online | ToolVerse',
    seoDescription:
      'Simplify complex sentences toward clearer English. Pair with Readability Score Checker to measure progress.',
    sections: [
      {
        heading: 'Clarity without dumbing down',
        body: 'Keep necessary technical terms; explain them. Simplify structure and filler first.',
      },
    ],
    faqs: [
      {
        question: 'Will it remove technical vocabulary?',
        answer:
          'Review the output. You may need to restore field-specific terms your audience expects.',
      },
      {
        question: 'Is text stored?',
        answer: 'No. Processing is local in your browser.',
      },
    ],
  },

  'essay-structure-checker': {
    answerFirst:
      'Essay Structure Checker reviews whether a draft has basic pieces (intro, body progression, conclusion cues) so you can reorganize before polishing sentences.',
    seoTitle: 'Essay Structure Checker Online | ToolVerse',
    seoDescription:
      'Check essay structure cues before you polish wording. A planning aid — follow your assignment rubric.',
    sections: [
      {
        heading: 'Structure before style',
        body: 'Fix missing thesis or weak section flow first. Then use readability and tone tools for sentence-level edits.',
      },
    ],
    faqs: [
      {
        question: 'Does this write my essay?',
        answer:
          'No. It helps you inspect structure. You still write and cite your own work.',
      },
      {
        question: 'Is my draft uploaded?',
        answer: 'No. Checking runs in your browser.',
      },
    ],
  },

  'base64-encoder-decoder': {
    answerFirst:
      'Base64 Encoder & Decoder converts text to Base64 and back in your browser — handy for data URLs and quick debugging.',
    seoTitle: 'Base64 Encoder Decoder Online | ToolVerse',
    seoDescription:
      'Encode or decode Base64 locally. Useful for developers debugging data URLs and tokens — do not paste production secrets into random sites.',
    sections: [
      {
        heading: 'Not encryption',
        body: 'Base64 is encoding, not secrecy. Anyone can decode it. Prefer real encryption and secret managers for sensitive values.',
      },
    ],
    faqs: [
      {
        question: 'Is my string uploaded?',
        answer: 'No. Encoding/decoding runs in your browser.',
      },
      {
        question: 'Can I encode files?',
        answer:
          'This tool focuses on text strings. For large binaries, use dedicated local tooling.',
      },
    ],
  },

  'lorem-ipsum-generator': {
    answerFirst:
      'Lorem Ipsum Generator creates placeholder text for mockups and layouts so designers can test typography without real copy.',
    seoTitle: 'Lorem Ipsum Generator Online | ToolVerse',
    seoDescription:
      'Generate dummy lorem ipsum text for wireframes and design drafts. Free, fast, browser-based.',
    sections: [
      {
        heading: 'Use for layout, not content',
        body: 'Replace placeholder text before publish. Accessibility reviews need real headings and meaningful copy.',
      },
    ],
    faqs: [
      {
        question: 'Can I set paragraph count?',
        answer:
          'Yes — use the controls to choose how much placeholder text you need.',
      },
      {
        question: 'Is anything stored?',
        answer: 'No. Generation is local.',
      },
    ],
  },

  'unit-converter-suite': {
    answerFirst:
      'Unit Converter Suite converts common measurements (length, weight, temperature, energy, and more) for homework and everyday checks.',
    seoTitle: 'Unit Converter Online (Length, Weight, Temp) | ToolVerse',
    seoDescription:
      'Convert units for length, mass, temperature, and more in your browser. Quick educational converter for school and daily use.',
    sections: [
      {
        heading: 'Precision and rounding',
        body: 'Scientific work may need more decimal places than everyday cooking conversions. Check significant figures for lab reports.',
      },
    ],
    faqs: [
      {
        question: 'Are conversions exact?',
        answer:
          'They use standard factors with normal floating-point limits. For legal metrology, use certified references.',
      },
      {
        question: 'Is input stored?',
        answer: 'No. Math runs locally.',
      },
    ],
  },

  'quotation-generator': {
    answerFirst:
      'Quotation & Estimate Generator builds a client-ready price estimate PDF from your line items, totals, and business details.',
    seoTitle: 'Quotation & Estimate PDF Generator | ToolVerse',
    seoDescription:
      'Create formal quotation and estimate PDFs for client proposals. Pair with invoices when the job is won.',
    sections: [
      {
        heading: 'Quote then invoice',
        body: 'Send a clear estimate first. When accepted, convert agreed totals into an invoice with Invoice Generator so numbering stays consistent.',
      },
      {
        heading: 'Pricing sanity checks',
        body: 'Use Profit Margin Calculator before you lock discounts so quotes stay profitable.',
      },
    ],
    faqs: [
      {
        question: 'Is this a signed contract?',
        answer:
          'No. It is a document helper. Add your own terms and legal review when needed.',
      },
      {
        question: 'Are client details stored on ToolVerse?',
        answer: 'PDF generation for this tool runs in your browser session.',
      },
    ],
  },

  'thesis-statement-checker': {
    answerFirst:
      'Thesis Statement Checklist helps you review length, clarity, and claim focus so your thesis is specific enough to guide an essay.',
    seoTitle: 'Thesis Statement Checker & Checklist | ToolVerse',
    seoDescription:
      'Evaluate thesis clarity and focus before you draft. Educational checklist — follow your assignment rubric.',
    sections: [
      {
        heading: 'Specific beats vague',
        body: 'A strong thesis takes a clear position and sets scope. If it could fit any paper, tighten the claim.',
      },
      {
        heading: 'Next writing steps',
        body: 'After the thesis holds, Essay Structure Checker and Academic Tone Checker help with organization and register.',
      },
    ],
    faqs: [
      {
        question: 'Will this write my thesis for me?',
        answer:
          'No. It is a review checklist. You write and revise your own claim.',
      },
      {
        question: 'Is my text uploaded?',
        answer: 'No. Checking runs in your browser.',
      },
    ],
  },

  'transition-word-helper': {
    answerFirst:
      'Transition Word & Phrase Helper lists connectors for addition, contrast, cause/effect, and conclusions so paragraphs flow more clearly.',
    seoTitle: 'Transition Words & Phrases Helper | ToolVerse',
    seoDescription:
      'Browse linking words by category with example usage for essays and reports. Browser-based writing aid.',
    sections: [
      {
        heading: 'Choose meaning, not decoration',
        body: 'Pick transitions that match the logical relationship. Overusing “however” or “moreover” makes prose stiff.',
      },
    ],
    faqs: [
      {
        question: 'Can I paste these into any essay style?',
        answer:
          'Yes as a vocabulary aid. Match tone to your discipline and instructor preferences.',
      },
      {
        question: 'Is anything stored?',
        answer: 'No. The helper runs locally in your browser.',
      },
    ],
  },

  'email-proofreading-checklist': {
    answerFirst:
      'Email Proofreading & Tone Checklist walks through subject, greeting, CTA, attachments, and tone before you hit send.',
    seoTitle: 'Email Proofreading Checklist Online | ToolVerse',
    seoDescription:
      'Proofread professional emails with a practical checklist for subject lines, tone, and attachments.',
    sections: [
      {
        heading: 'Subject and ask',
        body: 'Clear subjects and one obvious next step reduce follow-up loops. Soften or formalize tone with Formal Tone Converter when needed.',
      },
    ],
    faqs: [
      {
        question: 'Does this send email for me?',
        answer: 'No. It is a pre-send checklist only.',
      },
      {
        question: 'Is email content uploaded?',
        answer: 'No. The checklist runs in your browser.',
      },
    ],
  },

  'assignment-submission-checklist': {
    answerFirst:
      'Assignment Submission Checklist helps you verify format, IDs, citations, margins, and deadlines before you upload coursework.',
    seoTitle: 'Assignment Submission Checklist | ToolVerse',
    seoDescription:
      'Check file format, cover details, citations, and deadlines before submitting homework or term papers.',
    sections: [
      {
        heading: 'Portal upload failures',
        body: 'If PDFs or photos fail size checks, use PDF Merge / Compress Image to Target Size, then re-upload.',
      },
    ],
    faqs: [
      {
        question: 'Does this submit to my university?',
        answer: 'No. You still upload through your school’s portal.',
      },
      {
        question: 'Is my assignment stored?',
        answer: 'No. The checklist is local.',
      },
    ],
  },

  'originality-checklist': {
    answerFirst:
      'Ethical Originality & Citation Checklist is a self-review for quotes, paraphrases, and source logging — not a plagiarism score or Turnitin bypass.',
    seoTitle: 'Originality & Citation Ethics Checklist | ToolVerse',
    seoDescription:
      'Ethical self-check for citations and quotations. No fake plagiarism scores — follow your institution’s integrity rules.',
    sections: [
      {
        heading: 'What this is not',
        body: 'It does not scan the web, evade detectors, or guarantee a similarity percentage. Use it to catch missing citations before submission.',
      },
    ],
    faqs: [
      {
        question: 'Is this a plagiarism detector?',
        answer:
          'No. It is an integrity checklist for your own process.',
      },
      {
        question: 'Are drafts uploaded?',
        answer: 'No. Review stays in your browser.',
      },
    ],
  },

  'equation-solver': {
    answerFirst:
      'Quadratic & Linear Equation Solver finds roots for ax²+bx+c=0 and simple linear forms, with discriminant-aware handling for homework checks.',
    seoTitle: 'Quadratic & Linear Equation Solver | ToolVerse',
    seoDescription:
      'Solve quadratic and linear equations online. See roots from standard coefficients — educational math helper.',
    sections: [
      {
        heading: 'Check your algebra steps',
        body: 'Use the solver to verify answers after you attempt the work. For matrices, open Matrix & Vector Calculator.',
      },
    ],
    faqs: [
      {
        question: 'Does it show every school method?',
        answer:
          'It focuses on standard root results. Write full working as your teacher requires.',
      },
      {
        question: 'Are equations stored?',
        answer: 'No. Solving runs locally.',
      },
    ],
  },

  'matrix-vector-calculator': {
    answerFirst:
      'Matrix & Vector Calculator computes 2×2/3×3 determinants, transpose, and related vector operations for linear-algebra practice.',
    seoTitle: 'Matrix Determinant & Vector Calculator | ToolVerse',
    seoDescription:
      'Calculate 2x2 and 3x3 determinants, transpose, and vector products in your browser.',
    sections: [
      {
        heading: 'Small matrices, clear checks',
        body: 'Handy for verifying homework on 2×2 and 3×3 systems. Larger systems need dedicated CAS software.',
      },
    ],
    faqs: [
      {
        question: 'Can it invert every matrix?',
        answer:
          'Singular matrices have no inverse. The tool reports what the inputs allow.',
      },
      {
        question: 'Is input stored?',
        answer: 'No. Calculations are local.',
      },
    ],
  },

  'target-cgpa-calculator': {
    answerFirst:
      'Target CGPA Calculator estimates the semester GPA you need next to reach a graduation CGPA goal.',
    seoTitle: 'Target CGPA & Required GPA Calculator | ToolVerse',
    seoDescription:
      'Find the GPA you need next semester to hit a target CGPA. Planning aid — confirm with your registrar’s formula.',
    sections: [
      {
        heading: 'Credits matter',
        body: 'Required GPA depends on remaining credit hours. Enter realistic credit loads for upcoming terms.',
      },
      {
        heading: 'Pair with current GPA',
        body: 'Compute current standing with GPA Calculator, then plan the target here.',
      },
    ],
    faqs: [
      {
        question: 'Does every university use the same formula?',
        answer:
          'No. Credit weighting differs. Verify against your transcript rules.',
      },
      {
        question: 'Is data stored?',
        answer: 'No. Math runs in your browser.',
      },
    ],
  },

  'attendance-calculator': {
    answerFirst:
      'Attendance Calculator estimates how many classes you can miss — or must attend — to stay above a target like 75%.',
    seoTitle: 'Attendance Calculator (75% Target) | ToolVerse',
    seoDescription:
      'Calculate classes you can bunk or must attend to reach your attendance percentage target.',
    sections: [
      {
        heading: 'Policies differ',
        body: 'Some schools count labs separately or freeze attendance early. Treat this as arithmetic, then confirm with your department.',
      },
    ],
    faqs: [
      {
        question: 'Is 75% universal?',
        answer:
          'No. Enter your required percentage. Many institutions use 75%, but yours may differ.',
      },
      {
        question: 'Are numbers stored?',
        answer: 'No. Calculations are local.',
      },
    ],
  },

  'ats-resume-checker': {
    answerFirst:
      'ATS Resume & Action Verb Checklist reviews formatting cues and suggests stronger verbs so your resume is easier for applicant-tracking systems to parse.',
    seoTitle: 'ATS Resume Checker & Action Verbs | ToolVerse',
    seoDescription:
      'Check resume structure cues and browse action verbs. Pair with Cover Letter Generator for applications.',
    sections: [
      {
        heading: 'ATS-friendly habits',
        body: 'Simple headings, standard section names, and text (not only icons) improve parse rates. Always tailor keywords to the job ad.',
      },
    ],
    faqs: [
      {
        question: 'Does this guarantee interviews?',
        answer:
          'No. It is a formatting and language aid. Experience and fit matter most.',
      },
      {
        question: 'Is my resume uploaded?',
        answer: 'No. Review runs in your browser for this tool.',
      },
    ],
  },

  'cover-letter-generator': {
    answerFirst:
      'Cover Letter Builder helps you assemble a professional job or internship cover letter PDF from your details and role context.',
    seoTitle: 'Cover Letter Generator (PDF) | ToolVerse',
    seoDescription:
      'Build a personalized cover letter PDF for job applications. Edit carefully before you send.',
    sections: [
      {
        heading: 'Customize every time',
        body: 'Generic letters underperform. Name the role, company, and one concrete match to the posting.',
      },
    ],
    faqs: [
      {
        question: 'Can I reuse one letter everywhere?',
        answer:
          'Better to adapt each letter. Keep a base draft, then customize the middle paragraph.',
      },
      {
        question: 'Is content stored on servers?',
        answer: 'Generation for this tool runs in your browser session.',
      },
    ],
  },

  'leave-application-generator': {
    answerFirst:
      'Leave Application Generator drafts formal school or workplace leave/sick letters you can copy or export.',
    seoTitle: 'Leave Application Letter Generator | ToolVerse',
    seoDescription:
      'Generate formal leave or sick application letters for school, university, or office use.',
    sections: [
      {
        heading: 'Include the essentials',
        body: 'Dates, reason at an appropriate detail level, and a polite close. Follow your org’s template if one exists.',
      },
    ],
    faqs: [
      {
        question: 'Is this legally binding?',
        answer:
          'No. It is a writing helper. Follow HR or school submission rules.',
      },
      {
        question: 'Is my letter stored?',
        answer: 'No. Drafting runs locally in your browser.',
      },
    ],
  },

  'youtube-tag-formatter': {
    answerFirst:
      'YouTube Tags & Keyword Formatter turns keyword lists into comma-separated tags with a practical length counter for the upload form.',
    seoTitle: 'YouTube Tags Formatter Online | ToolVerse',
    seoDescription:
      'Format YouTube video tags and watch character limits. Pair with chapters and earnings estimators for creators.',
    sections: [
      {
        heading: 'Tags follow titles and content',
        body: 'Irrelevant tag stuffing does not help. Prefer phrases that match what the video actually covers.',
      },
    ],
    faqs: [
      {
        question: 'Do tags still matter?',
        answer:
          'They are one signal among many. Titles, thumbnails, and watch time matter more.',
      },
      {
        question: 'Are keywords uploaded?',
        answer: 'No. Formatting is local.',
      },
    ],
  },

  'instagram-grid-splitter': {
    answerFirst:
      'Instagram Grid Splitter crops one image into 3×1 or 3×3 tiles for carousel or puzzle-grid posts.',
    seoTitle: 'Instagram Grid Splitter Online | ToolVerse',
    seoDescription:
      'Split images into Instagram grid tiles in your browser. Use with Social Media Image Resizer for platform sizes.',
    sections: [
      {
        heading: 'Upload order',
        body: 'Post tiles in the correct sequence so the grid rebuilds on your profile. Preview on mobile before publishing.',
      },
    ],
    faqs: [
      {
        question: 'Is my photo uploaded?',
        answer: 'No. Splitting runs in your browser.',
      },
      {
        question: 'Does Instagram keep exact pixels?',
        answer:
          'Instagram may recompress. Start from a sharp source image.',
      },
    ],
  },

  'youtube-chapters-generator': {
    answerFirst:
      'YouTube Chapters Generator formats timestamp lines (00:00 Intro) for your description so viewers can jump between sections.',
    seoTitle: 'YouTube Chapters & Timestamp Generator | ToolVerse',
    seoDescription:
      'Create YouTube chapter timestamps for descriptions. Start with 00:00 and keep times ascending.',
    sections: [
      {
        heading: 'Chapter rules of thumb',
        body: 'First stamp must be 00:00. Use clear labels. Pair with Tag Formatter when you finalize the upload package.',
      },
    ],
    faqs: [
      {
        question: 'Why aren’t chapters showing?',
        answer:
          'Check 00:00 start, ascending times, and enough chapter length. YouTube may take time to process.',
      },
      {
        question: 'Is text stored?',
        answer: 'No. Formatting is local.',
      },
    ],
  },

  'css-gradient-shadow-generator': {
    answerFirst:
      'CSS Box-Shadow & Gradient Generator builds copy-paste CSS for linear gradients and layered shadows for UI polish.',
    seoTitle: 'CSS Gradient & Box-Shadow Generator | ToolVerse',
    seoDescription:
      'Generate CSS gradients and box-shadow snippets with live-friendly copy output for front-end work.',
    sections: [
      {
        heading: 'Keep contrast accessible',
        body: 'Fancy gradients still need readable text. Check contrast when placing copy on colorful backgrounds.',
      },
    ],
    faqs: [
      {
        question: 'Does this write full layouts?',
        answer:
          'No. It focuses on gradient and shadow CSS you paste into your stylesheet.',
      },
      {
        question: 'Is code uploaded?',
        answer: 'No. Generation runs in your browser.',
      },
    ],
  },

  'jwt-decoder': {
    answerFirst:
      'JWT Decoder inspects header and payload claims (including expiry) from a token you paste — decode only tokens you are allowed to handle.',
    seoTitle: 'JWT Decoder & Expiry Inspector | ToolVerse',
    seoDescription:
      'Decode JWT header/payload and check expiry locally. Do not paste production secrets into untrusted sites.',
    sections: [
      {
        heading: 'Decode ≠ verify signature',
        body: 'Viewing claims is not cryptographic verification. Validate signatures in your backend with trusted keys.',
      },
      {
        heading: 'Privacy caution',
        body: 'Tokens can contain PII. Prefer local decoding. Clear the page after debugging on shared machines.',
      },
    ],
    faqs: [
      {
        question: 'Is my JWT uploaded?',
        answer: 'No. Decoding runs in your browser for this tool.',
      },
      {
        question: 'Can it forge tokens?',
        answer:
          'It inspects existing tokens. Issuing valid signed JWTs requires your secret/private key elsewhere.',
      },
    ],
  },

  'sql-formatter': {
    answerFirst:
      'SQL Formatter beautifies queries with clearer keyword casing and indentation so reviews and debugging are easier.',
    seoTitle: 'SQL Formatter & Beautifier Online | ToolVerse',
    seoDescription:
      'Format and minify SQL in your browser. Handy for query reviews without pasting production data into unknown hosts.',
    sections: [
      {
        heading: 'Avoid pasting sensitive rows',
        body: 'Format structure, not confidential customer data. Prefer redacted samples when sharing with teammates.',
      },
    ],
    faqs: [
      {
        question: 'Does it run SQL against a database?',
        answer: 'No. It only formats text.',
      },
      {
        question: 'Is my query uploaded?',
        answer: 'No. Formatting is local.',
      },
    ],
  },

  'regex-tester': {
    answerFirst:
      'Regex Tester lets you try regular expressions against sample text with match feedback for debugging patterns.',
    seoTitle: 'Regex Tester Online | ToolVerse',
    seoDescription:
      'Test regular expressions with live matches in your browser. Great for form validation and text cleanup patterns.',
    sections: [
      {
        heading: 'Flavor differences',
        body: 'JavaScript regex differs from some server flavors. Confirm patterns in the runtime you will ship.',
      },
    ],
    faqs: [
      {
        question: 'Is sample text uploaded?',
        answer: 'No. Testing runs locally.',
      },
      {
        question: 'Can bad regex freeze the tab?',
        answer:
          'Pathological patterns can be slow. Start simple and build up.',
      },
    ],
  },

  'cron-expression-generator': {
    answerFirst:
      'Cron Expression Reader translates five-field cron schedules into plain-language timing so jobs are easier to audit.',
    seoTitle: 'Cron Expression Reader & Translator | ToolVerse',
    seoDescription:
      'Read cron schedules in plain English. Useful for DevOps and scheduled job reviews.',
    sections: [
      {
        heading: 'Timezones still matter',
        body: 'Cron strings do not carry timezone. Confirm the host timezone before trusting “every Monday at 9.”',
      },
    ],
    faqs: [
      {
        question: 'Do you support seconds fields?',
        answer:
          'Focus on common five-field expressions. Some systems add seconds — check your platform docs.',
      },
      {
        question: 'Is input stored?',
        answer: 'No. Translation is local.',
      },
    ],
  },

  'subnet-calculator': {
    answerFirst:
      'IPv4 Subnet Calculator derives mask, network, broadcast, and usable host ranges from an IP and CIDR prefix.',
    seoTitle: 'IPv4 Subnet & CIDR Calculator | ToolVerse',
    seoDescription:
      'Calculate subnet mask, network/broadcast addresses, and usable IP ranges from CIDR notation.',
    sections: [
      {
        heading: 'Plan before you allocate',
        body: 'Use the calculator to size VLANs and avoid overlapping ranges. Double-check against your IPAM source of truth.',
      },
    ],
    faqs: [
      {
        question: 'Does this support IPv6?',
        answer:
          'This tool focuses on IPv4 CIDR math. Use dedicated IPv6 planners for v6.',
      },
      {
        question: 'Are addresses stored?',
        answer: 'No. Calculations run in your browser.',
      },
    ],
  },

  'daraz-profit-calculator': {
    answerFirst:
      'Daraz & E-Commerce Seller Profit Calculator estimates fees, tax-like deductions, and net profit so pricing stays realistic.',
    seoTitle: 'Daraz Seller Profit & Fee Calculator | ToolVerse',
    seoDescription:
      'Estimate Daraz-style commissions, fees, and net profit. Educational — confirm live fee tables on the marketplace.',
    sections: [
      {
        heading: 'Fees change',
        body: 'Marketplace fee schedules update. Re-check official seller center rates before large inventory buys.',
      },
      {
        heading: 'Break-even view',
        body: 'Pair with Break-Even Calculator when fixed costs (ads, packaging) matter.',
      },
    ],
    faqs: [
      {
        question: 'Is this an official Daraz tool?',
        answer:
          'No. It is an independent estimate. Seller Center figures win.',
      },
      {
        question: 'Are numbers stored?',
        answer: 'No. Math is local.',
      },
    ],
  },

  'shipping-label-generator': {
    answerFirst:
      'Shipping Label & Packing Slip Maker creates printable PDF labels with sender/recipient details and optional tracking QR.',
    seoTitle: 'Shipping Label & Packing Slip PDF Maker | ToolVerse',
    seoDescription:
      'Generate printable shipping labels and packing slips as PDFs in your browser for small-seller fulfillment.',
    sections: [
      {
        heading: 'Carrier rules',
        body: 'Some carriers require their own label formats. Use this for packing slips or when your workflow allows custom PDFs.',
      },
    ],
    faqs: [
      {
        question: 'Does this book a shipment?',
        answer:
          'No. It creates documents. Book pickup/drop-off with your carrier.',
      },
      {
        question: 'Is address data stored?',
        answer: 'PDF creation for this tool runs in your browser session.',
      },
    ],
  },

  'break-even-calculator': {
    answerFirst:
      'Break-Even Calculator estimates units and revenue needed to cover fixed costs given price and variable cost per unit.',
    seoTitle: 'Break-Even Point Calculator Online | ToolVerse',
    seoDescription:
      'Calculate break-even sales units and revenue from fixed costs, price, and variable cost. Planning aid for sellers.',
    sections: [
      {
        heading: 'Simple model',
        body: 'Assumes linear costs. Real businesses add tiers, returns, and ads — stress-test multiple scenarios.',
      },
    ],
    faqs: [
      {
        question: 'Does it include tax?',
        answer:
          'Enter costs consistently. Use VAT/GST tools if you need tax separation.',
      },
      {
        question: 'Are figures stored?',
        answer: 'No. Calculations are local.',
      },
    ],
  },

  'pakistan-electricity-bill-estimator': {
    answerFirst:
      'Pakistan Electricity Bill Estimator approximates monthly PKR cost from units consumed using typical DISCO-style slab logic — confirm with your bill.',
    seoTitle: 'Pakistan Electricity Bill Estimator (LESCO/KE) | ToolVerse',
    seoDescription:
      'Estimate LESCO/K-Electric/FESCO-style bills from units. Educational slabs — official tariff notifications prevail.',
    sections: [
      {
        heading: 'Tariffs change',
        body: 'Fuel adjustments, taxes, and protected vs unprotected rates alter totals. Use this for planning, then trust the DISCO bill.',
      },
      {
        heading: 'Solar planning',
        body: 'If you are sizing panels, continue with Solar Panel Calculator using your real load profile.',
      },
    ],
    faqs: [
      {
        question: 'Is this an official LESCO calculator?',
        answer:
          'No. Independent estimate only. Official bills and apps are authoritative.',
      },
      {
        question: 'Are readings stored?',
        answer: 'No. Estimates run in your browser.',
      },
    ],
  },

  'solar-panel-calculator': {
    answerFirst:
      'Solar Panel Calculator estimates panel kW, inverter size, and battery needs from daily appliance load for rough off-grid/hybrid planning.',
    seoTitle: 'Solar Panel & Inverter Size Calculator | ToolVerse',
    seoDescription:
      'Estimate solar kW, inverter, and battery Ah from load. Planning aid — get a site survey before buying hardware.',
    sections: [
      {
        heading: 'Sun hours and losses',
        body: 'Real yield depends on location, tilt, shade, and temperature. Vendor quotes should include derating.',
      },
    ],
    faqs: [
      {
        question: 'Can I buy hardware from these numbers alone?',
        answer:
          'Use them as a starting point. Confirm with a qualified installer and local net-metering rules.',
      },
      {
        question: 'Is load data stored?',
        answer: 'No. Calculations are local.',
      },
    ],
  },

  'global-job-finder': {
    answerFirst:
      'Global Job Finder searches multi-source listings by keyword and location so you can discover roles, then apply on the original employer or board site.',
    seoTitle: 'Global Job Finder — Multi-Source Search | ToolVerse',
    seoDescription:
      'Search tech, remote, and local jobs from multiple sources. Always verify employers and apply on official postings.',
    sections: [
      {
        heading: 'Discovery, not employment',
        body: 'ToolVerse is not the hiring company. Open the source link, confirm the employer, and never pay for a job offer.',
      },
      {
        heading: 'Application kit',
        body: 'Prep resume and letters with ATS Resume Checker and Cover Letter Generator. Compress portal photos with target-KB tools when needed.',
      },
    ],
    faqs: [
      {
        question: 'Do you submit applications for me?',
        answer:
          'No. You apply on the original posting site.',
      },
      {
        question: 'Are results complete?',
        answer:
          'Coverage depends on sources and filters. Cross-check major boards for critical searches.',
      },
    ],
  },
};

export function getToolPageContent(slug: string): ToolPageContent | undefined {
  return TOOL_PAGE_CONTENT[slug];
}
