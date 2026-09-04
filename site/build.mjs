import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchIssues, filterIssues } from './lib/github.mjs';
import { renderIndexPage, renderIssuePage } from './lib/render.mjs';

const siteDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(siteDir, '..');
const defaultSiteUrl = 'https://chinhbui.github.io/apple-platform-issue-guide';

function parseArgs(argv) {
  const options = { output: '_site', fixture: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--output') options.output = argv[++index];
    else if (arg === '--fixture') options.fixture = argv[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!options.output) throw new Error('--output requires a path');
  return options;
}

function absoluteFromRoot(pathValue) {
  return isAbsolute(pathValue) ? pathValue : resolve(rootDir, pathValue);
}

async function loadIssues({ fixture }) {
  if (fixture) {
    const raw = JSON.parse(await readFile(absoluteFromRoot(fixture), 'utf8'));
    if (!Array.isArray(raw)) throw new Error('Fixture must contain a JSON array');
    return filterIssues(raw);
  }

  return fetchIssues({
    repository: process.env.GITHUB_REPOSITORY || 'chinhbui/apple-platform-issue-guide',
    token: process.env.GITHUB_TOKEN,
  });
}

async function build({ output, fixture }) {
  const outputDir = absoluteFromRoot(output);
  const siteUrl = (process.env.SITE_URL || defaultSiteUrl).replace(/\/+$/, '');
  const issues = await loadIssues({ fixture });

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await copyFile(join(siteDir, 'styles.css'), join(outputDir, 'styles.css'));
  await copyFile(join(siteDir, 'client.js'), join(outputDir, 'client.js'));
  await writeFile(join(outputDir, 'index.html'), renderIndexPage({ issues, siteUrl }), 'utf8');

  for (const issue of issues) {
    const issueDir = join(outputDir, 'issues', String(issue.number));
    await mkdir(issueDir, { recursive: true });
    await writeFile(join(issueDir, 'index.html'), renderIssuePage({ issue, siteUrl }), 'utf8');
  }

  console.log(`Built ${issues.length} investigation${issues.length === 1 ? '' : 's'} into ${outputDir}`);
}

const options = parseArgs(process.argv.slice(2));
await build(options);
