import { describe, it, expect } from 'vitest';
import { parseGscCsv } from '../lib/seo/importers/gscCsvParser';

describe('Google Search Console CSV Parser', () => {
  it('handles empty or header-only csv gracefully', () => {
    const report = parseGscCsv('');
    expect(report.rows).toHaveLength(0);
    expect(report.totalClicks).toBe(0);

    const headerOnly = parseGscCsv('Top queries,Clicks,Impressions,CTR,Position\n');
    expect(headerOnly.rows).toHaveLength(0);
  });

  it('parses official GSC export format with percentage strings and quoted cells', () => {
    const sampleCsv = `Top queries,Clicks,Impressions,CTR,Position
"best seo audit tool",45,1200,3.75%,4.2
"free pdf merge online",120,4000,3.0%,2.1
"keyword density calculator",8,950,0.84%,8.5
"rank tracking software",0,500,0.0%,18.4`;

    const report = parseGscCsv(sampleCsv);
    expect(report.rows).toHaveLength(4);
    expect(report.totalClicks).toBe(173);
    expect(report.totalImpressions).toBe(6650);

    const first = report.rows[0];
    expect(first.query).toBe('best seo audit tool');
    expect(first.clicks).toBe(45);
    expect(first.impressions).toBe(1200);
    expect(first.ctr).toBe(3.8);
    expect(first.position).toBe(4.2);
  });

  it('correctly identifies high-opportunity queries with low CTR in top 20', () => {
    const sampleCsv = `Top queries,Clicks,Impressions,CTR,Position
"low ctr page one term",5,2500,0.2%,6.1
"high ctr term",300,1000,30.0%,1.2
"page 8 query",0,200,0.0%,75.0`;

    const report = parseGscCsv(sampleCsv);
    expect(report.opportunities).toHaveLength(1);
    expect(report.opportunities[0].query).toBe('low ctr page one term');
  });
});
