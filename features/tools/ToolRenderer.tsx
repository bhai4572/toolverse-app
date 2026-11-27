'use client';

import React, { lazy, Suspense } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { AlertTriangle, Lock } from 'lucide-react';

const ImageCompressorTool = lazy(() => import('./ImageCompressorTool').then((m) => ({ default: m.ImageCompressorTool })));
const ImageResizerTool = lazy(() => import('./ImageResizerTool').then((m) => ({ default: m.ImageResizerTool })));
const ImageConverterTool = lazy(() => import('./ImageConverterTool').then((m) => ({ default: m.ImageConverterTool })));
const PassportPhotoMakerTool = lazy(() => import('./PassportPhotoMakerTool').then((m) => ({ default: m.PassportPhotoMakerTool })));
const PdfMergeTool = lazy(() => import('./PdfMergeTool').then((m) => ({ default: m.PdfMergeTool })));
const PdfSplitTool = lazy(() => import('./PdfSplitTool').then((m) => ({ default: m.PdfSplitTool })));
const PdfCompressTool = lazy(() => import('./PdfCompressTool').then((m) => ({ default: m.PdfCompressTool })));
const JpgToPdfTool = lazy(() => import('./JpgToPdfTool').then((m) => ({ default: m.JpgToPdfTool })));
const PdfRotateTool = lazy(() => import('./PdfRotateTool').then((m) => ({ default: m.PdfRotateTool })));
const WordCounterTool = lazy(() => import('./WordCounterTool').then((m) => ({ default: m.WordCounterTool })));
const TextCaseConverterTool = lazy(() => import('./TextCaseConverterTool').then((m) => ({ default: m.TextCaseConverterTool })));
const RemoveDuplicateLinesTool = lazy(() => import('./RemoveDuplicateLinesTool').then((m) => ({ default: m.RemoveDuplicateLinesTool })));
const JsonFormatterTool = lazy(() => import('./JsonFormatterTool').then((m) => ({ default: m.JsonFormatterTool })));
const QrCodeGeneratorTool = lazy(() => import('./QrCodeGeneratorTool').then((m) => ({ default: m.QrCodeGeneratorTool })));
const BarcodeGeneratorTool = lazy(() => import('./BarcodeGeneratorTool').then((m) => ({ default: m.BarcodeGeneratorTool })));
const PasswordGeneratorTool = lazy(() => import('./PasswordGeneratorTool').then((m) => ({ default: m.PasswordGeneratorTool })));
const CalculatorTools = lazy(() => import('./CalculatorTools').then((m) => ({ default: m.CalculatorTools })));
const WesternFinanceTools = lazy(() => import('./WesternFinanceTools').then((m) => ({ default: m.WesternFinanceTools })));
const ZakatCalculatorTool = lazy(() => import('./ZakatCalculatorTool').then((m) => ({ default: m.ZakatCalculatorTool })));
const PakistanTaxTool = lazy(() => import('./PakistanTaxTool').then((m) => ({ default: m.PakistanTaxTool })));
const InvoiceGeneratorTool = lazy(() => import('./InvoiceGeneratorTool').then((m) => ({ default: m.InvoiceGeneratorTool })));
const UrlShortenerTool = lazy(() => import('./UrlShortenerTool').then((m) => ({ default: m.UrlShortenerTool })));
const UtmBuilderTool = lazy(() => import('./UtmBuilderTool').then((m) => ({ default: m.UtmBuilderTool })));
const MetaTagGeneratorTool = lazy(() => import('./MetaTagGeneratorTool').then((m) => ({ default: m.MetaTagGeneratorTool })));
const AdsenseCalculatorTool = lazy(() => import('./AdsenseCalculatorTool').then((m) => ({ default: m.AdsenseCalculatorTool })));
const YoutubeEarningsTool = lazy(() => import('./YoutubeEarningsTool').then((m) => ({ default: m.YoutubeEarningsTool })));
const Base64Tool = lazy(() => import('./Base64Tool').then((m) => ({ default: m.Base64Tool })));
const HashGeneratorTool = lazy(() => import('./HashGeneratorTool').then((m) => ({ default: m.HashGeneratorTool })));
const LoremIpsumTool = lazy(() => import('./LoremIpsumTool').then((m) => ({ default: m.LoremIpsumTool })));
const WritingTools = lazy(() => import('./WritingTools').then((m) => ({ default: m.WritingTools })));
const AdvancedTools = lazy(() => import('./AdvancedTools').then((m) => ({ default: m.AdvancedTools })));
const JobFinderTool = lazy(() => import('./JobTools').then((m) => ({ default: m.JobFinderTool })));
const SeoTools = lazy(() => import('./SeoTools').then((m) => ({ default: m.SeoTools })));
const TrendingTools = lazy(() => import('./TrendingTools').then((m) => ({ default: m.TrendingTools })));
const DocumentConversionTools = lazy(() => import('./DocumentConversionTools').then((m) => ({ default: m.DocumentConversionTools })));
const EmailFinderTool = lazy(() => import('./EmailFinderTool').then((m) => ({ default: m.EmailFinderTool })));
const CvMakerTool = lazy(() => import('./cv-builder/CvMakerTool'));

