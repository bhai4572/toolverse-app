import React, { useMemo } from 'react';
import {
  ADDITIONAL_SECTION_CONFIGS,
  AdditionalSectionKey,
  CV_LOCALE_DICTIONARY,
  CvCustomField,
  CvCustomSection,
  CvDesignSettings,
  CvDocumentData,
  CvEducationItem,
  CvExperienceItem,
  CvSkillItem,
  CvStandardRecordItem,
  formatCvDate,
} from '@/lib/cv/typesAndDefaults';
import { CvTemplateDefinition, getCvTemplateById } from '@/lib/cv/templatesCatalog';

const FONT_FAMILY_CSS: Record<CvDesignSettings['fontFamily'], string> = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  georgia: "Georgia, 'Times New Roman', Times, serif",
  merriweather: "'Merriweather', Georgia, 'Times New Roman', serif",
  roboto: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  playfair: "'Playfair Display', Georgia, 'Times New Roman', serif",
};

const FONT_SIZE_SCALE: Record<CvDesignSettings['fontSize'], { base: string; sm: string; lg: string; xl: string; h1: string }> = {
  small: { base: '11.5px', sm: '10.5px', lg: '13px', xl: '15px', h1: '23px' },
  medium: { base: '12.5px', sm: '11.2px', lg: '14px', xl: '16.5px', h1: '26px' },
  large: { base: '13.8px', sm: '12px', lg: '15.5px', xl: '18px', h1: '29px' },
};

const MARGIN_PX: Record<CvDesignSettings['pageMargin'], number> = {
  narrow: 28,
  normal: 40,
  wide: 54,
};

const SPACING_GAP: Record<CvDesignSettings['sectionSpacing'], string> = {
  compact: '10px',
  normal: '15px',
  relaxed: '21px',
};

interface RenderableBlock {
  sectionId: string;
  sectionTitle: string;
  placement: 'main' | 'sidebar';
  weight: number; // Estimated vertical weight for multi-page pagination
  node: React.ReactNode;
}

/**
 * Miniature Visual Thumbnail for each of the 25 Templates
 */
