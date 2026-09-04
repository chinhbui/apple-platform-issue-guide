import test from 'node:test';
import assert from 'node:assert/strict';

import { fetchIssues, filterIssues, normalizeIssue } from '../lib/github.mjs';

function rawIssue(overrides = {}) {
  return {
    number: 6,
    title: '[HLS] Example',
    state: 'open',
    html_url: 'https://github.com/chinhbui/apple-platform-issue-guide/issues/6',
    body: 'raw markdown',
    body_html: '<h2>Problem</h2><p>Example</p>',
    labels: [{ name: 'area/hls' }, { name: 'platform/ios' }],
    created_at: '2026-09-04T01:00:00Z',
    updated_at: '2026-09-04T02:00:00Z',
    ...overrides,
  };
}

test('normalizeIssue keeps rendered body, state, labels, and timestamps', () => {
  assert.deepEqual(normalizeIssue(rawIssue()), {
    number: 6,
    title: '[HLS] Example',
    state: 'open',
    htmlUrl: 'https://github.com/chinhbui/apple-platform-issue-guide/issues/6',
    bodyHtml: '<h2>Problem</h2><p>Example</p>',
    labels: ['area/hls', 'platform/ios'],
    createdAt: '2026-09-04T01:00:00Z',
    updatedAt: '2026-09-04T02:00:00Z',
  });
});

test('filterIssues excludes pull requests and retains closed issues', () => {
  const issues = filterIssues([
    rawIssue({ number: 8, state: 'closed' }),
    rawIssue({ number: 7, pull_request: { url: 'https://api.github.com/pr/7' } }),
    rawIssue({ number: 6 }),
  ]);

  assert.deepEqual(issues.map(({ number, state }) => ({ number, state })), [
    { number: 8, state: 'closed' },
    { number: 6, state: 'open' },
  ]);
});

test('fetchIssues requests the full representation and paginates 100-item pages', async () => {
  const calls = [];
  const pageOne = Array.from({ length: 100 }, (_, index) => rawIssue({ number: 200 - index }));
  const pageTwo = [rawIssue({ number: 100 })];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const body = calls.length === 1 ? pageOne : pageTwo;
    return { ok: true, status: 200, json: async () => body };
  };

  const issues = await fetchIssues({
    repository: 'chinhbui/apple-platform-issue-guide',
    token: 'secret',
    fetchImpl,
  });

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /per_page=100&page=1/);
  assert.match(calls[1].url, /page=2/);
  assert.equal(calls[0].options.headers.Accept, 'application/vnd.github.full+json');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer secret');
  assert.equal(issues.length, 101);
});

test('fetchIssues throws a clear error for a failed GitHub response', async () => {
  const fetchImpl = async () => ({ ok: false, status: 403, text: async () => 'rate limited' });

  await assert.rejects(
    fetchIssues({ repository: 'chinhbui/apple-platform-issue-guide', fetchImpl }),
    /GitHub Issues request failed \(403\): rate limited/,
  );
});
