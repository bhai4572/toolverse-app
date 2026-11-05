import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  CvDocumentData,
  CvDesignSettings,
  ADDITIONAL_SECTION_CONFIGS,
  AdditionalSectionKey,
  formatCvDate,
  CV_LOCALE_DICTIONARY,
} from '../../../lib/cv/typesAndDefaults';
import { getCvTemplateById } from '../../../lib/cv/templatesCatalog';

export interface ExportResult {
  success: boolean;
  pageCount: number;
  fileName: string;
  error?: string;
}

export function sanitizeCvFileName(fullName: string, templateId: string, ext: string): string {
  const cleanName = (fullName || 'Professional_CV')
    .trim()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\u00C0-\u017F_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const cleanTemplate = (templateId || 'cv').replace(/[^a-zA-Z0-9_-]+/g, '-');
  return `${cleanName || 'Professional_CV'}_${cleanTemplate}.${ext}`;
}

/**
 * Generates a structured, selectable-text PDF using jsPDF directly (and overlays
 * high-resolution page canvases when a DOM container is provided in browser context).
 */
export async function exportCvToPdf(
  containerEl: HTMLElement | null,
  data: CvDocumentData,
  design: CvDesignSettings
): Promise<ExportResult> {
  try {
    const isLetter = design.pageSize === 'LETTER';
    const pdfFormat = isLetter ? 'letter' : 'a4';
    const pageWidthMm = isLetter ? 215.9 : 210;
    const pageHeightMm = isLetter ? 279.4 : 297;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pdfFormat,
      compress: true,
    });

    const fileName = sanitizeCvFileName(data.personal.fullName, design.templateId, 'pdf');
    const pageSheets = containerEl
      ? Array.from(containerEl.querySelectorAll<HTMLElement>('.cv-page-sheet'))
      : [];

    if (pageSheets.length > 0 && typeof window !== 'undefined') {
      for (let idx = 0; idx < pageSheets.length; idx++) {
        if (idx > 0) {
          doc.addPage(pdfFormat, 'portrait');
        }
        const sheet = pageSheets[idx];
        const canvas = await html2canvas(sheet, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.96);
        doc.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
        embedInvisibleSelectableTextLayer(doc, data, idx, pageWidthMm, pageHeightMm);
      }
      doc.save(fileName);
      return {
        success: true,
        pageCount: pageSheets.length,
        fileName,
      };
    }

    // Fallback / Headless structured vector PDF generation (ensures selectable text & multi-page support)
    const totalPages = renderVectorPdfContent(doc, data, design, pageWidthMm, pageHeightMm, pdfFormat);
    if (typeof window !== 'undefined' && typeof doc.save === 'function' && containerEl) {
      doc.save(fileName);
    }
    return {
      success: true,
      pageCount: totalPages,
      fileName,
    };
  } catch (err: any) {
    return {
      success: false,
      pageCount: 0,
      fileName: '',
      error: err?.message || 'Failed to generate PDF document.',
    };
  }
}

/**
 * Pure structured vector PDF generator returning raw PDF data URI for automated verification
 * and environments without html2canvas.
 */
export function generateStructuredPdfOutput(
  data: CvDocumentData,
  design: CvDesignSettings
): { outputString: string; pageCount: number; fileName: string } {
  const isLetter = design.pageSize === 'LETTER';
  const pdfFormat = isLetter ? 'letter' : 'a4';
  const pageWidthMm = isLetter ? 215.9 : 210;
  const pageHeightMm = isLetter ? 279.4 : 297;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pdfFormat,
    compress: false,
  });

  const pageCount = renderVectorPdfContent(doc, data, design, pageWidthMm, pageHeightMm, pdfFormat);
  const fileName = sanitizeCvFileName(data.personal.fullName, design.templateId, 'pdf');
  const outputString = doc.output('datauristring');
  return { outputString, pageCount, fileName };
}

