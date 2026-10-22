import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PROJECT_ID = '3328748206627828150';
const API_KEY = process.env.STITCH_API_KEY || '';
const BASE_DIR = 'd:/projects/Signable';

const TARGET_SCREENS = [
  {
    order: 1,
    folder: '01_learning_path',
    id: '5f74cf196f14448cbc8ce92b0271c3e9',
    expectedTitle: 'SignAble - Learning Path'
  },
  {
    order: 2,
    folder: '02_lesson_intro',
    id: 'd9450b58cd714f3b8e4a6514481b8e6c',
    expectedTitle: 'SignAble - Lesson Intro'
  },
  {
    order: 3,
    folder: '03_watch_the_sign',
    id: '9536aae479474b95ac88431e3a5b4453',
    expectedTitle: 'SignAble - Watch the Sign'
  },
  {
    order: 4,
    folder: '04_sign_practice_studio_redesigned',
    id: '7940ff717b554556b9ed15b10d6f5ddd',
    expectedTitle: 'SignAble - Sign Practice Studio (Redesigned)'
  },
  {
    order: 5,
    folder: '05_lesson_complete',
    id: '736c9aeab069467192f4d89fe885ba1d',
    expectedTitle: 'SignAble - Lesson Complete'
  }
];

function downloadWithCurl(url, destPath) {
  console.log(`Downloading with curl -L to: ${destPath}`);
  execFileSync('curl.exe', ['-s', '-L', '-o', destPath, url], { stdio: 'inherit' });
  const stats = fs.statSync(destPath);
  console.log(`  --> Done (${stats.size} bytes)`);
}

async function main() {
  console.log(`Fetching project and screen details for project ID: ${PROJECT_ID}...`);
  const projectRes = await fetch(`https://stitch.googleapis.com/v1/projects/${PROJECT_ID}`, {
    headers: { 'X-Goog-Api-Key': API_KEY }
  });
  const projectData = await projectRes.json();

  const screensRes = await fetch(`https://stitch.googleapis.com/v1/projects/${PROJECT_ID}/screens`, {
    headers: { 'X-Goog-Api-Key': API_KEY }
  });
  const screensData = await screensRes.json();

  const screensDir = path.join(BASE_DIR, 'screens');
  const byIdDir = path.join(screensDir, 'by-id');
  const docsDir = path.join(BASE_DIR, 'docs');

  fs.mkdirSync(screensDir, { recursive: true });
  fs.mkdirSync(byIdDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });

  // Save project metadata
  fs.writeFileSync(
    path.join(BASE_DIR, 'project.json'),
    JSON.stringify(projectData, null, 2),
    'utf-8'
  );

  console.log(`Project title: ${projectData.title}`);
  console.log(`Found ${screensData.screens?.length || 0} total screens in project.\n`);

  for (const target of TARGET_SCREENS) {
    console.log(`=======================================================`);
    console.log(`Processing Screen #${target.order}: ${target.expectedTitle}`);
    console.log(`Screen ID: ${target.id}`);

    const screen = screensData.screens.find(s => s.id === target.id);
    if (!screen) {
      console.error(`ERROR: Screen ID ${target.id} not found in project!`);
      continue;
    }

    const folderPath = path.join(screensDir, target.folder);
    fs.mkdirSync(folderPath, { recursive: true });

    // Paths
    const htmlDest = path.join(folderPath, 'screen.html');
    const imgDest = path.join(folderPath, 'screenshot.jpg');
    const metaDest = path.join(folderPath, 'metadata.json');

    const byIdHtml = path.join(byIdDir, `${target.id}.html`);
    const byIdImg = path.join(byIdDir, `${target.id}.jpg`);

    // Download HTML
    if (screen.htmlCode?.downloadUrl) {
      downloadWithCurl(screen.htmlCode.downloadUrl, htmlDest);
      fs.copyFileSync(htmlDest, byIdHtml);
    } else {
      console.warn(`No htmlCode.downloadUrl found for screen ${target.id}`);
    }

    // Download Screenshot
    if (screen.screenshot?.downloadUrl) {
      downloadWithCurl(screen.screenshot.downloadUrl, imgDest);
      fs.copyFileSync(imgDest, byIdImg);
    } else {
      console.warn(`No screenshot.downloadUrl found for screen ${target.id}`);
    }

    // Save screen metadata
    fs.writeFileSync(metaDest, JSON.stringify(screen, null, 2), 'utf-8');
    console.log(`  --> Saved metadata to: ${metaDest}`);
  }

  // Also download the design documents found in the project
  console.log(`\n=======================================================`);
  console.log(`Downloading Project Design Documents...`);
  for (const s of screensData.screens) {
    if (s.title && s.title.endsWith('.md') && s.htmlCode?.downloadUrl) {
      const docPath = path.join(docsDir, s.title);
      downloadWithCurl(s.htmlCode.downloadUrl, docPath);
    }
  }

  console.log(`\n=======================================================`);
  console.log(`All downloads completed successfully!`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
