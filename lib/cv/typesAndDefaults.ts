/**
 * Toolverse Advanced Free CV & Resume Builder
 * Core Data Models, 20 Predefined Additional Sections, Custom Section/Field Builder Types,
 * Validation Utilities, and Multi-Language (LTR + RTL) Dictionary.
 */

export type CvLocaleCode = 'en' | 'ur' | 'ar' | 'fr' | 'de' | 'es';

export type CustomFieldType = 'text' | 'date' | 'url' | 'list' | 'multiline';

export interface CvCustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  value: string;
  visible: boolean;
}

export interface CvCustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  dateRange?: string;
  location?: string;
  description?: string;
  visible: boolean;
  fields: CvCustomField[];
}

export interface CvCustomSection {
  id: string;
  title: string;
  visible: boolean;
  items: CvCustomSectionItem[];
}

export interface CvPersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  fullAddress: string;
  linkedinUrl: string;
  websiteUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  profilePhotoDataUrl: string;
  // Per-field optional visibility flags
  showFullAddress: boolean;
  showLinkedin: boolean;
  showWebsite: boolean;
  showPortfolio: boolean;
  showGithub: boolean;
  showProfilePhoto: boolean;
}

export interface CvSummarySection {
  content: string;
  visible: boolean;
}

export interface CvExperienceItem {
  id: string;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
  achievements: string;
  visible: boolean;
  customFields: CvCustomField[];
}

export interface CvEducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startYear: string;
  graduationYear: string;
  currentlyStudying: boolean;
  gradeGpa: string;
  showGpa: boolean;
  description: string;
  visible: boolean;
}

export type SkillProficiency = '' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface CvSkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: SkillProficiency;
  visible: boolean;
}

/**
 * All 20 Dedicated Optional CV Sections required by specification
 */
export type AdditionalSectionKey =
  | 'projects'
  | 'certifications'
  | 'training'
  | 'languages'
  | 'awards'
  | 'volunteer'
  | 'publications'
  | 'research'
  | 'internships'
  | 'memberships'
  | 'references'
  | 'hobbies'
  | 'courses'
  | 'conferences'
  | 'patents'
  | 'licenses'
  | 'military'
  | 'teaching'
  | 'leadership'
  | 'extracurricular';

export interface CvStandardRecordItem {
  id: string;
  title: string; // e.g., Project Name, Certification Name, Language, Award Title, Referee Name
  organization: string; // e.g., Issuing Org, Journal, Institution, Company, Branch
  roleOrSubtitle: string; // e.g., Role, Credential ID, Proficiency, Patent Number, Rank
  location: string;
  startDate: string;
  endDate: string;
  url: string;
  description: string;
  visible: boolean;
}

export interface CvAdditionalSectionConfig {
  key: AdditionalSectionKey;
  defaultLabel: string;
  titleLabel: string;
  orgLabel: string;
  subtitleLabel: string;
  urlLabel?: string;
  descLabel: string;
}

