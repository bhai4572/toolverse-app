'use client';

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  QrCode,
  AlertCircle,
  RefreshCw,
  Download,
  ExternalLink,
  Share2,
  Trash2,
  Link2,
  BarChart3,
} from 'lucide-react';
import {
  buildTrackedUrl,
  validateCustomAlias,
  getLocalShortLinks,
  saveLocalShortLink,
  clearLocalShortLinks,
  ShortLinkRecord,
} from '@/lib/url-shortener/client';
import { generateQrCodeDataUrl } from '@/lib/developer/engine';

export function UrlShortenerTool() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [ttlDays, setTtlDays] = useState<number>(0);
  const [showUtm, setShowUtm] = useState(false);
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
  const [shared, setShared] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshingCode, setRefreshingCode] = useState<string | null>(null);
  const [linkHistory, setLinkHistory] = useState<ShortLinkRecord[]>([]);

  useEffect(() => {
    setLinkHistory(getLocalShortLinks());
  }, []);

  const handleShorten = async () => {
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

    const aliasCheck = validateCustomAlias(customAlias);
    if (!aliasCheck.isValid) {
      setError(aliasCheck.error || 'Invalid custom alias.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          customAlias: aliasCheck.normalized || undefined,
          ttlDays,
          utm: {
            source: utmSource.trim() || undefined,
            medium: utmMedium.trim() || undefined,
            campaign: utmCampaign.trim() || undefined,
            term: utmTerm.trim() || undefined,
            content: utmContent.trim() || undefined,
          },
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;

      if (!res.ok || !data?.shortUrl) {
        const message =
          data?.error ||
          (res.status === 503
            ? 'URL shortener storage is not configured on this deployment yet.'
            : res.status === 429
            ? 'Too many requests. Please wait a moment and try again.'
            : `Unable to create short URL (HTTP ${res.status}).`);
        throw new Error(message);
      }

      const record: ShortLinkRecord = {
        id: data.id || data.code,
        code: data.code,
        alias: data.alias || data.code,
        originalUrl: data.destinationUrl || data.originalUrl || built.url,
        destinationUrl: data.destinationUrl || data.originalUrl || built.url,
        shortUrl: data.shortUrl,
        createdAt: data.createdAt || new Date().toISOString(),
        expiresAt: data.expiresAt ?? null,
        clicks: typeof data.clicks === 'number' ? data.clicks : 0,
        analyticsEnabled: Boolean(data.analyticsEnabled),
      };

      const qr = await generateQrCodeDataUrl(record.shortUrl);
      setCurrentLink(record);
      setQrCodeUrl(qr);
      saveLocalShortLink(record);
      setLinkHistory(getLocalShortLinks());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create short URL.';
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshStats = async (code: string) => {
    setRefreshingCode(code);
    try {
      const res = await fetch(`/api/shorten?code=${encodeURIComponent(code)}`);
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;
      if (res.ok && data) {
        if (currentLink && (currentLink.code === code || currentLink.alias === code)) {
          setCurrentLink((prev) =>
            prev
              ? {
                  ...prev,
                  clicks: typeof data.clicks === 'number' ? data.clicks : prev.clicks,
                  analyticsEnabled: Boolean(data.analyticsEnabled),
                }
              : prev
          );
        }
        const updatedHistory = linkHistory.map((item) =>
          item.code === code || item.alias === code
            ? {
                ...item,
                clicks: typeof data.clicks === 'number' ? data.clicks : item.clicks,
                analyticsEnabled: Boolean(data.analyticsEnabled),
              }
            : item
        );
        setLinkHistory(updatedHistory);
      }
    } catch {
      // ignore transient stats refresh errors
    } finally {
      setRefreshingCode(null);
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
      setError('Could not copy automatically. Please select and copy the short URL manually.');
    }
  };

  const shareShortUrl = async (shortUrl: string) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Short URL via ToolVerse', url: shortUrl });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // user cancelled or share unavailable — fall through to copy
      }
    }
    await copyText(shortUrl);
  };

  const handleClearHistory = () => {
    clearLocalShortLinks();
    setLinkHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="destination-url-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Long Destination URL (Must start with http:// or https://)
            </label>
            <input
              id="destination-url-input"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://example.com/very-long-article-or-campaign-link"
              className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="custom-alias-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Custom Short Alias (Optional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono whitespace-nowrap">toolverse.baby/s/</span>
                <input
                  id="custom-alias-input"
                  type="text"
                  value={customAlias}
                  onChange={(e) => {
                    setCustomAlias(e.target.value);
                    setError(null);
                  }}
                  placeholder="my-link (optional)"
                  className="flex-1 min-w-0 px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="link-expiry-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Link Expiration
              </label>
              <select
                id="link-expiry-select"
                value={ttlDays}
                onChange={(e) => setTtlDays(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value={0}>No expiration</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowUtm((prev) => !prev)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {showUtm ? 'Hide optional UTM parameters' : '+ Add optional UTM campaign parameters'}
            </button>

            {showUtm && (
              <div className="mt-3 space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="utm_source (e.g. newsletter)"
                    aria-label="UTM Source"
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    placeholder="utm_medium (e.g. email)"
                    aria-label="UTM Medium"
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="utm_campaign (e.g. launch)"
                    aria-label="UTM Campaign"
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                    placeholder="utm_term (optional)"
                    aria-label="UTM Term"
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                    placeholder="utm_content (optional)"
                    aria-label="UTM Content"
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleShorten}
          disabled={isProcessing}
          className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Link2 className="w-4 h-4" /> Shorten URL &amp; Generate QR Code
            </>
          )}
        </button>

        {currentLink && (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Your Short URL:</div>
                <div className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-100 font-mono break-all">
                  {currentLink.shortUrl}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  Destination: {currentLink.originalUrl}
                </div>
                {currentLink.expiresAt && (
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    Expires: {new Date(currentLink.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyText(currentLink.shortUrl)}
                  className="btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={() => shareShortUrl(currentLink.shortUrl)}
                  className="btn-secondary text-xs flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" /> {shared ? 'Shared' : 'Share'}
                </button>
                <a
                  href={currentLink.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs flex items-center gap-1"
                  aria-label="Test short URL redirect in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test
                </a>
              </div>
            </div>

            {currentLink.analyticsEnabled && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <BarChart3 className="w-3.5 h-3.5" /> Redirect clicks: {currentLink.clicks}
                </span>
                <button
                  type="button"
                  onClick={() => refreshStats(currentLink.code || currentLink.alias)}
                  disabled={refreshingCode === (currentLink.code || currentLink.alias)}
                  className="text-indigo-700 dark:text-indigo-300 hover:underline font-medium"
                >
                  {refreshingCode === (currentLink.code || currentLink.alias) ? 'Refreshing...' : 'Refresh count'}
                </button>
              </div>
            )}

            {qrCodeUrl && (
              <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={qrCodeUrl}
                  alt="QR code linking to short URL"
                  className="w-24 h-24 border rounded bg-white p-1"
                />
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    Scannable QR code generated locally for your short URL.
                  </p>
                  <a
                    href={qrCodeUrl}
                    download={`toolverse-${currentLink.code || 'short'}-qr.png`}
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
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Your Recent Short Links (Saved Locally)
            </div>
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {linkHistory.map((link) => (
              <div
                key={link.id}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate min-w-0 flex-1">
                  <div className="font-mono font-bold text-brand-600 truncate">{link.shortUrl}</div>
                  <div className="text-slate-500 truncate">{link.originalUrl}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {link.analyticsEnabled && (
                    <span className="text-[11px] text-slate-500 font-medium">{link.clicks} clicks</span>
                  )}
                  <button
                    type="button"
                    onClick={() => copyText(link.shortUrl, link.id)}
                    className="btn-secondary py-1 px-2 text-[10px]"
                  >
                    {copiedId === link.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
