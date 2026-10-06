'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Copy, Check, Barcode, RefreshCw, Layers } from 'lucide-react';

export function BarcodeGeneratorTool() {
  const [text, setText] = useState('TOOLVERSE-12345');
  const [format, setFormat] = useState<'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14'>('CODE128');
  const [lineColor, setLineColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!text.trim()) {
      setError('Please enter data or text to encode.');
      setDataUrl(null);
      return;
    }

    try {
      setError(null);
      if (canvasRef.current) {
        JsBarcode(canvasRef.current, text, {
          format,
          lineColor,
          background: backgroundColor,
          width,
          height,
          displayValue,
          fontSize,
          margin: 10,
          valid: (valid) => {
            if (!valid) {
              setError(`Invalid value for ${format} format.`);
            } else {
              setError(null);
            }
          },
        });
        setDataUrl(canvasRef.current.toDataURL('image/png'));
      }
    } catch (err: any) {
      setError(err?.message || `The value "${text}" is not valid for format ${format}.`);
      setDataUrl(null);
    }
  }, [text, format, lineColor, backgroundColor, width, height, displayValue, fontSize]);

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `barcode-${format.toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy to clipboard failed', err);
    }
  };

  const handleFormatChange = (newFormat: typeof format) => {
    setFormat(newFormat);
    if (newFormat === 'EAN13' && (!/^\d{12,13}$/.test(text))) {
      setText('9780201379624');
    } else if (newFormat === 'EAN8' && (!/^\d{7,8}$/.test(text))) {
      setText('90311017');
    } else if (newFormat === 'UPC' && (!/^\d{11,12}$/.test(text))) {
      setText('123456789012');
    } else if (newFormat === 'ITF14' && (!/^\d{13,14}$/.test(text))) {
      setText('10012345678902');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Configuration Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Barcode Format / Symbology:
            </label>
            <select
              value={format}
              onChange={(e) => handleFormatChange(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value="CODE128">Code 128 (Alphanumeric & Text - Most Common)</option>
              <option value="CODE39">Code 39 (Letters, Digits & Symbols)</option>
              <option value="EAN13">EAN-13 (13-Digit International Standard)</option>
              <option value="EAN8">EAN-8 (8-Digit Compact Standard)</option>
              <option value="UPC">UPC-A (12-Digit Retail Barcode)</option>
              <option value="ITF14">ITF-14 (14-Digit Shipping Container)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Barcode Value / Data:
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or numbers..."
              className="w-full px-4 py-2.5 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
            {format === 'EAN13' && (
              <p className="text-[11px] text-slate-500 mt-1">EAN-13 requires exactly 12 or 13 numeric digits.</p>
            )}
            {format === 'EAN8' && (
              <p className="text-[11px] text-slate-500 mt-1">EAN-8 requires exactly 7 or 8 numeric digits.</p>
            )}
            {format === 'UPC' && (
              <p className="text-[11px] text-slate-500 mt-1">UPC-A requires exactly 11 or 12 numeric digits.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bar Width (px):
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500">{width}px</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bar Height (px):
              </label>
              <input
                type="range"
                min="30"
                max="150"
                step="5"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500">{height}px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bar Color:
              </label>
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-full h-9 border rounded-lg cursor-pointer bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Background Color:
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-9 border rounded-lg cursor-pointer bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={displayValue}
                onChange={(e) => setDisplayValue(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-brand-600"></div>
            </label>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Show text label below barcode
            </span>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live Barcode Preview
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-center overflow-x-auto max-w-full">
            <canvas ref={canvasRef} />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {dataUrl && !error && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadPng}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download PNG Barcode
              </button>

              <button
                onClick={handleCopyImage}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Image!' : 'Copy Image'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