export type ToolComponentKey =
  | 'ImageCompressorTool'
  | 'ImageResizerTool'
  | 'ImageConverterTool'
  | 'PassportPhotoMakerTool'
  | 'PdfMergeTool'
  | 'PdfSplitTool'
  | 'PdfCompressTool'
  | 'JpgToPdfTool'
  | 'PdfRotateTool'
  | 'DocumentConversionTools'
  | 'WordCounterTool'
  | 'TextCaseConverterTool'
  | 'RemoveDuplicateLinesTool'
  | 'JsonFormatterTool'
  | 'QrCodeGeneratorTool'
  | 'BarcodeGeneratorTool'
  | 'PasswordGeneratorTool'
  | 'CalculatorTools'
  | 'WesternFinanceTools'
  | 'ZakatCalculatorTool'
  | 'PakistanTaxTool'
  | 'InvoiceGeneratorTool'
  | 'UrlShortenerTool'
  | 'UtmBuilderTool'
  | 'MetaTagGeneratorTool'
  | 'AdsenseCalculatorTool'
  | 'YoutubeEarningsTool'
  | 'Base64Tool'
  | 'HashGeneratorTool'
  | 'LoremIpsumTool'
  | 'WritingTools'
  | 'AdvancedTools'
  | 'SeoTools'
  | 'TrendingTools'
  | 'JobFinderTool'
  | 'EmailFinderTool'
  | 'CvMakerTool';

/**
 * Centralized, explicit mapping from every live tool slug to its component key.
 * Unknown slugs return undefined and render UnavailableToolNotice (never an unrelated tool).
 */
