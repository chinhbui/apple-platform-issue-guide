import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(new URL('../..', import.meta.url).pathname);

function runNode(args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`build exited ${code}: ${stderr}`));
    });
  });
}

test('fixture build writes index, assets, and stable issue documents', async () => {
  const output = await mkdtemp(join(tmpdir(), 'apple-issue-guide-'));
  await runNode(['site/build.mjs', '--output', output, '--fixture', 'site/fixtures/issues.json']);

  await access(join(output, 'index.html'));
  await access(join(output, 'styles.css'));
  await access(join(output, 'client.js'));
  await access(join(output, 'issues', '5', 'index.html'));
  await access(join(output, 'issues', '6', 'index.html'));

  const index = await readFile(join(output, 'index.html'), 'utf8');
  const issue = await readFile(join(output, 'issues', '6', 'index.html'), 'utf8');
  assert.match(index, /\.\/issues\/6\//);
  assert.match(issue, /id="problem"/);
  assert.match(issue, /id="evidence-level"/);
  assert.match(issue, /id="solution-guideline"/);
  assert.match(issue, /id="verification"/);
});
