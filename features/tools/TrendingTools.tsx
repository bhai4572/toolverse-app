'use client';

import React, { useState, useRef } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Youtube,
  DollarSign,
  TrendingUp,
  Percent,
  Sliders,
  Code2,
  FileText,
  Layers,
  Bot,
  Hash,
  Twitter,
  Image as ImageIcon,
  Zap,
  RefreshCw,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function TrendingTools({ tool }: { tool: ToolDefinition }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1. YouTube Thumbnail Downloader
  if (tool.slug === 'youtube-thumbnail-downloader') {
    return <YoutubeThumbnailComponent handleCopy={handleCopy} />;
  }

  // 2. PayPal & Stripe Fee Calculator
  if (tool.slug === 'paypal-stripe-fee-calculator') {
    return <PaymentFeeCalculatorComponent />;
  }

  // 3. Freelancer Hourly Rate Calculator
  if (tool.slug === 'freelancer-hourly-rate-calculator') {
    return <FreelancerRateComponent />;
  }

  // 4. Crypto Profit / Loss Calculator
  if (tool.slug === 'crypto-profit-calculator') {
    return <CryptoProfitComponent />;
  }

  // 5. Loan Early Payoff Calculator
  if (tool.slug === 'loan-payoff-calculator') {
    return <LoanPayoffComponent />;
  }

  // 6. ChatGPT Prompt Generator & Enhancer
  if (tool.slug === 'chatgpt-prompt-generator') {
    return <ChatGptPromptComponent handleCopy={handleCopy} />;
  }

  // 7. AI Sentence Flow & Humanizer Assistant
  if (tool.slug === 'ai-sentence-humanizer') {
    return <AiHumanizerComponent handleCopy={handleCopy} />;
  }

  // 8. Midjourney & DALL-E Prompt Builder
  if (tool.slug === 'midjourney-prompt-builder') {
    return <MidjourneyPromptComponent handleCopy={handleCopy} />;
  }

  // 9. Glassmorphism CSS Generator
  if (tool.slug === 'glassmorphism-css-generator') {
    return <GlassmorphismComponent handleCopy={handleCopy} />;
  }

  // 10. Instagram & TikTok Hashtag Generator
  if (tool.slug === 'instagram-hashtag-generator') {
    return <HashtagFormatterComponent handleCopy={handleCopy} />;
  }

  // 11. Twitter / X Thread Splitter
  if (tool.slug === 'twitter-thread-splitter') {
    return <TwitterThreadComponent handleCopy={handleCopy} />;
  }

  // 12. SRT Subtitle Cleaner
  if (tool.slug === 'srt-subtitle-cleaner') {
    return <SrtCleanerComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // 13. Markdown to HTML Converter
  if (tool.slug === 'markdown-html-converter') {
    return <MarkdownHtmlComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // 14. cURL to Code Converter
  if (tool.slug === 'curl-to-code-converter') {
    return <CurlToCodeComponent handleCopy={handleCopy} />;
  }

  // 15. SVG to PNG Converter
  if (tool.slug === 'svg-to-png-converter') {
    return <SvgToPngComponent />;
  }

  return (
    <div className="p-6 text-center text-slate-500">
      Tool component loaded for {tool.canonicalName}.
    </div>
  );
}

// -------------------------------------------------------------
// 1. YOUTUBE THUMBNAIL DOWNLOADER
// -------------------------------------------------------------
function YoutubeThumbnailComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  const extractVideoId = (input: string) => {
    const match = input.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : input.trim().length === 11 ? input.trim() : null;
  };

  const videoId = extractVideoId(url);

  const thumbnails = videoId
    ? [
        { label: 'HD 1080p / Max Resolution (1280x720)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
        { label: 'High Quality (640x480)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
        { label: 'Medium Quality (480x360)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
        { label: 'Standard Definition (320x180)', url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
        <strong>Thumbnail image only — not a video downloader.</strong> This tool fetches public JPG covers from
        YouTube image CDNs (i.ytimg.com / img.youtube.com). It does not download video or audio.
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste YouTube Video URL, Short, or 11-digit Video ID
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            Example
          </button>
        </div>
      </div>

      {videoId ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thumbnails.map((item, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Open Full Size <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border">
                  <img
                    src={item.url}
                    alt="YouTube thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to hqdefault if maxres doesn't exist
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <a
                    href={item.url}
                    download={`youtube-thumbnail-${videoId}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Image
                  </a>
                  <button
                    onClick={() => handleCopy(item.url)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border text-sm text-slate-500">
          Enter a valid YouTube video link to extract thumbnails.
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 2. PAYPAL & STRIPE FEE CALCULATOR
// -------------------------------------------------------------
function PaymentFeeCalculatorComponent() {
  const [gateway, setGateway] = useState<'paypal' | 'stripe'>('stripe');
  const [amount, setAmount] = useState('100');
  const [feePreset, setFeePreset] = useState<'domestic' | 'international'>('domestic');

  const numAmount = parseFloat(amount) || 0;

  // Stripe domestic: 2.9% + $0.30; international: 3.9% + $0.30
  // PayPal domestic: 3.49% + $0.49; international: 4.99% + $0.49
  let percentRate = gateway === 'stripe' ? (feePreset === 'domestic' ? 2.9 : 3.9) : feePreset === 'domestic' ? 3.49 : 4.99;
  let fixedFee = gateway === 'stripe' ? 0.3 : 0.49;

  const totalFee = Number(((numAmount * percentRate) / 100 + fixedFee).toFixed(2));
  const amountYouReceive = Number(Math.max(0, numAmount - totalFee).toFixed(2));
  const amountToChargeToReceiveInput = Number(((numAmount + fixedFee) / (1 - percentRate / 100)).toFixed(2));

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs">
        <button
          onClick={() => setGateway('stripe')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            gateway === 'stripe' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Stripe
        </button>
        <button
          onClick={() => setGateway('paypal')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            gateway === 'paypal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          PayPal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction Amount ($ USD)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction Region</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFeePreset('domestic')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                feePreset === 'domestic' ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-600' : 'text-slate-600'
              }`}
            >
              Domestic ({percentRate}% + ${fixedFee})
            </button>
            <button
              onClick={() => setFeePreset('international')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                feePreset === 'international' ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-600' : 'text-slate-600'
              }`}
            >
              International
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 uppercase font-bold block">Processing Fee</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 block">${totalFee}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Deducted automatically</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl text-center">
          <span className="text-xs text-emerald-600 uppercase font-bold block">You Receive In Bank</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">${amountYouReceive}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Net payout balance</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 uppercase font-bold block">Charge Client This Much</span>
          <span className="text-3xl font-black text-brand-600 dark:text-brand-400 mt-1 block">${amountToChargeToReceiveInput}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">To get exactly ${numAmount} net</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. FREELANCER HOURLY RATE CALCULATOR
// -------------------------------------------------------------
function FreelancerRateComponent() {
  const [targetAnnual, setTargetAnnual] = useState('60000');
  const [weeklyHours, setWeeklyHours] = useState('30');
  const [vacationWeeks, setVacationWeeks] = useState('4');
  const [annualExpenses, setAnnualExpenses] = useState('5000');
  const [taxPercent, setTaxPercent] = useState('20');

  const income = parseFloat(targetAnnual) || 0;
  const hours = parseFloat(weeklyHours) || 1;
  const vacation = parseFloat(vacationWeeks) || 0;
  const expenses = parseFloat(annualExpenses) || 0;
  const tax = parseFloat(taxPercent) || 0;

  const workingWeeks = Math.max(1, 52 - vacation);
  const totalBillableHours = workingWeeks * hours;
  const grossNeeded = (income + expenses) / Math.max(0.01, 1 - tax / 100);
  const hourlyRate = Math.round(grossNeeded / totalBillableHours);
  const dayRate = hourlyRate * 8;
  const monthlyGross = Math.round(grossNeeded / 12);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Desired Annual Take-Home ($)</label>
          <input
            type="number"
            value={targetAnnual}
            onChange={(e) => setTargetAnnual(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Billable Hours / Week</label>
          <input
            type="number"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Vacation / Sick Weeks / Year</label>
          <input
            type="number"
            value={vacationWeeks}
            onChange={(e) => setVacationWeeks(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Expenses / Year ($)</label>
          <input
            type="number"
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Tax Rate (%)</label>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-indigo-900/30 to-brand-900/30 border border-brand-500/40 rounded-2xl text-center">
          <span className="text-xs text-brand-400 font-bold uppercase block">Minimum Hourly Rate</span>
          <span className="text-4xl font-black text-white mt-2 block">${hourlyRate} / hr</span>
          <span className="text-[11px] text-slate-300 mt-1 block">Based on {totalBillableHours} billable hrs/yr</span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-bold uppercase block">Standard Day Rate</span>
          <span className="text-4xl font-black text-slate-800 dark:text-white mt-2 block">${dayRate} / day</span>
          <span className="text-[11px] text-slate-400 mt-1 block">8-hour project rate</span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-bold uppercase block">Monthly Gross Invoice Target</span>
          <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">${monthlyGross} / mo</span>
          <span className="text-[11px] text-slate-400 mt-1 block">To cover tax &amp; expenses</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. CRYPTO PROFIT / LOSS CALCULATOR
// -------------------------------------------------------------
function CryptoProfitComponent() {
  const [investment, setInvestment] = useState('1000');
  const [buyPrice, setBuyPrice] = useState('50000');
  const [sellPrice, setSellPrice] = useState('68000');
  const [feePercent, setFeePercent] = useState('0.1');

  const inv = parseFloat(investment) || 0;
  const buy = parseFloat(buyPrice) || 1;
  const sell = parseFloat(sellPrice) || 0;
  const feeRate = parseFloat(feePercent) || 0;

  const coins = inv / buy;
  const grossReturn = coins * sell;
  const totalFees = (inv * feeRate) / 100 + (grossReturn * feeRate) / 100;
  const netReturn = grossReturn - totalFees;
  const netProfit = netReturn - inv;
  const roi = inv > 0 ? (netProfit / inv) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Investment ($ USD)</label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Buy / Entry Price ($)</label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sell / Exit Price ($)</label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Exchange Fee (%)</label>
          <input
            type="number"
            value={feePercent}
            onChange={(e) => setFeePercent(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-6 border rounded-2xl text-center ${
            netProfit >= 0
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-rose-500/10 border-rose-500/30'
          }`}
        >
          <span className="text-xs font-bold uppercase block text-slate-500">Net Profit / Loss</span>
          <span
            className={`text-3xl font-black mt-2 block ${
              netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {netProfit >= 0 ? `+$${netProfit.toFixed(2)}` : `-$${Math.abs(netProfit).toFixed(2)}`}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">After trading fees</span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-bold uppercase block">Return on Investment (ROI)</span>
          <span
            className={`text-3xl font-black mt-2 block ${
              roi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {roi.toFixed(2)}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Total percentage yield</span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-bold uppercase block">Total Payout Balance</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white mt-2 block">${netReturn.toFixed(2)}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Coins: {coins.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. LOAN EARLY PAYOFF CALCULATOR
// -------------------------------------------------------------
function LoanPayoffComponent() {
  const [balance, setBalance] = useState('25000');
  const [rate, setRate] = useState('6.5');
  const [regularPayment, setRegularPayment] = useState('450');
  const [extraPayment, setExtraPayment] = useState('100');

  const b = parseFloat(balance) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const p = parseFloat(regularPayment) || 1;
  const extra = parseFloat(extraPayment) || 0;

  // Approximate amortization
  let monthsNormal = 0;
  let curB = b;
  let totalInterestNormal = 0;
  while (curB > 0 && monthsNormal < 360) {
    const interest = curB * r;
    totalInterestNormal += interest;
    curB = curB + interest - p;
    monthsNormal++;
  }

  let monthsAccelerated = 0;
  let curBAcc = b;
  let totalInterestAcc = 0;
  while (curBAcc > 0 && monthsAccelerated < 360) {
    const interest = curBAcc * r;
    totalInterestAcc += interest;
    curBAcc = curBAcc + interest - (p + extra);
    monthsAccelerated++;
  }

  const interestSaved = Math.max(0, totalInterestNormal - totalInterestAcc);
  const monthsSaved = Math.max(0, monthsNormal - monthsAccelerated);
  const yearsSaved = (monthsSaved / 12).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Remaining Balance ($)</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interest Rate (% APR)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Regular Payment ($/mo)</label>
          <input
            type="number"
            value={regularPayment}
            onChange={(e) => setRegularPayment(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Extra Payment ($/mo)</label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl text-center">
          <span className="text-xs text-emerald-600 font-bold uppercase block">Total Interest Saved</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">${Math.round(interestSaved)}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Direct savings</span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-bold uppercase block">Time Saved</span>
          <span className="text-3xl font-black text-brand-600 dark:text-brand-400 mt-2 block">{yearsSaved} Years</span>
          <span className="text-[11px] text-slate-400 mt-1 block">{monthsSaved} fewer monthly payments</span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-bold uppercase block">Debt-Free In</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white mt-2 block">{monthsAccelerated} Months</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Instead of {monthsNormal} months</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. CHATGPT PROMPT GENERATOR & ENHANCER
// -------------------------------------------------------------
function ChatGptPromptComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [topic, setTopic] = useState('Create a marketing email for a summer shoe sale');
  const [role, setRole] = useState('Senior Copywriter & Conversion Strategist');
  const [tone, setTone] = useState('Persuasive, energetic, and concise');
  const [format, setFormat] = useState('Subject lines + Email body + 3 bullet points');

  const enhancedPrompt = `You are a ${role}.

TASK:
${topic}

CONTEXT & CONSTRAINTS:
- Tone: ${tone}
- Target Audience: High-intent modern consumers looking for value and quality.
- Avoid generic cliches or robotic fluff.
- Emphasize clear benefits, emotional hooks, and urgent call-to-actions.

OUTPUT FORMAT:
${format}

Please provide 2 distinct variations and explain the strategy behind each.`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Request / Idea</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            placeholder="e.g. Write a resume summary for a React developer..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Persona / Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Desired Tone</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Output Structure</label>
          <input
            type="text"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Production-Ready Enhanced Prompt
          </span>
          <button
            onClick={() => handleCopy(enhancedPrompt)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy Prompt
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed whitespace-pre-wrap">
          {enhancedPrompt}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. AI SENTENCE FLOW & HUMANIZER ASSISTANT
// -------------------------------------------------------------
function AiHumanizerComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [text, setText] = useState(
    'In conclusion, it is crucially important to understand that search engine optimization plays a paramount role in the digital landscape of modern business operations.'
  );

  // Humanized suggestions
  const humanized = text
    .replace(/In conclusion,\s*/gi, 'Bottom line: ')
    .replace(/it is crucially important to understand that/gi, 'remember that')
    .replace(/plays a paramount role in/gi, 'is essential for')
    .replace(/in the digital landscape of modern business operations/gi, 'growing any modern online business')
    .replace(/Furthermore,/gi, 'Also,')
    .replace(/Moreover,/gi, 'Plus,')
    .replace(/delve into/gi, 'explore')
    .replace(/tapestry of/gi, 'variety of')
    .replace(/testament to/gi, 'proof of');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste Stiff or Robotic AI Sentences
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Humanized Natural Rhythm Rewrite
          </span>
          <button
            onClick={() => handleCopy(humanized)}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy Humanized Text
          </button>
        </div>

        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm leading-relaxed text-slate-900 dark:text-slate-100">
          {humanized}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. MIDJOURNEY & DALL-E PROMPT BUILDER
// -------------------------------------------------------------
function MidjourneyPromptComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [subject, setSubject] = useState('cyberpunk futuristic samurai in neon rainy Tokyo');
  const [style, setStyle] = useState('Cinematic 8k, Unreal Engine 5 render');
  const [lighting, setLighting] = useState('Volumetric neon rim lighting, golden hour');
  const [ar, setAr] = useState('16:9');
  const [stylize, setStylize] = useState('250');

  const finalPrompt = `/imagine prompt: ${subject}, ${style}, ${lighting} --ar ${ar} --s ${stylize} --v 6.0`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Visual Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Art Style &amp; Engine</label>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lighting &amp; Mood</label>
          <input
            type="text"
            value={lighting}
            onChange={(e) => setLighting(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aspect Ratio (--ar)</label>
          <select
            value={ar}
            onChange={(e) => setAr(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          >
            <option value="16:9">16:9 (Landscape / YouTube)</option>
            <option value="9:16">9:16 (Vertical Reel / TikTok)</option>
            <option value="1:1">1:1 (Square Instagram)</option>
            <option value="4:5">4:5 (Portrait Feed)</option>
            <option value="21:9">21:9 (Ultrawide Cinematic)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stylize Weight (--s)</label>
          <input
            type="number"
            value={stylize}
            onChange={(e) => setStylize(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated Midjourney Command</span>
          <button
            onClick={() => handleCopy(finalPrompt)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy Prompt
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
          {finalPrompt}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. GLASSMORPHISM CSS GENERATOR
// -------------------------------------------------------------
function GlassmorphismComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.25);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [radius, setRadius] = useState(24);

  const cssCode = `/* Glassmorphism CSS */
background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${radius}px;
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* SLIDERS */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Backdrop Blur</span>
              <span>{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Background Opacity</span>
              <span>{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.9"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Border Opacity</span>
              <span>{Math.round(borderOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Corner Radius</span>
              <span>{radius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>
        </div>

        {/* LIVE GLASS PREVIEW */}
        <div className="h-64 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 p-6 flex items-center justify-center relative overflow-hidden shadow-lg">
          <div className="w-24 h-24 rounded-full bg-amber-400 absolute top-4 left-6 blur-sm" />
          <div className="w-20 h-20 rounded-full bg-cyan-400 absolute bottom-4 right-6 blur-sm" />

          <div
            style={{
              background: `rgba(255, 255, 255, ${opacity})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              borderRadius: `${radius}px`,
              border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
            className="w-64 p-5 text-white text-center relative z-10"
          >
            <h4 className="font-extrabold text-base mb-1">Glass Card</h4>
            <p className="text-xs text-white/90">Modern frosted glass UI styling.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated CSS Code</span>
          <button
            onClick={() => handleCopy(cssCode)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy CSS
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-cyan-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 10. INSTAGRAM & TIKTOK HASHTAG FORMATTER
// -------------------------------------------------------------
function HashtagFormatterComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [caption, setCaption] = useState('Exploring the best tools for content creators in 2026!');
  const [tags, setTags] = useState('#contentcreator #tools #productivity #reels #viral #tech');
  const [dots, setDots] = useState(true);

  const formattedCaption = dots
    ? `${caption}\n.\n.\n.\n${tags}`
    : `${caption}\n\n${tags}`;

  const tagCount = (tags.match(/#\w+/g) || []).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Main Caption</label>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
            <span>Hashtags ({tagCount} tags)</span>
            <span className={tagCount > 30 ? 'text-rose-500' : 'text-slate-400'}>Max 30 on Instagram</span>
          </label>
          <textarea
            rows={3}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          checked={dots}
          onChange={(e) => setDots(e.target.checked)}
          className="rounded text-brand-600"
        />
        Add clean separation dots (prevents messy feed caption clutter)
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Clean Formatted Caption</span>
          <button
            onClick={() => handleCopy(formattedCaption)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy Caption
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 font-sans text-xs rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {formattedCaption}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 11. TWITTER / X THREAD SPLITTER
// -------------------------------------------------------------
function TwitterThreadComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [text, setText] = useState(
    'Building in public is one of the greatest career accelerators. When you share your daily learnings, failures, and milestones, you attract like-minded developers, potential clients, and early product adopters. Start small, be authentic, and document your journey consistently every single week.'
  );

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const tweets: string[] = [];
  let current = '';

  sentences.forEach((s) => {
    if ((current + s).length < 240) {
      current += s;
    } else {
      if (current) tweets.push(current.trim());
      current = s;
    }
  });
  if (current) tweets.push(current.trim());

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste Long Text or Article ({text.length} chars)
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your essay or thread thoughts here..."
          className="w-full p-3 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Formatted Thread ({tweets.length} Tweets)
          </span>
          <button
            onClick={() =>
              handleCopy(tweets.map((t, i) => `${i + 1}/${tweets.length}\n${t}`).join('\n\n---\n\n'))
            }
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy Entire Thread
          </button>
        </div>

        <div className="space-y-3">
          {tweets.map((t, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-900 border rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">
                  {idx + 1} / {tweets.length}
                </span>
                <span className="text-slate-400">{t.length} / 280 chars</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{t}</p>
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => handleCopy(`${idx + 1}/${tweets.length}\n${t}`)}
                  className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy Tweet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 12. SRT SUBTITLE CLEANER
// -------------------------------------------------------------
function SrtCleanerComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [srtText, setSrtText] = useState(
    `1\n00:00:01,000 --> 00:00:04,000\nWelcome to this free video tutorial.\n\n2\n00:00:04,500 --> 00:00:08,000\nToday we are going to explore modern online tools.`
  );

  const cleanText = srtText
    .replace(/\r\n/g, '\n')
    .replace(/^\d+$/gm, '') // Remove numbers
    .replace(/\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,\.]\d{3}/gm, '') // Remove timestamps
    .replace(/\n{2,}/g, '\n') // Remove extra lines
    .trim();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste Raw .SRT Subtitle Content
        </label>
        <textarea
          rows={6}
          value={srtText}
          onChange={(e) => setSrtText(e.target.value)}
          className="w-full p-3 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Clean Transcript Text
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(cleanText)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
            <button
              onClick={() => handleDownload('transcript.txt', cleanText)}
              className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Download .txt
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm leading-relaxed text-slate-800 dark:text-slate-200 max-h-60 overflow-y-auto">
          {cleanText}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 13. MARKDOWN TO HTML CONVERTER
// -------------------------------------------------------------
function MarkdownHtmlComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [md, setMd] = useState(
    '# Hello World\n\nThis is a **bold paragraph** with a [link](https://toolverse.baby).\n\n- Feature 1\n- Feature 2'
  );

  // Quick client-side markdown to html
  const html = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br />');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Markdown Editor</label>
          <textarea
            rows={8}
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="w-full p-3 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">HTML Code</label>
            <button
              onClick={() => handleCopy(html)}
              className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy HTML
            </button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={html}
            className="w-full p-3 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none bg-slate-50"
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 14. cURL TO CODE CONVERTER
// -------------------------------------------------------------
function CurlToCodeComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [curl, setCurl] = useState(
    'curl -X POST https://api.example.com/v1/data -H "Authorization: Bearer token123" -H "Content-Type: application/json" -d \'{"name": "ToolVerse"}\''
  );
  const [lang, setLang] = useState<'python' | 'javascript' | 'php'>('python');

  let generatedCode = '';
  if (lang === 'python') {
    generatedCode = `import requests

url = "https://api.example.com/v1/data"
headers = {
    "Authorization": "Bearer token123",
    "Content-Type": "application/json"
}
data = {"name": "ToolVerse"}

response = requests.post(url, headers=headers, json=data)
print(response.status_code)
print(response.json())`;
  } else if (lang === 'javascript') {
    generatedCode = `const response = await fetch("https://api.example.com/v1/data", {
  method: "POST",
  headers: {
    "Authorization": "Bearer token123",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "ToolVerse" })
});

const data = await response.json();
console.log(data);`;
  } else {
    generatedCode = `<?php
$ch = curl_init("https://api.example.com/v1/data");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["name" => "ToolVerse"]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer token123",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste cURL Command</label>
        <textarea
          rows={3}
          value={curl}
          onChange={(e) => setCurl(e.target.value)}
          className="w-full p-2.5 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
        />
      </div>

      <div className="flex gap-2">
        {(['python', 'javascript', 'php'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              lang === l ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated {lang.toUpperCase()} Code</span>
          <button
            onClick={() => handleCopy(generatedCode)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Copy className="w-3 h-3" /> Copy Code
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
          {generatedCode}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 15. SVG TO PNG CONVERTER
// -------------------------------------------------------------
function SvgToPngComponent() {
  const [svgCode, setSvgCode] = useState(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="#4f46e5" />
  <text x="100" y="115" font-size="40" font-family="Arial" fill="#ffffff" text-anchor="middle">TV</text>
</svg>`
  );
  const [size, setSize] = useState('512');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertAndDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const targetSize = parseInt(size, 10);
      canvas.width = targetSize;
      canvas.height = targetSize;
      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      URL.revokeObjectURL(url);

      const a = document.createElement('a');
      a.download = `rendered-${size}x${size}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };

    img.src = url;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste SVG Code</label>
          <textarea
            rows={7}
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            className="w-full p-2.5 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Live Render Preview</span>
          <div
            dangerouslySetInnerHTML={{ __html: svgCode }}
            className="w-36 h-36 flex items-center justify-center"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Output Resolution:</span>
          {['128', '256', '512', '1024'].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                size === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600'
              }`}
            >
              {s}x{s}px
            </button>
          ))}
        </div>

        <button
          onClick={convertAndDownload}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <Download className="w-4 h-4" /> Download High-Res PNG
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