export const TemplateThumbnailPreview: React.FC<{
  template: CvTemplateDefinition;
  active?: boolean;
}> = ({ template, active }) => {
  const accent = template.defaultAccent;
  const isLeftSidebar = template.defaultSidebar === 'left';
  const isRightSidebar = template.defaultSidebar === 'right';
  const isBanner = template.headerStyle === 'full-banner' || template.headerStyle === 'split-bar';
  const isEuropass = template.layoutVariant === 'european-europass-split';

  return (
    <div
      className={`w-full aspect-[210/297] rounded-lg bg-white border overflow-hidden shadow-xs flex flex-col transition ${
        active ? 'border-indigo-600 ring-2 ring-indigo-500/40' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Top Header Strip */}
      {isBanner ? (
        <div style={{ backgroundColor: accent }} className="px-2.5 py-2 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-2 w-16 bg-white/95 rounded-xs" />
            <div className="h-1.5 w-11 bg-white/70 rounded-xs" />
          </div>
          {template.defaultPhoto === 'show' && (
            <div className="w-5 h-5 rounded-full bg-white/30 border border-white/70 shrink-0" />
          )}
        </div>
      ) : (
        <div
          className={`px-2.5 pt-2 pb-1.5 border-b border-slate-200 flex items-center ${
            template.headerStyle === 'centered-classic' ? 'flex-col text-center' : 'justify-between'
          }`}
        >
          <div className={template.headerStyle === 'centered-classic' ? ' flex flex-col items-center space-y-1' : 'space-y-1'}>
            <div style={{ backgroundColor: accent }} className="h-2 w-16 rounded-xs" />
            <div className="h-1.5 w-12 bg-slate-400 rounded-xs" />
          </div>
          {template.defaultPhoto === 'show' && template.headerStyle !== 'centered-classic' && (
            <div style={{ borderColor: accent }} className="w-4 h-4 rounded-full bg-slate-200 border shrink-0" />
          )}
        </div>
      )}

      {/* Body Grid */}
      <div className="flex-1 flex p-2 gap-1.5 bg-white">
        {isLeftSidebar && (
          <div
            style={{ backgroundColor: `${accent}12`, borderColor: `${accent}30` }}
            className="w-[33%] rounded-xs p-1.5 space-y-1.5 border-r"
          >
            <div style={{ backgroundColor: accent }} className="h-1.5 w-8 rounded-xs" />
            <div className="h-1 w-full bg-slate-300 rounded-xs" />
            <div className="h-1 w-4/5 bg-slate-300 rounded-xs" />
            <div style={{ backgroundColor: accent }} className="h-1.5 w-7 rounded-xs mt-2" />
            <div className="flex flex-wrap gap-0.5">
              <span style={{ backgroundColor: `${accent}25` }} className="h-1.5 w-5 rounded-xs" />
              <span style={{ backgroundColor: `${accent}25` }} className="h-1.5 w-6 rounded-xs" />
              <span style={{ backgroundColor: `${accent}25` }} className="h-1.5 w-4 rounded-xs" />
            </div>
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          {[1, 2, 3].map((blk) => (
            <div key={blk} className={isEuropass ? 'grid grid-cols-12 gap-1 items-start' : 'space-y-1'}>
              {isEuropass ? (
                <>
                  <div className="col-span-4">
                    <div style={{ backgroundColor: accent }} className="h-1.5 w-full rounded-xs" />
                  </div>
                  <div className="col-span-8 space-y-1">
                    <div className="h-1.5 w-4/5 bg-slate-700 rounded-xs" />
                    <div className="h-1 w-full bg-slate-300 rounded-xs" />
                    <div className="h-1 w-11/12 bg-slate-300 rounded-xs" />
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      backgroundColor: template.defaultHeadingStyle === 'boxed' ? `${accent}18` : 'transparent',
                      borderBottom: template.defaultHeadingStyle === 'underline' ? `1.5px solid ${accent}` : 'none',
                    }}
                    className="pb-0.5"
                  >
                    <div style={{ backgroundColor: accent }} className="h-1.5 w-12 rounded-xs" />
                  </div>
                  <div className="h-1 w-full bg-slate-300 rounded-xs" />
                  <div className="h-1 w-11/12 bg-slate-300 rounded-xs" />
                  <div className="h-1 w-3/4 bg-slate-200 rounded-xs" />
                </>
              )}
            </div>
          ))}
        </div>

        {isRightSidebar && (
          <div
            style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30` }}
            className="w-[32%] rounded-xs p-1.5 space-y-1.5 border-l"
          >
            <div style={{ backgroundColor: accent }} className="h-1.5 w-8 rounded-xs" />
            <div className="h-1 w-full bg-slate-300 rounded-xs" />
            <div className="h-1 w-3/4 bg-slate-300 rounded-xs" />
            <div style={{ backgroundColor: accent }} className="h-1.5 w-7 rounded-xs mt-2" />
            <div className="space-y-1">
              <div style={{ backgroundColor: accent }} className="h-1 w-full rounded-xs opacity-75" />
              <div style={{ backgroundColor: accent }} className="h-1 w-4/5 rounded-xs opacity-75" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function renderMultilineBullets(text: string): React.ReactNode {
  if (!text || !text.trim()) return null;
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const hasBulletPrefix = lines.some((l) => /^[•\-*▪▸]/.test(l));
  if (lines.length === 1 && !hasBulletPrefix) {
    return <p className="leading-relaxed whitespace-pre-line break-words">{lines[0]}</p>;
  }

  return (
    <ul className="list-disc list-outside ps-4 space-y-0.5 leading-relaxed">
      {lines.map((line, idx) => (
        <li key={idx} className="break-words">
          {line.replace(/^[•\-*▪▸]\s*/, '')}
        </li>
      ))}
    </ul>
  );
}

function renderCustomFieldsList(
  fields: CvCustomField[],
  dateFormat: CvDesignSettings['dateFormat'],
  accentColor: string
): React.ReactNode {
  const visibleFields = (fields || []).filter((f) => f.visible && f.value.trim());
  if (visibleFields.length === 0) return null;

  return (
    <div className="mt-1.5 space-y-1 pt-1 border-t border-slate-200/70">
      {visibleFields.map((field) => {
        const val = field.value.trim();
        if (field.type === 'list') {
          const items = val
            .split(/[\n,]/)
            .map((x) => x.trim())
            .filter(Boolean);
          return (
            <div key={field.id} className="text-[0.92em]">
              {field.label && <span className="font-semibold text-slate-800">{field.label}: </span>}
              <span className="inline-flex flex-wrap gap-1 mt-0.5">
                {items.map((it, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: `${accentColor}14`, color: accentColor }}
                    className="px-1.5 py-0.5 rounded text-[0.88em] font-medium"
                  >
                    {it}
                  </span>
                ))}
              </span>
            </div>
          );
        }
        if (field.type === 'multiline') {
          return (
            <div key={field.id} className="text-[0.92em] space-y-0.5">
              {field.label && <div className="font-semibold text-slate-800">{field.label}:</div>}
              <div className="text-slate-700">{renderMultilineBullets(val)}</div>
            </div>
          );
        }
        if (field.type === 'url') {
          const href = /^https?:\/\//i.test(val) ? val : `https://${val}`;
          return (
            <div key={field.id} className="text-[0.92em]">
              {field.label && <span className="font-semibold text-slate-800">{field.label}: </span>}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: accentColor }}
                className="underline break-all"
              >
                {val}
              </a>
            </div>
          );
        }
        if (field.type === 'date') {
          return (
            <div key={field.id} className="text-[0.92em]">
              {field.label && <span className="font-semibold text-slate-800">{field.label}: </span>}
              <span>{formatCvDate(val, dateFormat)}</span>
            </div>
          );
        }
        return (
          <div key={field.id} className="text-[0.92em]">
            {field.label && <span className="font-semibold text-slate-800">{field.label}: </span>}
            <span className="break-words">{val}</span>
          </div>
        );
      })}
    </div>
  );
}

