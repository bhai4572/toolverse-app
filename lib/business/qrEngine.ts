import { Business } from './types';

export type QRTemplate = 'Minimal' | 'Premium' | 'Dark' | 'Light' | 'Leader' | 'Verified';

export interface QRBadgeOptions {
  template: QRTemplate;
  showStatus: boolean;
  showCategory: boolean;
  customTagline?: string;
}

export function getPermanentBusinessQRUrl(businessId: string): string {
  return `https://toolverse.baby/b/${businessId}`;
}

export function formatRankingSnapshotLabel(business: Business): string {
  if (business.rankingPosition && business.rankingPosition <= 3) {
    const dateStr = business.rankingSnapshotDate || new Date().toISOString().split('T')[0];
    return `#${business.rankingPosition} in ${business.categoryName} (Ranked on ${dateStr})`;
  }
  if (business.isVerified) {
    return 'Verified Toolverse Business';
  }
  return 'Registered Toolverse Digital Identity';
}

/**
 * Generate lightweight SVG QR Identity badge string for display or vector export.
 */
export function generateSVGQRBadge(business: Business, options: QRBadgeOptions): string {
  const qrTarget = getPermanentBusinessQRUrl(business.id);
  const isDark = options.template === 'Dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const accentColor = isDark ? '#818cf8' : '#4f46e5';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';

  const statusLabel = formatRankingSnapshotLabel(business);
  const sanitizedName = business.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedCategory = business.categoryName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
  <defs>
    <style>
      .bg { fill: ${bgColor}; rx: 24px; }
      .border { stroke: ${borderColor}; stroke-width: 2px; fill: none; }
      .title { font-family: system-ui, -apple-system, sans-serif; font-weight: 900; font-size: 22px; fill: ${textColor}; text-anchor: middle; }
      .subtitle { font-family: system-ui, -apple-system, sans-serif; font-weight: 700; font-size: 13px; fill: ${accentColor}; text-anchor: middle; }
      .status { font-family: system-ui, -apple-system, sans-serif; font-weight: 600; font-size: 11px; fill: #10b981; text-anchor: middle; }
      .footer { font-family: system-ui, -apple-system, sans-serif; font-size: 11px; fill: #64748b; text-anchor: middle; }
      .qr-bg { fill: ${isDark ? '#1e293b' : '#f8fafc'}; rx: 16px; }
    </style>
  </defs>

  <rect width="400" height="520" class="bg" />
  <rect width="396" height="516" x="2" y="2" rx="22" class="border" />

  <!-- Header Branding -->
  <text x="200" y="44" class="subtitle">TOOLVERSE DIGITAL IDENTITY</text>
  <text x="200" y="78" class="title">${sanitizedName}</text>

  <!-- QR Frame Container -->
  <rect x="70" y="100" width="260" height="260" class="qr-bg" />

  <!-- QR Finder Patterns & Matrix Placeholder -->
  <g transform="translate(90, 120)">
    <!-- Top-Left Finder -->
    <rect x="0" y="0" width="50" height="50" fill="${textColor}" rx="8" />
    <rect x="8" y="8" width="34" height="34" fill="${bgColor}" rx="4" />
    <rect x="16" y="16" width="18" height="18" fill="${accentColor}" rx="2" />

    <!-- Top-Right Finder -->
    <rect x="170" y="0" width="50" height="50" fill="${textColor}" rx="8" />
    <rect x="178" y="8" width="34" height="34" fill="${bgColor}" rx="4" />
    <rect x="186" y="16" width="18" height="18" fill="${accentColor}" rx="2" />

    <!-- Bottom-Left Finder -->
    <rect x="0" y="170" width="50" height="50" fill="${textColor}" rx="8" />
    <rect x="8" y="178" width="34" height="34" fill="${bgColor}" rx="4" />
    <rect x="16" y="186" width="18" height="18" fill="${accentColor}" rx="2" />

    <!-- Decorative Matrix Dots -->
    <circle cx="80" cy="30" r="5" fill="${textColor}" />
    <circle cx="100" cy="30" r="5" fill="${accentColor}" />
    <circle cx="120" cy="30" r="5" fill="${textColor}" />
    <circle cx="140" cy="30" r="5" fill="${textColor}" />
    
    <circle cx="30" cy="80" r="5" fill="${textColor}" />
    <circle cx="30" cy="100" r="5" fill="${accentColor}" />
    <circle cx="30" cy="120" r="5" fill="${textColor}" />
    <circle cx="30" cy="140" r="5" fill="${textColor}" />

    <circle cx="80" cy="80" r="6" fill="${textColor}" />
    <circle cx="110" cy="110" r="8" fill="${accentColor}" />
    <circle cx="140" cy="140" r="6" fill="${textColor}" />

    <circle cx="190" cy="80" r="5" fill="${textColor}" />
    <circle cx="190" cy="110" r="5" fill="${accentColor}" />
    <circle cx="190" cy="140" r="5" fill="${textColor}" />

    <circle cx="80" cy="190" r="5" fill="${textColor}" />
    <circle cx="110" cy="190" r="5" fill="${accentColor}" />
    <circle cx="140" cy="190" r="5" fill="${textColor}" />

    <!-- Center Toolverse Icon -->
    <rect x="90" y="90" width="40" height="40" fill="${bgColor}" rx="10" stroke="${accentColor}" stroke-width="2" />
    <text x="110" y="115" font-family="sans-serif" font-weight="bold" font-size="16" fill="${accentColor}" text-anchor="middle">TV</text>
  </g>

  <!-- Status & Instructions -->
  ${options.showStatus ? `<text x="200" y="390" class="status">✓ ${statusLabel}</text>` : ''}
  ${options.showCategory ? `<text x="200" y="415" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${sanitizedCategory}</text>` : ''}

  <text x="200" y="450" font-family="sans-serif" font-weight="700" font-size="14" fill="${textColor}" text-anchor="middle">Scan to Discover &amp; Review</text>
  <text x="200" y="475" class="footer">ID: ${business.id} &bull; toolverse.baby/b/${business.id}</text>
</svg>`;
}