export const ADDITIONAL_SECTION_CONFIGS: readonly CvAdditionalSectionConfig[] = [
  {
    key: 'projects',
    defaultLabel: 'Projects',
    titleLabel: 'Project Title',
    orgLabel: 'Client / Organization',
    subtitleLabel: 'Role & Tech Stack',
    urlLabel: 'Project / Live URL',
    descLabel: 'Key Features & Impact',
  },
  {
    key: 'certifications',
    defaultLabel: 'Certifications',
    titleLabel: 'Certification Name',
    orgLabel: 'Issuing Authority',
    subtitleLabel: 'Credential ID',
    urlLabel: 'Verification URL',
    descLabel: 'Scope / Notes',
  },
  {
    key: 'training',
    defaultLabel: 'Professional Training',
    titleLabel: 'Training Program',
    orgLabel: 'Training Provider / Institute',
    subtitleLabel: 'Duration / Hours',
    urlLabel: 'Certificate Link',
    descLabel: 'Competencies Covered',
  },
  {
    key: 'languages',
    defaultLabel: 'Languages',
    titleLabel: 'Language Name',
    orgLabel: 'Certification (e.g. IELTS, DELF)',
    subtitleLabel: 'Fluency Level (e.g. Native, C1, Fluent)',
    descLabel: 'Notes',
  },
  {
    key: 'awards',
    defaultLabel: 'Awards and Achievements',
    titleLabel: 'Award / Honor Title',
    orgLabel: 'Awarding Institution',
    subtitleLabel: 'Recognition Scope',
    urlLabel: 'Reference Link',
    descLabel: 'Achievement Details',
  },
  {
    key: 'volunteer',
    defaultLabel: 'Volunteer Experience',
    titleLabel: 'Volunteer Role',
    orgLabel: 'Non-Profit / Organization',
    subtitleLabel: 'Cause / Department',
    urlLabel: 'Organization URL',
    descLabel: 'Contributions & Community Impact',
  },
  {
    key: 'publications',
    defaultLabel: 'Publications',
    titleLabel: 'Publication / Paper Title',
    orgLabel: 'Journal / Conference / Publisher',
    subtitleLabel: 'Co-Authors & Citation / Volume',
    urlLabel: 'DOI / Publication URL',
    descLabel: 'Abstract / Summary',
  },
  {
    key: 'research',
    defaultLabel: 'Research Experience',
    titleLabel: 'Research Topic / Project',
    orgLabel: 'University / Research Lab',
    subtitleLabel: 'Principal Investigator / Role',
    urlLabel: 'Repository / Paper Link',
    descLabel: 'Methodology & Findings',
  },
  {
    key: 'internships',
    defaultLabel: 'Internships',
    titleLabel: 'Intern Title',
    orgLabel: 'Company / Organization',
    subtitleLabel: 'Department / Team',
    urlLabel: 'Company Website',
    descLabel: 'Responsibilities & Key Deliverables',
  },
  {
    key: 'memberships',
    defaultLabel: 'Professional Memberships',
    titleLabel: 'Association / Society Name',
    orgLabel: 'Chapter / Region',
    subtitleLabel: 'Membership Tier / ID (e.g. IEEE Senior Member)',
    urlLabel: 'Profile / Directory URL',
    descLabel: 'Committee Involvement',
  },
  {
    key: 'references',
    defaultLabel: 'References',
    titleLabel: 'Referee Full Name',
    orgLabel: 'Company / Institution',
    subtitleLabel: 'Job Title & Relationship',
    urlLabel: 'Email & Phone Contact',
    descLabel: 'Reference Notes',
  },
  {
    key: 'hobbies',
    defaultLabel: 'Hobbies and Interests',
    titleLabel: 'Hobby / Interest',
    orgLabel: 'Club / Group (Optional)',
    subtitleLabel: 'Category',
    descLabel: 'Brief Details',
  },
  {
    key: 'courses',
    defaultLabel: 'Courses',
    titleLabel: 'Course Title',
    orgLabel: 'University / Platform (Coursera, edX, etc.)',
    subtitleLabel: 'Course Code / Grade',
    urlLabel: 'Credential URL',
    descLabel: 'Key Topics Learned',
  },
  {
    key: 'conferences',
    defaultLabel: 'Conferences',
    titleLabel: 'Conference / Summit Name',
    orgLabel: 'Organizer / Host',
    subtitleLabel: 'Role (Speaker, Panelist, Attendee)',
    urlLabel: 'Session / Slides Link',
    descLabel: 'Talk Title / Summary',
  },
  {
    key: 'patents',
    defaultLabel: 'Patents',
    titleLabel: 'Patent Title',
    orgLabel: 'Patent Office (USPTO, EPO, WIPO)',
    subtitleLabel: 'Patent / Application Number & Status',
    urlLabel: 'Patent Filing URL',
    descLabel: 'Technical Summary',
  },
  {
    key: 'licenses',
    defaultLabel: 'Licenses',
    titleLabel: 'Professional License Name',
    orgLabel: 'Licensing Board / Authority',
    subtitleLabel: 'License # & Jurisdiction',
    urlLabel: 'Registry URL',
    descLabel: 'Practice Standing / Notes',
  },
  {
    key: 'military',
    defaultLabel: 'Military Experience',
    titleLabel: 'Rank & Duty Title',
    orgLabel: 'Armed Forces Branch / Unit',
    subtitleLabel: 'Security Clearance / Specialty',
    descLabel: 'Leadership, Operations & Commendations',
  },
  {
    key: 'teaching',
    defaultLabel: 'Teaching Experience',
    titleLabel: 'Course / Subject Taught',
    orgLabel: 'University / School / Institute',
    subtitleLabel: 'Role (Professor, Lecturer, Teaching Assistant)',
    descLabel: 'Curriculum, Class Size & Outcomes',
  },
  {
    key: 'leadership',
    defaultLabel: 'Leadership Experience',
    titleLabel: 'Leadership Position',
    orgLabel: 'Organization / Board / Initiative',
    subtitleLabel: 'Team Size / Mandate',
    descLabel: 'Strategic Initiatives & Measurable Results',
  },
  {
    key: 'extracurricular',
    defaultLabel: 'Extracurricular Activities',
    titleLabel: 'Activity / Society / Team',
    orgLabel: 'Institution / Community',
    subtitleLabel: 'Position / Role',
    descLabel: 'Events Organized & Achievements',
  },
];