function embedInvisibleSelectableTextLayer(
  doc: jsPDF,
  data: CvDocumentData,
  pageIndex: number,
  pageWidthMm: number,
  pageHeightMm: number
) {
  if (pageIndex === 0) {
    doc.setProperties({
      title: `${data.personal.fullName || 'CV'} - ${data.personal.jobTitle || 'Resume'}`,
      subject: data.summary.content ? data.summary.content.slice(0, 180) : 'Professional Curriculum Vitae',
      author: data.personal.fullName || 'Toolverse CV Maker',
      keywords: data.skills.filter((s) => s.visible).map((s) => s.name).join(', '),
      creator: 'Toolverse Free CV Maker (https://toolverse.baby/cv-maker)',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(1);
    doc.setTextColor(255, 255, 255);
    const atsTokens: string[] = [
      data.personal.fullName,
      data.personal.jobTitle,
      data.personal.email,
      data.personal.phone,
      data.personal.city,
      data.personal.country,
    ].filter(Boolean);
    if (atsTokens.length > 0) {
      doc.text(atsTokens.join(' | ').slice(0, 200), 2, pageHeightMm - 1.5);
    }
  }
}

function renderVectorPdfContent(
  doc: jsPDF,
  data: CvDocumentData,
  design: CvDesignSettings,
  pageWidthMm: number,
  pageHeightMm: number,
  pdfFormat: string
): number {
  const dict = CV_LOCALE_DICTIONARY[design.locale] || CV_LOCALE_DICTIONARY.en;
  const tpl = getCvTemplateById(design.templateId);
  const marginMap: Record<CvDesignSettings['pageMargin'], number> = {
    narrow: 10,
    normal: 14,
    wide: 18,
  };
  const marginMm = marginMap[design.pageMargin] || 14;
  const usableWidth = pageWidthMm - marginMm * 2;
  let cursorY = marginMm;
  let pageCount = 1;

  const ensureSpace = (neededMm: number) => {
    if (cursorY + neededMm > pageHeightMm - marginMm) {
      doc.addPage(pdfFormat, 'portrait');
      pageCount += 1;
      cursorY = marginMm;
    }
  };

  const hex = (design.accentColor || tpl.defaultAccent || '#1e3a8a').replace('#', '');
  const r = parseInt(hex.substring(0, 2) || '1e', 16) || 30;
  const g = parseInt(hex.substring(2, 4) || '3a', 16) || 58;
  const b = parseInt(hex.substring(4, 6) || '8a', 16) || 138;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(r, g, b);
  doc.text(String(data.personal.fullName || 'Curriculum Vitae'), marginMm, cursorY + 5);
  cursorY += 8;

  if (data.personal.jobTitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(String(data.personal.jobTitle), marginMm, cursorY + 4);
    cursorY += 6;
  }

  const contacts: string[] = [];
  if (data.personal.email) contacts.push(data.personal.email);
  if (data.personal.phone) contacts.push(data.personal.phone);
  const loc = [
    data.personal.showFullAddress ? data.personal.fullAddress : '',
    data.personal.city,
    data.personal.country,
  ]
    .filter(Boolean)
    .join(', ');
  if (loc) contacts.push(loc);
  if (data.personal.showLinkedin && data.personal.linkedinUrl) contacts.push(data.personal.linkedinUrl);
  if (data.personal.showWebsite && data.personal.websiteUrl) contacts.push(data.personal.websiteUrl);
  if (data.personal.showPortfolio && data.personal.portfolioUrl) contacts.push(data.personal.portfolioUrl);
  if (data.personal.showGithub && data.personal.githubUrl) contacts.push(data.personal.githubUrl);

  if (contacts.length > 0) {
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const contactLines: string[] = doc.splitTextToSize(contacts.join('  •  '), usableWidth);
    doc.text(contactLines, marginMm, cursorY + 3.5);
    cursorY += contactLines.length * 4 + 3;
  }

  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.5);
  doc.line(marginMm, cursorY, pageWidthMm - marginMm, cursorY);
  cursorY += 5;

  const drawSectionHeading = (title: string) => {
    ensureSpace(12);
    cursorY += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(r, g, b);
    doc.text(String(title || 'Section').toUpperCase(), marginMm, cursorY + 3.5);
    cursorY += 5;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginMm, cursorY, pageWidthMm - marginMm, cursorY);
    cursorY += 3.5;
  };

  for (const orderItem of data.sectionOrder) {
    if (!orderItem.visible) continue;
    const secId = orderItem.id;

    if (secId === 'summary' && data.summary.visible && data.summary.content.trim()) {
      drawSectionHeading(dict.summary || orderItem.label);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      const lines: string[] = doc.splitTextToSize(data.summary.content.trim(), usableWidth);
      ensureSpace(lines.length * 4.2 + 3);
      doc.text(lines, marginMm, cursorY + 3);
      cursorY += lines.length * 4.2 + 3;
    } else if (secId === 'experience') {
      const visibleExp = data.experience.filter((e) => e.visible);
      if (visibleExp.length > 0) {
        drawSectionHeading(dict.experience || orderItem.label);
        for (const exp of visibleExp) {
          ensureSpace(16);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(`${exp.jobTitle} — ${exp.companyName}`, marginMm, cursorY + 3.5);

          const dateLabel = `${formatCvDate(exp.startDate, design.dateFormat)} – ${
            exp.currentlyWorking ? dict.present : formatCvDate(exp.endDate, design.dateFormat)
          }`;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(
            [dateLabel, exp.location, exp.employmentType].filter(Boolean).join(' | '),
            marginMm,
            cursorY + 7.5
          );
          cursorY += 10;

          if (exp.responsibilities.trim()) {
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            const respLines: string[] = doc.splitTextToSize(exp.responsibilities.trim(), usableWidth - 2);
            ensureSpace(respLines.length * 4 + 2);
            doc.text(respLines, marginMm + 2, cursorY + 3);
            cursorY += respLines.length * 4 + 1.5;
          }
          if (exp.achievements.trim()) {
            doc.setFontSize(9);
            doc.setTextColor(30, 41, 59);
            const achLines: string[] = doc.splitTextToSize(exp.achievements.trim(), usableWidth - 2);
            ensureSpace(achLines.length * 4 + 2);
            doc.text(achLines, marginMm + 2, cursorY + 3);
            cursorY += achLines.length * 4 + 1.5;
          }
          for (const cf of exp.customFields) {
            if (!cf.visible || !cf.value.trim()) continue;
            ensureSpace(6);
            doc.setFontSize(8.5);
            doc.setTextColor(71, 85, 105);
            const cfLines: string[] = doc.splitTextToSize(`${cf.label}: ${cf.value}`, usableWidth - 2);
            doc.text(cfLines, marginMm + 2, cursorY + 3);
            cursorY += cfLines.length * 3.8 + 1;
          }
          cursorY += 2;
        }
      }
    } else if (secId === 'education') {
      const visibleEdu = data.education.filter((e) => e.visible);
      if (visibleEdu.length > 0) {
        drawSectionHeading(dict.education || orderItem.label);
        for (const edu of visibleEdu) {
          ensureSpace(14);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(
            [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in '),
            marginMm,
            cursorY + 3.5
          );
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          const metaParts = [
            edu.institution,
            edu.location,
            `${edu.startYear} – ${edu.currentlyStudying ? dict.present : edu.graduationYear}`,
            edu.showGpa && edu.gradeGpa ? `GPA: ${edu.gradeGpa}` : '',
          ].filter(Boolean);
          doc.text(metaParts.join(' | '), marginMm, cursorY + 7.5);
          cursorY += 10;
          if (edu.description.trim()) {
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            const descLines: string[] = doc.splitTextToSize(edu.description.trim(), usableWidth - 2);
            ensureSpace(descLines.length * 4 + 2);
            doc.text(descLines, marginMm + 2, cursorY + 3);
            cursorY += descLines.length * 4 + 2;
          }
        }
      }
    } else if (secId === 'skills') {
      const visibleSkills = data.skills.filter((s) => s.visible && s.name.trim());
      if (visibleSkills.length > 0) {
        drawSectionHeading(dict.skills || orderItem.label);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        const skillText = visibleSkills
          .map((sk) =>
            data.showSkillProficiency && sk.proficiency ? `${sk.name} (${sk.proficiency})` : sk.name
          )
          .join('  •  ');
        const lines: string[] = doc.splitTextToSize(skillText, usableWidth);
        ensureSpace(lines.length * 4 + 3);
        doc.text(lines, marginMm, cursorY + 3);
        cursorY += lines.length * 4 + 3;
      }
    } else if (secId.startsWith('custom:')) {
      const customSec = data.customSections.find((cs) => cs.id === secId);
      if (customSec && customSec.visible && customSec.items.some((i) => i.visible)) {
        drawSectionHeading(customSec.title || orderItem.label);
        for (const item of customSec.items.filter((i) => i.visible)) {
          ensureSpace(12);
          if (item.title) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text(
              [item.title, item.subtitle].filter(Boolean).join(' — '),
              marginMm,
              cursorY + 3.5
            );
            cursorY += 5;
          }
          if (item.description && item.description.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.8);
            doc.setTextColor(51, 65, 85);
            const dLines: string[] = doc.splitTextToSize(item.description.trim(), usableWidth - 2);
            ensureSpace(dLines.length * 3.8 + 1.5);
            doc.text(dLines, marginMm + 2, cursorY + 3);
            cursorY += dLines.length * 3.8 + 1.5;
          }
          for (const field of item.fields) {
            if (!field.visible || !field.value.trim()) continue;
            ensureSpace(6);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.8);
            doc.setTextColor(51, 65, 85);
            const fLines: string[] = doc.splitTextToSize(`${field.label}: ${field.value}`, usableWidth - 2);
            doc.text(fLines, marginMm + 2, cursorY + 3);
            cursorY += fLines.length * 3.8 + 1.5;
          }
        }
      }
    } else {
      const cfg = ADDITIONAL_SECTION_CONFIGS.find((c) => c.key === (secId as AdditionalSectionKey));
      if (cfg) {
        const items = (data.additionalSections[cfg.key] || []).filter((it) => it.visible);
        if (items.length > 0) {
          drawSectionHeading(dict.additionalLabels[cfg.key] || cfg.defaultLabel);
          for (const item of items) {
            ensureSpace(12);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text(
              [item.title, item.organization, item.roleOrSubtitle].filter(Boolean).join(' — '),
              marginMm,
              cursorY + 3.5
            );
            cursorY += 4.5;
            const dateRange = [item.startDate, item.endDate].filter(Boolean).join(' – ');
            if (dateRange || item.location || item.url) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              doc.setTextColor(100, 116, 139);
              doc.text(
                [dateRange, item.location, item.url].filter(Boolean).join(' | '),
                marginMm,
                cursorY + 3
              );
              cursorY += 4;
            }
            if (item.description.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8.8);
              doc.setTextColor(51, 65, 85);
              const dLines: string[] = doc.splitTextToSize(item.description.trim(), usableWidth - 2);
              ensureSpace(dLines.length * 3.8 + 2);
              doc.text(dLines, marginMm + 2, cursorY + 3);
              cursorY += dLines.length * 3.8 + 2;
            }
          }
        }
      }
    }
  }

  return pageCount;
}

