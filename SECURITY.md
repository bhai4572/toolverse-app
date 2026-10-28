# ToolVerse Platform — Security & Safe Crawling Specification

**Project:** ToolVerse — Advanced SEO and Marketing Intelligence Platform  
**Compliance Level:** Enterprise Safe Crawling & SSRF Protection  
**Last Updated:** 2026-10-28  

---

## 1. Outbound Request & SSRF Defense

The crawler engine (`crawlerEngine.ts`) and safe HTTP client (`ssrfGuard.ts`) enforce strict controls on all outbound network operations.

### 1.1 Destination Filtering
Every target URL undergoes multi-layer validation before any connection is initiated:
1. **Scheme Restrictions:** Only `http:` and `https:` schemes are allowed. Schemes such as `file:`, `ftp:`, `gopher:`, `javascript:`, `data:`, `ldap:`, and `dict:` are rejected unconditionally.
2. **Port Restrictions:** Outbound connections are restricted exclusively to standard HTTP (`80`) and HTTPS (`443`) ports. Custom ports (e.g., `8080`, `8443`, `3000`, `6379`, `27017`, `22`) are blocked.
3. **Credential Stripping & Rejection:** URLs containing embedded basic auth credentials (`http://user:pass@domain.com`) are rejected to prevent credential leakage.
4. **IP Address & CIDR Blocklist:**
   - **IPv4 Loopback:** `127.0.0.0/8`
   - **RFC1918 Private Ranges:** `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
   - **Link-Local & Cloud Metadata:** `169.254.0.0/16` (Specifically defends against AWS/GCP/Azure `http://169.254.169.254/` metadata service extraction)
   - **Carrier-Grade NAT:** `100.64.0.0/10`
   - **Multicast & Reserved:** `224.0.0.0/4`, `240.0.0.0/4`, `0.0.0.0/8`
   - **IPv6 Equivalents:** Loopback (`::1`), Unique Local (`fc00::/7`), Link-Local (`fe80::/10`), IPv4-mapped IPv6 (`::ffff:0:0/96`), and Multicast (`ff00::/8`).

### 1.2 DNS Resolution & Rebinding Defense
* All domain hostnames are resolved via Cloudflare DNS over HTTPS (`https://cloudflare-dns.com/dns-query`) prior to issuing HTTP requests.
* If a hostname resolves to any blocked private or loopback IP, the request is terminated immediately.
* **Redirect Validation:** On every HTTP redirect (`301`, `302`, `307`, `308`), the destination URL is re-evaluated through the complete SSRF verification pipeline before following the hop.

---

## 2. Resource Consumption & DoS Defenses

To ensure stability and protect both ToolVerse infrastructure and target web servers:
1. **Concurrency Cap:** The crawler limits concurrent outbound requests to **maximum 2 simultaneous requests per host**.
2. **Page & Depth Limits:** Serverless crawl execution is capped at a safe default of 10 pages and depth 3 (configurable up to 200 pages on dedicated worker profiles).
3. **Response Size Threshold:** Maximum download size is capped at **5MB** per resource. Excessively large payloads or infinite streams are truncated and aborted.
4. **Timeout Enforcement:**
   - Connection timeout: 5,000 ms.
   - Read/overall response timeout: 10,000 ms per page.
   - Total job timeout: 60 seconds per edge invocation.

---

## 3. Data Protection & Input Sanitization

### 3.1 Untrusted Crawled HTML (XSS Prevention)
* The platform extracts structured data (titles, descriptions, headings, anchors, schema) and strictly treats extracted text as plain data strings.
* HTML previews and inspection panels never render raw external HTML using unsanitized mechanisms. Any code previews use text nodes or HTML entity escaping.

### 3.2 Spreadsheet Formula Injection Defense
* When generating CSV exports (audit findings, keyword lists, backlink reports), cells starting with formula trigger characters (`=`, `+`, `-`, `@`, `\t`, `\r`) are automatically escaped with a leading single quote (`'`) to prevent arbitrary code execution when opened in Microsoft Excel or Google Sheets.

### 3.3 Credential Isolation & Log Redaction
* Sensitive tokens (Google OAuth tokens, API keys) are stored in isolated client-side storage or encrypted environment variables.
* Server-side logs automatically redact headers such as `Authorization`, `Cookie`, and `Set-Cookie`.
