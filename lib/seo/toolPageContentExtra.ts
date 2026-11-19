/**
 * Expanded, hand-written copy for the highest-traffic tool pages (content plan, 2026-11-17).
 * Merged into TOOL_PAGE_CONTENT by getToolPageContent(): extra sections are appended and
 * extra FAQs are added (deduplicated by question). Plain text only — no markdown.
 * Keep claims accurate to what each tool actually does.
 */
import type { ToolFaq, ToolSeoSection } from './toolPageContent';

export interface ToolPageContentExtra {
  sections: ToolSeoSection[];
  faqs: ToolFaq[];
}

export const TOOL_PAGE_CONTENT_EXTRA: Record<string, ToolPageContentExtra> = {
  'pdf-merge': {
    sections: [
      {
        heading: 'Step by step: combine PDFs into one file',
        body: 'Click Add PDF Files and pick every document you want to join — for example a CV, a cover letter and scanned certificates. The files appear in a list in the order you added them; that list is the page order of the final document, so add your most important file first. Press merge and the combined PDF downloads straight to your device. There is no account, no watermark and no daily limit.',
      },
      {
        heading: 'Common uses: job applications, admissions and office paperwork',
        body: 'Many job portals, university admission systems and embassy appointment sites accept only one PDF upload per section. Merging lets you send your CV plus degree, transcript and experience letters as a single document. Students combine assignment parts, accountants join monthly statements, and landlords merge a tenancy agreement with CNIC copies. Because merging happens in your browser, private documents such as bank statements and identity cards are never sent to a server.',
      },
      {
        heading: 'Keep the merged file small enough to upload',
        body: 'Merging does not recompress pages, so the output size is roughly the sum of the inputs. If a portal has a 2 MB or 5 MB limit, shrink oversized scans first: convert photos to PDF with JPG to PDF after compressing them with the Image Compressor, or try Compress PDF on the merged result. Scanning at 150–200 DPI in grayscale instead of 600 DPI color usually keeps a ten-page bundle under 2 MB.',
      },
      {
        heading: 'What the merge keeps and what it cannot change',
        body: 'Text, images, page sizes and orientation of each source page are preserved exactly. Password-protected or encrypted PDFs must be unlocked in their original app first, because the browser cannot read encrypted content. Interactive form fields from different files may not stay fillable after merging; fill and flatten forms before combining if that matters.',
      },
    ],
    faqs: [
      {
        question: 'How many PDF files can I merge at once?',
        answer: 'There is no fixed limit. The practical limit is your device memory — dozens of normal documents work fine on a laptop; very large scanned files (hundreds of MB in total) are better merged in smaller batches.',
      },
      {
        question: 'Can I merge PDFs on my phone?',
        answer: 'Yes. The tool works in Chrome, Safari and other modern mobile browsers. Tap Add PDF Files, choose documents from your Files or Downloads folder, merge, and the result is saved to your downloads.',
      },
      {
        question: 'Why is my merged PDF so large?',
        answer: 'Merging keeps every page exactly as it was, so large scans stay large. Compress images before converting them to PDF, or rescan at a lower resolution, to reduce the final size.',
      },
    ],
  },

  'pdf-compress': {
    sections: [
      {
        heading: 'How this PDF compressor works',
        body: 'The tool rebuilds your PDF in the browser with compact object streams and removes unnecessary metadata. This lossless clean-up keeps text sharp and selectable and never lowers image quality. It works best on PDFs exported from Word, Excel, design tools or online forms, which often contain redundant structure. If the rebuilt file would be larger than the original, you simply keep the original size.',
      },
      {
        heading: 'Getting scanned PDFs under 1 MB or 2 MB',
        body: 'Scanned documents are mostly large images, so a lossless rebuild cannot shrink them much. For portals that demand a small file (for example under 1 MB for an application form), work from the images instead: compress each scan or photo with the Image Compressor or Compress Image to Target Size, then rebuild the document with JPG to PDF. A clear A4 page saved as a 150–250 KB JPG is readable for almost every form.',
      },
      {
        heading: 'Tips before you upload a compressed PDF',
        body: 'Open the downloaded file once and zoom in on signatures, stamps and small print to make sure everything is legible. Keep the original as a backup. If a portal still rejects the file, check whether it also limits page count or requires PDF/A, and split long documents with Split PDF so each part fits the limit.',
      },
    ],
    faqs: [
      {
        question: 'Does compressing a PDF reduce quality?',
        answer: 'No. This tool only performs lossless structural compression, so text and images stay exactly the same. That is also why image-heavy scans shrink only a little.',
      },
      {
        question: 'How do I compress a scanned PDF to under 1 MB?',
        answer: 'Compress the page images first (Image Compressor or Compress Image to Target Size), then combine them with JPG to PDF. Scanning in grayscale at 150–200 DPI also cuts size dramatically.',
      },
      {
        question: 'Is my PDF uploaded anywhere?',
        answer: 'No. Compression runs entirely in your browser, which makes it safe for bank statements, contracts and identity documents.',
      },
    ],
  },

  'pdf-split': {
    sections: [
      {
        heading: 'Extract exactly the pages you need',
        body: 'Upload a PDF and type the pages you want in the page range box. Use commas for single pages and a hyphen for ranges: "1-3, 5" keeps pages 1, 2, 3 and 5 in a new PDF. Click extract and the smaller file downloads instantly. Run the tool again with a different range to create as many separate files as you need from one document.',
      },
      {
        heading: 'Practical examples',
        body: 'Send only the signed page of a contract instead of the whole agreement. Pull your result card out of a 40-page university transcript. Separate a combined bank statement into individual months. Remove blank or duplicate pages from a scan before submitting it. Splitting is also the easiest way to get under upload limits: if a portal accepts 2 MB per file, split a long document into parts that each fit.',
      },
      {
        heading: 'Privacy and quality',
        body: 'Pages are copied, not re-rendered, so text, images and links on the extracted pages stay identical to the original. The original PDF is never modified and never leaves your device. Encrypted PDFs need to be unlocked in their original app before splitting.',
      },
    ],
    faqs: [
      {
        question: 'How do I write a page range?',
        answer: 'Use commas and hyphens, like "2" for one page, "4-7" for a range, or "1, 3, 10-12" for a mix. Page numbers start at 1.',
      },
      {
        question: 'Can I change the order of pages?',
        answer: 'Use the PDF Rotate / Reorder tool to rearrange pages, or split the pages you need and combine them in the order you want with Merge PDF.',
      },
    ],
  },

  'jpg-to-pdf': {
    sections: [
      {
        heading: 'Turn photos and scans into one PDF',
        body: 'Select one or more JPG or PNG images, choose a page layout — A4, US Letter, or Fit (each page matches its image size) — and convert. Every image becomes one page, in the order you selected them. The PDF downloads immediately and nothing is uploaded, so it is safe for CNIC copies, passports, receipts and certificates.',
      },
      {
        heading: 'A4, Letter or Fit: which layout to choose',
        body: 'Choose A4 for documents that will be printed or submitted in Pakistan, India, the UK, Europe and most of the world. Choose Letter for US and Canadian forms. Choose Fit when you want no white margins, for example a photo portfolio or a screenshot collection that will only be read on screen.',
      },
      {
        heading: 'Make a small, readable PDF from phone photos',
        body: 'Phone photos are often 3–8 MB each, which produces a heavy PDF. For upload portals, first run each photo through the Image Compressor (or Compress Image to Target Size at around 200–300 KB), crop away the table or background with the Image Resizer, and then convert. Shoot documents in daylight, flat on a dark surface, holding the phone straight above the page to avoid shadows and skew.',
      },
    ],
    faqs: [
      {
        question: 'Can I convert multiple images into a single PDF?',
        answer: 'Yes. Select all the images at once and they become one multi-page PDF, one image per page.',
      },
      {
        question: 'Will image quality drop when converting to PDF?',
        answer: 'Images are placed into the PDF as they are. If the PDF is too large, compress the images before converting rather than after.',
      },
    ],
  },

  'image-compressor': {
    sections: [
      {
        heading: 'Two ways to compress: quality slider or target size',
        body: 'Use the quality slider when you just want a lighter photo for a website, WhatsApp or email — 70–80% quality usually cuts file size by more than half with no visible difference. Use a target size (20, 30, 50, 100, 200 KB and more, or a custom number) when a form demands a maximum file size; the compressor then searches for the best quality that stays under your limit.',
      },
      {
        heading: 'JPG, PNG or WebP: which format compresses best',
        body: 'JPG is best for photographs and gives the biggest savings. PNG is lossless and suits logos, screenshots and graphics with sharp edges or transparency, but photos saved as PNG stay large. WebP gives JPG-like quality at smaller sizes and is ideal for websites. If a PNG photo will not shrink enough, convert it to JPG first with PNG to JPG, then compress.',
      },
      {
        heading: 'Faster websites and better Core Web Vitals',
        body: 'Large hero images are the most common cause of a slow Largest Contentful Paint. Resize images to the width they are actually displayed at (for example 1200–1600 px for a full-width banner), then compress to roughly 100–250 KB. Smaller images load faster on mobile data, improve PageSpeed scores and reduce bandwidth costs.',
      },
    ],
    faqs: [
      {
        question: 'How much can I compress a photo without losing visible quality?',
        answer: 'For typical phone photos, 70–80% quality reduces size by 50–80% with no difference noticeable on screen. Very small targets (under 30 KB) will look softer, especially on large images.',
      },
      {
        question: 'Is there a file size limit?',
        answer: 'Images up to about 50 MB work well. Everything runs on your own device, so very large files depend on your browser memory.',
      },
      {
        question: 'Are my photos uploaded?',
        answer: 'No. Compression happens locally with your browser, so private photos and documents stay on your device.',
      },
    ],
  },

  'compress-image-target-size': {
    sections: [
      {
        heading: 'Common photo and signature size limits',
        body: 'Typical requirements: recruitment and public service commission forms often ask for a photo under 50–100 KB and a signature under 20–50 KB; scholarship and university portals commonly cap uploads at 100–200 KB; many visa and passport services accept photos up to around 240 KB with specific pixel dimensions. Always read the exact rule on the form, then type that number as your target.',
      },
      {
        heading: 'Step by step: hit an exact KB limit',
        body: 'First crop the photo to the required shape with the Image Resizer or Passport Photo Maker — cropping removes pixels you do not need, so the remaining image keeps more detail at the same file size. Then open this tool, choose a preset such as 50 KB or type a custom value, and compress. Check the result size shown on screen and download. If the portal also requires pixel dimensions (for example 600 x 600), resize first and compress second.',
      },
      {
        heading: 'Signatures: keep them crisp under 20 KB',
        body: 'Sign with a dark pen on plain white paper, photograph it in good light and crop tightly around the signature. A small, high-contrast image compresses well, so even a 10–20 KB target stays sharp. Avoid shadows and lined paper, which add detail that wastes file size.',
      },
    ],
    faqs: [
      {
        question: 'How do I reduce a photo to 20 KB?',
        answer: 'Crop the photo tightly first, optionally resize it to around 300–400 px wide, then set 20 KB as the target. Small images reach 20 KB with much better clarity than full-size photos.',
      },
      {
        question: 'Can I compress a PNG to a target size?',
        answer: 'Yes, but photos in PNG format are hard to shrink. For photos, convert to JPG first for much smaller results.',
      },
    ],
  },

  'image-resizer': {
    sections: [
      {
        heading: 'Resize by pixels without distortion',
        body: 'Enter the width or height you need and keep Maintain Aspect Ratio switched on — the other side is calculated automatically, so faces and logos never look stretched. Turn the lock off only when a form demands exact dimensions such as 600 x 600 or 413 x 531 pixels; crop to the right shape first so nothing gets squashed.',
      },
      {
        heading: 'Popular sizes',
        body: 'Website hero image: 1600–1920 px wide. Blog image: 1200 x 630 (also ideal for Facebook and LinkedIn link previews). Instagram post: 1080 x 1080 or 1080 x 1350. YouTube thumbnail: 1280 x 720. Passport-style photos for many forms: 600 x 600 (2 x 2 inch) or 413 x 531 (35 x 45 mm at 300 DPI). For social platforms, the Social Media Image Resizer has these presets built in.',
      },
      {
        heading: 'Resize first, compress second',
        body: 'Reducing pixel dimensions is the most effective way to cut file size: halving width and height removes about three quarters of the pixels. When a portal has both a dimension rule and a KB limit, resize here first, then use Compress Image to Target Size to meet the KB limit.',
      },
    ],
    faqs: [
      {
        question: 'Will resizing make my image blurry?',
        answer: 'Making an image smaller keeps it sharp. Enlarging beyond the original size cannot add real detail, so upscaled photos may look soft.',
      },
      {
        question: 'Which formats are supported?',
        answer: 'JPG, PNG and WebP. Convert HEIC photos from iPhone with HEIC to JPG first.',
      },
    ],
  },

  'heic-to-jpg': {
    sections: [
      {
        heading: 'Why iPhone photos are HEIC and why websites reject them',
        body: 'iPhones save photos as HEIC (High Efficiency Image Container) by default because it takes about half the space of JPG. Many Windows apps, government and job portals, and older Android devices cannot open HEIC, so uploads fail with an "unsupported format" error. Converting to JPG makes the photo universally compatible.',
      },
      {
        heading: 'Convert HEIC to JPG in three steps',
        body: 'Select one or more .heic files, keep JPG as the output format, and convert. The JPG files download to your device. The conversion uses a decoder that runs inside your browser, so personal photos are never uploaded. Large batches can take a few seconds per photo on older phones.',
      },
      {
        heading: 'Stop your iPhone from creating HEIC files',
        body: 'On iPhone open Settings, then Camera, then Formats, and choose Most Compatible. New photos will be saved as JPG. Alternatively, sharing a photo by email or AirDrop to a Windows PC often converts it automatically, but this tool is the quickest fix for files you already have.',
      },
    ],
    faqs: [
      {
        question: 'Does converting HEIC to JPG lose quality?',
        answer: 'The JPG is saved at high quality, so the difference is not visible in normal use. JPG files are usually larger than the original HEIC.',
      },
      {
        question: 'Can I then compress the JPG for a form?',
        answer: 'Yes. After converting, use Compress Image to Target Size to meet limits like 50 KB or 100 KB.',
      },
    ],
  },

  'passport-photo-maker': {
    sections: [
      {
        heading: 'Built-in passport and visa sizes',
        body: 'Choose a preset and the photo is cropped and resized to that exact shape: US passport and visa (2 x 2 inch, 600 x 600 px), UK passport (35 x 45 mm), Canada passport (50 x 70 mm), Australia (35 x 45 mm), EU and Schengen visa (35 x 45 mm), the common 2 x 2 inch size used by many Pakistani forms, and India passport (35 x 35 mm). Always confirm the current rule on the official website you are applying to.',
      },
      {
        heading: 'How to take a photo that gets accepted',
        body: 'Stand about one metre from a plain white or off-white wall, facing a window for even light. Keep a neutral expression with both eyes open and mouth closed, and look straight at the camera held at eye level. Remove glasses if the rules require it, and avoid hats unless worn for religious reasons. Ask someone else to take the photo — selfies distort faces and are often rejected.',
      },
      {
        heading: 'Printing at home or at a photo shop',
        body: 'Download the cropped photo and print it on glossy photo paper at 100% scale (do not "fit to page"), or take the file to a photo shop and ask for the stated physical size. For online applications, upload the digital file directly; if the portal also has a KB limit, run it through Compress Image to Target Size.',
      },
    ],
    faqs: [
      {
        question: 'Can I use this for an online visa application?',
        answer: 'Yes. Download the correctly sized photo and upload it. Check the portal for its pixel and file-size rules and compress if needed.',
      },
      {
        question: 'Does the tool remove the background?',
        answer: 'It crops and resizes your photo; it does not replace the background. Take the photo against a plain light wall for best results.',
      },
    ],
  },

  'cv-maker': {
    sections: [
      {
        heading: 'Which template should you choose?',
        body: 'Applying through job portals or large companies? Pick a single-column ATS-friendly template — applicant tracking systems read it reliably. Changing careers or applying to creative roles? A modern two-column layout highlights skills and projects. Academic, research and medical roles usually expect a longer academic CV with publications and conferences. For Europe, a Europass-style layout is familiar to recruiters. You can switch templates at any time without retyping.',
      },
      {
        heading: 'CV tips that get more interviews',
        body: 'Keep it to one or two pages for most roles. Start each experience bullet with an action verb and include a number where you can: "Reduced invoice processing time by 30%" beats "Responsible for invoices". Copy the exact skill names from the job advert into your skills section. Use a professional email address, add your LinkedIn URL, and remove outdated details such as full home address, CNIC number or marital status unless the employer asks for them.',
      },
      {
        heading: 'Download, save and update later',
        body: 'Export a selectable-text PDF for applications, or PNG/JPG for sharing on WhatsApp. Your CV is saved only in this browser, so download a JSON backup if you want to continue on another device or keep separate versions for different jobs. Before sending, rename the file professionally, for example "Ayesha-Khan-CV.pdf".',
      },
    ],
    faqs: [
      {
        question: 'Is the PDF readable by applicant tracking systems (ATS)?',
        answer: 'The PDF export contains real, selectable text. For the best ATS results, choose a single-column template, use standard section headings like Experience and Education, and avoid putting key information only in images.',
      },
      {
        question: 'What is the difference between a CV and a resume?',
        answer: 'In Pakistan, India, the UK and Europe "CV" is the normal word for a job application document of one to two pages. In the US and Canada a resume is a short (usually one page) summary, while a CV means a longer academic record. The builder supports both styles.',
      },
      {
        question: 'Should I add a photo to my CV?',
        answer: 'It depends on the country: photos are common in Pakistan, the Middle East and parts of Europe, but are usually left out in the US, UK and Canada to avoid bias. Follow the employer or job advert instructions.',
      },
    ],
  },

  'pakistan-salary-tax-estimator': {
    sections: [
      {
        heading: 'Salary tax slabs for Tax Year 2026-27',
        body: 'For 1 July 2026 to 30 June 2027 (Finance Act 2026), salaried income is taxed as follows. Up to PKR 600,000 a year: 0%. PKR 600,001–1,200,000: 1% of the amount above 600,000. PKR 1,200,001–2,200,000: PKR 6,000 plus 11% above 1.2 million. PKR 2,200,001–3,200,000: PKR 116,000 plus 20% above 2.2 million. PKR 3,200,001–4,100,000: PKR 316,000 plus 25% above 3.2 million. PKR 4,100,001–5,600,000: PKR 541,000 plus 29% above 4.1 million. PKR 5,600,001–7,000,000: PKR 976,000 plus 32% above 5.6 million. Above PKR 7,000,000: PKR 1,424,000 plus 35% above 7 million.',
      },
      {
        heading: 'Worked examples',
        body: 'PKR 100,000 a month (1.2 million a year): tax is PKR 6,000 a year, or PKR 500 a month. PKR 150,000 a month (1.8 million): 6,000 + 11% of 600,000 = PKR 72,000 a year, about PKR 6,000 a month, so take-home is roughly PKR 144,000. PKR 250,000 a month (3 million): 116,000 + 20% of 800,000 = PKR 276,000 a year, about PKR 23,000 a month. PKR 500,000 a month (6 million): 976,000 + 32% of 400,000 = PKR 1,104,000 a year, about PKR 92,000 a month.',
      },
      {
        heading: 'How to check your payslip',
        body: 'Enter your monthly taxable salary (basic pay plus taxable allowances). Compare the monthly tax shown here with the income tax line on your payslip. A different figure is not automatically wrong: bonuses, arrears, exempt allowances and joining mid-year change how employers spread withholding across the year. Your final liability is settled when you file your annual return on IRIS, where tax credits such as approved pension contributions and donations can reduce it.',
      },
    ],
    faqs: [
      {
        question: 'Which tax year does this calculator use?',
        answer: 'Tax Year 2027 (1 July 2026 – 30 June 2027) salaried slabs under the Finance Act 2026, as published in the FBR Withholding Tax Rates Card 2027.',
      },
      {
        question: 'What is the tax on a PKR 200,000 monthly salary?',
        answer: 'PKR 200,000 a month is PKR 2.4 million a year. Tax = 116,000 + 20% of 200,000 = PKR 156,000 a year, or PKR 13,000 a month.',
      },
      {
        question: 'Is salary up to PKR 50,000 a month tax-free?',
        answer: 'Yes. Annual taxable salary up to PKR 600,000 (PKR 50,000 a month) is taxed at 0%.',
      },
    ],
  },

  'pakistan-electricity-bill-estimator': {
    sections: [
      {
        heading: 'How the estimate is calculated',
        body: 'Enter the units (kWh) from your meter or last bill. The estimator prices them through residential slabs from 1–100 units up to above 700 units, then adds a per-unit financing cost (FC) surcharge, a quarterly tariff adjustment, electricity duty and the PTV fee to show an estimated total with a slab-by-slab breakdown. Rates are benchmark figures, so treat the result as a planning estimate rather than your exact bill.',
      },
      {
        heading: 'Why your real bill can be higher or lower',
        body: 'Actual bills from LESCO, FESCO, IESCO, GEPCO, MEPCO, PESCO, HESCO, QESCO, SEPCO, TESCO and K-Electric also depend on your tariff category (protected or non-protected), the monthly fuel price adjustment (FPA) set by NEPRA, general sales tax, income tax for non-filers above certain bill amounts, and occasional government relief packages. Crossing a slab boundary — for example from 200 to 201 units for protected consumers — can raise the rate on your whole consumption, which is why many households try to stay under 200 units.',
      },
      {
        heading: 'Practical ways to cut units',
        body: 'Run air conditioners at 26°C with a fan instead of 18–20°C; each degree saves several percent. Replace old bulbs with LEDs and old fans with DC inverter fans. Use the washing machine and iron during the day in one batch. Check your fridge door seal. If your monthly use is consistently above 300–400 units, the Solar Panel Calculator helps you estimate the system size that would offset it.',
      },
    ],
    faqs: [
      {
        question: 'How do I find how many units I used?',
        answer: 'Subtract the previous meter reading from the present reading printed on your bill, or read your meter twice a month apart.',
      },
      {
        question: 'Is this the official bill from my DISCO?',
        answer: 'No. It is an independent estimate. Check your official bill on your distribution company website using your 14-digit reference number.',
      },
    ],
  },

  'zakat-calculator': {
    sections: [
      {
        heading: 'What to include in your Zakat calculation',
        body: 'Add the current value of cash in hand and savings, bank balances, gold and silver you own (at today’s selling rate), and business inventory or trade goods. Then enter immediate debts and liabilities that are due. The calculator shows total assets, net wealth and 2.5% Zakat on the net amount if it is above the Nisab you enter.',
      },
      {
        heading: 'Understanding Nisab',
        body: 'Nisab is the minimum wealth on which Zakat becomes due. It is commonly measured as 87.48 grams (7.5 tola) of gold or 612.36 grams (52.5 tola) of silver. Many scholars recommend the silver Nisab for mixed assets because it is lower and benefits more people in need. Check today’s silver or gold rate from your local bullion market, multiply by the weight, and enter that value as your Nisab threshold.',
      },
      {
        heading: 'Worked example',
        body: 'Suppose you have PKR 400,000 in the bank, PKR 100,000 cash and gold worth PKR 1,000,000, and you owe PKR 100,000 that is due this month. Net wealth = 1,500,000 − 100,000 = PKR 1,400,000. If that is above Nisab and has been held for one lunar year, Zakat = 2.5% x 1,400,000 = PKR 35,000.',
      },
      {
        heading: 'Important notes',
        body: 'Zakat is due on wealth held for a full lunar (Hijri) year. Personal-use items such as your home, car and household furniture are generally not included. Banks in Pakistan deduct Zakat automatically from some savings accounts on the first of Ramadan unless you file an exemption declaration; account for any amount already deducted. Rulings differ between schools of thought on topics like jewellery for personal use and long-term debts, so confirm with a scholar you trust.',
      },
    ],
    faqs: [
      {
        question: 'Is Zakat 2.5% of total savings?',
        answer: 'It is 2.5% of net zakatable wealth (assets minus immediate debts) that is above Nisab and has been held for one lunar year.',
      },
      {
        question: 'Should I use the gold or silver Nisab?',
        answer: 'Both are used. The silver Nisab (612.36 g) is lower, so more people qualify; many scholars recommend it when your wealth is a mix of cash and assets. Ask your scholar for guidance.',
      },
    ],
  },

  'emi-calculator': {
    sections: [
      {
        heading: 'The EMI formula',
        body: 'EMI = P x r x (1 + r)^n / ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate divided by 12, as a decimal) and n is the number of monthly installments. The calculator applies this reducing-balance formula used by most banks for car loans, home finance and personal loans, and shows the monthly installment, total payment and total interest.',
      },
      {
        heading: 'Worked examples',
        body: 'A loan of 1,000,000 at 18% a year for 36 months has an EMI of about 36,152 and total interest of about 301,486. 500,000 at 15% for 24 months: EMI about 24,243, interest about 81,840. 3,000,000 at 20% for 60 months: EMI about 79,482, interest about 1,768,899 — longer terms lower the monthly payment but sharply increase total interest.',
      },
      {
        heading: 'How to use EMI results when choosing a loan',
        body: 'Compare offers by total cost, not just the monthly figure. Add processing fees, insurance and any mandatory charges to the interest. A common budgeting rule is to keep all EMIs below 30–40% of take-home pay. If you can afford it, a shorter tenure or a larger down payment saves the most; prepaying principal early in the loan saves more than prepaying near the end. For Islamic car and home finance, the rental or profit rate can be entered in the same way to estimate the monthly amount.',
      },
    ],
    faqs: [
      {
        question: 'Is EMI calculated on a flat rate or reducing balance?',
        answer: 'This calculator uses the reducing-balance method, which most banks use. Flat-rate quotes look cheaper but usually cost more in total.',
      },
      {
        question: 'Does the EMI include fees and insurance?',
        answer: 'No. Add processing fees, insurance and other charges separately when comparing loan offers.',
      },
    ],
  },
};
