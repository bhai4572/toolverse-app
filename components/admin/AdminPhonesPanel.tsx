'use client';

import React, { useState } from 'react';
import {
  getAllPhones,
  getAllPhoneBrands,
  importPhonesBatch,
  parsePhonesCsvToSeeds,
  exportPhonesToCsv,
  exportPhonesToJson,
  toggleArchivePhone,
  evaluatePhoneSeoQuality,
  getArchivedPhoneSlugs,
} from '@/lib/phones/database';
import { PhoneImportResult } from '@/lib/phones/types';
import { Upload, Download, CheckCircle2, Smartphone } from 'lucide-react';

interface AdminPhonesPanelProps {
  onMutated: () => void;
}

const SAMPLE_CSV = `brandSlug,modelName,releaseYear,priceUsd,pricePkr,ptaStatus,is5g,displaySize,displayType,resolution,refreshRateHz,chipset,os,maxRamGb,maxStorageGb,mainCamera,primaryMp,selfieCamera,capacityMah,charging,colors,summary
samsung,Galaxy S25 Ultra,2025,1299,439999,PTA Approved (Official Warranty),true,6.9 inches,Dynamic LTPO AMOLED 2X,1440 x 3120 pixels,120,Snapdragon 8 Elite (3 nm),Android 15,12,512,200 MP + 50 MP 5x + 50 MP UW + 10 MP 3x,200,12 MP,5000,45W wired,Titanium Black; Titanium Silverblue,Flagship Galaxy S25 Ultra smartphone imported via CSV batch.`;

export function AdminPhonesPanel({ onMutated }: AdminPhonesPanelProps) {
  const [search, setSearch] = useState('');
  const [importMode, setImportMode] = useState<'skip_duplicate' | 'update_existing'>('skip_duplicate');
  const [csvOrJsonInput, setCsvOrJsonInput] = useState('');
  const [importReport, setImportReport] = useState<PhoneImportResult | null>(null);

  const allPhones = getAllPhones(true);
  const archivedSet = new Set(getArchivedPhoneSlugs());
  const brands = getAllPhoneBrands();

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = csvOrJsonInput.trim();
    if (!raw) return;

    if (raw.startsWith('[') || raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const res = importPhonesBatch(list, importMode, 'json_import');
      setImportReport(res);
    } else {
      const seeds = parsePhonesCsvToSeeds(raw);
      const res = importPhonesBatch(seeds, importMode, 'csv_import');
      setImportReport(res);
    }
    onMutated();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvOrJsonInput(text);
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = allPhones.filter(
    (p) =>
      !search.trim() ||
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.brandSlug.includes(search.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* Bulk CSV / JSON Importer with Deduplication */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Bulk Mobile Phone Importer (CSV / JSON — Strict Zero-Duplicate Engine)</span>
            </h2>
            <p className="text-slate-500 mt-0.5">
              Import thousands of GSMArena-style or Pakistan PKR models via CSV or JSON. Automatically deduplicates by canonical brand + model slug.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCsvOrJsonInput(SAMPLE_CSV)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
            >
              Load Sample CSV
            </button>
            <button
              type="button"
              onClick={() => downloadFile(exportPhonesToCsv(), 'toolverse_phones.csv', 'text/csv')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              type="button"
              onClick={() => downloadFile(exportPhonesToJson(), 'toolverse_phones.json', 'application/json')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
          </div>
        </div>

        <form onSubmit={handleBulkImport} className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="text-xs"
            />
            <select
              value={importMode}
              onChange={(e) => setImportMode(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            >
              <option value="skip_duplicate">Skip Existing Duplicates (Safe Dedup)</option>
              <option value="update_existing">Update Matching Models with New Prices/Specs</option>
            </select>
          </div>

          <textarea
            rows={5}
            placeholder="Paste CSV or JSON array of phone specs here..."
            value={csvOrJsonInput}
            onChange={(e) => setCsvOrJsonInput(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
          />

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Run Deduplicated Batch Import
            </button>
            <span className="text-slate-400">
              D1 SQL schema ready at <code className="text-indigo-500">backend/phones_d1_schema.sql</code>
            </span>
          </div>
        </form>

        {importReport && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center gap-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-bold">
              Import Complete: {importReport.added} Added • {importReport.updated} Updated •{' '}
              {importReport.skippedDuplicates} Duplicates Skipped
            </span>
            {importReport.errors.length > 0 && (
              <span className="text-rose-600 font-semibold">
                ({importReport.errors.length} errors)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Catalog Inventory Table */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>Deduplicated Mobile Phone Catalog ({allPhones.length} Models / {brands.length} Brands)</span>
            </h3>
          </div>
          <input
            type="text"
            placeholder="Filter phones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-64"
          />
        </div>

        <div className="overflow-x-auto max-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800 font-bold">
                <th className="p-3">Model</th>
                <th className="p-3">Price (PKR / USD)</th>
                <th className="p-3">Chipset &amp; Battery</th>
                <th className="p-3">SEO Score</th>
                <th className="p-3">Origin</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((phone) => {
                const isArchived = phone.isArchived || archivedSet.has(phone.slug);
                const seoRep = evaluatePhoneSeoQuality(phone);
                return (
                  <tr key={phone.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <a href={`/phones/${phone.slug}`} className="font-bold text-indigo-600 hover:underline">
                        {phone.fullName}
                      </a>
                      <div className="text-[10px] font-mono text-slate-400">{phone.canonicalKey}</div>
                    </td>
                    <td className="p-3 font-semibold">
                      {phone.pricePkr ? `PKR ${phone.pricePkr.toLocaleString()}` : 'TBA'} /{' '}
                      {phone.priceUsd ? `$${phone.priceUsd}` : 'TBA'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {phone.specs.platform.chipset} • {phone.specs.battery.capacityMah}mAh
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold">
                        {seoRep.score}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px]">{phone.sourceOrigin}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => {
                          toggleArchivePhone(phone.slug, !isArchived);
                          onMutated();
                        }}
                        className={`px-2.5 py-1 rounded font-bold ${
                          isArchived
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isArchived ? 'Restore' : 'Archive'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

