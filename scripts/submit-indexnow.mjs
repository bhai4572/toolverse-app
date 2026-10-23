/**
 * Automated IndexNow Submitter for ToolVerse
 * Submits all canonical URLs from public/sitemap.xml to Bing, Yandex, Seznam & Naver via IndexNow API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HOST = 'toolverse.baby';
const KEY = '4a8f9b2c3d1e4a5b6c7d8e9f0a1b2c3d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(root, 'public/sitemap.xml');

async function submitIndexNow() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('[IndexNow] public/sitemap.xml not found.');
    process.exit(1);
  }

  const content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  console.log(`[IndexNow] Found ${urls.length} URLs in public/sitemap.xml to submit...`);

  // IndexNow allows up to 10,000 URLs per batch
  const batchSize = 5000;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };

    console.log(`[IndexNow] Submitting batch of ${batch.length} URLs to api.indexnow.org...`);

    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 202) {
        console.log(`[IndexNow] SUCCESS! Status: ${response.status} (URLs queued for instant crawl by Bing & Yandex).`);
      } else {
        const text = await response.text();
        console.warn(`[IndexNow] Response status: ${response.status}. Response: ${text}`);
      }
    } catch (err) {
      console.error('[IndexNow] Submission failed:', err.message);
    }
  }
}

submitIndexNow();