/**
 * Exports all `.cv-page-sheet` pages as high-resolution PNG files.
 */
export async function exportCvToPng(
  containerEl: HTMLElement | null,
  fullName: string,
  templateId: string
): Promise<ExportResult> {
  if (!containerEl) {
    return { success: false, pageCount: 0, fileName: '', error: 'Preview container not found.' };
  }
  try {
    const sheets = Array.from(containerEl.querySelectorAll<HTMLElement>('.cv-page-sheet'));
    if (sheets.length === 0) {
      return { success: false, pageCount: 0, fileName: '', error: 'No CV pages available to export.' };
    }
    const baseName = sanitizeCvFileName(fullName, templateId, 'png').replace(/\.png$/, '');
    for (let i = 0; i < sheets.length; i++) {
      const canvas = await html2canvas(sheets[i], {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const fileName = sheets.length > 1 ? `${baseName}_Page_${i + 1}.png` : `${baseName}.png`;
      triggerDataUrlDownload(dataUrl, fileName);
    }
    return {
      success: true,
      pageCount: sheets.length,
      fileName: `${baseName}.png`,
    };
  } catch (err: any) {
    return {
      success: false,
      pageCount: 0,
      fileName: '',
      error: err?.message || 'Failed to export PNG image.',
    };
  }
}

/**
 * Exports all `.cv-page-sheet` pages as high-resolution JPG files with user-selectable DPI scale.
 */
export async function exportCvToJpg(
  containerEl: HTMLElement | null,
  fullName: string,
  templateId: string,
  dpiOption: '150' | '300' | '450' = '300'
): Promise<ExportResult> {
  if (!containerEl) {
    return { success: false, pageCount: 0, fileName: '', error: 'Preview container not found.' };
  }
  try {
    const sheets = Array.from(containerEl.querySelectorAll<HTMLElement>('.cv-page-sheet'));
    if (sheets.length === 0) {
      return { success: false, pageCount: 0, fileName: '', error: 'No CV pages available to export.' };
    }
    const scaleMap: Record<'150' | '300' | '450', number> = {
      '150': 1.6,
      '300': 2.5,
      '450': 3.4,
    };
    const qualityMap: Record<'150' | '300' | '450', number> = {
      '150': 0.9,
      '300': 0.96,
      '450': 0.99,
    };
    const scale = scaleMap[dpiOption] || 2.5;
    const quality = qualityMap[dpiOption] || 0.96;

    const baseName = sanitizeCvFileName(fullName, templateId, 'jpg').replace(/\.jpg$/, '');
    for (let i = 0; i < sheets.length; i++) {
      const canvas = await html2canvas(sheets[i], {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const fileName =
        sheets.length > 1 ? `${baseName}_${dpiOption}DPI_Page_${i + 1}.jpg` : `${baseName}_${dpiOption}DPI.jpg`;
      triggerDataUrlDownload(dataUrl, fileName);
    }
    return {
      success: true,
      pageCount: sheets.length,
      fileName: `${baseName}_${dpiOption}DPI.jpg`,
    };
  } catch (err: any) {
    return {
      success: false,
      pageCount: 0,
      fileName: '',
      error: err?.message || 'Failed to export JPG image.',
    };
  }
}

/**
 * Prints the rendered CV cleanly without any editor UI controls.
 */
export function printCvDocument(
  containerEl: HTMLElement | null,
  documentTitle: string,
  pageSize: 'A4' | 'LETTER'
): boolean {
  if (!containerEl || typeof window === 'undefined') return false;
  const sheets = Array.from(containerEl.querySelectorAll<HTMLElement>('.cv-page-sheet'));
  if (sheets.length === 0) return false;

  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    window.print();
    return true;
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  const pagesHtml = sheets.map((s) => s.outerHTML).join('\n');
  const cssPageSize = pageSize === 'LETTER' ? 'letter portrait' : 'A4 portrait';

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${documentTitle || 'Curriculum Vitae'}</title>
  ${styles}
  <style>
    @page {
      size: ${cssPageSize};
      margin: 0;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cv-page-sheet {
      box-shadow: none !important;
      border: none !important;
      margin: 0 auto !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .cv-page-sheet:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
  </style>
</head>
<body>
  ${pagesHtml}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 250);
    };
  </script>
</body>
</html>`);
  printWindow.document.close();
  return true;
}

function triggerDataUrlDownload(dataUrl: string, fileName: string) {
  if (typeof document === 'undefined') return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
