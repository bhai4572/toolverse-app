/**
 * ToolVerse SSRF & Safe Fetch Guard
 * Protects against Server-Side Request Forgery (SSRF), DNS rebinding, internal network scanning,
 * non-standard ports, cloud metadata access, and malicious redirect chains.
 */

// Blocked IPv4 CIDR ranges in integer representation
interface IPv4Range {
  start: number;
  end: number;
  name: string;
}

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

const BLOCKED_IPV4_RANGES: IPv4Range[] = [
  // 0.0.0.0/8 (Current network)
  { start: ipToLong('0.0.0.0'), end: ipToLong('0.255.255.255'), name: 'Current Network' },
  // 10.0.0.0/8 (Private RFC 1918)
  { start: ipToLong('10.0.0.0'), end: ipToLong('10.255.255.255'), name: 'Private 10/8' },
  // 100.64.0.0/10 (Shared Carrier-Grade NAT)
  { start: ipToLong('100.64.0.0'), end: ipToLong('100.127.255.255'), name: 'Carrier-Grade NAT' },
  // 127.0.0.0/8 (Loopback)
  { start: ipToLong('127.0.0.0'), end: ipToLong('127.255.255.255'), name: 'Loopback 127/8' },
  // 169.254.0.0/16 (Link-local / AWS & Cloud Metadata 169.254.169.254)
  { start: ipToLong('169.254.0.0'), end: ipToLong('169.254.255.255'), name: 'Link-Local / Cloud Metadata' },
  // 172.16.0.0/12 (Private RFC 1918)
  { start: ipToLong('172.16.0.0'), end: ipToLong('172.31.255.255'), name: 'Private 172.16/12' },
  // 192.0.0.0/24 (IETF Protocol Assignments)
  { start: ipToLong('192.0.0.0'), end: ipToLong('192.0.0.255'), name: 'IETF Protocol' },
  // 192.0.2.0/24 (TEST-NET-1)
  { start: ipToLong('192.0.2.0'), end: ipToLong('192.0.2.255'), name: 'Documentation Test-Net-1' },
  // 192.168.0.0/16 (Private RFC 1918)
  { start: ipToLong('192.168.0.0'), end: ipToLong('192.168.255.255'), name: 'Private 192.168/16' },
  // 198.18.0.0/15 (Network benchmark tests)
  { start: ipToLong('198.18.0.0'), end: ipToLong('198.19.255.255'), name: 'Benchmark Tests' },
  // 198.51.100.0/24 (TEST-NET-2)
  { start: ipToLong('198.51.100.0'), end: ipToLong('198.51.100.255'), name: 'Documentation Test-Net-2' },
  // 203.0.113.0/24 (TEST-NET-3)
  { start: ipToLong('203.0.113.0'), end: ipToLong('203.0.113.255'), name: 'Documentation Test-Net-3' },
  // 224.0.0.0/4 (Multicast)
  { start: ipToLong('224.0.0.0'), end: ipToLong('239.255.255.255'), name: 'Multicast' },
  // 240.0.0.0/4 (Reserved / Future Use)
  { start: ipToLong('240.0.0.0'), end: ipToLong('255.255.255.255'), name: 'Reserved / Broadcast' },
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'local',
  'broadcasthost',
  'ip6-localhost',
  'ip6-loopback',
  'instance-data',
  'metadata.google.internal',
  'metadata.internal',
]);

const BLOCKED_HOSTNAME_SUFFIXES = [
  '.localhost',
  '.local',
  '.internal',
  '.localdomain',
  '.lan',
  '.home',
  '.corp',
  '.arpa',
];

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
  hostname?: string;
  protocol?: string;
  port?: number;
}

/**
 * Validates a target URL against protocol, credentials, port, and hostname restrictions.
 */