export type CoreOrAdditionalSectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | AdditionalSectionKey
  | `custom:${string}`;

export interface CvSectionOrderItem {
  id: CoreOrAdditionalSectionId;
  label: string;
  visible: boolean;
  isCustom?: boolean;
}

export interface CvDocumentData {
  personal: CvPersonalInfo;
  summary: CvSummarySection;
  experience: CvExperienceItem[];
  education: CvEducationItem[];
  skills: CvSkillItem[];
  skillCategories: string[];
  showSkillProficiency: boolean;
  additionalSections: Record<AdditionalSectionKey, CvStandardRecordItem[]>;
  customSections: CvCustomSection[];
  sectionOrder: CvSectionOrderItem[];
}

export type CvFontFamily = 'inter' | 'georgia' | 'merriweather' | 'roboto' | 'mono' | 'playfair';
export type CvFontSize = 'small' | 'medium' | 'large';
export type CvSectionSpacing = 'compact' | 'normal' | 'relaxed';
export type CvPageMargin = 'narrow' | 'normal' | 'wide';
export type CvDateFormat = 'MMM YYYY' | 'MM/YYYY' | 'YYYY-MM' | 'YYYY';
export type CvHeadingStyle = 'uppercase-bar' | 'underline' | 'pill' | 'minimal' | 'boxed';
export type CvPageSize = 'A4' | 'LETTER';
export type CvPhotoVisibility = 'auto' | 'show' | 'hide';
export type CvSidebarMode = 'auto' | 'left' | 'right' | 'none';

export interface CvDesignSettings {
  templateId: string;
  accentColor: string;
  fontFamily: CvFontFamily;
  fontSize: CvFontSize;
  sectionSpacing: CvSectionSpacing;
  pageMargin: CvPageMargin;
  photoVisibility: CvPhotoVisibility;
  sidebarMode: CvSidebarMode;
  dateFormat: CvDateFormat;
  headingStyle: CvHeadingStyle;
  pageSize: CvPageSize;
  locale: CvLocaleCode;
}

/**
 * Multi-Language Section Heading & Label Dictionary (LTR + RTL support)
 * Note: Never translates user-entered content; translates structural headings & dates.
 */
export const CV_LOCALE_DICTIONARY: Record<
  CvLocaleCode,
  {
    name: string;
    nativeName: string;
    dir: 'ltr' | 'rtl';
    present: string;
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    responsibilities: string;
    achievements: string;
    gpa: string;
    page: string;
    of: string;
    additionalLabels: Record<AdditionalSectionKey, string>;
  }