export const TOOL_RENDERER_MAP: Record<string, ToolComponentKey> = {
  // Image & Design Tools
  'image-compressor': 'ImageCompressorTool',
  'compress-image-target-size': 'ImageCompressorTool',
  'image-resizer': 'ImageResizerTool',
  'image-cropper': 'ImageResizerTool',
  'social-media-image-resizer': 'ImageResizerTool',
  'jpg-to-png': 'ImageConverterTool',
  'png-to-jpg': 'ImageConverterTool',
  'jpg-to-webp': 'ImageConverterTool',
  'webp-to-jpg': 'ImageConverterTool',
  'heic-to-jpg': 'ImageConverterTool',
  'passport-photo-maker': 'PassportPhotoMakerTool',
  'midjourney-prompt-builder': 'TrendingTools',
  'svg-to-png-converter': 'TrendingTools',

  // PDF & Document Tools
  'pdf-merge': 'PdfMergeTool',
  'pdf-split': 'PdfSplitTool',
  'pdf-compress': 'PdfCompressTool',
  'compress-pdf-to-200kb': 'PdfCompressTool',
  'compress-pdf-to-100kb': 'PdfCompressTool',
  'compress-pdf-to-300kb': 'PdfCompressTool',
  'compress-pdf-to-500kb': 'PdfCompressTool',
  'jpg-to-pdf': 'JpgToPdfTool',
  'images-to-pdf': 'JpgToPdfTool',
  'pdf-rotate': 'PdfRotateTool',
  'pdf-reorder-pages': 'PdfRotateTool',
  'excel-to-pdf': 'DocumentConversionTools',
  'excel-to-csv': 'DocumentConversionTools',
  'csv-to-excel': 'DocumentConversionTools',
  'csv-to-pdf': 'DocumentConversionTools',
  'word-to-pdf': 'DocumentConversionTools',

  // Text, Writing & Student Tools
  'word-counter': 'WordCounterTool',
  'character-counter': 'WordCounterTool',
  'text-diff-checker': 'WordCounterTool',
  'text-case-converter': 'TextCaseConverterTool',
  'remove-duplicate-lines': 'RemoveDuplicateLinesTool',
  'lorem-ipsum-generator': 'LoremIpsumTool',
  'gpa-calculator': 'CalculatorTools',

  // Writing, Grammar & Academic Integrity Tools
  'ai-sentence-humanizer': 'WritingTools',
  'readability-score': 'WritingTools',
  'repeated-word-finder': 'WritingTools',
  'duplicate-phrase-finder': 'WritingTools',
  'passive-voice-finder': 'WritingTools',
  'sentence-length-checker': 'WritingTools',
  'academic-tone-checker': 'WritingTools',
  'citation-checklist': 'WritingTools',
  'reference-list-alphabetizer': 'WritingTools',
  'citation-generator': 'WritingTools',
  'essay-structure-checker': 'WritingTools',
  'thesis-statement-checker': 'WritingTools',
  'transition-word-helper': 'WritingTools',
  'formal-tone-converter': 'WritingTools',
  'simple-english-converter': 'WritingTools',
  'email-proofreading-checklist': 'WritingTools',
  'assignment-submission-checklist': 'WritingTools',
  'originality-checklist': 'WritingTools',

  // Calculators & Finance
  'percentage-calculator': 'CalculatorTools',
  'discount-calculator': 'CalculatorTools',
  'compound-interest-calculator': 'CalculatorTools',
  'emi-calculator': 'CalculatorTools',
  'age-calculator': 'CalculatorTools',
  'loan-payoff-calculator': 'CalculatorTools',
  'vat-gst-calculator': 'CalculatorTools',
  'tip-calculator': 'CalculatorTools',
  'profit-margin-calculator': 'CalculatorTools',
  'equation-solver': 'CalculatorTools',
  'us-sales-tax-calculator': 'WesternFinanceTools',
  'us-paycheck-calculator': 'WesternFinanceTools',
  'uk-take-home-pay-calculator': 'WesternFinanceTools',
  'canada-paycheque-calculator': 'WesternFinanceTools',
  'australia-pay-calculator': 'WesternFinanceTools',
  'car-loan-calculator': 'WesternFinanceTools',
  'fuel-trip-cost-calculator': 'WesternFinanceTools',
  'zakat-calculator': 'ZakatCalculatorTool',
  'pakistan-salary-tax-estimator': 'PakistanTaxTool',
  'invoice-generator': 'InvoiceGeneratorTool',
  'quotation-generator': 'InvoiceGeneratorTool',

  // SEO & URL Tools
  'url-shortener': 'UrlShortenerTool',
  'utm-builder': 'UtmBuilderTool',
  'meta-tag-generator': 'MetaTagGeneratorTool',
  'seo-audit-analyzer': 'SeoTools',
  'keyword-research-tool': 'SeoTools',
  'backlink-checker-analyzer': 'SeoTools',
  'serp-simulator': 'SeoTools',
  'keyword-density-checker': 'SeoTools',
  'robots-txt-generator': 'SeoTools',
  'xml-sitemap-validator': 'SeoTools',
  'schema-markup-generator': 'SeoTools',
  'redirect-chain-checker': 'SeoTools',
  'canonical-hreflang-generator': 'SeoTools',

  // Creator & Social Tools
  'adsense-revenue-calculator': 'AdsenseCalculatorTool',
  'youtube-earnings-estimator': 'YoutubeEarningsTool',
  'youtube-thumbnail-downloader': 'TrendingTools',
  'chatgpt-prompt-generator': 'TrendingTools',
  'instagram-hashtag-generator': 'TrendingTools',
  'twitter-thread-splitter': 'TrendingTools',
  'srt-subtitle-cleaner': 'TrendingTools',

  // Developer & Cybersecurity Tools
  'json-formatter': 'JsonFormatterTool',
  'json-to-csv': 'JsonFormatterTool',
  'qr-code-generator': 'QrCodeGeneratorTool',
  'wifi-qr-code-generator': 'QrCodeGeneratorTool',
  'barcode-generator': 'BarcodeGeneratorTool',
  'password-generator': 'PasswordGeneratorTool',
  'uuid-generator': 'PasswordGeneratorTool',
  'base64-encoder-decoder': 'Base64Tool',
  'hash-generator': 'HashGeneratorTool',
  'glassmorphism-css-generator': 'TrendingTools',
  'markdown-html-converter': 'TrendingTools',
  'curl-to-code-converter': 'TrendingTools',

  // Advanced / Regional / Business Utilities
  'paypal-stripe-fee-calculator': 'TrendingTools',
  'freelancer-hourly-rate-calculator': 'TrendingTools',
  'crypto-profit-calculator': 'TrendingTools',
  'matrix-vector-calculator': 'AdvancedTools',
  'unit-converter-suite': 'AdvancedTools',
  'target-cgpa-calculator': 'AdvancedTools',
  'attendance-calculator': 'AdvancedTools',
  'ats-resume-checker': 'AdvancedTools',
  'cover-letter-generator': 'AdvancedTools',
  'leave-application-generator': 'AdvancedTools',
  'youtube-tag-formatter': 'AdvancedTools',
  'instagram-grid-splitter': 'AdvancedTools',
  'youtube-chapters-generator': 'AdvancedTools',
  'css-gradient-shadow-generator': 'AdvancedTools',
  'jwt-decoder': 'AdvancedTools',
  'sql-formatter': 'AdvancedTools',
  'regex-tester': 'AdvancedTools',
  'cron-expression-generator': 'AdvancedTools',
  'subnet-calculator': 'AdvancedTools',
  'daraz-profit-calculator': 'AdvancedTools',
  'shipping-label-generator': 'AdvancedTools',
  'break-even-calculator': 'AdvancedTools',
  'pakistan-electricity-bill-estimator': 'AdvancedTools',
  'solar-panel-calculator': 'AdvancedTools',

  // Career, B2B & CV Builder
  'global-job-finder': 'JobFinderTool',
  'b2b-email-finder': 'EmailFinderTool',
  'email-finder': 'EmailFinderTool',
  'email-scraper': 'EmailFinderTool',
  'cv-maker': 'CvMakerTool',
  'resume-builder': 'CvMakerTool',
  'free-cv-maker': 'CvMakerTool',
};