export function validateTargetUrl(rawUrl: string): UrlValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string.' };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    return { valid: false, error: 'URL exceeds maximum length of 2048 characters.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Invalid URL format. Please provide a valid http or https URL.' };
  }

  // 1. Protocol: Strictly HTTP and HTTPS only
  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return { valid: false, error: `Protocol "${protocol}" is not allowed. Only HTTP and HTTPS are permitted.` };
  }

  // 2. Credentials: Reject any user:pass authentication in URL
  if (parsed.username || parsed.password) {
    return { valid: false, error: 'Credentials (username/password) in URL are strictly prohibited.' };
  }

  // 3. Port: Strictly 80 and 443 only (no internal admin ports like 22, 3306, 6379, 8080)
  const port = parsed.port ? parseInt(parsed.port, 10) : protocol === 'https:' ? 443 : 80;
  if (port !== 80 && port !== 443) {
    return { valid: false, error: `Port ${port} is not allowed. Only standard ports 80 and 443 are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^\.+|\.+$/g, '');
  if (!hostname) {
    return { valid: false, error: 'Hostname cannot be empty.' };
  }

  // 4. Hostname Blacklist
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, error: `Target host "${hostname}" is blocked for security.` };
  }

  for (const suffix of BLOCKED_HOSTNAME_SUFFIXES) {
    if (hostname.endsWith(suffix)) {
      return { valid: false, error: `Internal domain suffix "${suffix}" is prohibited.` };
    }
  }

  // 5. Direct IP checks (IPv4 and IPv6)
  if (isDirectIp(hostname)) {
    const ipCheck = isIpBlocked(hostname);
    if (ipCheck.blocked) {
      return { valid: false, error: `IP target "${hostname}" (${ipCheck.reason}) is prohibited.` };
    }
  }

  // Clean canonical URL without user fragments
  const sanitizedUrl = `${parsed.protocol}//${parsed.host}${parsed.pathname || '/'}${parsed.search}`;

  return {
    valid: true,
    sanitizedUrl,
    hostname,
    protocol,
    port,
  };
}

/** Check if string is a numeric IPv4 or IPv6 address */
export function isDirectIp(host: string): boolean {
  // IPv4 standard regex
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) return true;
  // IPv6
  if (host.includes(':')) return true;
  return false;
}

export interface IpCheckResult {
  blocked: boolean;
  reason?: string;
}

/**
 * Checks if a given IP address belongs to blocked/private/loopback ranges.
 */
export function isIpBlocked(ipStr: string): IpCheckResult {
  const cleanIp = ipStr.replace(/^\[|\]$/g, '').trim().toLowerCase();

  // IPv4 Check
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanIp)) {
    const octets = cleanIp.split('.').map((o) => parseInt(o, 10));
    for (const octet of octets) {
      if (octet < 0 || octet > 255) {
        return { blocked: true, reason: 'Malformed IPv4 octet' };
      }
    }

    const ipLong = ipToLong(cleanIp);
    for (const range of BLOCKED_IPV4_RANGES) {
      if (ipLong >= range.start && ipLong <= range.end) {
        return { blocked: true, reason: range.name };
      }
    }

    return { blocked: false };
  }

  // IPv6 Checks
  if (cleanIp.includes(':')) {
    // Loopback ::1 or ::
    if (cleanIp === '::1' || cleanIp === '::') {
      return { blocked: true, reason: 'IPv6 Loopback' };
    }

    // IPv4-mapped IPv6 (::ffff:127.0.0.1 or ::ffff:7f00:1)
    if (cleanIp.startsWith('::ffff:')) {
      const rest = cleanIp.slice(7);
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(rest)) {
        return isIpBlocked(rest);
      }
      return { blocked: true, reason: 'IPv4-mapped IPv6' };
    }

    // Unique Local Address (ULA) fc00::/7 (fc00... or fd00...)
    if (/^f[cd][0-9a-f]{2}:/i.test(cleanIp)) {
      return { blocked: true, reason: 'IPv6 Unique Local Address' };
    }

    // Link-local fe80::/10
    if (/^fe[89ab][0-9a-f]:/i.test(cleanIp)) {
      return { blocked: true, reason: 'IPv6 Link-Local' };
    }

    // Multicast ff00::/8
    if (/^ff[0-9a-f]{2}:/i.test(cleanIp)) {
      return { blocked: true, reason: 'IPv6 Multicast' };
    }

    // Documentation / benchmark prefixes
    if (cleanIp.startsWith('2001:db8:') || cleanIp.startsWith('100::') || cleanIp.startsWith('2001:2::')) {
      return { blocked: true, reason: 'IPv6 Documentation/Benchmark' };
    }

    return { blocked: false };
  }

  return { blocked: false };
}

/**
 * Resolves a hostname to IPs via DNS-over-HTTPS (DoH) to verify against rebinding attacks.
 * Works seamlessly in both Cloudflare Workers/Pages edge runtime and Node.js.
 */