> = {
  en: {
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    present: 'Present',
    contact: 'Contact',
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    responsibilities: 'Key Responsibilities',
    achievements: 'Key Achievements',
    gpa: 'GPA / Grade',
    page: 'Page',
    of: 'of',
    additionalLabels: {
      projects: 'Projects',
      certifications: 'Certifications',
      training: 'Professional Training',
      languages: 'Languages',
      awards: 'Awards & Achievements',
      volunteer: 'Volunteer Experience',
      publications: 'Publications',
      research: 'Research Experience',
      internships: 'Internships',
      memberships: 'Professional Memberships',
      references: 'References',
      hobbies: 'Hobbies & Interests',
      courses: 'Courses',
      conferences: 'Conferences',
      patents: 'Patents',
      licenses: 'Licenses',
      military: 'Military Experience',
      teaching: 'Teaching Experience',
      leadership: 'Leadership Experience',
      extracurricular: 'Extracurricular Activities',
    },
  },
  ur: {
    name: 'Urdu',
    nativeName: 'اردو (RTL)',
    dir: 'rtl',
    present: 'موجودہ',
    contact: 'رابطہ کی معلومات',
    summary: 'پیشہ ورانہ خلاصہ',
    experience: 'کام کا تجربہ',
    education: 'تعلیم',
    skills: 'مہارتیں',
    responsibilities: 'ذمہ داریاں',
    achievements: 'نمایاں کامیابیاں',
    gpa: 'گریڈ / جی پی اے',
    page: 'صفحہ',
    of: 'از',
    additionalLabels: {
      projects: 'پروجیکٹس',
      certifications: 'سرٹیفیکیشنز',
      training: 'پیشہ ورانہ تربیت',
      languages: 'زبانیں',
      awards: 'ایوارڈز اور کامیابیاں',
      volunteer: 'رضاکارانہ تجربہ',
      publications: 'مطبوعات',
      research: 'تحقیقی تجربہ',
      internships: 'انٹرن شپس',
      memberships: 'پیشہ ورانہ رکنیت',
      references: 'حوالہ جات',
      hobbies: 'مشاغل اور دلچسپیاں',
      courses: 'کورسز',
      conferences: 'کانفرنسز',
      patents: 'پیٹنٹس',
      licenses: 'لائسنس',
      military: 'عسکری تجربہ',
      teaching: 'تدریسی تجربہ',
      leadership: 'قیادت کا تجربہ',
      extracurricular: 'ہم نصابی سرگرمیاں',
    },
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية (RTL)',
    dir: 'rtl',
    present: 'حتى الآن',
    contact: 'معلومات الاتصال',
    summary: 'الملخص المهني',
    experience: 'الخبرة العملية',
    education: 'التعليم',
    skills: 'المهارات',
    responsibilities: 'المسؤوليات الرئيسية',
    achievements: 'الإنجازات الرئيسية',
    gpa: 'المعدل التراكمي',
    page: 'صفحة',
    of: 'من',
    additionalLabels: {
      projects: 'المشاريع',
      certifications: 'الشهادات المهنية',
      training: 'التدريب المهني',
      languages: 'اللغات',
      awards: 'الجوائز والإنجازات',
      volunteer: 'العمل التطوعي',
      publications: 'المنشورات العلمية',
      research: 'الخبرة البحثية',
      internships: 'التدريب العملي',
      memberships: 'العضويات المهنية',
      references: 'المراجع',
      hobbies: 'الهوايات والاهتمامات',
      courses: 'الدورات التدريبية',
      conferences: 'المؤتمرات',
      patents: 'براءات الاختراع',
      licenses: 'التراخيص المهنية',
      military: 'الخدمة العسكرية',
      teaching: 'الخبرة التدريسية',
      leadership: 'الخبرة القيادية',
      extracurricular: 'الأنشطة اللاصفية',
    },
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    present: 'Présent',
    contact: 'Coordonnées',
    summary: 'Profil Professionnel',
    experience: 'Expérience Professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    responsibilities: 'Responsabilités',
    achievements: 'Réalisations Clés',
    gpa: 'Mention / Moyenne',
    page: 'Page',
    of: 'sur',
    additionalLabels: {
      projects: 'Projets',
      certifications: 'Certifications',
      training: 'Formation Continue',
      languages: 'Langues',
      awards: 'Prix et Distinctions',
      volunteer: 'Bénévolat',
      publications: 'Publications',
      research: 'Travaux de Recherche',
      internships: 'Stages',
      memberships: 'Affiliations Professionnelles',
      references: 'Références',
      hobbies: 'Centres d’Intérêt',
      courses: 'Cours',
      conferences: 'Conférences',
      patents: 'Brevets',
      licenses: 'Licences',
      military: 'Service Militaire',
      teaching: 'Expérience d’Enseignement',
      leadership: 'Leadership',
      extracurricular: 'Activités Параscolaires',
    },
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    present: 'Heute',
    contact: 'Kontakt',
    summary: 'Berufsprofil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung & Studium',
    skills: 'Kenntnisse & Fähigkeiten',
    responsibilities: 'Aufgabenbereiche',
    achievements: 'Wichtige Erfolge',
    gpa: 'Abschlussnote',
    page: 'Seite',
    of: 'von',
    additionalLabels: {
      projects: 'Projekte',
      certifications: 'Zertifizierungen',
      training: 'Weiterbildung',
      languages: 'Sprachen',
      awards: 'Auszeichnungen',
      volunteer: 'Ehrenamtliches Engagement',
      publications: 'Publikationen',
      research: 'Forschungserfahrung',
      internships: 'Praktika',
      memberships: 'Mitgliedschaften',
      references: 'Referenzen',
      hobbies: 'Interessen',
      courses: 'Kurse',
      conferences: 'Konferenzen',
      patents: 'Patente',
      licenses: 'Lizenzen & Zulassungen',
      military: 'Wehrdienst',
      teaching: 'Lehrerfahrung',
      leadership: 'Führungserfahrung',
      extracurricular: 'Außercurriculare Aktivitäten',
    },
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    present: 'Actualidad',
    contact: 'Contacto',
    summary: 'Perfil Profesional',
    experience: 'Experiencia Laboral',
    education: 'Educación',
    skills: 'Habilidades',
    responsibilities: 'Responsabilidades',
    achievements: 'Logros Destacados',
    gpa: 'Promedio / Nota',
    page: 'Página',
    of: 'de',
    additionalLabels: {
      projects: 'Proyectos',
      certifications: 'Certificaciones',
      training: 'Capacitación Profesional',
      languages: 'Idiomas',
      awards: 'Premios y Logros',
      volunteer: 'Voluntariado',
      publications: 'Publicaciones',
      research: 'Experiencia en Investigación',
      internships: 'Prácticas Profesionales',
      memberships: 'Membresías Profesionales',
      references: 'Referencias',
      hobbies: 'Intereses y Aficiones',
      courses: 'Cursos',
      conferences: 'Conferencias',
      patents: 'Patentes',
      licenses: 'Licencias Profesionales',
      military: 'Experiencia Militar',
      teaching: 'Experiencia Docente',
      leadership: 'Experiencia de Liderazgo',
      extracurricular: 'Actividades Extracurriculares',
    },
  },
};

