/**
 * Official Google Search Console (GSC) Performance CSV Parser
 * Handles official exports (Queries.csv, Pages.csv, Devices.csv, Countries.csv)
 * Identifies high-opportunity keywords (high impressions, low CTR, positions 4-20).
 */

import type { GscPerformanceRow } from '../workspace/workspaceTypes';

export interface GscParsedReport {
  rows: GscPerformanceRow[];
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  opportunities: GscPerformanceRow[];
}

export function parseGscCsv(csvContent: string): GscParsedReport {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) {
    return {
      rows: [],
      totalClicks: 0,
      totalImpressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      opportunities: [],
    };
  }

  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());

  // Find column indices
  const queryIdx = headers.findIndex((h) => h.includes('query') || h.includes('top queries'));
  const pageIdx = headers.findIndex((h) => h.includes('page') || h.includes('top pages'));
  const clicksIdx = headers.findIndex((h) => h.includes('click'));
  const impressionsIdx = headers.findIndex((h) => h.includes('impression'));
  const ctrIdx = headers.findIndex((h) => h.includes('ctr'));
  const positionIdx = headers.findIndex((h) => h.includes('position'));

  const rows: GscPerformanceRow[] = [];
  let totalClicks = 0;
  let totalImpressions = 0;

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split on comma while respecting quotes
    const cells = rawLine
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((c) => c.replace(/^["']|["']$/g, '').trim());

    const query = queryIdx >= 0 ? cells[queryIdx] || '' : '';
    const page = pageIdx >= 0 ? cells[pageIdx] || '' : '';
    const clicks = clicksIdx >= 0 ? parseInt(cells[clicksIdx], 10) || 0 : 0;
    const impressions = impressionsIdx >= 0 ? parseInt(cells[impressionsIdx], 10) || 0 : 0;

    let ctr = 0;
    if (ctrIdx >= 0 && cells[ctrIdx]) {
      const rawCtr = cells[ctrIdx].replace('%', '');
      const parsed = parseFloat(rawCtr);
      ctr = !isNaN(parsed) ? (parsed <= 1 && cells[ctrIdx].indexOf('%') === -1 ? parsed * 100 : parsed) : 0;
    } else if (impressions > 0) {
      ctr = (clicks / impressions) * 100;
    }

    const position = positionIdx >= 0 ? parseFloat(cells[positionIdx]) || 100 : 100;

    if (query || page) {
      rows.push({
        query: query || page,
        page: page || undefined,
        clicks,
        impressions,
        ctr: Math.round(ctr * 10) / 10,
        position: Math.round(position * 10) / 10,
      });
      totalClicks += clicks;
      totalImpressions += impressions;
    }
  }

  const avgCtr =
    totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 1000) / 10 : 0;
  const avgPosition =
    rows.length > 0
      ? Math.round((rows.reduce((sum, r) => sum + r.position, 0) / rows.length) * 10) / 10
      : 0;

  // Identify High Opportunity Queries:
  // Ranked within top 20, meaningful impressions, and CTR below 3.5%
  const opportunities = rows
    .filter(
      (r) =>
        r.position >= 3 &&
        r.position <= 20 &&
        r.impressions >= 10 &&
        r.ctr < 3.5
    )
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  return {
    rows,
    totalClicks,
    totalImpressions,
    avgCtr,
    avgPosition,
    opportunities,
  };
}
