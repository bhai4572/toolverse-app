import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function siteAuditDevPlugin() {
  return {
    name: 'site-audit-dev-server',
    configureServer(server: any) {
      server.middlewares.use('/api/site-audit', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { executeSiteAudit } = await server.ssrLoadModule('/lib/seo/audit/crawlerEngine.ts');
            const parsed = JSON.parse(body || '{}');
            const report = await executeSiteAudit(parsed.url, { maxPages: parsed.maxPages || 10 });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(report));
          } catch (err: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Audit failed' }));
          }
        });
      });

      server.middlewares.use('/api/email-finder', async (req: any, res: any, next: any) => {
        const clientIp = req.socket?.remoteAddress || '127.0.0.1';
        if (req.method === 'GET') {
          try {
            const { getAdminDashboardStats, discoverAndVerifyCompanyEmails } = await server.ssrLoadModule('/lib/b2b/serverCrawlerAndDb.ts');
            const urlObj = new URL(req.url || '', 'http://localhost');
            const q = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
            if (q) {
              const result = await discoverAndVerifyCompanyEmails({ query: q });
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }
            const adminStats = getAdminDashboardStats();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(adminStats));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Admin stats fetch failed' }));
          }
          return;
        }
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const {
              checkRateLimit,
              discoverAndVerifyCompanyEmails,
              purchaseCreditPack,
              getAdminDashboardStats,
            } = await server.ssrLoadModule('/lib/b2b/serverCrawlerAndDb.ts');

            const rl = checkRateLimit(clientIp, 25);
            if (!rl.allowed) {
              res.statusCode = 429;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Rate limit exceeded. Retry in ${rl.retryAfterSec}s.` }));
              return;
            }

            const parsed = JSON.parse(body || '{}');
            if (parsed.action === 'purchase_pack' && parsed.packId) {
              const packResult = purchaseCreditPack(parsed.userId || 'default_user', parsed.packId);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(packResult));
              return;
            }
            if (parsed.action === 'admin_stats') {
              const stats = getAdminDashboardStats(parsed.userId || 'default_user');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(stats));
              return;
            }

            const result = await discoverAndVerifyCompanyEmails({
              query: parsed.query || '',
              filters: parsed.filters || {},
              providerKeys: parsed.providerKeys || {},
              forceRefresh: Boolean(parsed.forceRefresh),
              userId: parsed.userId || 'default_user',
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Email finder lookup failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteAuditDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './lib/shims/next-link.tsx'),
      'next/navigation': path.resolve(__dirname, './lib/shims/next-navigation.ts'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