export function createEmptyAdditionalSections(): Record<AdditionalSectionKey, CvStandardRecordItem[]> {
  return {
    projects: [],
    certifications: [],
    training: [],
    languages: [],
    awards: [],
    volunteer: [],
    publications: [],
    research: [],
    internships: [],
    memberships: [],
    references: [],
    hobbies: [],
    courses: [],
    conferences: [],
    patents: [],
    licenses: [],
    military: [],
    teaching: [],
    leadership: [],
    extracurricular: [],
  };
}

export function createDefaultSectionOrder(): CvSectionOrderItem[] {
  return [
    { id: 'summary', label: 'Professional Summary', visible: true },
    { id: 'experience', label: 'Work Experience', visible: true },
    { id: 'education', label: 'Education', visible: true },
    { id: 'skills', label: 'Skills', visible: true },
    ...ADDITIONAL_SECTION_CONFIGS.map((cfg) => ({
      id: cfg.key as CoreOrAdditionalSectionId,
      label: cfg.defaultLabel,
      visible: true,
    })),
  ];
}

export function createDefaultDesignSettings(): CvDesignSettings {
  return {
    templateId: 'classic-professional',
    accentColor: '#1e3a8a',
    fontFamily: 'inter',
    fontSize: 'medium',
    sectionSpacing: 'normal',
    pageMargin: 'normal',
    photoVisibility: 'auto',
    sidebarMode: 'auto',
    dateFormat: 'MMM YYYY',
    headingStyle: 'uppercase-bar',
    pageSize: 'A4',
    locale: 'en',
  };
}

export function createBlankCvDocument(): CvDocumentData {
  return {
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      fullAddress: '',
      linkedinUrl: '',
      websiteUrl: '',
      portfolioUrl: '',
      githubUrl: '',
      profilePhotoDataUrl: '',
      showFullAddress: true,
      showLinkedin: true,
      showWebsite: true,
      showPortfolio: true,
      showGithub: true,
      showProfilePhoto: true,
    },
    summary: {
      content: '',
      visible: true,
    },
    experience: [],
    education: [],
    skills: [],
    skillCategories: ['Technical Skills', 'Soft Skills', 'Industry-Specific Skills', 'Language Skills'],
    showSkillProficiency: true,
    additionalSections: createEmptyAdditionalSections(),
    customSections: [],
    sectionOrder: createDefaultSectionOrder(),
  };
}

