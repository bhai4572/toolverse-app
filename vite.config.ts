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
        if (req.method === 'GET') {
          try {
            const { readCompanyDatabase } = await server.ssrLoadModule('/lib/b2b/serverCrawlerAndDb.ts');
            const savedRecords = readCompanyDatabase();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ savedRecords }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'DB read failed' }));
          }
          return;
        }
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { lookupOrCrawlCompany, addExecutiveToCompanyDb } = await server.ssrLoadModule('/lib/b2b/serverCrawlerAndDb.ts');
            const parsed = JSON.parse(body || '{}');
            if (parsed.action === 'add_executive' && parsed.domain) {
              const updated = addExecutiveToCompanyDb(parsed.domain, parsed.executive || {});
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ record: updated }));
              return;
            }
            const result = await lookupOrCrawlCompany(parsed.query, {
              forceRefresh: Boolean(parsed.forceRefresh),
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
