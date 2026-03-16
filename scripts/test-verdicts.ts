/**
 * Puppeteer test script to capture all 7 verdict scenarios
 * Generates screenshots of the page and downloads the shareable images
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(__dirname, '..', 'resultats');
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

// Test scenarios for each verdict type
// Gap = scoreInfra - scoreApp
// - OVERKILL_SEVERE: gap >= 40
// - OVERKILL: gap >= 25
// - SLIGHT_OVERKILL: gap >= 10
// - BALANCED: -10 < gap < 10
// - SLIGHT_UNDERKILL: gap <= -10
// - UNDERKILL: gap <= -25
// - UNDERKILL_SEVERE: gap <= -40

interface TestScenario {
  name: string;
  verdict: string;
  app: {
    criticality: number;
    userCount: number;
    financialImpact: number;
    availability: number;
    exposure: number;
    complexity: number;
    dataSensitivity: number;
  };
  infra: {
    sophistication: number;
    resilience: number;
    cost: number;
    teamCapacity: number;
    operationalMaturity: number;
    automation: number;
    security: number;
  };
}

// Thresholds:
// - OVERKILL_SEVERE: gap >= 40
// - OVERKILL: 25 <= gap < 40
// - SLIGHT_OVERKILL: 10 <= gap < 25
// - BALANCED: -10 < gap < 10
// - SLIGHT_UNDERKILL: -25 < gap <= -10
// - UNDERKILL: -40 < gap <= -25
// - UNDERKILL_SEVERE: gap <= -40

const scenarios: TestScenario[] = [
  {
    name: '1-overkill-severe',
    verdict: 'OVERKILL_SEVERE',
    // Target gap: ~50 (infra 75, app 25)
    app: {
      criticality: 2,
      userCount: 2,
      financialImpact: 2,
      availability: 2,
      exposure: 2,
      complexity: 2,
      dataSensitivity: 2,
    },
    infra: {
      sophistication: 5,
      resilience: 5,
      cost: 5,
      teamCapacity: 4,
      operationalMaturity: 4,
      automation: 4,
      security: 3,
    },
  },
  {
    name: '2-overkill',
    verdict: 'OVERKILL',
    // Target gap: ~30 (infra 60, app 30)
    app: {
      criticality: 2,
      userCount: 3,
      financialImpact: 2,
      availability: 2,
      exposure: 2,
      complexity: 2,
      dataSensitivity: 2,
    },
    infra: {
      sophistication: 4,
      resilience: 4,
      cost: 4,
      teamCapacity: 3,
      operationalMaturity: 3,
      automation: 3,
      security: 3,
    },
  },
  {
    name: '3-slight-overkill',
    verdict: 'SLIGHT_OVERKILL',
    // Target gap: ~15 (infra 50, app 35)
    app: {
      criticality: 3,
      userCount: 3,
      financialImpact: 3,
      availability: 2,
      exposure: 2,
      complexity: 2,
      dataSensitivity: 2,
    },
    infra: {
      sophistication: 4,
      resilience: 3,
      cost: 3,
      teamCapacity: 3,
      operationalMaturity: 3,
      automation: 3,
      security: 2,
    },
  },
  {
    name: '4-balanced',
    verdict: 'BALANCED',
    // Target gap: ~0 (both around 45)
    app: {
      criticality: 3,
      userCount: 3,
      financialImpact: 3,
      availability: 3,
      exposure: 3,
      complexity: 3,
      dataSensitivity: 2,
    },
    infra: {
      sophistication: 3,
      resilience: 3,
      cost: 3,
      teamCapacity: 3,
      operationalMaturity: 3,
      automation: 3,
      security: 2,
    },
  },
  {
    name: '5-slight-underkill',
    verdict: 'SLIGHT_UNDERKILL',
    // Target gap: ~-15 (app 50, infra 35)
    app: {
      criticality: 4,
      userCount: 3,
      financialImpact: 3,
      availability: 3,
      exposure: 3,
      complexity: 3,
      dataSensitivity: 2,
    },
    infra: {
      sophistication: 2,
      resilience: 3,
      cost: 3,
      teamCapacity: 2,
      operationalMaturity: 2,
      automation: 2,
      security: 2,
    },
  },
  {
    name: '6-underkill',
    verdict: 'UNDERKILL',
    // Target gap: ~-30 (app 55, infra 25)
    app: {
      criticality: 4,
      userCount: 3,
      financialImpact: 4,
      availability: 3,
      exposure: 3,
      complexity: 3,
      dataSensitivity: 2,
    },
    infra: {
      sophistication: 2,
      resilience: 2,
      cost: 2,
      teamCapacity: 2,
      operationalMaturity: 2,
      automation: 2,
      security: 2,
    },
  },
  {
    name: '7-underkill-severe',
    verdict: 'UNDERKILL_SEVERE',
    // Target gap: ~-50 (app 75, infra 25)
    app: {
      criticality: 5,
      userCount: 5,
      financialImpact: 5,
      availability: 5,
      exposure: 4,
      complexity: 4,
      dataSensitivity: 3,
    },
    infra: {
      sophistication: 2,
      resilience: 2,
      cost: 2,
      teamCapacity: 1,
      operationalMaturity: 1,
      automation: 1,
      security: 1,
    },
  },
];

async function waitForDownload(downloadPath: string, timeout = 10000): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const files = fs.readdirSync(downloadPath);
    const pngFile = files.find(f => f.endsWith('.png') && !f.includes('.crdownload'));
    if (pngFile) {
      return path.join(downloadPath, pngFile);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

async function testScenario(browser: Browser, scenario: TestScenario): Promise<void> {
  console.log(`\n📋 Testing: ${scenario.name} (${scenario.verdict})`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Create temp download folder for this scenario
  const downloadPath = path.join(OUTPUT_DIR, 'temp_downloads');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  // Clear temp folder
  const existingFiles = fs.readdirSync(downloadPath);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(downloadPath, file));
  }

  // Configure downloads
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  try {
    // Set localStorage with mock answers before navigating
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Inject the answers into localStorage via the zustand persist format
    // The store name is 'stackoverkill-score'
    const storeData = {
      state: {
        step: 2,
        appAnswers: scenario.app,
        infraAnswers: scenario.infra,
        result: null,
      },
      version: 0,
    };

    await page.evaluate((data) => {
      localStorage.setItem('stackoverkill-score', JSON.stringify(data));
    }, storeData);

    // Navigate to result page - this will trigger the API call
    await page.goto(`${BASE_URL}/result`, { waitUntil: 'networkidle0' });

    // Wait for result to load (loading spinner to disappear)
    await page.waitForFunction(
      () => !document.body.innerText.includes('Calcul en cours'),
      { timeout: 15000 }
    );

    // Extra wait for animations and rendering
    await new Promise(r => setTimeout(r, 1000));

    // Take screenshot of the full page
    const pageScreenshotPath = path.join(OUTPUT_DIR, `${scenario.name}-page.png`);
    await page.screenshot({
      path: pageScreenshotPath,
      fullPage: false,
    });
    console.log(`  ✅ Page screenshot: ${scenario.name}-page.png`);

    // Click download button to get the shareable image
    // Find button by iterating and checking text content
    const buttons = await page.$$('button');
    let downloadClicked = false;
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('Télécharger')) {
        await btn.click();
        downloadClicked = true;

        // Wait for download to complete
        await new Promise(r => setTimeout(r, 3000));

        const downloadedFile = await waitForDownload(downloadPath);
        if (downloadedFile) {
          // Move and rename the file
          const destPath = path.join(OUTPUT_DIR, `${scenario.name}-card.png`);
          fs.renameSync(downloadedFile, destPath);
          console.log(`  ✅ Card image: ${scenario.name}-card.png`);
        } else {
          console.log(`  ⚠️  Download timeout for card image`);
        }
        break;
      }
    }

    if (!downloadClicked) {
      console.log(`  ⚠️  Download button not found`);
    }

  } catch (error) {
    console.error(`  ❌ Error: ${error}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 StackOverkill Verdict Screenshot Generator\n');
  console.log('Prerequisites:');
  console.log('  - Frontend running on http://localhost:3000');
  console.log('  - Backend running on http://localhost:3001\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Check if servers are running
  try {
    const frontendCheck = await fetch(BASE_URL);
    if (!frontendCheck.ok) throw new Error('Frontend not responding');
  } catch {
    console.error('❌ Frontend not running on http://localhost:3000');
    console.error('   Run: cd apps/frontend && pnpm dev');
    process.exit(1);
  }

  try {
    const testPayload = {
      app: { criticality: 1, userCount: 1, financialImpact: 1, availability: 1, exposure: 1, complexity: 1, dataSensitivity: 1 },
      infra: { sophistication: 1, resilience: 1, cost: 1, teamCapacity: 1, operationalMaturity: 1, automation: 1, security: 1 },
    };
    const backendCheck = await fetch(`${API_URL}/api/v1/score/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });
    if (!backendCheck.ok) throw new Error('Backend not responding');
  } catch {
    console.error('❌ Backend not running on http://localhost:3001');
    console.error('   Run: cd apps/backend && pnpm dev');
    process.exit(1);
  }

  console.log('✅ Servers are running\n');
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const scenario of scenarios) {
      await testScenario(browser, scenario);
    }

    console.log('\n✨ All scenarios completed!');
    console.log(`📁 Results saved to: ${OUTPUT_DIR}`);

    // List generated files
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
    console.log(`\n📄 Generated files (${files.length}):`);
    files.sort().forEach(f => console.log(`   - ${f}`));

  } finally {
    await browser.close();

    // Cleanup temp folder
    const tempPath = path.join(OUTPUT_DIR, 'temp_downloads');
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { recursive: true });
    }
  }
}

main().catch(console.error);