export function createSampleCvDocument(): CvDocumentData {
  const additional = createEmptyAdditionalSections();
  additional.projects = [
    {
      id: 'proj-1',
      title: 'Distributed Real-Time Payment Settlement Engine',
      organization: 'FinCore Global',
      roleOrSubtitle: 'Lead Architect • Go, Kafka, PostgreSQL, Kubernetes',
      location: 'London, UK',
      startDate: '2023-03',
      endDate: '2024-08',
      url: 'https://github.com/alexmercer/fincore-settlement',
      description:
        'Designed high-throughput multi-currency clearing pipeline processing 18,000+ transactions/sec with 99.995% uptime and automated reconciliation.',
      visible: true,
    },
  ];
  additional.certifications = [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect – Professional',
      organization: 'Amazon Web Services',
      roleOrSubtitle: 'Credential ID: AWS-SAP-994821',
      location: '',
      startDate: '2023-06',
      endDate: '2026-06',
      url: 'https://aws.amazon.com/verification',
      description: 'Cloud infrastructure architecture, zero-downtime migration, and FinOps security.',
      visible: true,
    },
  ];
  additional.languages = [
    {
      id: 'lang-1',
      title: 'English',
      organization: 'Native / Bilingual',
      roleOrSubtitle: 'Native / C2',
      location: '',
      startDate: '',
      endDate: '',
      url: '',
      description: '',
      visible: true,
    },
    {
      id: 'lang-2',
      title: 'German',
      organization: 'Goethe-Zertifikat C1',
      roleOrSubtitle: 'Professional Working Proficiency (C1)',
      location: '',
      startDate: '',
      endDate: '',
      url: '',
      description: '',
      visible: true,
    },
  ];

  const customSectionId = 'custom:achievements-showcase';

  return {
    personal: {
      fullName: 'Alexander J. Mercer',
      jobTitle: 'Principal Full-Stack & Cloud Systems Architect',
      email: 'alex.mercer@professional.dev',
      phone: '+44 20 7946 0921',
      country: 'United Kingdom',
      city: 'London',
      fullAddress: '42 Bishopsgate, Financial District, London EC2N 4AH',
      linkedinUrl: 'https://linkedin.com/in/alexmercer-architect',
      websiteUrl: 'https://alexmercer.dev',
      portfolioUrl: 'https://portfolio.alexmercer.dev',
      githubUrl: 'https://github.com/alexmercer',
      profilePhotoDataUrl: '',
      showFullAddress: true,
      showLinkedin: true,
      showWebsite: true,
      showPortfolio: true,
      showGithub: true,
      showProfilePhoto: true,
    },
    summary: {
      content:
        'Principal Software & Cloud Architect with 10+ years of experience designing resilient distributed systems, B2B SaaS platforms, and low-latency financial infrastructure. Proven track record leading cross-functional engineering teams of 25+ developers, reducing cloud compute spend by 38%, and delivering enterprise products serving 4M+ active users.',
      visible: true,
    },
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Principal Cloud & Distributed Systems Architect',
        companyName: 'Vanguard FinTech Technologies Ltd.',
        employmentType: 'Full-time',
        location: 'London, United Kingdom',
        startDate: '2021-04',
        endDate: '',
        currentlyWorking: true,
        responsibilities:
          '• Lead architecture and technical strategy across 6 core engineering squads building real-time B2B treasury and cross-border payment APIs.\n• Oversee multi-region Kubernetes clusters on AWS and GCP with strict SOC2 Type II and PCI-DSS level-1 compliance.',
        achievements:
          '• Reduced API p99 latency from 420ms to 68ms by re-architecting the event ledger in Rust and Go.\n• Cut annual AWS infrastructure spend by $410,000 (38%) via spot-fleet autoscaling and query indexing.',
        visible: true,
        customFields: [
          {
            id: 'exp1-cf1',
            label: 'Team Size Managed',
            type: 'text',
            value: '28 Engineers across 4 time zones',
            visible: true,
          },
        ],
      },
      {
        id: 'exp-2',
        jobTitle: 'Senior Full-Stack Software Engineer',
        companyName: 'CloudScale Enterprise Solutions',
        employmentType: 'Full-time',
        location: 'Manchester, United Kingdom',
        startDate: '2017-08',
        endDate: '2021-03',
        currentlyWorking: false,
        responsibilities:
          '• Built customer-facing analytics dashboards and multi-tenant GraphQL/REST microservices using TypeScript, React, Node.js, and PostgreSQL.\n• Mentored 12 junior and mid-level developers and instituted automated CI/CD quality gates.',
        achievements:
          '• Accelerated release frequency from bi-weekly manual deployments to 15+ automated zero-downtime deploys per day.\n• Increased enterprise customer retention by 19% through launch of real-time SLA monitoring module.',
        visible: true,
        customFields: [],
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Master of Science (M.Sc.)',
        fieldOfStudy: 'Advanced Computer Science & Distributed Computing',
        institution: 'Imperial College London',
        location: 'London, UK',
        startYear: '2015',
        graduationYear: '2017',
        currentlyStudying: false,
        gradeGpa: 'Distinction (3.95 / 4.0 GPA)',
        showGpa: true,
        description:
          'Master’s Thesis on Consensus Algorithms and Fault-Tolerant State Replication in Geo-Distributed Databases.',
        visible: true,
      },
      {
        id: 'edu-2',
        degree: 'Bachelor of Science (B.Sc. Hons)',
        fieldOfStudy: 'Software Engineering',
        institution: 'University of Manchester',
        location: 'Manchester, UK',
        startYear: '2011',
        graduationYear: '2015',
        currentlyStudying: false,
        gradeGpa: 'First-Class Honours',
        showGpa: true,
        description: 'President of the University Computing & Competitive Programming Society.',
        visible: true,
      },
    ],
    skills: [
      { id: 'sk-1', name: 'TypeScript / JavaScript (ES2024)', category: 'Technical Skills', proficiency: 'Expert', visible: true },
      { id: 'sk-2', name: 'React 19, Next.js & Tailwind CSS', category: 'Technical Skills', proficiency: 'Expert', visible: true },
      { id: 'sk-3', name: 'Go (Golang) & Node.js Microservices', category: 'Technical Skills', proficiency: 'Expert', visible: true },
      { id: 'sk-4', name: 'PostgreSQL, Redis & Apache Kafka', category: 'Technical Skills', proficiency: 'Advanced', visible: true },
      { id: 'sk-5', name: 'AWS, Kubernetes, Docker & Terraform', category: 'Technical Skills', proficiency: 'Expert', visible: true },
      { id: 'sk-6', name: 'Technical Leadership & System Design', category: 'Soft Skills', proficiency: 'Expert', visible: true },
      { id: 'sk-7', name: 'Executive Stakeholder Communication', category: 'Soft Skills', proficiency: 'Advanced', visible: true },
      { id: 'sk-8', name: 'PCI-DSS, SOC2 & FinTech Compliance', category: 'Industry-Specific Skills', proficiency: 'Advanced', visible: true },
    ],
    skillCategories: ['Technical Skills', 'Soft Skills', 'Industry-Specific Skills', 'Language Skills'],
    showSkillProficiency: true,
    additionalSections: additional,
    customSections: [
      {
        id: customSectionId,
        title: 'Keynote Speaking & Open Source Advisory',
        visible: true,
        items: [
          {
            id: 'cs-item-1',
            title: 'KubeCon + CloudNativeCon Europe Speaker',
            subtitle: 'Cloud Native Computing Foundation (CNCF)',
            dateRange: '2024',
            location: 'Paris, France',
            description: 'Presented keynote session on multi-region zero-trust service mesh performance.',
            visible: true,
            fields: [
              {
                id: 'cf-1',
                label: 'Session Topic',
                type: 'text',
                value: 'Scaling High-Frequency Financial Ledgers on Kubernetes',
                visible: true,
              },
              {
                id: 'cf-2',
                label: 'Audience Size',
                type: 'text',
                value: '1,400+ Cloud Architects & SREs',
                visible: true,
              },
              {
                id: 'cf-3',
                label: 'Slide Deck URL',
                type: 'url',
                value: 'https://alexmercer.dev/talks/kubecon-2024',
                visible: true,
              },
            ],
          },
        ],
      },
    ],
    sectionOrder: [
      ...createDefaultSectionOrder(),
      {
        id: customSectionId as CoreOrAdditionalSectionId,
        label: 'Keynote Speaking & Open Source Advisory',
        visible: true,
        isCustom: true,
      },
    ],
  };
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatCvDate(raw: string, format: CvDateFormat): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  // Match YYYY-MM or YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const monthNum = Math.max(1, Math.min(12, parseInt(isoMatch[2], 10)));
    const monthPadded = String(monthNum).padStart(2, '0');
    const monthShort = MONTH_NAMES[monthNum - 1];
    switch (format) {
      case 'MMM YYYY':
        return `${monthShort} ${year}`;
      case 'MM/YYYY':
        return `${monthPadded}/${year}`;
      case 'YYYY-MM':
        return `${year}-${monthPadded}`;
      case 'YYYY':
        return year;
    }
  }
  return trimmed;
}

