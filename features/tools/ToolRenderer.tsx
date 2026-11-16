'use client';

import React, { Suspense } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { Lock, Loader2 } from 'lucide-react';

// Light / pure JS tools imported normally
import { ImageResizerTool } from './ImageResizerTool';
import { PassportPhotoMakerTool } from './PassportPhotoMakerTool';
import { WordCounterTool } from './WordCounterTool';
import { TextCaseConverterTool } from './TextCaseConverterTool';
import { RemoveDuplicateLinesTool } from './RemoveDuplicateLinesTool';
import { JsonFormatterTool } from './JsonFormatterTool';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
import { CalculatorTools } from './CalculatorTools';
import { WesternFinanceTools } from './WesternFinanceTools';
import { ZakatCalculatorTool } from './ZakatCalculatorTool';
import { PakistanTaxTool } from './PakistanTaxTool';
import { UrlShortenerTool } from './UrlShortenerTool';
import { UtmBuilderTool } from './UtmBuilderTool';
import { MetaTagGeneratorTool } from './MetaTagGeneratorTool';
import { AdsenseCalculatorTool } from './AdsenseCalculatorTool';
import { YoutubeEarningsTool } from './YoutubeEarningsTool';
import { Base64Tool } from './Base64Tool';
import { HashGeneratorTool } from './HashGeneratorTool';
import { LoremIpsumTool } from './LoremIpsumTool';
import { WritingTools } from './WritingTools';
import { AdvancedTools } from './AdvancedTools';
import { JobFinderTool } from './JobTools';
import { SeoTools } from './SeoTools';
import { TrendingTools } from './TrendingTools';
import { CarTools } from './CarTools';
import { EmailFinderTool } from './EmailFinderTool';

// Heavy vendor bundles lazy-loaded on demand (Code-splitting: saves ~1.65 MB gzipped on all non-tool pages)
const PdfMergeTool = React.lazy(() => import('./PdfMergeTool').then((m) => ({ default: m.PdfMergeTool })));
const PdfSplitTool = React.lazy(() => import('./PdfSplitTool').then((m) => ({ default: m.PdfSplitTool })));
const PdfCompressTool = React.lazy(() => import('./PdfCompressTool').then((m) => ({ default: m.PdfCompressTool })));
const JpgToPdfTool = React.lazy(() => import('./JpgToPdfTool').then((m) => ({ default: m.JpgToPdfTool })));
const PdfRotateTool = React.lazy(() => import('./PdfRotateTool').then((m) => ({ default: m.PdfRotateTool })));
const InvoiceGeneratorTool = React.lazy(() => import('./InvoiceGeneratorTool').then((m) => ({ default: m.InvoiceGeneratorTool })));
const DocumentConversionTools = React.lazy(() => import('./DocumentConversionTools').then((m) => ({ default: m.DocumentConversionTools })));
const ImageConverterTool = React.lazy(() => import('./ImageConverterTool').then((m) => ({ default: m.ImageConverterTool })));
const ImageCompressorTool = React.lazy(() => import('./ImageCompressorTool').then((m) => ({ default: m.ImageCompressorTool })));
const CvMakerTool = React.lazy(() => import('./cv-builder/CvMakerTool'));
const BarcodeGeneratorTool = React.lazy(() => import('./BarcodeGeneratorTool').then((m) => ({ default: m.BarcodeGeneratorTool })));
const QrCodeGeneratorTool = React.lazy(() => import('./QrCodeGeneratorTool').then((m) => ({ default: m.QrCodeGeneratorTool })));

function ToolLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-12 text-slate-500 text-sm">
      <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-600" />
      <span>Loading tool engine…</span>
    </div>
  );
}

export function ToolRenderer({ tool }: { tool: ToolDefinition }) {
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
