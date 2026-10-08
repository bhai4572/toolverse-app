'use client';

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { generateQrCodeDataUrl } from '@/lib/developer/engine';

type Mode = 'text' | 'wifi';

function buildWifiPayload(ssid: string, password: string, encryption: string, hidden: boolean) {
  const esc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
  const t = encryption === 'nopass' ? 'nopass' : encryption;
  const p = encryption === 'nopass' ? '' : `P:${esc(password)};`;
  const h = hidden ? 'H:true;' : '';
  return `WIFI:T:${t};S:${esc(ssid)};${p}${h};`;
}

export function QrCodeGeneratorTool({ defaultMode = 'text' }: { defaultMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [text, setText] = useState('https://toolverse.baby');
  const [ssid, setSsid] = useState('GuestWiFi');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [hidden, setHidden] = useState(false);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const payload =
    mode === 'wifi' ? buildWifiPayload(ssid, password, encryption, hidden) : text;

  useEffect(() => {
    if (!payload.trim()) {
      setQrDataUrl(null);
      return;
    }
    generateQrCodeDataUrl(payload, { width: 300, darkColor, lightColor })
      .then(setQrDataUrl)
      .catch((err) => console.error(err));
  }, [payload, darkColor, lightColor]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${mode === 'text' ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}
          >
            URL / text
          </button>
          <button
            type="button"
            onClick={() => setMode('wifi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${mode === 'wifi' ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}
          >
            Wi‑Fi QR
          </button>
        </div>

        {mode === 'text' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter URL or text to encode
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Network name (SSID)</label>
              <input value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Encryption</label>
              <select value={encryption} onChange={(e) => setEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')} className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (no password)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={encryption === 'nopass'}
                className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-50"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
              Hidden network
            </label>
            <p className="sm:col-span-2 text-[11px] text-slate-500">
              Guests scan to join Wi‑Fi without typing the password. Payload stays in your browser when you generate the PNG.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Foreground</label>
            <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="w-full h-10 border rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Background</label>
            <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="w-full h-10 border rounded-lg cursor-pointer" />
          </div>
        </div>

        {qrDataUrl && (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-4">
            <img
              src={qrDataUrl}
              alt={mode === 'wifi' ? 'Wi-Fi QR code preview' : 'Generated QR code preview'}
              className="w-56 h-56 border rounded-lg shadow-sm bg-white p-2"
              loading="lazy"
            />
            <a
              href={qrDataUrl}
              download={mode === 'wifi' ? 'wifi-qr.png' : 'qrcode.png'}
              className="btn-primary text-xs flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4" /> Download PNG
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
