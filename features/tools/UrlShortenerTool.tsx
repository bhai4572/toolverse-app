'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, AlertCircle, RefreshCw, Info, Download, ExternalLink } from 'lucide-react';
import {
  buildTrackedUrl,
  getLocalShortLinks,
  saveLocalShortLink,
  ShortLinkRecord,
} from '@/lib/url-shortener/client';
import { generateQrCodeDataUrl } from '@/lib/developer/engine';

export function UrlShortenerTool() {
  const [url, setUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentLink, setCurrentLink] = useState<ShortLinkRecord | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkHistory, setLinkHistory] = useState<ShortLinkRecord[]>([]);

  useEffect(() => {
    setLinkHistory(getLocalShortLinks());
  }, []);

  const handleGenerate = async () => {
    setError(null);
    const built = buildTrackedUrl(url, {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
    });

    if (!built.isValid || !built.url) {
      setError(built.error || 'Please enter a valid http:// or https:// URL.');
      return;
    }

    setIsProcessing(true);
    try {
      const qr = await generateQrCodeDataUrl(built.url);
      const record: ShortLinkRecord = {
        id: `url-${Date.now()}`,
        alias: built.url,
        originalUrl: url.trim(),
        shortUrl: built.url,
        createdAt: new Date().toISOString(),
        clicks: 0,
      };

      setCurrentLink(record);
      setQrCodeUrl(qr);
      saveLocalShortLink(record);
      setLinkHistory(getLocalShortLinks());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate URL and QR code.';
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = async (value: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setError('Could not copy to clipboard automatically. Please select and copy the URL manually.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> Hosted short-URL redirects are not currently available on ToolVerse. This utility
          runs 100% locally in your browser to validate links, append optional UTM campaign parameters, copy clean
          shareable URLs, and generate downloadable QR codes without sending data to a server.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="destination-url-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Destination URL (Must start with http:// or https://)
            </label>
            <input
              id="destination-url-input"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://example.com/landing-page"
              className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Optional UTM Campaign Parameters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="utm_source (e.g. newsletter)"
                aria-label="UTM Source"
                className="px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <input
                type="text"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="utm_medium (e.g. email)"
                aria-label="UTM Medium"
                className="px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="utm_campaign (e.g. spring_launch)"
                aria-label="UTM Campaign"
                className="px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="utm_term (optional keyword)"
                aria-label="UTM Term"
                className="px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <input
                type="text"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="utm_content (optional variant)"
                aria-label="UTM Content"
                className="px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <QrCode className="w-4 h-4" /> Generate Trackable URL &amp; QR Code
            </>
          )}
        </button>

        {currentLink && (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Generated Shareable URL:</div>
                <div className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-100 font-mono break-all">
                  {currentLink.shortUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyText(currentLink.shortUrl)}
                  className="btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
                <a
                  href={currentLink.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs flex items-center gap-1"
                  aria-label="Open generated URL in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
              </div>
            </div>

            {qrCodeUrl && (
              <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={qrCodeUrl}
                  alt="QR code linking to generated URL"
                  className="w-24 h-24 border rounded bg-white p-1"
                />
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>Scannable QR code generated locally in your browser for print, slides, and mobile sharing.</p>
                  <a
                    href={qrCodeUrl}
                    download="toolverse-url-qr.png"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500"
                  >
                    <Download className="w-3.5 h-3.5" /> Download QR PNG
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Local History */}
      {linkHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your Recent Links (Saved Locally)</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {linkHistory.map((link) => (
              <div
                key={link.id}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate min-w-0 flex-1">
                  <div className="font-mono font-bold text-brand-600 truncate">{link.shortUrl}</div>
                  <div className="text-slate-500 truncate">{link.originalUrl}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(link.shortUrl, link.id)}
                  className="btn-secondary py-1 px-2 text-[10px] flex-shrink-0"
                >
                  {copiedId === link.id ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
