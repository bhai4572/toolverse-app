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
const CarTools = lazy(() => import('./CarTools').then((m) => ({ default: m.CarTools })));
const EmailFinderTool = lazy(() => import('./EmailFinderTool').then((m) => ({ default: m.EmailFinderTool })));
const CvMakerTool = lazy(() => import('./cv-builder/CvMakerTool'));

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

  return (
    <Suspense fallback={<ToolLoadingFallback />}>
      {renderToolContent(tool)}
    </Suspense>
  );
}

function renderToolContent(tool: ToolDefinition) {
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
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'jpg-to-webp':
      return <ImageConverterTool defaultTargetFormat="image/webp" />;
    case 'webp-to-jpg':
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'heic-to-jpg':
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'passport-photo-maker':
      return <PassportPhotoMakerTool />;
    case 'pdf-merge':
      return <PdfMergeTool />;
    case 'pdf-split':
      return <PdfSplitTool />;
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
    case 'jpg-to-pdf':
    case 'images-to-pdf':
      return <JpgToPdfTool />;
    case 'pdf-rotate':
    case 'pdf-reorder-pages':
      return <PdfRotateTool />;
    case 'excel-to-pdf':
    case 'excel-to-csv':
    case 'csv-to-excel':
    case 'csv-to-pdf':
    case 'word-to-pdf':
      return <DocumentConversionTools tool={tool} />;
    case 'word-counter':
    case 'character-counter':
    case 'text-diff-checker':
      return <WordCounterTool />;
    case 'text-case-converter':
      return <TextCaseConverterTool />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesTool />;
    case 'json-formatter':
    case 'json-to-csv':
      return <JsonFormatterTool />;
    case 'qr-code-generator':
    case 'wifi-qr-code-generator':
      return <QrCodeGeneratorTool />;
    case 'barcode-generator':
      return <BarcodeGeneratorTool />;
    case 'password-generator':
    case 'uuid-generator':
      return <PasswordGeneratorTool />;
    case 'percentage-calculator':
    case 'discount-calculator':
    case 'compound-interest-calculator':
    case 'emi-calculator':
    case 'age-calculator':
    case 'loan-payoff-calculator':
    case 'vat-gst-calculator':
    case 'tip-calculator':
    case 'profit-margin-calculator':
    case 'equation-solver':
      return <CalculatorTools tool={tool} />;
    case 'us-sales-tax-calculator':
    case 'us-paycheck-calculator':
    case 'uk-take-home-pay-calculator':
    case 'canada-paycheque-calculator':
    case 'australia-pay-calculator':
    case 'car-loan-calculator':
    case 'fuel-trip-cost-calculator':
      return <WesternFinanceTools tool={tool} />;
    case 'zakat-calculator':
      return <ZakatCalculatorTool />;
    case 'pakistan-salary-tax-estimator':
      return <PakistanTaxTool />;
    case 'invoice-generator':
    case 'quotation-generator':
      return <InvoiceGeneratorTool />;
    case 'url-shortener':
      return <UrlShortenerTool />;
    case 'utm-builder':
      return <UtmBuilderTool />;
    case 'meta-tag-generator':
      return <MetaTagGeneratorTool />;
    case 'adsense-revenue-calculator':
      return <AdsenseCalculatorTool />;
    case 'youtube-earnings-estimator':
      return <YoutubeEarningsTool />;
    case 'base64-encoder-decoder':
      return <Base64Tool />;
    case 'hash-generator':
      return <HashGeneratorTool />;
    case 'lorem-ipsum-generator':
      return <LoremIpsumTool />;
    case 'ai-sentence-humanizer':
    case 'readability-score':
    case 'repeated-word-finder':
    case 'duplicate-phrase-finder':
    case 'passive-voice-finder':
    case 'sentence-length-checker':
    case 'academic-tone-checker':
    case 'citation-checklist':
    case 'reference-list-alphabetizer':
    case 'citation-generator':
    case 'essay-structure-checker':
    case 'thesis-statement-checker':
    case 'transition-word-helper':
    case 'formal-tone-converter':
    case 'simple-english-converter':
    case 'email-proofreading-checklist':
    case 'assignment-submission-checklist':
    case 'originality-checklist':
      return <WritingTools tool={tool} />;
    case 'paypal-stripe-fee-calculator':
    case 'freelancer-hourly-rate-calculator':
    case 'crypto-profit-calculator':
    case 'matrix-vector-calculator':
    case 'unit-converter-suite':
    case 'target-cgpa-calculator':
    case 'attendance-calculator':
    case 'ats-resume-checker':
    case 'cover-letter-generator':
    case 'leave-application-generator':
    case 'youtube-tag-formatter':
    case 'instagram-grid-splitter':
    case 'youtube-chapters-generator':
    case 'css-gradient-shadow-generator':
    case 'jwt-decoder':
    case 'sql-formatter':
    case 'regex-tester':
    case 'cron-expression-generator':
    case 'subnet-calculator':
    case 'daraz-profit-calculator':
    case 'shipping-label-generator':
    case 'break-even-calculator':
    case 'pakistan-electricity-bill-estimator':
    case 'solar-panel-calculator':
      return <AdvancedTools tool={tool} />;
    case 'global-job-finder':
      return <JobFinderTool />;
    case 'b2b-email-finder':
    case 'email-finder':
    case 'email-scraper':
      return <EmailFinderTool />;
    case 'cv-maker':
    case 'resume-builder':
    case 'free-cv-maker':
      return <CvMakerTool />;
    default:
      return <ImageCompressorTool />;
  }
}

function ToolLoading() {
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
