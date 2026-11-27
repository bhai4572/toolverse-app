export interface ShortLinkRecord {
  id: string;
  alias: string;
  code?: string;
  originalUrl: string;
  destinationUrl?: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string | null;
  clicks: number;
  analyticsEnabled?: boolean;
}

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export const MAX_DESTINATION_URL_LENGTH = 2048;

export const RESERVED_ALIASES = new Set([
  'admin',
  'api',
  'app',
  'blog',
  'category',
  'cv-maker',
  'login',
  'logout',
  'signup',
  'tools',
  'legal',
  'privacy',
  'terms',
  'about',
  'contact',
  'sitemap',
  'robots',
  'dashboard',
  's',
  'sw',
  'service-worker',
]);

function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host) return true;
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '0.0.0.0' ||
    host === '::' ||
    host === '::1' ||
    host.startsWith('127.') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    host.startsWith('169.254.') ||
    host.startsWith('fe80:') ||
    host.startsWith('fc') ||
    host.startsWith('fd')
  ) {
    return true;
  }

  // RFC1918 172.16.0.0/12
  const m172 = host.match(/^172\.(\d+)\.\d+\.\d+$/);
  if (m172) {
    const second = Number(m172[1]);
    if (second >= 16 && second <= 31) return true;
  }

  return false;
}

export function validateDestinationUrl(url: string): { isValid: boolean; error?: string } {
  const trimmed = (url || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'URL cannot be empty.' };
  }

  if (trimmed.length > MAX_DESTINATION_URL_LENGTH) {
    return {
      isValid: false,
      error: `URL is too long (maximum ${MAX_DESTINATION_URL_LENGTH} characters).`,
    };
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only http:// and https:// URLs are allowed.' };
    }

    if (parsed.username || parsed.password) {
      return { isValid: false, error: 'URLs containing embedded credentials are not permitted.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.includes('.') || isPrivateOrLocalHost(hostname)) {
      return { isValid: false, error: 'Private, internal, and localhost addresses are not permitted.' };
    }

    // Prevent recursive short-link loops pointing back to ToolVerse /s/*
    if (
      (hostname === 'toolverse.baby' || hostname === 'www.toolverse.baby') &&
      (parsed.pathname === '/s' || parsed.pathname.startsWith('/s/'))
    ) {
      return { isValid: false, error: 'Recursive short links pointing to toolverse.baby/s/ are not allowed.' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format. Please include http:// or https://' };
  }
}

export function validateCustomAlias(alias: string): { isValid: boolean; normalized?: string; error?: string } {
  const trimmed = (alias || '').trim();
  if (!trimmed) {
    return { isValid: true, normalized: '' };
  }
  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Custom alias must be 3-30 letters, numbers, hyphens, or underscores.',
    };
  }
  if (isAliasReserved(trimmed)) {
    return { isValid: false, error: 'This alias is reserved and cannot be used.' };
  }
  return { isValid: true, normalized: trimmed };
}

export function buildTrackedUrl(
  destinationUrl: string,
  utm: UtmParams = {}
): { isValid: boolean; url?: string; error?: string } {
  const validation = validateDestinationUrl(destinationUrl);
  if (!validation.isValid) {
    return { isValid: false, error: validation.error };
  }

  try {
    const parsed = new URL(destinationUrl.trim());
    const entries: Array<[string, string | undefined]> = [
      ['utm_source', utm.source],
      ['utm_medium', utm.medium],
      ['utm_campaign', utm.campaign],
      ['utm_term', utm.term],
      ['utm_content', utm.content],
    ];

    for (const [key, value] of entries) {
      const cleaned = value?.trim();
      if (cleaned) {
        parsed.searchParams.set(key, cleaned);
      }
    }

    const finalUrl = parsed.toString();
    if (finalUrl.length > MAX_DESTINATION_URL_LENGTH) {
      return {
        isValid: false,
        error: `Final URL with UTM parameters exceeds ${MAX_DESTINATION_URL_LENGTH} characters.`,
      };
    }

    return { isValid: true, url: finalUrl };
  } catch {
    return { isValid: false, error: 'Invalid URL format. Please include http:// or https://' };
  }
}

export function isAliasReserved(alias: string): boolean {
  return RESERVED_ALIASES.has(alias.trim().toLowerCase());
}

export function generateRandomAlias(length: number = 7): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const maxByte = 256 - (256 % chars.length);
  let result = '';
  const buf = new Uint8Array(length * 2);

  while (result.length < length) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && result.length < length; i++) {
      if (buf[i] < maxByte) {
        result += chars.charAt(buf[i] % chars.length);
      }
    }
  }
  return result;
}

// LocalStorage persistence helper for guest user link history
export function saveLocalShortLink(link: ShortLinkRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalShortLinks();
    const updated = [link, ...existing.filter((l) => l.alias !== link.alias)];
    localStorage.setItem('toolverse_short_links', JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save link to localStorage:', e);
  }
}

export function getLocalShortLinks(): ShortLinkRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('toolverse_short_links');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearLocalShortLinks(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('toolverse_short_links');
  } catch {
    // ignore storage errors
  }
}
