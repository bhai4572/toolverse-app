import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CvDocumentData,
  CvDesignSettings,
  CvExperienceItem,
  CvEducationItem,
  CvSkillItem,
  CvStandardRecordItem,
  CvCustomSection,
  CvCustomSectionItem,
  CvCustomField,
  CustomFieldType,
  AdditionalSectionKey,
  CoreOrAdditionalSectionId,
  ADDITIONAL_SECTION_CONFIGS,
  CV_LOCALE_DICTIONARY,
  CvLocaleCode,
  SkillProficiency,
  createBlankCvDocument,
  createSampleCvDocument,
  createDefaultDesignSettings,
  validateCvData,
  polishSummaryTextClientSide,
} from '../../../lib/cv/typesAndDefaults';
import {
  CV_TEMPLATES,
  getCvTemplateById,
  applyTemplateDefaultsToDesign,
  CvTemplateDefinition,
} from '../../../lib/cv/templatesCatalog';
import { CvTemplateRenderer, TemplateThumbnailPreview } from './CvTemplateRenderer';
import {
  exportCvToPdf,
  exportCvToPng,
  exportCvToJpg,
  printCvDocument,
} from './exportEngine';

const STORAGE_KEY_DATA = 'toolverse_cv_maker_data_v1';
const STORAGE_KEY_DESIGN = 'toolverse_cv_maker_design_v1';

const ACCENT_PRESETS = [
  '#1e3a8a',
  '#0f766e',
  '#1d4ed8',
  '#0369a1',
  '#4338ca',
  '#7c3aed',
  '#be123c',
  '#b45309',
  '#15803d',
  '#111827',
  '#334155',
  '#6d28d9',
];

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
  'Remote',
];

const SKILL_PROFICIENCIES: SkillProficiency[] = [
  '',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

const CUSTOM_FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Single-Line Text' },
  { value: 'date', label: 'Date / Period' },
  { value: 'url', label: 'Website / URL Link' },
  { value: 'list', label: 'Bullet / Comma List' },
  { value: 'multiline', label: 'Multiline Description' },
];

type LeftPanelTab =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'additional'
  | 'custom'
  | 'sections';

type RightPanelTab = 'templates' | 'customize';