export function getToolRendererKey(slug: string): ToolComponentKey | undefined {
  return TOOL_RENDERER_MAP[slug];
}

function UnavailableToolNotice({ tool }: { tool: ToolDefinition }) {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Tool Temporarily Unavailable
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        The interactive interface for <strong>{tool.canonicalName}</strong> is currently unavailable. Please browse our other free privacy-first tools while we resolve this.
      </p>
      <a
        href="/tools"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
      >
        Browse All Tools
      </a>
    </div>
  );
}

function renderToolContent(tool: ToolDefinition) {
  const key = getToolRendererKey(tool.slug);
  if (!key) {
    return <UnavailableToolNotice tool={tool} />;
  }

  switch (tool.slug) {
    case 'image-compressor':
      return <ImageCompressorTool isTargetKbMode={false} />;
    case 'compress-image-target-size':
      return <ImageCompressorTool isTargetKbMode={true} />;
    case 'image-resizer':
    case 'image-cropper':
      return <ImageResizerTool isSocialMode={false} />;
    case 'social-media-image-resizer':
      return <ImageResizerTool isSocialMode={true} />;
    case 'jpg-to-png':
      return <ImageConverterTool defaultTargetFormat="image/png" />;
    case 'png-to-jpg':
    case 'webp-to-jpg':
    case 'heic-to-jpg':
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'jpg-to-webp':
      return <ImageConverterTool defaultTargetFormat="image/webp" />;
    case 'pdf-compress':
      return <PdfCompressTool initialTargetKb={0} />;
    case 'compress-pdf-to-200kb':
      return <PdfCompressTool initialTargetKb={200} />;
    case 'compress-pdf-to-100kb':
      return <PdfCompressTool initialTargetKb={100} />;
    case 'compress-pdf-to-300kb':
      return <PdfCompressTool initialTargetKb={300} />;
    case 'compress-pdf-to-500kb':
      return <PdfCompressTool initialTargetKb={500} />;
    default:
      break;
  }

  switch (key) {
    case 'PassportPhotoMakerTool':
      return <PassportPhotoMakerTool />;
    case 'PdfMergeTool':
      return <PdfMergeTool />;
    case 'PdfSplitTool':
      return <PdfSplitTool />;
    case 'JpgToPdfTool':
      return <JpgToPdfTool />;
    case 'PdfRotateTool':
      return <PdfRotateTool />;
    case 'DocumentConversionTools':
      return <DocumentConversionTools tool={tool} />;
    case 'WordCounterTool':
      return <WordCounterTool />;
    case 'TextCaseConverterTool':
      return <TextCaseConverterTool />;
    case 'RemoveDuplicateLinesTool':
      return <RemoveDuplicateLinesTool />;
    case 'JsonFormatterTool':
      return <JsonFormatterTool />;
    case 'QrCodeGeneratorTool':
      return <QrCodeGeneratorTool />;
    case 'BarcodeGeneratorTool':
      return <BarcodeGeneratorTool />;
    case 'PasswordGeneratorTool':
      return <PasswordGeneratorTool />;
    case 'CalculatorTools':
      return <CalculatorTools tool={tool} />;
    case 'WesternFinanceTools':
      return <WesternFinanceTools tool={tool} />;
    case 'ZakatCalculatorTool':
      return <ZakatCalculatorTool />;
    case 'PakistanTaxTool':
      return <PakistanTaxTool />;
    case 'InvoiceGeneratorTool':
      return <InvoiceGeneratorTool />;
    case 'UrlShortenerTool':
      return <UrlShortenerTool />;
    case 'UtmBuilderTool':
      return <UtmBuilderTool />;
    case 'MetaTagGeneratorTool':
      return <MetaTagGeneratorTool />;
    case 'AdsenseCalculatorTool':
      return <AdsenseCalculatorTool />;
    case 'YoutubeEarningsTool':
      return <YoutubeEarningsTool />;
    case 'Base64Tool':
      return <Base64Tool />;
    case 'HashGeneratorTool':
      return <HashGeneratorTool />;
    case 'LoremIpsumTool':
      return <LoremIpsumTool />;
    case 'WritingTools':
      return <WritingTools tool={tool} />;
    case 'AdvancedTools':
      return <AdvancedTools tool={tool} />;
    case 'SeoTools':
      return <SeoTools tool={tool} />;
    case 'TrendingTools':
      return <TrendingTools tool={tool} />;
    case 'JobFinderTool':
      return <JobFinderTool />;
    case 'EmailFinderTool':
      return <EmailFinderTool />;
    case 'CvMakerTool':
      return <CvMakerTool />;
    default:
      return <UnavailableToolNotice tool={tool} />;
  }
}

function ToolRendererInner({ tool }: { tool: ToolDefinition }) {
  if (tool.status === 'admin_configuration_required') {
    return (
      <div className="p-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
          Configuration Required by Administrator
        </h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
          This server-side processing tool requires administrator setup. Please configure the required environment keys ({tool.requiredEnvironmentVariables?.join(', ') || 'API_KEY'}) in production.
        </p>
      </div>
    );
  }

  if (tool.status === 'disabled') {
    return (
      <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-xl text-center text-slate-500 text-sm">
        This tool is currently disabled.
      </div>
    );
  }

  return renderToolContent(tool);
}

export function ToolLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[320px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-500"
    >
      Loading tool…
    </div>
  );
}

/**
 * Each tool is code-split (React.lazy) so heavy libraries (pdf-lib, jsPDF, xlsx,
 * heic2any, image compression, QR/barcode) only download on the page that needs them.
 */
export function ToolRenderer({ tool }: { tool: ToolDefinition }) {
  return (
    <Suspense fallback={<ToolLoading />}>
      <ToolRendererInner tool={tool} />
    </Suspense>
  );
}
