'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, Minimize2, CheckCircle } from 'lucide-react';
import { compressPdfFile } from '@/lib/pdf/engine';

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

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

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[160px]">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 flex items-center justify-center mb-2">
            <Minimize2 className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Select a PDF to compress</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Runs in your browser — file is not uploaded</p>
          <label className="btn-primary cursor-pointer text-xs">
            <span className="inline-flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Choose PDF</span>
            <input type="file" accept=".pdf,application/pdf" onChange={onFile} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => { setFile(null); setUrl(null); setStats(null); }}
              className="btn-secondary text-xs"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-slate-500">Original size: {fmt(file.size)}</p>
          <button type="button" onClick={run} disabled={busy} className="btn-primary text-xs inline-flex items-center gap-2">
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Minimize2 className="w-4 h-4" />}
            {busy ? 'Compressing…' : 'Compress PDF'}
          </button>
          {stats && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="w-4 h-4" />
                {stats.compressed < stats.original
                  ? `Reduced ${fmt(stats.original)} → ${fmt(stats.compressed)} (${Math.round((1 - stats.compressed / stats.original) * 100)}% smaller)`
                  : 'Already compact — saved a re-packed copy at similar size'}
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Client-side re-pack (object streams + metadata strip). Scanned image PDFs may need image compression first for big wins.
              </p>
            </div>
          )}
          {url && (
            <a href={url} download={file.name.replace(/\.pdf$/i, '') + '-compressed.pdf'} className="btn-primary text-xs inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4" /> Download compressed PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}