export interface CvValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export function validateCvData(data: CvDocumentData): CvValidationIssue[] {
  const issues: CvValidationIssue[] = [];
  const p = data.personal;

  if (!p.fullName.trim()) {
    issues.push({
      field: 'fullName',
      message: 'Full Name is recommended so employers can identify your CV.',
      severity: 'warning',
    });
  }

  if (p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) {
    issues.push({
      field: 'email',
      message: 'Please enter a valid email address (e.g., name@domain.com).',
      severity: 'error',
    });
  }

  const urlFields: Array<{ key: keyof CvPersonalInfo; label: string }> = [
    { key: 'linkedinUrl', label: 'LinkedIn URL' },
    { key: 'websiteUrl', label: 'Personal Website URL' },
    { key: 'portfolioUrl', label: 'Portfolio URL' },
    { key: 'githubUrl', label: 'GitHub URL' },
  ];

  for (const uf of urlFields) {
    const val = String(p[uf.key] || '').trim();
    if (val && !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val)) {
      issues.push({
        field: uf.key,
        message: `${uf.label} does not look like a valid web address (e.g., https://example.com).`,
        severity: 'error',
      });
    }
  }

  return issues;
}

/**
 * Optional Client-Side Summary Polisher
 * Strictly refines the user's OWN entered text without inventing any fake companies, degrees, or skills.
 */
