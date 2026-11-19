/**
 * Global ad loaders. Monetag (push + vignette) and Adsterra were removed on 2026-11-17
 * for AdSense review. Nothing is injected. Kept as no-ops so imports stay stable.
 */
export function isJobTarget(pathname: string, search?: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/jobs' || p.startsWith('/jobs/') || p === '/tools/global-job-finder') return true;
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  if (s) {
    try {
      const params = new URLSearchParams(s);
      if (params.has('job') || params.has('jobId') || params.has('job_id') || params.has('id')) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

export function injectMonetagVignette(_zone?: string): boolean {
  return false;
}

/** No-op: third-party vignette removed. */
export function triggerJobVignetteOnce(): boolean {
  return false;
}

export function AdGlobals() {
  return null;
}
