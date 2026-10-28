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
