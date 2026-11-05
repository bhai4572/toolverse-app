import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  createBlankCvDocument,
  createSampleCvDocument,
  createDefaultDesignSettings,
  ADDITIONAL_SECTION_CONFIGS,
  CV_LOCALE_DICTIONARY,
  validateCvData,
  polishSummaryTextClientSide,
  formatCvDate,
  CustomFieldType,
  CoreOrAdditionalSectionId,
} from '../lib/cv/typesAndDefaults';
import {
  CV_TEMPLATES,
  getCvTemplateById,
  applyTemplateDefaultsToDesign,
} from '../lib/cv/templatesCatalog';
import {
  CvTemplateRenderer,
  TemplateThumbnailPreview,
} from '../features/tools/cv-builder/CvTemplateRenderer';
import {
  generateStructuredPdfOutput,
  sanitizeCvFileName,
} from '../features/tools/cv-builder/exportEngine';
import { getToolBySlug } from '../lib/tools/registry';
import { getMetadataForPath } from '../lib/seo/metaEngine';

describe('Toolverse Advanced Free CV & Resume Builder — Comprehensive Suite', () => {
  it('1. Creates a clean blank CV from scratch with all 20 additional sections initialized', () => {
    const blank = createBlankCvDocument();
    expect(blank.personal.fullName).toBe('');
    expect(blank.experience.length).toBe(0);
    expect(blank.education.length).toBe(0);
    expect(blank.skills.length).toBe(0);
    expect(blank.customSections.length).toBe(0);
    expect(ADDITIONAL_SECTION_CONFIGS.length).toBe(20);
    for (const cfg of ADDITIONAL_SECTION_CONFIGS) {
      expect(Array.isArray(blank.additionalSections[cfg.key])).toBe(true);
    }
  });

  it('2. Populates and renders all 20 predefined additional CV sections', () => {
    const cv = createBlankCvDocument();
    cv.personal.fullName = 'Dr. Elena Rostova';
    cv.personal.jobTitle = 'Principal Research Scientist';

    for (const cfg of ADDITIONAL_SECTION_CONFIGS) {
      cv.additionalSections[cfg.key] = [
        {
          id: `item-${cfg.key}`,
          title: `${cfg.defaultLabel} Headline Entry`,
          organization: `${cfg.defaultLabel} Organization`,
          roleOrSubtitle: `REF-${cfg.key.toUpperCase()}`,
          location: 'Zurich, Switzerland',
          startDate: '2023-01',
          endDate: '2024-06',
          url: 'https://toolverse.baby/verify',
          description: `Verified entry for ${cfg.defaultLabel}`,
          visible: true,
        },
      ];
    }

    const design = createDefaultDesignSettings('academic-cv');
    const html = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );

    for (const cfg of ADDITIONAL_SECTION_CONFIGS) {
      expect(html).toContain(`${cfg.defaultLabel} Headline Entry`);
      expect(html).toContain(`REF-${cfg.key.toUpperCase()}`);
    }
  });

  it('3. Supports multiple work experience records with responsibilities, achievements, and custom fields', () => {
    const cv = createSampleCvDocument();
    expect(cv.experience.length).toBeGreaterThanOrEqual(2);
    cv.experience.push({
      id: 'exp-3',
      jobTitle: 'Staff Infrastructure Engineer',
      companyName: 'HyperScale Systems',
      employmentType: 'Full-time',
      location: 'Austin, TX',
      startDate: '2016-05',
      endDate: '2018-02',
      currentlyWorking: false,
      responsibilities: 'Designed global service mesh.',
      achievements: 'Cut P99 latency by 55%.',
      visible: true,
      customFields: [
        {
          id: 'exp3-cf',
          label: 'Cluster Size',
          type: 'text',
          value: '1,200 Kubernetes Nodes',
          visible: true,
        },
      ],
    });

    const design = createDefaultDesignSettings('classic-professional');
    const html = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(html).toContain('Staff Infrastructure Engineer');
    expect(html).toContain('HyperScale Systems');
    expect(html).toContain('1,200 Kubernetes Nodes');
  });

  it('4. Supports multiple education records and optional GPA visibility toggle', () => {
    const cv = createSampleCvDocument();
    cv.education.push({
      id: 'edu-2',
      degree: 'B.S.',
      fieldOfStudy: 'Applied Mathematics',
      institution: 'MIT',
      location: 'Cambridge, MA',
      startYear: '2010',
      graduationYear: '2014',
      currentlyStudying: false,
      gradeGpa: '3.98 / 4.0',
      showGpa: true,
      description: 'Summa Cum Laude',
      visible: true,
    });

    const design = createDefaultDesignSettings('classic-professional');
    const htmlWithGpa = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(htmlWithGpa).toContain('3.98 / 4.0');

    // Hide GPA on the newly added education record
    cv.education[cv.education.length - 1].showGpa = false;
    const htmlWithoutGpa = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(htmlWithoutGpa).not.toContain('3.98 / 4.0');
  });

  it('5 & 6. Supports unlimited custom sections and all 5 custom field types (text, date, url, list, multiline)', () => {
    const cv = createSampleCvDocument();
    const fieldTypes: CustomFieldType[] = ['text', 'date', 'url', 'list', 'multiline'];
    const customSecId = 'custom:clinical-rotations' as CoreOrAdditionalSectionId;

    cv.customSections.push({
      id: customSecId,
      title: 'Clinical Rotations & Clearances',
      visible: true,
      items: [
        {
          id: 'c-item-1',
          title: 'Johns Hopkins Cardiology Rotation',
          subtitle: 'Chief Resident Supervision',
          dateRange: '2024',
          location: 'Baltimore, MD',
          description: 'Completed intensive clinical fellowship.',
          visible: true,
          fields: fieldTypes.map((ft, idx) => ({
            id: `field-${ft}-${idx}`,
            label: `Label_${ft}`,
            type: ft,
            visible: true,
            value:
              ft === 'url'
                ? 'https://hopkinsmedicine.org/verify'
                : ft === 'list'
                ? 'ECG Interpretation, Echo Diagnostics, ICU Triage'
                : ft === 'date'
                ? '2024-08'
                : `Value_for_${ft}_field`,
          })),
        },
      ],
    });
    cv.sectionOrder.push({
      id: customSecId,
      label: 'Clinical Rotations & Clearances',
      visible: true,
      isCustom: true,
    });

    const design = createDefaultDesignSettings('medical-professional');
    const html = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );

    expect(html).toContain('Clinical Rotations &amp; Clearances');
    expect(html).toContain('Johns Hopkins Cardiology Rotation');
    expect(html).toContain('https://hopkinsmedicine.org/verify');
    expect(html).toContain('ECG Interpretation');
    expect(html).toContain('Value_for_text_field');
    expect(html).toContain('Value_for_multiline_field');
  });

  it('7 & 8. Reorders sections and hides/shows sections dynamically without losing data', () => {
    const cv = createSampleCvDocument();
    const design = createDefaultDesignSettings('ats-friendly-standard');

    // Hide summary section
    cv.summary.visible = false;
    cv.sectionOrder = cv.sectionOrder.map((s) =>
      s.id === 'summary' ? { ...s, visible: false } : s
    );

    const htmlHidden = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(htmlHidden).not.toContain('resilient distributed systems');
    // Data is still preserved in state
    expect(cv.summary.content.length).toBeGreaterThan(50);

    // Re-enable summary section
    cv.summary.visible = true;
    cv.sectionOrder = cv.sectionOrder.map((s) =>
      s.id === 'summary' ? { ...s, visible: true } : s
    );
    const htmlRestored = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(htmlRestored).toContain('resilient distributed systems');
  });

  it('9. Includes all 25 genuinely distinct professional templates and switches across all 25 without data loss', () => {
    expect(CV_TEMPLATES.length).toBe(25);
    const cv = createSampleCvDocument();
    let design = createDefaultDesignSettings('classic-professional');

    const uniqueIds = new Set(CV_TEMPLATES.map((t) => t.id));
    expect(uniqueIds.size).toBe(25);

    for (const tpl of CV_TEMPLATES) {
      design = applyTemplateDefaultsToDesign(design, tpl.id);
      expect(getCvTemplateById(tpl.id).name).toBe(tpl.name);

      const thumbHtml = renderToStaticMarkup(
        React.createElement(TemplateThumbnailPreview, { template: tpl, active: true })
      );
      expect(thumbHtml).toContain('aspect-[210/297]');

      const renderedHtml = renderToStaticMarkup(
        React.createElement(CvTemplateRenderer, { data: cv, design })
      );
      // Verify personal, experience, education, skills, and custom section survive every single template switch
      expect(renderedHtml).toContain(cv.personal.fullName);
      expect(renderedHtml).toContain(cv.experience[0].companyName);
      expect(renderedHtml).toContain(cv.education[0].institution);
      expect(renderedHtml).toContain('KubeCon');
    }
  });

  it('10. Renders and hides optional profile photo cleanly', () => {
    const cv = createSampleCvDocument();
    cv.personal.profilePhotoDataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    cv.personal.showProfilePhoto = true;

    const design = createDefaultDesignSettings('modern-two-column');
    design.photoVisibility = 'show';

    const htmlWithPhoto = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(htmlWithPhoto).toContain('data:image/png;base64');

    design.photoVisibility = 'hide';
    const htmlWithoutPhoto = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design })
    );
    expect(htmlWithoutPhoto).not.toContain('data:image/png;base64');
  });

  it('11 & 12. Expands from a single-page CV to a multi-page CV automatically when content grows', () => {
    const singlePageCv = createBlankCvDocument();
    singlePageCv.personal.fullName = 'Sophia Lin';
    singlePageCv.personal.jobTitle = 'Product Designer';
    singlePageCv.summary.content = 'Focused product designer.';

    const design = createDefaultDesignSettings('modern-minimalist');
    const singleHtml = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: singlePageCv, design })
    );
    expect(singleHtml).not.toContain('Page 2 of');

    // Now populate extensive multi-page content
    const multiPageCv = createSampleCvDocument();
    for (let i = 0; i < 6; i++) {
      multiPageCv.experience.push({
        id: `heavy-exp-${i}`,
        jobTitle: `Senior Engineering Director #${i + 1}`,
        companyName: `Global Enterprise Corp ${i + 1}`,
        employmentType: 'Full-time',
        location: 'New York, NY',
        startDate: '2018-01',
        endDate: '2023-12',
        currentlyWorking: false,
        responsibilities:
          'Directed 120+ engineers across 8 product lines.\nBuilt multi-region cloud infrastructure.\nSpearheaded SOC2 and ISO27001 compliance.',
        achievements:
          'Grew ARR from $15M to $85M.\nReduced cloud spend by $1.4M annually.',
        visible: true,
        customFields: [],
      });
    }

    const multiHtml = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: multiPageCv, design })
    );
    expect(multiHtml).toContain('Page 2 of');
  });

  it('13 & 14. Generates real PDF output (A4 and US Letter) and sanitizes export filenames', () => {
    const cv = createSampleCvDocument();
    const designA4 = createDefaultDesignSettings('classic-professional');
    designA4.pageSize = 'A4';

    const pdfA4 = generateStructuredPdfOutput(cv, designA4);
    expect(pdfA4.outputString.startsWith('data:application/pdf')).toBe(true);
    expect(pdfA4.pageCount).toBeGreaterThanOrEqual(1);
    expect(pdfA4.fileName).toBe('Alexander_J_Mercer_classic-professional.pdf');

    const designLetter = createDefaultDesignSettings('corporate-executive');
    designLetter.pageSize = 'LETTER';
    const pdfLetter = generateStructuredPdfOutput(cv, designLetter);
    expect(pdfLetter.outputString.startsWith('data:application/pdf')).toBe(true);

    expect(sanitizeCvFileName('Dr. Aisha Khan!', 'medical-professional', 'png')).toBe(
      'Dr_Aisha_Khan_medical-professional.png'
    );
  });

  it('15, 16, 17, 18. Validates fields, polishes summary without fake claims, and supports RTL languages (Urdu & Arabic)', () => {
    const cv = createSampleCvDocument();
    cv.personal.email = 'invalid-email-format';
    cv.personal.linkedinUrl = 'not-a-valid-url';
    const errors = validateCvData(cv);
    expect(errors.some((e) => e.field === 'email')).toBe(true);
    expect(errors.some((e) => e.field === 'linkedinUrl')).toBe(true);

    // Client-side AI polish never invents fake degrees or employers
    const rawSummary = 'i led backend team and built payment apis';
    const polished = polishSummaryTextClientSide(
      rawSummary,
      cv.personal,
      cv.skills,
      cv.experience
    );
    expect(polished).toContain('I led backend team and built payment apis.');
    expect(polished).not.toContain('Harvard');

    // RTL rendering for Urdu & Arabic
    const designUr = createDefaultDesignSettings('international-cv');
    designUr.locale = 'ur';
    expect(CV_LOCALE_DICTIONARY.ur.dir).toBe('rtl');
    const htmlUr = renderToStaticMarkup(
      React.createElement(CvTemplateRenderer, { data: cv, design: designUr })
    );
    expect(htmlUr).toContain('dir="rtl"');
    expect(htmlUr).toContain(CV_LOCALE_DICTIONARY.ur.experience);

    expect(formatCvDate('2024-03', 'MMM YYYY')).toBe('Mar 2024');
    expect(formatCvDate('2024-03', 'MM/YYYY')).toBe('03/2024');
  });

  it('19 & 20. Registers /cv-maker and /tools/cv-maker in Toolverse Registry and SEO Meta Engine', () => {
    const tool = getToolBySlug('cv-maker');
    expect(tool).toBeDefined();
    expect(tool?.canonicalName).toContain('CV Maker');
    expect(getToolBySlug('resume-builder')?.slug).toBe('cv-maker');

    const meta = getMetadataForPath('/cv-maker');
    expect(meta.title.length).toBeLessThanOrEqual(60);
    expect(meta.canonicalUrl).toBe('https://toolverse.baby/cv-maker');
    expect(meta.description).toContain('CV');
    expect(Array.isArray(meta.jsonLd)).toBe(true);
  });
});
