'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, AlertCircle, FileSpreadsheet, FileText } from 'lucide-react';
import { ToolDefinition } from '@/lib/tools/registry';
import {
  DOC_MAX_BYTES,
  DOC_MAX_PDF_COLS,
  DOC_MAX_PDF_ROWS,
  extractDocxText,
  matrixToCsvBlob,
  matrixToPdfBlob,
  matrixToXlsxBlob,
  readCsvAsMatrix,
  readXlsxAsMatrix,
  textToPdfBlob,
} from '@/lib/document/engine';

type Mode = 'excel-to-pdf' | 'excel-to-csv' | 'csv-to-excel' | 'csv-to-pdf' | 'word-to-pdf';

const MODE_META: Record<
  Mode,
  { accept: string; label: string; outExt: string; icon: 'sheet' | 'doc' }
> = {
  'excel-to-pdf': {
    accept: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
    label: 'Upload Excel (.xlsx)',
    outExt: 'pdf',
    icon: 'sheet',
  },
  'excel-to-csv': {
    accept: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
    label: 'Upload Excel (.xlsx)',
    outExt: 'csv',
    icon: 'sheet',
  },
  'csv-to-excel': {
    accept: '.csv,text/csv',
    label: 'Upload CSV',
    outExt: 'xlsx',
    icon: 'sheet',
  },
  'csv-to-pdf': {
    accept: '.csv,text/csv',
    label: 'Upload CSV',
    outExt: 'pdf',
    icon: 'sheet',
  },
  'word-to-pdf': {
    accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Upload Word (.docx)',
    outExt: 'pdf',
    icon: 'doc',
  },
};

function baseName(file: File) {
  return file.name.replace(/\.[^.]+$/, '') || 'converted';
}

export function DocumentConversionTools({ tool }: { tool: ToolDefinition }) {
  const mode = tool.slug as Mode;
  const meta = MODE_META[mode] || MODE_META['excel-to-pdf'];
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState('');

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    try {
      let blob: Blob;
      const name = baseName(file);
      if (mode === 'excel-to-pdf') {
        const { rows, name: sheet } = await readXlsxAsMatrix(file);
        blob = await matrixToPdfBlob(rows, sheet);
        setResultName(`${name}.pdf`);
      } else if (mode === 'excel-to-csv') {
        const { rows } = await readXlsxAsMatrix(file);
        blob = await matrixToCsvBlob(rows);
        setResultName(`${name}.csv`);
      } else if (mode === 'csv-to-excel') {
        const rows = await readCsvAsMatrix(file);
        blob = await matrixToXlsxBlob(rows, 'Sheet1');
        setResultName(`${name}.xlsx`);
      } else if (mode === 'csv-to-pdf') {
        const rows = await readCsvAsMatrix(file);
        blob = await matrixToPdfBlob(rows, name);
        setResultName(`${name}.pdf`);
      } else {
        const text = await extractDocxText(file);
        blob = await textToPdfBlob(text, name);
        setResultName(`${name}.pdf`);
      }
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setBusy(false);
    }
  };

  const Icon = meta.icon === 'doc' ? FileText : FileSpreadsheet;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <p>
          <strong>Privacy:</strong> conversion runs in your browser — files are not uploaded to ToolVerse.
        </p>
        <p>
          <strong>Limits:</strong> max {DOC_MAX_BYTES / (1024 * 1024)} MB per file
          {(mode === 'excel-to-pdf' || mode === 'csv-to-pdf') &&
            `; PDF export caps at ${DOC_MAX_PDF_ROWS} rows × ${DOC_MAX_PDF_COLS} columns`}
          .
        </p>
        <p>
          <strong>Fidelity:</strong>{' '}
          {mode === 'word-to-pdf'
            ? 'Word → PDF extracts plain text only (no images, headers, or exact layout).'
            : 'Spreadsheets export cell values as a simple table — charts, formulas, merged cells, and rich formatting are not preserved.'}
        </p>
      </div>

      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
            <Icon className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{meta.label}</p>
          <label className="btn-primary cursor-pointer text-xs mt-3">
            <span className="inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Select file
            </span>
            <input type="file" accept={meta.accept} onChange={onPick} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError(null);
                if (resultUrl) URL.revokeObjectURL(resultUrl);
                setResultUrl(null);
              }}
              className="btn-secondary text-xs"
            >
              Clear
            </button>
          </div>

          <button type="button" onClick={convert} disabled={busy} className="w-full btn-primary py-3 text-sm inline-flex items-center justify-center gap-2">
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            Convert to .{meta.outExt}
          </button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {resultUrl && (
            <a
              href={resultUrl}
              download={resultName}
              className="btn-primary text-xs inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500"
            >
              <Download className="w-4 h-4" /> Download {resultName}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
