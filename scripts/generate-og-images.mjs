import puppeteer from 'puppeteer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'apps', 'frontend', 'public');

// Use localhost for dev, or production URL
const BASE_URL = process.env.OG_BASE_URL || 'http://localhost:3000';

async function generateOgImages() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  
  // Set viewport to OG image dimensions
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  // Screenshot Homepage
  console.log('Capturing homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  // Wait a bit for animations to settle
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ 
    path: join(publicDir, 'og-home.png'),
    type: 'png',
  });
  console.log('✓ og-home.png saved');

  // Screenshot Leaderboard
  console.log('Capturing leaderboard...');
  await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: join(publicDir, 'og-leaderboard.png'),
    type: 'png',
  });
  console.log('✓ og-leaderboard.png saved');

  await browser.close();
  console.log('\nDone! OG images generated in apps/frontend/public/');
}

generateOgImages().catch(console.error);