type MobileWizardStep = 0 | 1 | 2 | 3 | 4 | 5;

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function CvMakerTool() {
  const [cvData, setCvData] = useState<CvDocumentData>(() => createSampleCvDocument());
  const [design, setDesign] = useState<CvDesignSettings>(() =>
    createDefaultDesignSettings('classic-professional')
  );

  // Editor state
  const [leftTab, setLeftTab] = useState<LeftPanelTab>('personal');
  const [rightTab, setRightTab] = useState<RightPanelTab>('templates');
  const [activeAdditionalSection, setActiveAdditionalSection] =
    useState<AdditionalSectionKey>('projects');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('All');
  const [previewZoom, setPreviewZoom] = useState<number>(0.72);
  const [jpgDpi, setJpgDpi] = useState<'150' | '300' | '450'>('300');

  // Mobile wizard state
  const [mobileStep, setMobileStep] = useState<MobileWizardStep>(0);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);

  // Modals & status alerts
  const [inspectTemplateModal, setInspectTemplateModal] = useState<CvTemplateDefinition | null>(
    null
  );
  const [savedDraftBanner, setSavedDraftBanner] = useState<boolean>(false);
  const [statusToast, setStatusToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [newSkillCategoryInput, setNewSkillCategoryInput] = useState<string>('');
  const [newCustomSectionTitle, setNewCustomSectionTitle] = useState<string>('');
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const jsonUploadRef = useRef<HTMLInputElement | null>(null);
  const photoUploadRef = useRef<HTMLInputElement | null>(null);

  const showNotice = (type: 'success' | 'error' | 'info', message: string) => {
    setStatusToast({ type, message });
    setTimeout(() => {
      setStatusToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Check if localStorage has a saved draft on initial mount
  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY_DATA);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (parsed && parsed.personal) {
          setSavedDraftBanner(true);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  // Auto-save to localStorage whenever cvData or design changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(cvData));
        localStorage.setItem(STORAGE_KEY_DESIGN, JSON.stringify(design));
      } catch {
        // Ignore quota errors
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [cvData, design]);

  const handleRestoreSavedDraft = () => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY_DATA);
      const rawDesign = localStorage.getItem(STORAGE_KEY_DESIGN);
      if (rawData) {
        const parsedData = JSON.parse(rawData);
        if (parsedData && parsedData.personal && Array.isArray(parsedData.skills)) {
          setCvData(parsedData);
        }
      }
      if (rawDesign) {
        const parsedDesign = JSON.parse(rawDesign);
        if (parsedDesign && parsedDesign.templateId) {
          setDesign(parsedDesign);
        }
      }
      setSavedDraftBanner(false);
      showNotice('success', 'Restored your saved CV draft from browser storage.');
    } catch {
      showNotice('error', 'Could not restore draft from browser storage.');
    }
  };

  const handleManualSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(cvData));
      localStorage.setItem(STORAGE_KEY_DESIGN, JSON.stringify(design));
      showNotice('success', 'Draft saved locally in your browser.');
    } catch {
      showNotice('error', 'Browser storage is full or unavailable. Try exporting JSON backup.');
    }
  };

  const handleLoadSampleCv = () => {
    const sample = createSampleCvDocument();
    setCvData(sample);
    setSavedDraftBanner(false);
    showNotice('info', 'Loaded complete sample CV with realistic data.');
  };

  const handleClearAllData = () => {
    const blank = createBlankCvDocument();
    setCvData(blank);
    try {
      localStorage.removeItem(STORAGE_KEY_DATA);
    } catch {
      // ignore
    }
    setSavedDraftBanner(false);
    showNotice('info', 'All CV fields cleared. Starting with a clean blank CV.');
  };

  // Validation
  const validationErrors = useMemo(() => validateCvData(cvData), [cvData]);

  // Template switching without losing any user data
  const handleSelectTemplate = (templateId: string) => {
    setDesign((prev) => applyTemplateDefaultsToDesign(prev, templateId));
    const tpl = getCvTemplateById(templateId);
    showNotice('success', `Switched to "${tpl.number}. ${tpl.name}" template — all CV data preserved.`);
  };

  const handleResetDesign = () => {
    setDesign((prev) => applyTemplateDefaultsToDesign(prev, prev.templateId, true));
    showNotice('info', 'Reset design settings to template defaults.');
  };

  // Photo Upload Handler with Format & Size Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showNotice('error', 'Invalid image format. Please upload a JPG, PNG, or WebP photo.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showNotice('error', 'Profile photo is too large (max 4 MB). Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setCvData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          profilePhotoDataUrl: result,
          showProfilePhoto: true,
        },
      }));
      setDesign((prev) => ({ ...prev, photoVisibility: 'show' }));
      showNotice('success', 'Profile photo uploaded and enabled.');
    };
    reader.onerror = () => {
      showNotice('error', 'Could not read image file.');
    };
    reader.readAsDataURL(file);
  };

  // JSON Export & Import
  const handleExportJson = () => {
    const payload = JSON.stringify({ cvData, design }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cvData.personal.fullName || 'Toolverse_CV').replace(/\s+/g, '_')}_Backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice('success', 'Exported CV backup JSON file.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (parsed.cvData && parsed.cvData.personal) {
          setCvData(parsed.cvData);
          if (parsed.design) setDesign(parsed.design);
          showNotice('success', 'Imported CV backup JSON successfully.');
        } else if (parsed.personal) {
          setCvData(parsed);
          showNotice('success', 'Imported CV data JSON successfully.');
        } else {
          showNotice('error', 'Invalid CV JSON structure.');
        }
      } catch {
        showNotice('error', 'Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Free Download Handlers
  const handleDownloadPdf = async () => {
    setIsExporting('pdf');
    try {
      const res = await exportCvToPdf(previewRef.current, cvData, design);
      if (res.success) {
        showNotice(
          'success',
          `Downloaded ${res.fileName} (${res.pageCount} ${res.pageCount === 1 ? 'page' : 'pages'}) — 100% Free, No Watermark.`
        );
      } else {
        showNotice('error', res.error || 'Failed to generate PDF.');
      }
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPng = async () => {
    setIsExporting('png');
    try {
      const res = await exportCvToPng(
        previewRef.current,
        cvData.personal.fullName,
        design.templateId
      );
      if (res.success) {
        showNotice('success', `Downloaded high-resolution PNG (${res.pageCount} page(s)).`);
      } else {
        showNotice('error', res.error || 'Failed to export PNG.');
      }
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadJpg = async () => {
    setIsExporting('jpg');
    try {
      const res = await exportCvToJpg(
        previewRef.current,
        cvData.personal.fullName,
        design.templateId,
        jpgDpi
      );
      if (res.success) {
        showNotice('success', `Downloaded ${jpgDpi} DPI JPG (${res.pageCount} page(s)).`);
      } else {
        showNotice('error', res.error || 'Failed to export JPG.');
      }
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrintCv = () => {
    const ok = printCvDocument(
      previewRef.current,
      `${cvData.personal.fullName || 'Professional'} - CV`,
      design.pageSize
    );
    if (!ok) {
      showNotice('error', 'Unable to open print preview.');
    }
  };

  // Section Reordering & Visibility Helpers
  const moveSectionOrder = (index: number, direction: -1 | 1) => {
    setCvData((prev) => {
      const list = [...prev.sectionOrder];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, sectionOrder: list };
    });
  };

  const handleDropSectionOrder = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    setCvData((prev) => {
      const list = [...prev.sectionOrder];
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return { ...prev, sectionOrder: list };
    });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setCvData((prev) => {
      const nextOrder = prev.sectionOrder.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      );
      const targetSec = nextOrder.find((s) => s.id === sectionId);
      const nextSummary =
        sectionId === 'summary' && targetSec
          ? { ...prev.summary, visible: targetSec.visible }
          : prev.summary;
      const nextCustom = prev.customSections.map((cs) =>
        cs.id === sectionId && targetSec ? { ...cs, visible: targetSec.visible } : cs
      );
      return {
        ...prev,
        sectionOrder: nextOrder,
        summary: nextSummary,
        customSections: nextCustom,
      };
    });
  };

  // Filtered Templates
  const templateCategories = useMemo(() => {
    const cats = Array.from(new Set(CV_TEMPLATES.map((t) => t.category)));
    return ['All', ...cats];
  }, []);

  const filteredTemplates = useMemo(() => {
    if (templateCategoryFilter === 'All') return CV_TEMPLATES;
    return CV_TEMPLATES.filter((t) => t.category === templateCategoryFilter);
  }, [templateCategoryFilter]);

  // ============================================================================
  // RENDER HELPERS FOR LEFT PANEL EDITORS
  // ============================================================================

  const renderPersonalEditor = () => {
    const p = cvData.personal;
    const updatePersonal = (patch: Partial<typeof p>) =>
      setCvData((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">
              Enter your contact details. Toggle visibility for optional links or address.
            </p>
          </div>
        </div>

        {/* Profile photo uploader */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
          {p.profilePhotoDataUrl ? (
            <img
              src={p.profilePhotoDataUrl}
              alt={p.fullName || 'Profile'}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
              {(p.fullName || 'CV').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Profile Photo (Optional)</span>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.showProfilePhoto && design.photoVisibility !== 'hide'}
                  onChange={(e) => {
                    updatePersonal({ showProfilePhoto: e.target.checked });
                    setDesign((prev) => ({
                      ...prev,
                      photoVisibility: e.target.checked ? 'show' : 'hide',
                    }));
                  }}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Show on CV
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <input
                ref={photoUploadRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoUploadRef.current?.click()}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Upload Photo
              </button>
              {p.profilePhotoDataUrl && (
                <button
                  type="button"
                  onClick={() => updatePersonal({ profilePhotoDataUrl: '', showProfilePhoto: false })}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={p.fullName}
              onChange={(e) => updatePersonal({ fullName: e.target.value })}
              placeholder="e.g., Alexander J. Mercer"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Professional Job Title
            </label>
            <input
              type="text"
              value={p.jobTitle}
              onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
              placeholder="e.g., Principal Software & Cloud Architect"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={p.email}
              onChange={(e) => updatePersonal({ email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={p.phone}
              onChange={(e) => updatePersonal({ phone: e.target.value })}
              placeholder="+1 (415) 890-4321"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={p.city}
              onChange={(e) => updatePersonal({ city: e.target.value })}
              placeholder="San Francisco, CA"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
            <input
              type="text"
              value={p.country}
              onChange={(e) => updatePersonal({ country: e.target.value })}
              placeholder="United States"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>

          {/* Optional fields with explicit Hide/Show checkboxes */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Full Street Address (Optional)</label>
              <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.showFullAddress}
                  onChange={(e) => updatePersonal({ showFullAddress: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                Show on CV
              </label>
            </div>
            <input
              type="text"
              value={p.fullAddress}
              onChange={(e) => updatePersonal({ fullAddress: e.target.value })}
              placeholder="742 Market Street, Suite 400"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">LinkedIn URL</label>
              <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.showLinkedin}
                  onChange={(e) => updatePersonal({ showLinkedin: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                Show on CV
              </label>
            </div>
            <input
              type="url"
              value={p.linkedinUrl}
              onChange={(e) => updatePersonal({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Personal Website</label>
              <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.showWebsite}
                  onChange={(e) => updatePersonal({ showWebsite: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                Show on CV
              </label>
            </div>
            <input
              type="url"
              value={p.websiteUrl}
              onChange={(e) => updatePersonal({ websiteUrl: e.target.value })}
              placeholder="https://yourwebsite.dev"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Portfolio URL</label>
              <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.showPortfolio}
                  onChange={(e) => updatePersonal({ showPortfolio: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                Show
              </label>
            </div>
            <input
              type="url"
              value={p.portfolioUrl}
              onChange={(e) => updatePersonal({ portfolioUrl: e.target.value })}
              placeholder="https://behance.net/username"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">GitHub URL</label>
              <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.showGithub}
                  onChange={(e) => updatePersonal({ showGithub: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                Show
              </label>
            </div>
            <input
              type="url"
              value={p.githubUrl}
              onChange={(e) => updatePersonal({ githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSummaryEditor = () => {
    const s = cvData.summary;
    const charCount = s.content.length;

    const handlePolishSummary = () => {
      const polished = polishSummaryTextClientSide(
        s.content,
        cvData.personal,
        cvData.skills,
        cvData.experience
      );
      setCvData((prev) => ({
        ...prev,
        summary: { ...prev.summary, content: polished },
      }));
      showNotice(
        'success',
        'Polished grammar and phrasing using only your entered details (zero fabricated claims).'
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
            <p className="text-xs text-slate-500">
              Highlight your core strengths, leadership scope, and career focus.
            </p>
          </div>
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={s.visible}
              onChange={() => toggleSectionVisibility('summary')}
              className="rounded border-slate-300 text-indigo-600"
            />
            Show Section
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Summary Statement</label>
            <span className="text-[11px] font-medium text-slate-500">
              {charCount} characters
            </span>
          </div>
          <textarea
            rows={6}
            value={s.content}
            onChange={(e) =>
              setCvData((prev) => ({
                ...prev,
                summary: { ...prev.summary, content: e.target.value },
              }))
            }
            placeholder="Write a concise 3–5 sentence overview of your genuine experience, domain expertise, and measurable impact..."
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handlePolishSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition"
          >
            <span>✨ Polish Grammar & Tone (No Fake Claims)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setCvData((prev) => ({ ...prev, summary: { ...prev.summary, content: '' } }))
            }
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            Clear Summary
          </button>
        </div>
      </div>
    );
  };

  const renderExperienceEditor = () => {
    const addExperience = () => {
      const newItem: CvExperienceItem = {
        id: uid('exp'),
        jobTitle: 'Role / Position Title',
        companyName: 'Company Name',
        employmentType: 'Full-time',
        location: '',
        startDate: '2023-01',
        endDate: '',
        currentlyWorking: true,
        responsibilities: '',
        achievements: '',
        visible: true,
        customFields: [],
      };
      setCvData((prev) => ({ ...prev, experience: [...prev.experience, newItem] }));
    };

    const updateExp = (id: string, patch: Partial<CvExperienceItem>) => {
      setCvData((prev) => ({
        ...prev,
        experience: prev.experience.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));
    };

    const removeExp = (id: string) => {
      setCvData((prev) => ({
        ...prev,
        experience: prev.experience.filter((item) => item.id !== id),
      }));
    };

    const moveExp = (index: number, dir: -1 | 1) => {
      setCvData((prev) => {
        const list = [...prev.experience];
        const target = index + dir;
        if (target < 0 || target >= list.length) return prev;
        const tmp = list[index];
        list[index] = list[target];
        list[target] = tmp;
        return { ...prev, experience: list };
      });
    };

    const addExpCustomField = (expId: string) => {
      const cf: CvCustomField = {
        id: uid('exp-cf'),
        label: 'Tech Stack / Key Metric',
        type: 'text',
        value: '',
        visible: true,
      };
      setCvData((prev) => ({
        ...prev,
        experience: prev.experience.map((item) =>
          item.id === expId ? { ...item, customFields: [...item.customFields, cf] } : item
        ),
      }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Work Experience ({cvData.experience.length})
            </h3>
            <p className="text-xs text-slate-500">
              Add roles, responsibilities, achievements, and custom fields per job.
            </p>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            + Add Experience
          </button>
        </div>

        {cvData.experience.length === 0 && (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-xs text-slate-600 mb-2">No work experience entries added yet.</p>
            <button
              type="button"
              onClick={addExperience}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
            >
              + Add First Job
            </button>
          </div>
        )}

        <div className="space-y-4">
          {cvData.experience.map((exp, idx) => (
            <div
              key={exp.id}
              className={`p-3.5 rounded-xl border transition ${
                exp.visible
                  ? 'border-slate-200 bg-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 truncate">
                  #{idx + 1} {exp.jobTitle || 'Untitled Role'} — {exp.companyName || 'Company'}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveExp(idx, -1)}
                    disabled={idx === 0}
                    title="Move Up"
                    className="px-1.5 py-0.5 text-xs rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveExp(idx, 1)}
                    disabled={idx === cvData.experience.length - 1}
                    title="Move Down"
                    className="px-1.5 py-0.5 text-xs rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => updateExp(exp.id, { visible: !exp.visible })}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${
                      exp.visible
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {exp.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExp(exp.id)}
                    className="px-2 py-0.5 text-[11px] font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => updateExp(exp.id, { jobTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={exp.companyName}
                    onChange={(e) => updateExp(exp.id, { companyName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Employment Type
                  </label>
                  <select
                    value={exp.employmentType}
                    onChange={(e) => updateExp(exp.id, { employmentType: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">Select Type</option>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExp(exp.id, { location: e.target.value })}
                    placeholder="City, Country or Remote"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Start Date (YYYY-MM)
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExp(exp.id, { startDate: e.target.value })}
                    placeholder="2022-03"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[11px] font-semibold text-slate-700">
                      End Date (YYYY-MM)
                    </label>
                    <label className="inline-flex items-center gap-1 text-[11px] text-indigo-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) =>
                          updateExp(exp.id, { currentlyWorking: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      Current Role
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={exp.currentlyWorking}
                    value={exp.currentlyWorking ? 'Present' : exp.endDate}
                    onChange={(e) => updateExp(exp.id, { endDate: e.target.value })}
                    placeholder="2024-11"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Responsibilities (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={exp.responsibilities}
                    onChange={(e) => updateExp(exp.id, { responsibilities: e.target.value })}
                    placeholder="Led architecture and delivery of..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Key Achievements (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={exp.achievements}
                    onChange={(e) => updateExp(exp.id, { achievements: e.target.value })}
                    placeholder="Reduced latency by 42% and saved $240K/year..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Custom fields inside Work Experience */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600">
                    Custom Fields for this Role ({exp.customFields.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => addExpCustomField(exp.id)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Custom Field
                  </button>
                </div>
                {exp.customFields.map((cf) => (
                  <div
                    key={cf.id}
                    className="grid grid-cols-12 gap-1.5 items-center mb-1.5 bg-slate-50 p-1.5 rounded-lg"
                  >
                    <input
                      type="text"
                      value={cf.label}
                      onChange={(e) =>
                        updateExp(exp.id, {
                          customFields: exp.customFields.map((f) =>
                            f.id === cf.id ? { ...f, label: e.target.value } : f
                          ),
                        })
                      }
                      placeholder="Field Label"
                      className="col-span-4 px-2 py-1 text-xs rounded border border-slate-300"
                    />
                    <select
                      value={cf.type}
                      onChange={(e) =>
                        updateExp(exp.id, {
                          customFields: exp.customFields.map((f) =>
                            f.id === cf.id
                              ? { ...f, type: e.target.value as CustomFieldType }
                              : f
                          ),
                        })
                      }
                      className="col-span-3 px-1.5 py-1 text-xs rounded border border-slate-300 bg-white"
                    >
                      {CUSTOM_FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={cf.value}
                      onChange={(e) =>
                        updateExp(exp.id, {
                          customFields: exp.customFields.map((f) =>
                            f.id === cf.id ? { ...f, value: e.target.value } : f
                          ),
                        })
                      }
                      placeholder="Value"
                      className="col-span-4 px-2 py-1 text-xs rounded border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateExp(exp.id, {
                          customFields: exp.customFields.filter((f) => f.id !== cf.id),
                        })
                      }
                      className="col-span-1 text-xs text-rose-600 font-bold hover:text-rose-800 text-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationEditor = () => {
    const addEducation = () => {
      const newEdu: CvEducationItem = {
        id: uid('edu'),
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        institution: 'University Name',
        location: '',
        startYear: '2018',
        graduationYear: '2022',
        currentlyStudying: false,
        gradeGpa: '',
        showGpa: true,
        description: '',
        visible: true,
      };
      setCvData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
    };

    const updateEdu = (id: string, patch: Partial<CvEducationItem>) => {
      setCvData((prev) => ({
        ...prev,
        education: prev.education.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));
    };

    const removeEdu = (id: string) => {
      setCvData((prev) => ({
        ...prev,
        education: prev.education.filter((item) => item.id !== id),
      }));
    };

    const moveEdu = (index: number, dir: -1 | 1) => {
      setCvData((prev) => {
        const list = [...prev.education];
        const target = index + dir;
        if (target < 0 || target >= list.length) return prev;
        const tmp = list[index];
        list[index] = list[target];
        list[target] = tmp;
        return { ...prev, education: list };
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Education ({cvData.education.length})
            </h3>
            <p className="text-xs text-slate-500">
              Add academic degrees, institutions, honours, and optional GPA.
            </p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            + Add Education
          </button>
        </div>

        {cvData.education.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 truncate">
                #{idx + 1} {edu.degree} — {edu.institution}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveEdu(idx, -1)}
                  disabled={idx === 0}
                  className="px-1.5 py-0.5 text-xs rounded border border-slate-200 disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveEdu(idx, 1)}
                  disabled={idx === cvData.education.length - 1}
                  className="px-1.5 py-0.5 text-xs rounded border border-slate-200 disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => updateEdu(edu.id, { visible: !edu.visible })}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${
                    edu.visible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {edu.visible ? 'Visible' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => removeEdu(edu.id)}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded bg-rose-50 text-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Degree / Qualification
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEdu(edu.id, { degree: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Field of Study / Major
                </label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEdu(edu.id, { fieldOfStudy: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  School / University
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEdu(edu.id, { institution: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => updateEdu(edu.id, { location: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Start Year
                </label>
                <input
                  type="text"
                  value={edu.startYear}
                  onChange={(e) => updateEdu(edu.id, { startYear: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Graduation Year
                  </label>
                  <label className="inline-flex items-center gap-1 text-[11px] text-indigo-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.currentlyStudying}
                      onChange={(e) =>
                        updateEdu(edu.id, { currentlyStudying: e.target.checked })
                      }
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    Currently Studying
                  </label>
                </div>
                <input
                  type="text"
                  disabled={edu.currentlyStudying}
                  value={edu.currentlyStudying ? 'Present' : edu.graduationYear}
                  onChange={(e) => updateEdu(edu.id, { graduationYear: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 disabled:bg-slate-100"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Grade / GPA (Optional)
                  </label>
                  <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.showGpa}
                      onChange={(e) => updateEdu(edu.id, { showGpa: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    Show GPA on CV
                  </label>
                </div>
                <input
                  type="text"
                  value={edu.gradeGpa}
                  onChange={(e) => updateEdu(edu.id, { gradeGpa: e.target.value })}
                  placeholder="3.9 / 4.0 or First-Class Honours"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Description / Thesis / Honours
                </label>
                <textarea
                  rows={2}
                  value={edu.description}
                  onChange={(e) => updateEdu(edu.id, { description: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSkillsEditor = () => {
    const items = cvData.skills;
    const categories = cvData.skillCategories;

    const addSkill = () => {
      // Never auto-assign fake skill percentages — proficiency defaults to empty ('') unless user selects one
      const item: CvSkillItem = {
        id: uid('sk'),
        name: 'New Skill',
        category: categories[0] || 'Technical Skills',
        proficiency: '',
        visible: true,
      };
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, item],
      }));
    };

    const updateSkill = (id: string, patch: Partial<CvSkillItem>) => {
      setCvData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      }));
    };

    const removeSkill = (id: string) => {
      setCvData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }));
    };

    const moveSkill = (idx: number, dir: -1 | 1) => {
      setCvData((prev) => {
        const list = [...prev.skills];
        const target = idx + dir;
        if (target < 0 || target >= list.length) return prev;
        const tmp = list[idx];
        list[idx] = list[target];
        list[target] = tmp;
        return { ...prev, skills: list };
      });
    };

    const handleAddCategory = () => {
      const trimmed = newSkillCategoryInput.trim();
      if (!trimmed) return;
      if (categories.includes(trimmed)) {
        showNotice('info', 'This skill category already exists.');
        return;
      }
      setCvData((prev) => ({
        ...prev,
        skillCategories: [...prev.skillCategories, trimmed],
      }));
      setNewSkillCategoryInput('');
      showNotice('success', `Added skill category "${trimmed}".`);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Skills ({items.length})</h3>
            <p className="text-xs text-slate-500">
              Organize skills by category. Proficiency levels are optional and never auto-invented.
            </p>
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            + Add Skill
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={cvData.showSkillProficiency}
              onChange={(e) =>
                setCvData((prev) => ({
                  ...prev,
                  showSkillProficiency: e.target.checked,
                }))
              }
              className="rounded border-slate-300 text-indigo-600"
            />
            Display Proficiency Levels on CV
          </label>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newSkillCategoryInput}
              onChange={(e) => setNewSkillCategoryInput(e.target.value)}
              placeholder="New Custom Category..."
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900"
            >
              + Category
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-1.5 items-center p-2 rounded-lg border border-slate-200 bg-white"
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateSkill(item.id, { name: e.target.value })}
                placeholder="Skill name"
                className="col-span-4 px-2 py-1 text-xs rounded border border-slate-300"
              />
              <select
                value={item.category}
                onChange={(e) => updateSkill(item.id, { category: e.target.value })}
                className="col-span-4 px-1.5 py-1 text-xs rounded border border-slate-300 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={item.proficiency}
                onChange={(e) =>
                  updateSkill(item.id, {
                    proficiency: e.target.value as SkillProficiency,
                  })
                }
                className="col-span-2 px-1.5 py-1 text-xs rounded border border-slate-300 bg-white"
              >
                {SKILL_PROFICIENCIES.map((pLevel) => (
                  <option key={pLevel || 'none'} value={pLevel}>
                    {pLevel || 'No Level'}
                  </option>
                ))}
              </select>
              <div className="col-span-2 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => moveSkill(idx, -1)}
                  disabled={idx === 0}
                  className="px-1 py-0.5 text-[11px] rounded border border-slate-200 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSkill(idx, 1)}
                  disabled={idx === items.length - 1}
                  className="px-1 py-0.5 text-[11px] rounded border border-slate-200 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeSkill(item.id)}
                  className="px-1.5 py-0.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // All 20 Additional CV Sections Editor
  const renderAdditionalSectionsEditor = () => {
    const cfg =
      ADDITIONAL_SECTION_CONFIGS.find((c) => c.key === activeAdditionalSection) ||
      ADDITIONAL_SECTION_CONFIGS[0];
    const items = cvData.additionalSections[cfg.key] || [];
    const secMeta = cvData.sectionOrder.find((s) => s.id === cfg.key);

    const addItem = () => {
      const newItem: CvStandardRecordItem = {
        id: uid(cfg.key),
        title: '',
        organization: '',
        roleOrSubtitle: '',
        location: '',
        startDate: '',
        endDate: '',
        url: '',
        description: '',
        visible: true,
      };
      setCvData((prev) => ({
        ...prev,
        additionalSections: {
          ...prev.additionalSections,
          [cfg.key]: [...(prev.additionalSections[cfg.key] || []), newItem],
        },
        sectionOrder: prev.sectionOrder.map((s) =>
          s.id === cfg.key ? { ...s, visible: true } : s
        ),
      }));
    };

    const updateItem = (itemId: string, patch: Partial<CvStandardRecordItem>) => {
      setCvData((prev) => ({
        ...prev,
        additionalSections: {
          ...prev.additionalSections,
          [cfg.key]: (prev.additionalSections[cfg.key] || []).map((it) =>
            it.id === itemId ? { ...it, ...patch } : it
          ),
        },
      }));
    };

    const removeItem = (itemId: string) => {
      setCvData((prev) => ({
        ...prev,
        additionalSections: {
          ...prev.additionalSections,
          [cfg.key]: (prev.additionalSections[cfg.key] || []).filter((it) => it.id !== itemId),
        },
      }));
    };

    return (
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900">
            20 Specialized CV Sections
          </h3>
          <p className="text-xs text-slate-500">
            Select any of the 20 built-in sections below to add entries.
          </p>
        </div>

        {/* Selector pills for all 20 sections */}
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
          {ADDITIONAL_SECTION_CONFIGS.map((sectionCfg) => {
            const count = (cvData.additionalSections[sectionCfg.key] || []).length;
            const isSelected = sectionCfg.key === activeAdditionalSection;
            return (
              <button
                key={sectionCfg.key}
                type="button"
                onClick={() => setActiveAdditionalSection(sectionCfg.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : count > 0
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{sectionCfg.defaultLabel}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Additional Section Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-bold text-indigo-950">{cfg.defaultLabel}</h4>
            <label className="inline-flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={secMeta?.visible ?? true}
                onChange={() => toggleSectionVisibility(cfg.key)}
                className="rounded border-slate-300 text-indigo-600"
              />
              Visible on CV
            </label>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + Add to {cfg.defaultLabel}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-5 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-xs text-slate-600 mb-2">
              No entries in <strong>{cfg.defaultLabel}</strong> yet.
            </p>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
            >
              + Add {cfg.defaultLabel} Entry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    #{idx + 1} {item.title || cfg.defaultLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { visible: !item.visible })}
                      className={`px-2 py-0.5 text-[11px] rounded border font-semibold ${
                        item.visible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="px-2 py-0.5 text-[11px] rounded bg-rose-50 text-rose-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      {cfg.titleLabel}
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      placeholder={cfg.titleLabel}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      {cfg.orgLabel}
                    </label>
                    <input
                      type="text"
                      value={item.organization}
                      onChange={(e) => updateItem(item.id, { organization: e.target.value })}
                      placeholder={cfg.orgLabel}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      {cfg.subtitleLabel}
                    </label>
                    <input
                      type="text"
                      value={item.roleOrSubtitle}
                      onChange={(e) => updateItem(item.id, { roleOrSubtitle: e.target.value })}
                      placeholder={cfg.subtitleLabel}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => updateItem(item.id, { location: e.target.value })}
                      placeholder="City / Country"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                      placeholder="YYYY-MM or Year"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      End Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.endDate}
                      onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                      placeholder="YYYY-MM or Present"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  {cfg.urlLabel && (
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        {cfg.urlLabel}
                      </label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => updateItem(item.id, { url: e.target.value })}
                        placeholder={cfg.urlLabel}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      {cfg.descLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder={cfg.descLabel}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Custom Section & Custom Field Builder (Section 10 - Critical Requirement)
  const renderCustomSectionsBuilder = () => {
    const handleCreateCustomSection = () => {
      const title = newCustomSectionTitle.trim() || 'Custom Section';
      const newSecId = `custom:${uid('sec')}` as CoreOrAdditionalSectionId;
      const newSec: CvCustomSection = {
        id: newSecId,
        title,
        visible: true,
        items: [
          {
            id: uid('custom-item'),
            title: 'Entry Title / Topic',
            subtitle: 'Subtitle / Context',
            dateRange: '2024',
            location: '',
            description: '',
            visible: true,
            fields: [
              {
                id: uid('cf'),
                label: 'Key Detail',
                type: 'text',
                value: 'Add your custom detail here',
                visible: true,
              },
            ],
          },
        ],
      };

      setCvData((prev) => ({
        ...prev,
        customSections: [...prev.customSections, newSec],
        sectionOrder: [
          ...prev.sectionOrder,
          {
            id: newSecId,
            label: title,
            visible: true,
            isCustom: true,
          },
        ],
      }));
      setNewCustomSectionTitle('');
      showNotice('success', `Created custom section "${title}".`);
    };

    const renameCustomSection = (secId: string, newTitle: string) => {
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((cs) =>
          cs.id === secId ? { ...cs, title: newTitle } : cs
        ),
        sectionOrder: prev.sectionOrder.map((so) =>
          so.id === secId ? { ...so, label: newTitle } : so
        ),
      }));
    };

    const deleteCustomSection = (secId: string) => {
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.filter((cs) => cs.id !== secId),
        sectionOrder: prev.sectionOrder.filter((so) => so.id !== secId),
      }));
      showNotice('info', 'Deleted custom section.');
    };

    const addCustomItem = (secId: string) => {
      const newItem: CvCustomSectionItem = {
        id: uid('custom-item'),
        title: 'New Entry Heading',
        subtitle: '',
        dateRange: '',
        location: '',
        description: '',
        visible: true,
        fields: [
          {
            id: uid('cf'),
            label: 'Field Label',
            type: 'text',
            value: '',
            visible: true,
          },
        ],
      };
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((cs) =>
          cs.id === secId ? { ...cs, items: [...cs.items, newItem] } : cs
        ),
      }));
    };

    const updateCustomItem = (
      secId: string,
      itemId: string,
      patch: Partial<CvCustomSectionItem>
    ) => {
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((cs) =>
          cs.id === secId
            ? {
                ...cs,
                items: cs.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
              }
            : cs
        ),
      }));
    };

    const removeCustomItem = (secId: string, itemId: string) => {
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((cs) =>
          cs.id === secId
            ? { ...cs, items: cs.items.filter((it) => it.id !== itemId) }
            : cs
        ),
      }));
    };

    const addFieldToCustomItem = (secId: string, itemId: string) => {
      const newField: CvCustomField = {
        id: uid('cf'),
        label: 'Custom Field',
        type: 'text',
        value: '',
        visible: true,
      };
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((cs) =>
          cs.id === secId
            ? {
                ...cs,
                items: cs.items.map((it) =>
                  it.id === itemId ? { ...it, fields: [...it.fields, newField] } : it
                ),
              }
            : cs
        ),
      }));
    };

    const moveCustomField = (
      secId: string,
      itemId: string,
      fieldIdx: number,
      dir: -1 | 1
    ) => {
      setCvData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((cs) => {
          if (cs.id !== secId) return cs;
          return {
            ...cs,
            items: cs.items.map((it) => {
              if (it.id !== itemId) return it;
              const list = [...it.fields];
              const target = fieldIdx + dir;
              if (target < 0 || target >= list.length) return it;
              const tmp = list[fieldIdx];
              list[fieldIdx] = list[target];
              list[target] = tmp;
              return { ...it, fields: list };
            }),
          };
        }),
      }));
    };

    return (
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900">
            Custom Section & Custom Field Builder
          </h3>
          <p className="text-xs text-slate-500">
            Create unlimited custom sections (e.g., Clinical Rotations, Speaking Engagements,
            Security Clearances, Open Source) with custom typed fields.
          </p>
        </div>

        {/* Create new custom section bar */}
        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newCustomSectionTitle}
            onChange={(e) => setNewCustomSectionTitle(e.target.value)}
            placeholder="Enter Custom Section Title (e.g., Speaking Engagements)"
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-indigo-300 bg-white focus:border-indigo-600 outline-none"
          />
          <button
            type="button"
            onClick={handleCreateCustomSection}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shrink-0"
          >
            + Add Custom Section
          </button>
        </div>

        {cvData.customSections.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-xs text-slate-600">
              No custom sections created yet. Enter a title above and click{' '}
              <strong>+ Add Custom Section</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cvData.customSections.map((cs) => (
              <div
                key={cs.id}
                className="p-3.5 rounded-xl border-2 border-indigo-100 bg-white shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
                      Custom Section Title
                    </label>
                    <input
                      type="text"
                      value={cs.title}
                      onChange={(e) => renameCustomSection(cs.id, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-bold rounded border border-slate-300"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(cs.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                        cs.visible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cs.visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => addCustomItem(cs.id)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      + Add Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCustomSection(cs.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                    >
                      Delete Section
                    </button>
                  </div>
                </div>

                {/* Entries inside custom section */}
                <div className="space-y-3">
                  {cs.items.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Entry #{itemIdx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCustomItem(cs.id, item.id, { visible: !item.visible })
                            }
                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                          >
                            {item.visible ? 'Hide Entry' : 'Show Entry'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCustomItem(cs.id, item.id)}
                            className="text-[11px] font-semibold text-rose-600 hover:text-rose-800"
                          >
                            Remove Entry
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Entry Heading
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateCustomItem(cs.id, item.id, { title: e.target.value })
                            }
                            placeholder="Heading / Title"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Subheading / Organization
                          </label>
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) =>
                              updateCustomItem(cs.id, item.id, { subtitle: e.target.value })
                            }
                            placeholder="Subheading (Optional)"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Date / Period
                          </label>
                          <input
                            type="text"
                            value={item.dateRange || ''}
                            onChange={(e) =>
                              updateCustomItem(cs.id, item.id, { dateRange: e.target.value })
                            }
                            placeholder="e.g., 2024"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Location
                          </label>
                          <input
                            type="text"
                            value={item.location || ''}
                            onChange={(e) =>
                              updateCustomItem(cs.id, item.id, { location: e.target.value })
                            }
                            placeholder="e.g., Paris, France"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Summary / Description
                          </label>
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) =>
                              updateCustomItem(cs.id, item.id, { description: e.target.value })
                            }
                            placeholder="Optional overview..."
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      {/* Custom fields list */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">
                            Custom Fields ({item.fields.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => addFieldToCustomItem(cs.id, item.id)}
                            className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                          >
                            + Add Field
                          </button>
                        </div>

                        {item.fields.map((field, fIdx) => (
                          <div
                            key={field.id}
                            className="p-2 rounded-lg bg-white border border-slate-200 space-y-1.5"
                          >
                            <div className="grid grid-cols-12 gap-1.5 items-center">
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) =>
                                  updateCustomItem(cs.id, item.id, {
                                    fields: item.fields.map((f) =>
                                      f.id === field.id ? { ...f, label: e.target.value } : f
                                    ),
                                  })
                                }
                                placeholder="Field Label"
                                className="col-span-5 px-2 py-1 text-xs rounded border border-slate-300"
                              />
                              <select
                                value={field.type}
                                onChange={(e) =>
                                  updateCustomItem(cs.id, item.id, {
                                    fields: item.fields.map((f) =>
                                      f.id === field.id
                                        ? { ...f, type: e.target.value as CustomFieldType }
                                        : f
                                    ),
                                  })
                                }
                                className="col-span-4 px-1.5 py-1 text-xs rounded border border-slate-300 bg-white"
                              >
                                {CUSTOM_FIELD_TYPES.map((ft) => (
                                  <option key={ft.value} value={ft.value}>
                                    {ft.label}
                                  </option>
                                ))}
                              </select>
                              <div className="col-span-3 flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveCustomField(cs.id, item.id, fIdx, -1)}
                                  disabled={fIdx === 0}
                                  className="px-1 py-0.5 text-[10px] rounded border border-slate-200 disabled:opacity-30"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveCustomField(cs.id, item.id, fIdx, 1)}
                                  disabled={fIdx === item.fields.length - 1}
                                  className="px-1 py-0.5 text-[10px] rounded border border-slate-200 disabled:opacity-30"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCustomItem(cs.id, item.id, {
                                      fields: item.fields.filter((f) => f.id !== field.id),
                                    })
                                  }
                                  className="px-1.5 py-0.5 text-xs font-bold text-rose-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            {field.type === 'multiline' || field.type === 'list' ? (
                              <textarea
                                rows={2}
                                value={field.value}
                                onChange={(e) =>
                                  updateCustomItem(cs.id, item.id, {
                                    fields: item.fields.map((f) =>
                                      f.id === field.id ? { ...f, value: e.target.value } : f
                                    ),
                                  })
                                }
                                placeholder={
                                  field.type === 'list'
                                    ? 'Enter list items separated by commas or new lines...'
                                    : 'Enter detailed multiline text...'
                                }
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                              />
                            ) : (
                              <input
                                type={field.type === 'url' ? 'url' : 'text'}
                                value={field.value}
                                onChange={(e) =>
                                  updateCustomItem(cs.id, item.id, {
                                    fields: item.fields.map((f) =>
                                      f.id === field.id ? { ...f, value: e.target.value } : f
                                    ),
                                  })
                                }
                                placeholder={
                                  field.type === 'date'
                                    ? 'e.g., 2024-05 or May 2024'
                                    : field.type === 'url'
                                    ? 'https://...'
                                    : 'Enter field value...'
                                }
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Centralized Section Manager (Section 11 - Drag & Drop + Up/Down + Hide/Show)
  const renderSectionManager = () => {
    return (
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900">
            Section Order & Visibility Manager
          </h3>
          <p className="text-xs text-slate-500">
            Drag and drop or use the arrow buttons to reorder sections. Toggle visibility without
            losing your saved content.
          </p>
        </div>

        <div className="space-y-1.5">
          {cvData.sectionOrder.map((sec, idx) => (
            <div
              key={sec.id}
              draggable
              onDragStart={() => setDraggedSectionIndex(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedSectionIndex !== null) {
                  handleDropSectionOrder(draggedSectionIndex, idx);
                  setDraggedSectionIndex(null);
                }
              }}
              className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition cursor-grab active:cursor-grabbing ${
                sec.visible
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-65'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-slate-400 text-xs font-bold select-none">⋮⋮</span>
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{sec.label}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {sec.isCustom ? 'Custom Section' : 'Standard Section'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveSectionOrder(idx, -1)}
                  disabled={idx === 0}
                  className="px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-35"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSectionOrder(idx, 1)}
                  disabled={idx === cvData.sectionOrder.length - 1}
                  className="px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-35"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility(sec.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                    sec.visible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {sec.visible ? 'Shown' : 'Hidden'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER HELPERS FOR RIGHT PANEL (25 TEMPLATES + CUSTOMIZATION)
  // ============================================================================

  const renderTemplateGallery = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">25 Professional Templates</h3>
            <p className="text-xs text-slate-500">
              Switch anytime without losing data. Click Preview to inspect larger.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {templateCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setTemplateCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                templateCategoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredTemplates.map((tpl) => {
            const isSelected = design.templateId === tpl.id;
            return (
              <div
                key={tpl.id}
                className={`group rounded-xl border p-2 transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/30'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className="cursor-pointer"
                >
                  <TemplateThumbnailPreview template={tpl} active={isSelected} />
                  <div className="mt-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-slate-900 truncate">
                        {tpl.number}. {tpl.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {tpl.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ Active' : 'Use Template'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectTemplateModal(tpl)}
                    className="px-2 py-1 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    title="Preview template before selecting"
                  >
                    Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCustomizationControls = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Design & Layout Controls</h3>
            <p className="text-xs text-slate-500">
              Customize colors, typography, spacing, margins, and regional date styles.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDesign}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Reset Design
          </button>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Primary Accent Color
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_PRESETS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setDesign((prev) => ({ ...prev, accentColor: hex }))}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  design.accentColor.toLowerCase() === hex.toLowerCase()
                    ? 'border-slate-900 scale-110 ring-2 ring-indigo-300'
                    : 'border-white shadow'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
            <input
              type="color"
              value={design.accentColor}
              onChange={(e) => setDesign((prev) => ({ ...prev, accentColor: e.target.value }))}
              className="w-7 h-7 rounded cursor-pointer border border-slate-300"
              title="Custom Color Picker"
            />
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Font Family</label>
          <select
            value={design.fontFamily}
            onChange={(e) =>
              setDesign((prev) => ({
                ...prev,
                fontFamily: e.target.value as CvDesignSettings['fontFamily'],
              }))
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="inter">Inter (Modern Sans-Serif)</option>
            <option value="roboto">Roboto (Clean Corporate)</option>
            <option value="georgia">Georgia (Classic Academic Serif)</option>
            <option value="merriweather">Merriweather (Editorial Serif)</option>
            <option value="playfair">Playfair Display (Executive Serif)</option>
            <option value="mono">JetBrains Mono (Technical / Dev)</option>
          </select>
        </div>

        {/* Font Size & Spacing */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Font Size</label>
            <select
              value={design.fontSize}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  fontSize: e.target.value as CvDesignSettings['fontSize'],
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="small">Compact (Small)</option>
              <option value="medium">Standard (Medium)</option>
              <option value="large">Spacious (Large)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Section Spacing
            </label>
            <select
              value={design.sectionSpacing}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  sectionSpacing: e.target.value as CvDesignSettings['sectionSpacing'],
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="compact">Compact</option>
              <option value="normal">Balanced</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>

        {/* Page Margins */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Page Margins</label>
          <select
            value={design.pageMargin}
            onChange={(e) =>
              setDesign((prev) => ({
                ...prev,
                pageMargin: e.target.value as CvDesignSettings['pageMargin'],
              }))
            }
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="narrow">Narrow (28px)</option>
            <option value="normal">Standard (40px)</option>
            <option value="wide">Wide (54px)</option>
          </select>
        </div>

        {/* Section Heading Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Section Heading Style
          </label>
          <select
            value={design.headingStyle}
            onChange={(e) =>
              setDesign((prev) => ({
                ...prev,
                headingStyle: e.target.value as CvDesignSettings['headingStyle'],
              }))
            }
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="uppercase-bar">Uppercase Accent Rule</option>
            <option value="underline">Clean Underline</option>
            <option value="boxed">Tinted Box Header</option>
            <option value="pill">Capsule Pill Dot</option>
            <option value="minimal">Minimalist</option>
          </select>
        </div>

        {/* Sidebar Layout & Date Formatting */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Column / Sidebar
            </label>
            <select
              value={design.sidebarMode}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  sidebarMode: e.target.value as CvDesignSettings['sidebarMode'],
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="auto">Template Default</option>
              <option value="none">Single Column</option>
              <option value="left">Left Sidebar</option>
              <option value="right">Right Sidebar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date Format</label>
            <select
              value={design.dateFormat}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  dateFormat: e.target.value as CvDesignSettings['dateFormat'],
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="MMM YYYY">Jan 2024</option>
              <option value="MM/YYYY">01/2024</option>
              <option value="YYYY-MM">2024-01</option>
              <option value="YYYY">2024 (Year Only)</option>
            </select>
          </div>
        </div>

        {/* Page Size & Language/RTL */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Paper Size</label>
            <select
              value={design.pageSize}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  pageSize: e.target.value as CvDesignSettings['pageSize'],
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="LETTER">US Letter (8.5 × 11 in)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              CV Headings Language
            </label>
            <select
              value={design.locale}
              onChange={(e) =>
                setDesign((prev) => ({
                  ...prev,
                  locale: e.target.value as CvLocaleCode,
                }))
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              {(Object.keys(CV_LOCALE_DICTIONARY) as CvLocaleCode[]).map((code) => {
                const loc = CV_LOCALE_DICTIONARY[code];
                return (
                  <option key={code} value={code}>
                    {loc.name} ({loc.dir.toUpperCase()})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const activeTemplate = getCvTemplateById(design.templateId);

  return (
    <div className="w-full bg-slate-100 rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Saved Draft Recovery Banner */}
      {savedDraftBanner && (
        <div className="bg-indigo-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500 font-bold uppercase text-[10px]">
              Saved Draft Found
            </span>
            <span>
              We found a previously saved CV draft in your browser storage. Would you like to
              restore it?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreSavedDraft}
              className="px-3 py-1 rounded-lg bg-white text-indigo-950 font-bold hover:bg-indigo-50 transition"
            >
              Restore Saved Draft
            </button>
            <button
              type="button"
              onClick={() => setSavedDraftBanner(false)}
              className="px-2.5 py-1 rounded-lg bg-indigo-800 text-indigo-200 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Status Toast */}
      {statusToast && (
        <div
          className={`px-4 py-2 text-xs font-semibold flex items-center justify-between ${
            statusToast.type === 'error'
              ? 'bg-rose-600 text-white'
              : statusToast.type === 'info'
              ? 'bg-slate-800 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          <span>{statusToast.message}</span>
          <button
            type="button"
            onClick={() => setStatusToast(null)}
            className="text-white/80 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action & Export Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
            Template: {activeTemplate.number}. {activeTemplate.name}
          </span>

          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
          >
            💾 Save Draft
          </button>
          <button
            type="button"
            onClick={handleLoadSampleCv}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
          >
            📋 Load Sample CV
          </button>
          <button
            type="button"
            onClick={handleClearAllData}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
          >
            🗑️ Clear All Data
          </button>

          {/* JSON Backup */}
          <button
            type="button"
            onClick={handleExportJson}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
            title="Download JSON Backup"
          >
            Export JSON
          </button>
          <input
            ref={jsonUploadRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => jsonUploadRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
            title="Restore JSON Backup"
          >
            Import JSON
          </button>
        </div>

        {/* Free Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting !== null}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
          >
            {isExporting === 'pdf' ? 'Generating PDF...' : '⬇ Download PDF (Free)'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting !== null}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
          >
            {isExporting === 'png' ? 'Exporting PNG...' : '⬇ PNG'}
          </button>

          <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden">
            <select
              value={jpgDpi}
              onChange={(e) => setJpgDpi(e.target.value as '150' | '300' | '450')}
              className="px-2 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border-r border-slate-300 outline-none"
              title="Select JPG Resolution"
            >
              <option value="150">150 DPI</option>
              <option value="300">300 DPI</option>
              <option value="450">450 DPI</option>
            </select>
            <button
              type="button"
              onClick={handleDownloadJpg}
              disabled={isExporting !== null}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition disabled:opacity-50"
            >
              {isExporting === 'jpg' ? 'Exporting...' : '⬇ JPG'}
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintCv}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition"
          >
            🖨️ Print CV
          </button>
        </div>
      </div>

      {/* Validation Warning Bar (Non-blocking) */}
      {validationErrors.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex flex-wrap items-center gap-2 text-xs text-amber-900">
          <span className="font-bold">Validation Notice:</span>
          {validationErrors.map((err, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-amber-100/80 border border-amber-300">
              {err.message}
            </span>
          ))}
        </div>
      )}

      {/* ====================================================================
          DESKTOP THREE-PANEL STUDIO (lg and above)
         ==================================================================== */}
      <div className="hidden lg:grid lg:grid-cols-12 min-h-[820px]">
        {/* LEFT PANEL: All Information Input Forms (4 Columns) */}
        <div className="lg:col-span-4 bg-white border-r border-slate-200 flex flex-col h-[860px]">
          {/* Section Navigation Tabs */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1">
            {[
              { id: 'personal', label: '1. Personal' },
              { id: 'summary', label: '2. Summary' },
              { id: 'experience', label: '3. Experience' },
              { id: 'education', label: '4. Education' },
              { id: 'skills', label: '5. Skills' },
              { id: 'additional', label: '6. +20 Sections' },
              { id: 'custom', label: '7. Custom Builder' },
              { id: 'sections', label: '⇅ Reorder' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLeftTab(tab.id as LeftPanelTab)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  leftTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Form Body */}
          <div className="p-4 overflow-y-auto flex-1">
            {leftTab === 'personal' && renderPersonalEditor()}
            {leftTab === 'summary' && renderSummaryEditor()}
            {leftTab === 'experience' && renderExperienceEditor()}
            {leftTab === 'education' && renderEducationEditor()}
            {leftTab === 'skills' && renderSkillsEditor()}
            {leftTab === 'additional' && renderAdditionalSectionsEditor()}
            {leftTab === 'custom' && renderCustomSectionsBuilder()}
            {leftTab === 'sections' && renderSectionManager()}
          </div>
        </div>

        {/* CENTER PANEL: Live Multi-Page CV Preview (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-200/75 flex flex-col h-[860px] overflow-hidden">
          {/* Preview Zoom & Page Bar */}
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Live Multi-Page Preview</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
                {design.pageSize}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                No Watermark
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.max(0.5, Number((z - 0.08).toFixed(2))))}
                className="px-2 py-0.5 rounded bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
              >
                −
              </button>
              <span className="font-bold text-slate-700 min-w-[44px] text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.min(1.1, Number((z + 0.08).toFixed(2))))}
                className="px-2 py-0.5 rounded bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Scrollable Preview Canvas */}
          <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
            <div ref={previewRef}>
              <CvTemplateRenderer data={cvData} design={design} scale={previewZoom} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Template Gallery & Customization Controls (3 Columns) */}
        <div className="lg:col-span-3 bg-white border-l border-slate-200 flex flex-col h-[860px]">
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setRightTab('templates')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                rightTab === 'templates'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🎨 Templates (25)
            </button>
            <button
              type="button"
              onClick={() => setRightTab('customize')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                rightTab === 'customize'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ⚙️ Customize
            </button>
          </div>

          <div className="p-3.5 overflow-y-auto flex-1">
            {rightTab === 'templates' ? renderTemplateGallery() : renderCustomizationControls()}
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE STEP-BY-STEP WIZARD (< lg screens)
         ==================================================================== */}
      <div className="lg:hidden bg-white p-4 space-y-4">
        {/* Progress Indicator */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>
              Step {mobileStep + 1} of 6:{' '}
              {
                [
                  'Personal & Summary',
                  'Work Experience',
                  'Education & Skills',
                  'Additional & Custom Sections',
                  'Choose Template & Customize',
                  'Review & Free Download',
                ][mobileStep]
              }
            </span>
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold"
            >
              👁️ Live Preview
            </button>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((mobileStep + 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="py-2 space-y-6">
          {mobileStep === 0 && (
            <>
              {renderPersonalEditor()}
              <hr className="border-slate-200" />
              {renderSummaryEditor()}
            </>
          )}
          {mobileStep === 1 && renderExperienceEditor()}
          {mobileStep === 2 && (
            <>
              {renderEducationEditor()}
              <hr className="border-slate-200" />
              {renderSkillsEditor()}
            </>
          )}
          {mobileStep === 3 && (
            <>
              {renderAdditionalSectionsEditor()}
              <hr className="border-slate-200" />
              {renderCustomSectionsBuilder()}
              <hr className="border-slate-200" />
              {renderSectionManager()}
            </>
          )}
          {mobileStep === 4 && (
            <>
              {renderTemplateGallery()}
              <hr className="border-slate-200" />
              {renderCustomizationControls()}
            </>
          )}
          {mobileStep === 5 && (
            <div className="space-y-4 text-center py-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                Your Professional CV is Ready!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Download your CV for free in high-resolution PDF, PNG, or JPG format with zero
                watermarks and no account required.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow"
                >
                  ⬇ Download PDF (Free)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
                >
                  ⬇ Download PNG
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJpg}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs shadow"
                >
                  ⬇ Download JPG ({jpgDpi} DPI)
                </button>
                <button
                  type="button"
                  onClick={handlePrintCv}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300"
                >
                  🖨️ Print CV
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Previous / Next Navigation Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            type="button"
            disabled={mobileStep === 0}
            onClick={() => setMobileStep((s) => Math.max(0, s - 1) as MobileWizardStep)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 disabled:opacity-40"
          >
            ← Previous Step
          </button>
          {mobileStep < 5 ? (
            <button
              type="button"
              onClick={() => setMobileStep((s) => Math.min(5, s + 1) as MobileWizardStep)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
            >
              👁️ Open Full Preview
            </button>
          )}
        </div>
      </div>

      {/* Mobile Live Preview Modal */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex flex-col">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-200">
            <span className="text-xs font-bold text-slate-900">
              Live CV Preview ({activeTemplate.name})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                ⬇ PDF
              </button>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center">
            <CvTemplateRenderer data={cvData} design={design} scale={0.45} />
          </div>
        </div>
      )}

      {/* Template Preview-Before-Selecting Modal */}
      {inspectTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Template Preview: {inspectTemplateModal.number}. {inspectTemplateModal.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {inspectTemplateModal.description} • {inspectTemplateModal.tagline}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectTemplate(inspectTemplateModal.id);
                    setInspectTemplateModal(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Apply This Template
                </button>
                <button
                  type="button"
                  onClick={() => setInspectTemplateModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Close ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-slate-200 p-6 flex justify-center">
              <CvTemplateRenderer
                data={cvData}
                design={applyTemplateDefaultsToDesign(design, inspectTemplateModal.id)}
                scale={0.68}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