export const CvTemplateRenderer: React.FC<{
  data: CvDocumentData;
  design: CvDesignSettings;
  scale?: number;
}> = ({ data, design, scale = 1 }) => {
  const template = getCvTemplateById(design.templateId);
  const dict = CV_LOCALE_DICTIONARY[design.locale] || CV_LOCALE_DICTIONARY.en;
  const fontScale = FONT_SIZE_SCALE[design.fontSize] || FONT_SIZE_SCALE.medium;
  const marginPx = MARGIN_PX[design.pageMargin] || 40;
  const sectionGap = SPACING_GAP[design.sectionSpacing] || '15px';
  const accent = design.accentColor || template.defaultAccent;

  // Page dimensions at 96 DPI: A4 = 794 x 1123, US Letter = 816 x 1056
  const pageWidthPx = design.pageSize === 'LETTER' ? 816 : 794;
  const pageHeightPx = design.pageSize === 'LETTER' ? 1056 : 1123;

  // Determine effective photo & sidebar visibility
  const showPhoto =
    Boolean(data.personal.profilePhotoDataUrl) &&
    data.personal.showProfilePhoto &&
    (design.photoVisibility === 'show' ||
      (design.photoVisibility === 'auto' && template.defaultPhoto === 'show'));

  const effectiveSidebar: 'left' | 'right' | 'none' =
    design.sidebarMode === 'auto' ? template.defaultSidebar : design.sidebarMode;

  const isEuropass = template.layoutVariant === 'european-europass-split';
  const isTimelineVariant =
    template.layoutVariant === 'pm-milestone-timeline' ||
    template.layoutVariant === 'modern-two-col-left';

  // Helper to render section heading according to design.headingStyle & template
  const renderSectionHeading = (title: string) => {
    if (isEuropass) {
      return (
        <div
          style={{ color: accent, borderColor: accent }}
          className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b-2 mb-2"
        >
          {title}
        </div>
      );
    }

    switch (design.headingStyle) {
      case 'uppercase-bar':
        return (
          <div
            style={{ borderBottom: `2px solid ${accent}`, color: accent }}
            className="font-extrabold uppercase tracking-wider pb-1 mb-2.5 flex items-center justify-between"
          >
            <span style={{ fontSize: fontScale.lg }}>{title}</span>
          </div>
        );
      case 'underline':
        return (
          <div className="border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-2">
            <span
              style={{ color: accent, fontSize: fontScale.lg }}
              className="font-bold tracking-tight"
            >
              {title}
            </span>
          </div>
        );
      case 'pill':
        return (
          <div className="mb-2.5 flex items-center gap-2">
            <span
              style={{ backgroundColor: accent }}
              className="w-2 h-4 rounded-full inline-block shrink-0"
            />
            <span
              style={{ color: accent, fontSize: fontScale.lg }}
              className="font-extrabold uppercase tracking-wide"
            >
              {title}
            </span>
          </div>
        );
      case 'boxed':
        return (
          <div
            style={{ backgroundColor: `${accent}14`, borderLeft: `4px solid ${accent}`, color: accent }}
            className="px-2.5 py-1 mb-2.5 font-extrabold uppercase tracking-wider"
          >
            <span style={{ fontSize: fontScale.base }}>{title}</span>
          </div>
        );
      case 'minimal':
      default:
        return (
          <div className="mb-2 flex items-center gap-2">
            <span
              style={{ color: accent, fontSize: fontScale.lg }}
              className="font-bold uppercase tracking-widest"
            >
              {title}
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
        );
    }
  };

  // Build ordered renderable section blocks and paginate them cleanly across pages
  const pages = useMemo(() => {
    const blocks: RenderableBlock[] = [];
    const sidebarSectionIds = new Set<string>(
      effectiveSidebar !== 'none'
        ? ['skills', 'languages', 'certifications', 'hobbies', 'memberships', 'licenses']
        : []
    );

    const wrapEuropassOrStandard = (title: string, content: React.ReactNode) => {
      if (isEuropass) {
        return (
          <div className="grid grid-cols-12 gap-4 items-start py-1">
            <div className="col-span-3 pr-2 border-r border-slate-200">
              <div style={{ color: accent }} className="font-extrabold uppercase text-[11px] tracking-wider">
                {title}
              </div>
            </div>
            <div className="col-span-9">{content}</div>
          </div>
        );
      }
      return (
        <div>
          {renderSectionHeading(title)}
          {content}
        </div>
      );
    };

    for (const orderItem of data.sectionOrder) {
      if (!orderItem.visible) continue;
      const secId = orderItem.id;

      // 1. Professional Summary
      if (secId === 'summary') {
        if (!data.summary.visible || !data.summary.content.trim()) continue;
        const lineCount = Math.ceil(data.summary.content.length / 95);
        blocks.push({
          sectionId: 'summary',
          sectionTitle: dict.summary,
          placement: 'main',
          weight: 55 + lineCount * 18,
          node: wrapEuropassOrStandard(
            dict.summary,
            <div className="text-slate-700 leading-relaxed whitespace-pre-line break-words">
              {data.summary.content.trim()}
            </div>
          ),
        });
        continue;
      }

      // 2. Work Experience
      if (secId === 'experience') {
        const visibleExp = data.experience.filter(
          (e) => e.visible && (e.jobTitle.trim() || e.companyName.trim() || e.responsibilities.trim() || e.achievements.trim())
        );
        if (visibleExp.length === 0) continue;

        const renderExpRecord = (exp: CvExperienceItem) => {
          const start = formatCvDate(exp.startDate, design.dateFormat);
          const end = exp.currentlyWorking ? dict.present : formatCvDate(exp.endDate, design.dateFormat);
          const dateStr = [start, end].filter(Boolean).join(' – ');
          return (
            <div
              key={exp.id}
              className={`space-y-1 ${
                isTimelineVariant ? 'relative pl-4 border-l-2 border-slate-200 pb-2' : 'pb-2.5'
              }`}
            >
              {isTimelineVariant && (
                <span
                  style={{ backgroundColor: accent }}
                  className="w-2.5 h-2.5 rounded-full absolute -left-[6px] top-1.5"
                />
              )}
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900" style={{ fontSize: fontScale.lg }}>
                    {exp.jobTitle || 'Position'}
                  </span>
                  {exp.companyName && (
                    <span className="font-semibold text-slate-700">
                      {' '}
                      • <span style={{ color: accent }}>{exp.companyName}</span>
                    </span>
                  )}
                  {exp.employmentType && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[0.85em] font-medium">
                      {exp.employmentType}
                    </span>
                  )}
                </div>
                <div className="text-slate-500 font-medium text-[0.9em] shrink-0">
                  {[dateStr, exp.location].filter(Boolean).join(' | ')}
                </div>
              </div>
              {exp.responsibilities.trim() && (
                <div className="text-slate-700">{renderMultilineBullets(exp.responsibilities)}</div>
              )}
              {exp.achievements.trim() && (
                <div className="text-slate-800 pt-0.5">
                  <div className="font-semibold text-[0.9em] text-slate-600 mb-0.5">{dict.achievements}:</div>
                  {renderMultilineBullets(exp.achievements)}
                </div>
              )}
              {renderCustomFieldsList(exp.customFields, design.dateFormat, accent)}
            </div>
          );
        };

        // Chunk large experience lists into groups of 3 so multi-page CVs break cleanly between jobs
        const chunkSize = 3;
        for (let i = 0; i < visibleExp.length; i += chunkSize) {
          const slice = visibleExp.slice(i, i + chunkSize);
          const sliceWeight = slice.reduce((acc, item) => {
            const textLen = (item.responsibilities?.length || 0) + (item.achievements?.length || 0);
            return acc + 70 + Math.ceil(textLen / 85) * 16 + (item.customFields?.length || 0) * 18;
          }, 35);

          blocks.push({
            sectionId: `experience-${i}`,
            sectionTitle: dict.experience,
            placement: 'main',
            weight: sliceWeight,
            node: wrapEuropassOrStandard(
              i === 0 ? dict.experience : `${dict.experience} (Cont.)`,
              <div className="space-y-2.5">{slice.map(renderExpRecord)}</div>
            ),
          });
        }
        continue;
      }

      // 3. Education
      if (secId === 'education') {
        const visibleEdu = data.education.filter(
          (ed) => ed.visible && (ed.degree.trim() || ed.institution.trim() || ed.fieldOfStudy.trim())
        );
        if (visibleEdu.length === 0) continue;

        const eduWeight = visibleEdu.reduce(
          (acc, ed) => acc + 60 + (ed.description ? Math.ceil(ed.description.length / 90) * 16 : 0),
          35
        );

        blocks.push({
          sectionId: 'education',
          sectionTitle: dict.education,
          placement: 'main',
          weight: eduWeight,
          node: wrapEuropassOrStandard(
            dict.education,
            <div className="space-y-2.5">
              {visibleEdu.map((ed: CvEducationItem) => {
                const start = formatCvDate(ed.startYear, design.dateFormat);
                const end = ed.currentlyStudying ? dict.present : formatCvDate(ed.graduationYear, design.dateFormat);
                const dateStr = [start, end].filter(Boolean).join(' – ');
                return (
                  <div key={ed.id} className="space-y-0.5 pb-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900" style={{ fontSize: fontScale.lg }}>
                          {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(' in ')}
                        </span>
                        {ed.institution && (
                          <span className="font-semibold text-slate-700">
                            {' '}
                            • <span style={{ color: accent }}>{ed.institution}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-medium text-[0.9em] shrink-0">
                        {[dateStr, ed.location].filter(Boolean).join(' | ')}
                      </div>
                    </div>
                    {ed.showGpa && ed.gradeGpa.trim() && (
                      <div className="text-[0.92em] font-semibold text-slate-700">
                        {dict.gpa}: {ed.gradeGpa}
                      </div>
                    )}
                    {ed.description.trim() && (
                      <div className="text-slate-700">{renderMultilineBullets(ed.description)}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ),
        });
        continue;
      }

      // 4. Skills
      if (secId === 'skills') {
        const visibleSkills = data.skills.filter((s) => s.visible && s.name.trim());
        if (visibleSkills.length === 0) continue;

        const grouped = visibleSkills.reduce<Record<string, CvSkillItem[]>>((acc, s) => {
          const cat = s.category || 'Skills';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(s);
          return acc;
        }, {});

        const placement = sidebarSectionIds.has('skills') ? 'sidebar' : 'main';
        const skillNode = (
          <div className="space-y-2">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="space-y-1">
                {Object.keys(grouped).length > 1 && (
                  <div className="font-bold text-slate-800 text-[0.92em]">{cat}</div>
                )}
                {template.skillDisplay === 'pills' || template.skillDisplay === 'compact-tags' ? (
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((sk) => (
                      <span
                        key={sk.id}
                        style={{
                          backgroundColor: `${accent}14`,
                          borderColor: `${accent}35`,
                          color: '#0f172a',
                        }}
                        className="px-2 py-0.5 rounded border text-[0.9em] font-medium"
                      >
                        {sk.name}
                        {data.showSkillProficiency && sk.proficiency ? (
                          <span className="opacity-70 text-[0.85em]"> ({sk.proficiency})</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                ) : template.skillDisplay === 'progress-bars' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((sk) => {
                      const pct =
                        sk.proficiency === 'Expert'
                          ? 95
                          : sk.proficiency === 'Advanced'
                          ? 82
                          : sk.proficiency === 'Intermediate'
                          ? 68
                          : sk.proficiency === 'Beginner'
                          ? 45
                          : 0;
                      return (
                        <div key={sk.id} className="space-y-0.5">
                          <div className="flex justify-between text-[0.9em] font-medium">
                            <span>{sk.name}</span>
                            {data.showSkillProficiency && sk.proficiency && (
                              <span className="text-slate-500 text-[0.85em]">{sk.proficiency}</span>
                            )}
                          </div>
                          {data.showSkillProficiency && pct > 0 && (
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${pct}%`, backgroundColor: accent }}
                                className="h-full rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-slate-700 leading-relaxed">
                    {items
                      .map((sk) =>
                        data.showSkillProficiency && sk.proficiency
                          ? `${sk.name} (${sk.proficiency})`
                          : sk.name
                      )
                      .join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

        blocks.push({
          sectionId: 'skills',
          sectionTitle: dict.skills,
          placement,
          weight: 50 + Math.ceil(visibleSkills.length / 3) * 20,
          node:
            placement === 'sidebar' ? (
              <div>
                {renderSectionHeading(dict.skills)}
                {skillNode}
              </div>
            ) : (
              wrapEuropassOrStandard(dict.skills, skillNode)
            ),
        });
        continue;
      }

      // 5. Custom Sections (`custom:...`)
      if (secId.startsWith('custom:')) {
        const customSec: CvCustomSection | undefined = data.customSections.find((cs) => cs.id === secId);
        if (!customSec || !customSec.visible) continue;
        const visibleItems = customSec.items.filter(
          (it) =>
            it.visible &&
            (it.title.trim() ||
              it.subtitle?.trim() ||
              it.description?.trim() ||
              it.fields.some((f) => f.visible && f.value.trim()))
        );
        if (visibleItems.length === 0) continue;

        const secTitle = customSec.title || orderItem.label || 'Custom Section';
        const customWeight = visibleItems.reduce(
          (acc, it) => acc + 65 + (it.fields?.length || 0) * 18 + (it.description ? 25 : 0),
          35
        );

        blocks.push({
          sectionId: customSec.id,
          sectionTitle: secTitle,
          placement: 'main',
          weight: customWeight,
          node: wrapEuropassOrStandard(
            secTitle,
            <div className="space-y-2.5">
              {visibleItems.map((item) => (
                <div key={item.id} className="space-y-1 pb-1.5">
                  {(item.title || item.subtitle || item.dateRange || item.location) && (
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        {item.title && (
                          <span className="font-bold text-slate-900" style={{ fontSize: fontScale.lg }}>
                            {item.title}
                          </span>
                        )}
                        {item.subtitle && (
                          <span className="font-semibold text-slate-700">
                            {item.title ? ' • ' : ''}
                            <span style={{ color: accent }}>{item.subtitle}</span>
                          </span>
                        )}
                      </div>
                      {(item.dateRange || item.location) && (
                        <div className="text-slate-500 font-medium text-[0.9em]">
                          {[
                            item.dateRange ? formatCvDate(item.dateRange, design.dateFormat) : '',
                            item.location,
                          ]
                            .filter(Boolean)
                            .join(' | ')}
                        </div>
                      )}
                    </div>
                  )}
                  {item.description && item.description.trim() && (
                    <div className="text-slate-700">{renderMultilineBullets(item.description)}</div>
                  )}
                  {renderCustomFieldsList(item.fields, design.dateFormat, accent)}
                </div>
              ))}
            </div>
          ),
        });
        continue;
      }

      // 6. Any of the 20 Predefined Additional Sections
      const addKey = secId as AdditionalSectionKey;
      const addConfig = ADDITIONAL_SECTION_CONFIGS.find((c) => c.key === addKey);
      if (addConfig) {
        const records: CvStandardRecordItem[] = (data.additionalSections[addKey] || []).filter(
          (r) => r.visible && (r.title.trim() || r.organization.trim() || r.description.trim())
        );
        if (records.length === 0) continue;

        const secLabel = dict.additionalLabels[addKey] || addConfig.defaultLabel;
        const placement = sidebarSectionIds.has(addKey) ? 'sidebar' : 'main';
        const secWeight = records.reduce(
          (acc, r) => acc + 50 + (r.description ? Math.ceil(r.description.length / 90) * 16 : 0),
          35
        );

        const recordsNode = (
          <div className="space-y-2">
            {records.map((rec) => {
              const dStart = formatCvDate(rec.startDate, design.dateFormat);
              const dEnd = formatCvDate(rec.endDate, design.dateFormat);
              const dateRange = [dStart, dEnd].filter(Boolean).join(' – ');
              return (
                <div key={rec.id} className="space-y-0.5 pb-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{rec.title}</span>
                      {rec.organization && (
                        <span className="font-semibold text-slate-700">
                          {' '}
                          • <span style={{ color: accent }}>{rec.organization}</span>
                        </span>
                      )}
                      {rec.roleOrSubtitle && (
                        <span className="text-slate-600 text-[0.92em]"> ({rec.roleOrSubtitle})</span>
                      )}
                    </div>
                    {(dateRange || rec.location) && (
                      <div className="text-slate-500 font-medium text-[0.88em]">
                        {[dateRange, rec.location].filter(Boolean).join(' | ')}
                      </div>
                    )}
                  </div>
                  {rec.url && (
                    <div className="text-[0.88em]">
                      <a
                        href={/^https?:\/\//i.test(rec.url) ? rec.url : `https://${rec.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: accent }}
                        className="underline break-all"
                      >
                        {rec.url}
                      </a>
                    </div>
                  )}
                  {rec.description && rec.description.trim() && (
                    <div className="text-slate-700">{renderMultilineBullets(rec.description)}</div>
                  )}
                </div>
              );
            })}
          </div>
        );

        blocks.push({
          sectionId: addKey,
          sectionTitle: secLabel,
          placement,
          weight: secWeight,
          node:
            placement === 'sidebar' ? (
              <div>
                {renderSectionHeading(secLabel)}
                {recordsNode}
              </div>
            ) : (
              wrapEuropassOrStandard(secLabel, recordsNode)
            ),
        });
      }
    }

    // Paginate blocks across pages so long CVs automatically flow to Page 2, Page 3, etc.
    const mainBlocks = blocks.filter((b) => b.placement === 'main');
    const sidebarBlocks = blocks.filter((b) => b.placement === 'sidebar');

    // Page 1 has header (~165px), subsequent pages have full vertical height
    const page1MaxMainWeight = design.pageSize === 'LETTER' ? 760 : 820;
    const nextPagesMaxMainWeight = design.pageSize === 'LETTER' ? 890 : 950;

    const paginated: Array<{ main: RenderableBlock[]; sidebar: RenderableBlock[] }> = [];
    let currentMain: RenderableBlock[] = [];
    let currentWeight = 0;

    for (const blk of mainBlocks) {
      const limit = paginated.length === 0 ? page1MaxMainWeight : nextPagesMaxMainWeight;
      if (currentMain.length > 0 && currentWeight + blk.weight > limit) {
        paginated.push({ main: currentMain, sidebar: [] });
        currentMain = [blk];
        currentWeight = blk.weight;
      } else {
        currentMain.push(blk);
        currentWeight += blk.weight;
      }
    }
    if (currentMain.length > 0 || paginated.length === 0) {
      paginated.push({ main: currentMain, sidebar: [] });
    }

    // Place sidebar blocks on Page 1 (and overflow to Page 2 if many sidebar blocks)
    let sbWeight = 0;
    for (const sb of sidebarBlocks) {
      const targetPageIdx = sbWeight > 680 && paginated.length > 1 ? 1 : 0;
      paginated[targetPageIdx].sidebar.push(sb);
      sbWeight += sb.weight;
    }

    return paginated;
  }, [data, design, template, dict, fontScale, accent, effectiveSidebar, isEuropass, isTimelineVariant]);

  // Contact Details array (only non-empty & visible fields)
  const contactItems: Array<{ label: string; value: string; href?: string }> = [];
  const p = data.personal;
  if (p.email.trim()) contactItems.push({ label: 'Email', value: p.email.trim(), href: `mailto:${p.email.trim()}` });
  if (p.phone.trim()) contactItems.push({ label: 'Phone', value: p.phone.trim(), href: `tel:${p.phone.trim()}` });
  const locParts = [p.city.trim(), p.country.trim()].filter(Boolean).join(', ');
  if (locParts) contactItems.push({ label: 'Location', value: locParts });
  if (p.showFullAddress && p.fullAddress.trim()) {
    contactItems.push({ label: 'Address', value: p.fullAddress.trim() });
  }
  if (p.showLinkedin && p.linkedinUrl.trim()) {
    const u = p.linkedinUrl.trim();
    contactItems.push({ label: 'LinkedIn', value: u.replace(/^https?:\/\/(www\.)?/i, ''), href: /^https?:\/\//i.test(u) ? u : `https://${u}` });
  }
  if (p.showWebsite && p.websiteUrl.trim()) {
    const u = p.websiteUrl.trim();
    contactItems.push({ label: 'Website', value: u.replace(/^https?:\/\/(www\.)?/i, ''), href: /^https?:\/\//i.test(u) ? u : `https://${u}` });
  }
  if (p.showPortfolio && p.portfolioUrl.trim()) {
    const u = p.portfolioUrl.trim();
    contactItems.push({ label: 'Portfolio', value: u.replace(/^https?:\/\/(www\.)?/i, ''), href: /^https?:\/\//i.test(u) ? u : `https://${u}` });
  }
  if (p.showGithub && p.githubUrl.trim()) {
    const u = p.githubUrl.trim();
    contactItems.push({ label: 'GitHub', value: u.replace(/^https?:\/\/(www\.)?/i, ''), href: /^https?:\/\//i.test(u) ? u : `https://${u}` });
  }

  const renderHeader = () => {
    const displayName = p.fullName.trim() || 'Your Full Name';
    const displayTitle = p.jobTitle.trim();
    const initials = displayName
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    if (template.headerStyle === 'full-banner') {
      return (
        <div
          style={{
            backgroundColor: accent,
            margin: `-${marginPx}px -${marginPx}px 18px -${marginPx}px`,
            padding: `${marginPx * 0.75}px ${marginPx}px`,
          }}
          className="text-white flex items-center justify-between gap-5"
        >
          <div className="space-y-1.5 min-w-0 flex-1">
            <h1 style={{ fontSize: fontScale.h1 }} className="font-extrabold tracking-tight leading-tight break-words">
              {displayName}
            </h1>
            {displayTitle && (
              <div style={{ fontSize: fontScale.xl }} className="text-white/90 font-medium">
                {displayTitle}
              </div>
            )}
            {contactItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/85 pt-1" style={{ fontSize: fontScale.sm }}>
                {contactItems.map((c, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1">
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <span>{c.value}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          {showPhoto && (
            <img
              src={p.profilePhotoDataUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md shrink-0"
            />
          )}
        </div>
      );
    }

    if (template.headerStyle === 'centered-classic') {
      return (
        <div
          style={{ borderBottom: `2px solid ${accent}` }}
          className="pb-3.5 mb-4 text-center space-y-1.5"
        >
          {showPhoto && (
            <img
              src={p.profilePhotoDataUrl}
              alt={displayName}
              style={{ borderColor: accent }}
              className="w-16 h-16 rounded-full object-cover border-2 mx-auto mb-1"
            />
          )}
          <h1
            style={{ fontSize: fontScale.h1, color: accent }}
            className="font-extrabold tracking-tight uppercase leading-tight break-words"
          >
            {displayName}
          </h1>
          {displayTitle && (
            <div style={{ fontSize: fontScale.xl }} className="font-semibold text-slate-700">
              {displayTitle}
            </div>
          )}
          {contactItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-600 pt-0.5" style={{ fontSize: fontScale.sm }}>
              {contactItems.map((c, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-300">•</span>}
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {c.value}
                    </a>
                  ) : (
                    <span>{c.value}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (template.headerStyle === 'editorial-monogram') {
      return (
        <div className="pb-4 mb-4 border-b-2 border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {showPhoto ? (
              <img
                src={p.profilePhotoDataUrl}
                alt={displayName}
                style={{ borderColor: accent }}
                className="w-16 h-16 rounded-lg object-cover border-2 shrink-0"
              />
            ) : (
              <div
                style={{ backgroundColor: accent }}
                className="w-13 h-13 rounded-lg text-white font-extrabold flex items-center justify-center text-lg shrink-0"
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h1 style={{ fontSize: fontScale.h1, color: accent }} className="font-extrabold leading-tight break-words">
                {displayName}
              </h1>
              {displayTitle && (
                <div style={{ fontSize: fontScale.lg }} className="font-semibold text-slate-600 uppercase tracking-widest mt-0.5">
                  {displayTitle}
                </div>
              )}
            </div>
          </div>
          {contactItems.length > 0 && (
            <div className="text-right space-y-0.5 text-slate-600 shrink-0 max-w-[42%]" style={{ fontSize: fontScale.sm }}>
              {contactItems.map((c, idx) => (
                <div key={idx} className="truncate">
                  {c.value}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (template.headerStyle === 'boxed-frame') {
      return (
        <div
          style={{ borderColor: accent, backgroundColor: `${accent}08` }}
          className="p-4 rounded-lg border-2 mb-4 flex items-center justify-between gap-4"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <h1 style={{ fontSize: fontScale.h1, color: accent }} className="font-extrabold leading-tight break-words">
              {displayName}
            </h1>
            {displayTitle && (
              <div style={{ fontSize: fontScale.lg }} className="font-bold text-slate-800">
                {displayTitle}
              </div>
            )}
            {contactItems.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600 pt-1" style={{ fontSize: fontScale.sm }}>
                {contactItems.map((c, idx) => (
                  <span key={idx}>{c.value}</span>
                ))}
              </div>
            )}
          </div>
          {showPhoto && (
            <img
              src={p.profilePhotoDataUrl}
              alt={displayName}
              style={{ borderColor: accent }}
              className="w-18 h-18 rounded-lg object-cover border-2 shrink-0"
            />
          )}
        </div>
      );
    }

    // Default / left-minimal / split-bar / mono-terminal / europass-crest
    return (
      <div
        style={{ borderLeft: template.headerStyle === 'split-bar' ? `5px solid ${accent}` : 'none' }}
        className={`${template.headerStyle === 'split-bar' ? 'pl-3.5' : ''} pb-3.5 mb-4 border-b border-slate-200 flex items-center justify-between gap-4`}
      >
        <div className="space-y-1 min-w-0 flex-1">
          {template.headerStyle === 'europass-crest' && (
            <div style={{ color: accent }} className="text-[10px] font-extrabold uppercase tracking-widest">
              Curriculum Vitae • Europass Standard
            </div>
          )}
          <h1 style={{ fontSize: fontScale.h1, color: accent }} className="font-extrabold tracking-tight leading-tight break-words">
            {displayName}
          </h1>
          {displayTitle && (
            <div style={{ fontSize: fontScale.xl }} className="font-semibold text-slate-700">
              {displayTitle}
            </div>
          )}
          {contactItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 pt-1" style={{ fontSize: fontScale.sm }}>
              {contactItems.map((c, idx) => (
                <span key={idx}>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: accent }} className="hover:underline">
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {showPhoto && (
          <img
            src={p.profilePhotoDataUrl}
            alt={displayName}
            style={{ borderColor: accent }}
            className="w-18 h-18 rounded-full object-cover border-2 shrink-0"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          data-cv-page={pageIndex + 1}
          dir={dict.dir}
          style={{
            width: `${pageWidthPx}px`,
            minHeight: `${pageHeightPx}px`,
            padding: `${marginPx}px`,
            fontFamily: FONT_FAMILY_CSS[design.fontFamily],
            fontSize: fontScale.base,
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            marginBottom: scale !== 1 ? `${(scale - 1) * pageHeightPx}px` : undefined,
          }}
          className="cv-page-sheet bg-white text-slate-900 shadow-xl border border-slate-200 relative flex flex-col justify-between box-border overflow-hidden print:shadow-none print:border-none"
        >
          <div className="flex-1 flex flex-col">
            {/* Render Header on Page 1, or compact continuation header on Page 2+ */}
            {pageIndex === 0 ? (
              renderHeader()
            ) : (
              <div className="pb-2 mb-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">{p.fullName || 'Curriculum Vitae'}</span>
                <span>
                  {dict.page} {pageIndex + 1} {dict.of} {pages.length}
                </span>
              </div>
            )}

            {/* Main + Optional Sidebar Body */}
            <div className="flex-1 flex gap-6">
              {effectiveSidebar === 'left' && page.sidebar.length > 0 && (
                <aside
                  style={{
                    backgroundColor: `${accent}0c`,
                    borderColor: `${accent}25`,
                    gap: sectionGap,
                  }}
                  className="w-[31%] shrink-0 p-3.5 rounded-lg border flex flex-col"
                >
                  {page.sidebar.map((blk) => (
                    <div key={blk.sectionId}>{blk.node}</div>
                  ))}
                </aside>
              )}

              <div style={{ gap: sectionGap }} className="flex-1 min-w-0 flex flex-col">
                {page.main.map((blk) => (
                  <div key={blk.sectionId}>{blk.node}</div>
                ))}
              </div>

              {effectiveSidebar === 'right' && page.sidebar.length > 0 && (
                <aside
                  style={{
                    backgroundColor: `${accent}0c`,
                    borderColor: `${accent}25`,
                    gap: sectionGap,
                  }}
                  className="w-[31%] shrink-0 p-3.5 rounded-lg border flex flex-col"
                >
                  {page.sidebar.map((blk) => (
                    <div key={blk.sectionId}>{blk.node}</div>
                  ))}
                </aside>
              )}
            </div>
          </div>

          {/* Page Footer (only shown on multi-page CVs) */}
          {pages.length > 1 && (
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>{p.fullName}</span>
              <span>
                {dict.page} {pageIndex + 1} {dict.of} {pages.length}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

