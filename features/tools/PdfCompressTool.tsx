'use client';

import React, { useState } from 'react';
import {
  Upload,
  Download,
  RefreshCw,
  Minimize2,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Building2,
  Plane,
} from 'lucide-react';
import { compressPdfFile } from '@/lib/pdf/engine';

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface PdfCompressToolProps {
  initialTargetKb?: number;
}

const PRESET_PORTALS = [
  { kb: 100, label: '100 KB', portal: 'PPSC / UPSC / State Job Forms' },
  { kb: 200, label: '200 KB', portal: 'Visa Portals (UKVI / VFS / IRCC)' },
  { kb: 300, label: '300 KB', portal: 'University Admissions & Portals' },
  { kb: 500, label: '500 KB', portal: 'Government & Embassy Submissions' },
];

export function PdfCompressTool({ initialTargetKb }: PdfCompressToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const [targetKb, setTargetKb] = useState<number | null>(initialTargetKb || (initialTargetKb === 0 ? null : initialTargetKb ?? 200));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUrl(null);
    setStats(null);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { bytes, originalSize, compressedSize } = await compressPdfFile(file);
      setStats({ original: originalSize, compressed: compressedSize });
      setUrl(URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' })));
    } catch {
      alert('Could not compress this PDF. It may be password-protected or corrupted.');
    } finally {
      setBusy(false);
    }
  };

  const targetBytes = targetKb ? targetKb * 1024 : null;
  const isWithinTarget = stats && targetBytes ? stats.compressed <= targetBytes : null;

  return (
    <div className="space-y-6">
      {/* Target Size Presets Band */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-brand-600" /> Target File Size
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your target limit for visa, embassy, and government portal uploads
            </p>
          </div>
          {targetKb && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Target: {targetKb} KB
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_PORTALS.map((p) => {
            const active = targetKb === p.kb;
            return (
              <button
                key={p.kb}
                type="button"
                onClick={() => setTargetKb(p.kb)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  active
                    ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-1 ring-brand-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">{p.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{p.portal}</div>
              </button>
            );
          })}
        </div>
      </div>

      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[170px] p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 flex items-center justify-center mb-3">
            <Minimize2 className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {targetKb ? `Select a PDF to compress to ${targetKb} KB` : 'Select a PDF to compress'}
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Runs 100% locally in your browser memory — your document is never uploaded to any server
          </p>
          <label className="btn-primary cursor-pointer text-xs px-4 py-2">
            <span className="inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Choose PDF File
            </span>
            <input type="file" accept=".pdf,application/pdf" onChange={onFile} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setUrl(null);
                setStats(null);
              }}
              className="btn-secondary text-xs"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-slate-500">Original file size: <span className="font-semibold text-slate-700 dark:text-slate-300">{fmt(file.size)}</span></p>

          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="btn-primary text-xs inline-flex items-center gap-2"
          >
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Minimize2 className="w-4 h-4" />}
            {busy ? 'Re-packing & Compressing…' : targetKb ? `Compress to ${targetKb} KB Target` : 'Compress PDF'}
          </button>

          {stats && (
            <div className="space-y-3 pt-2">
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isWithinTarget === false
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isWithinTarget === false ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="text-amber-800 dark:text-amber-300">
                        Reduced to {fmt(stats.compressed)} (Exceeds {targetKb} KB cap)
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-800 dark:text-emerald-300">
                        {targetKb
                          ? `Target Met: Reduced to ${fmt(stats.compressed)} (Under ${targetKb} KB cap)`
                          : `Successfully Compressed to ${fmt(stats.compressed)}`}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {stats.compressed < stats.original
                    ? `Saved ${fmt(stats.original - stats.compressed)} (${Math.round((1 - stats.compressed / stats.original) * 100)}% reduction). Stripped non-essential metadata and optimized PDF object streams.`
                    : 'This PDF is already highly compressed and streamlined. Re-packed without metadata bloat.'}
                </p>

                {isWithinTarget === false && (
                  <div className="mt-2 p-2.5 rounded bg-amber-100/70 dark:bg-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200">
                    <strong>Honest Readability Advisory:</strong> High-resolution scanned documents (e.g. 300+ DPI color image pages) contain bitmap scans that cannot be reduced below {targetKb} KB without reducing scan DPI or splitting pages. If this is a multi-page scan, try splitting individual pages with <a href="/tools/pdf-split" className="underline font-bold">PDF Split</a> or compressing the underlying photos before merging.
                  </div>
                )}
              </div>

              {url && (
                <div className="pt-1">
                  <a
                    href={url}
                    download={
                      file.name.replace(/\.pdf$/i, '') +
                      (targetKb ? `-${targetKb}kb` : '-compressed') +
                      '.pdf'
                    }
                    className="btn-primary text-xs inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg"
                  >
                    <Download className="w-4 h-4" /> Download Compressed PDF ({fmt(stats.compressed)})
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Official Government & Visa Portal Guidelines */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          Official Visa &amp; Government Upload Size Limits
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-slate-200">UKVI / GOV.UK Visa Portals</div>
            <p>Maximum allowed is 5 MB, but guidance recommends under 200 KB to 500 KB per certificate or payslip for smooth portal validation.</p>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-slate-200">Canada IRCC &amp; Express Entry</div>
            <p>Maximum 4 MB per document slot. Passports and multi-page proof of funds must stay sharp and legible while under the cap.</p>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-slate-200">US CEAC / DS-260 &amp; DS-160</div>
            <p>Individual document uploads are capped at 2 MB. Official guidance requests clear black-and-white or greyscale scans.</p>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-slate-200">PPSC / UPSC / FPSC Recruitment</div>
            <p>Strict upload boundaries often enforce 100 KB to 200 KB per certificate or degree scan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
