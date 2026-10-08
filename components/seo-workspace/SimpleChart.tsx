'use client';

import React from 'react';

export interface ChartPoint {
  label: string;
  value: number;
}

/** Lightweight SVG charts — no chart library dependency. Values must be real user data. */
export function BarChart({
  data,
  height = 160,
  color = '#2563eb',
  invert = false,
  emptyLabel = 'Run a check to populate this chart (your data only).',
}: {
  data: ChartPoint[];
  height?: number;
  color?: string;
  /** Lower is better (e.g. rank positions) */
  invert?: boolean;
  emptyLabel?: string;
}) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl" style={{ height }}>
        {emptyLabel}
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = Math.max(max - (invert ? Math.min(min, 0) : 0), 1);

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${data.length * 48} ${height}`} className="w-full h-full" role="img" aria-label="Bar chart of your results">
        {data.map((d, i) => {
          const barH = invert
            ? Math.max(8, ((max - d.value + 1) / (max + 1)) * (height - 36))
            : Math.max(8, (d.value / range) * (height - 36));
          const x = i * 48 + 8;
          const y = height - 24 - barH;
          return (
            <g key={`${d.label}-${i}`}>
              <rect x={x} y={y} width={28} height={barH} rx={4} fill={color} opacity={0.85} />
              <text x={x + 14} y={height - 8} textAnchor="middle" className="fill-slate-500" fontSize="9">
                {d.label.length > 8 ? `${d.label.slice(0, 7)}…` : d.label}
              </text>
              <text x={x + 14} y={y - 4} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300" fontSize="9" fontWeight="700">
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LineChart({
  data,
  height = 160,
  color = '#0ea5e9',
  emptyLabel = 'No series yet — add your tracked data.',
}: {
  data: ChartPoint[];
  height?: number;
  color?: string;
  emptyLabel?: string;
}) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl" style={{ height }}>
        {emptyLabel}
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const pad = 16;
  const w = Math.max(280, data.length * 40);
  const innerH = height - pad * 2;
  const points = data
    .map((d, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (d.value - min) / (max - min || 1)) * innerH;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-full" role="img" aria-label="Line chart of your results">
        <polyline fill="none" stroke={color} strokeWidth="2.5" points={points} />
        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1)) * (w - pad * 2);
          const y = pad + (1 - (d.value - min) / (max - min || 1)) * innerH;
          return <circle key={i} cx={xFor(i)} cy={yFor(i)} r={3.5} fill={color} />;
          function xFor(idx: number) {
            return pad + (idx / (data.length - 1)) * (w - pad * 2);
          }
          function yFor(idx: number) {
            return pad + (1 - (data[idx].value - min) / (max - min || 1)) * innerH;
          }
        })}
        <polyline fill="none" stroke={color} strokeWidth="2.5" points={points} />
      </svg>
    </div>
  );
}

export function DonutScore({ score, label = 'Score' }: { score: number; label?: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;
  const color = clamped >= 80 ? '#059669' : clamped >= 50 ? '#d97706' : '#dc2626';
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-900 dark:text-white">{clamped}</span>
        <span className="text-[10px] uppercase font-bold text-slate-500">{label}</span>
      </div>
    </div>
  );
}