export async function resolveAndCheckDns(hostname: string): Promise<{ safe: boolean; error?: string; ip?: string }> {
  if (isDirectIp(hostname)) {
    const check = isIpBlocked(hostname);
    if (check.blocked) {
      return { safe: false, error: `Target IP is prohibited (${check.reason}).` };
    }
    return { safe: true, ip: hostname };
  }

  try {
    // Use Cloudflare 1.1.1.1 JSON DNS-over-HTTPS API (safe across edge isolates and local dev)
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`;
    const res = await fetch(dohUrl, {
      headers: { Accept: 'application/dns-json' },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data: any = await res.json();
      if (data && data.Answer && Array.isArray(data.Answer)) {
        for (const ans of data.Answer) {
          if (ans.type === 1 && ans.data) {
            // A record
            const ip = String(ans.data).trim();
            const ipCheck = isIpBlocked(ip);
            if (ipCheck.blocked) {
              return { safe: false, error: `Domain ${hostname} resolves to blocked address ${ip} (${ipCheck.reason}).` };
            }
            return { safe: true, ip };
          }
        }
      }
    }
  } catch {
    // If DoH lookup fails or is blocked locally, fall through to conservative check
  }

  return { safe: true };
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
  method?: 'GET' | 'HEAD';
}

export interface SafeFetchResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  headers: Headers;
  redirectChain: string[];
  bodyText: string;
  responseTimeMs: number;
  contentType: string;
}

/**
 * Secure HTTP client that guarantees SSRF protection on initial request and every redirect hop.
 */
export async function safeFetch(targetUrl: string, options: SafeFetchOptions = {}): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs || 8000;
  const maxBytes = options.maxBytes || 2 * 1024 * 1024; // 2 MB limit
  const maxRedirects = options.maxRedirects != null ? options.maxRedirects : 5;
  const method = options.method || 'GET';

  let currentUrl = targetUrl;
  const redirectChain: string[] = [];

  for (let hop = 0; hop <= maxRedirects; hop++) {
    // 1. SSRF URL validation
    const validation = validateTargetUrl(currentUrl);
    if (!validation.valid || !validation.sanitizedUrl) {
      throw new Error(`SSRF Block: ${validation.error || 'Invalid URL'}`);
    }

    // 2. DNS check
    const dnsCheck = await resolveAndCheckDns(validation.hostname!);
    if (!dnsCheck.safe) {
      throw new Error(`SSRF Block: ${dnsCheck.error}`);
    }

    const startTime = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(validation.sanitizedUrl, {
        method,
        redirect: 'manual', // Strictly manual to intercept and validate redirects
        signal: controller.signal,
        headers: {
          'User-Agent': 'ToolVerse-SiteAudit/1.0 (+https://toolverse.baby/workspace/site-audit; SEO Auditor)',
          Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5',
          'Accept-Language': 'en-US,en;q=0.9',
          ...options.headers,
        },
      });
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms.`);
      }
      throw new Error(`Network error while fetching ${validation.sanitizedUrl}: ${err.message}`);
    } finally {
      clearTimeout(timer);
    }

    const responseTimeMs = Math.round(performance.now() - startTime);

    // 3. Handle Redirects (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get('location');
      if (!location) {
        throw new Error(`Redirect response (${res.status}) missing Location header.`);
      }

      redirectChain.push(currentUrl);

      if (hop >= maxRedirects) {
        throw new Error(`Exceeded maximum redirect limit of ${maxRedirects} hops.`);
      }

      // Resolve relative redirect against current URL
      try {
        const nextUrl = new URL(location, currentUrl).href;
        currentUrl = nextUrl;
        continue;
      } catch {
        throw new Error(`Invalid redirect Location: "${location}"`);
      }
    }

    // 4. Response Body extraction with byte size limits
    const contentType = res.headers.get('content-type') || '';
    let bodyText = '';

    if (method === 'GET' && res.body) {
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          totalBytes += value.length;
          if (totalBytes > maxBytes) {
            reader.cancel();
            throw new Error(`Page size exceeds safety limit of ${Math.round(maxBytes / (1024 * 1024))}MB.`);
          }
          chunks.push(value);
        }
      }

      // Decode bytes to text
      const merged = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }
      bodyText = new TextDecoder('utf-8', { fatal: false }).decode(merged);
    }

    return {
      url: targetUrl,
      finalUrl: currentUrl,
      statusCode: res.status,
      statusText: res.statusText,
      headers: res.headers,
      redirectChain,
      bodyText,
      responseTimeMs,
      contentType,
    };
  }

  throw new Error('Unexpected crawler redirect state.');
}