export function polishSummaryTextClientSide(
  currentSummary: string,
  personal: CvPersonalInfo,
  skills: CvSkillItem[],
  experience: CvExperienceItem[]
): string {
  const trimmed = currentSummary.trim();
  const topSkills = skills
    .filter((s) => s.visible && s.name.trim())
    .slice(0, 5)
    .map((s) => s.name.trim());
  const latestRole = experience.find((e) => e.visible && e.jobTitle.trim());

  if (trimmed) {
    // Polish grammar, capitalize sentences, and tighten weak phrasing without adding fake facts
    let refined = trimmed
      .replace(/\bi am a\b/gi, 'Results-driven')
      .replace(/\bi have worked on\b/gi, 'Experienced in delivering')
      .replace(/\bresponsible for\b/gi, 'spearheaded')
      .replace(/\bhelped with\b/gi, 'contributed to')
      .replace(/\s+/g, ' ');
    refined = refined.charAt(0).toUpperCase() + refined.slice(1);
    if (!/[.!?]$/.test(refined)) refined += '.';
    return refined;
  }

  // If summary is empty, build a strictly factual summary from the user's own entered title, role, and skills
  const parts: string[] = [];
  if (personal.jobTitle.trim()) {
    parts.push(`Dedicated ${personal.jobTitle.trim()}`);
  } else if (latestRole?.jobTitle) {
    parts.push(`Experienced ${latestRole.jobTitle.trim()}`);
  } else {
    parts.push(' Motivated professional');
  }

  if (latestRole?.companyName) {
    parts[0] += ` with hands-on experience at ${latestRole.companyName.trim()}`;
  }
  parts[0] += '.';

  if (topSkills.length > 0) {
    parts.push(`Core competencies include ${topSkills.join(', ')}.`);
  }

  return parts.join(' ').trim();
}

