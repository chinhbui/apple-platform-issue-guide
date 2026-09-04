import test from 'node:test';
import assert from 'node:assert/strict';

import {
  anchorHeadings,
  renderIndexPage,
  renderIssuePage,
  slugify,
} from '../lib/render.mjs';

const issue = {
  number: 6,
  title: '[HLS] Short looping streams re-request segments',
  state: 'open',
  htmlUrl: 'https://github.com/chinhbui/apple-platform-issue-guide/issues/6',
  bodyHtml: '<h2>Problem</h2><p>Playback repeats network requests.</p><h2>Evidence level</h2><p><strong>Apple Confirmed.</strong></p><h2>Verification</h2><p>Compare request counts.</p>',
  labels: ['framework/avfoundation', 'area/hls', 'platform/ios', 'evidence/apple-confirmed'],
  createdAt: '2026-09-04T01:13:41Z',
  updatedAt: '2026-09-04T01:13:41Z',
};

test('slugify creates stable readable section fragments', () => {
  assert.equal(slugify('Solution / Guideline'), 'solution-guideline');
  assert.equal(slugify('Evidence level'), 'evidence-level');
  assert.equal(slugify('  AVPlayer & HLS  '), 'avplayer-hls');
});

test('anchorHeadings adds unique ids and returns a table of contents', () => {
  const result = anchorHeadings('<h2>Problem</h2><p>x</p><h2>Problem</h2><h3>Next check</h3>');

  assert.match(result.html, /<h2 id="problem">/);
  assert.match(result.html, /<h2 id="problem-2">/);
  assert.match(result.html, /href="#problem"/);
  assert.deepEqual(result.headings.map(({ id, text, level }) => ({ id, text, level })), [
    { id: 'problem', text: 'Problem', level: 2 },
    { id: 'problem-2', text: 'Problem', level: 2 },
    { id: 'next-check', text: 'Next check', level: 3 },
  ]);
});

test('index page links each investigation to its stable site URL', () => {
  const html = renderIndexPage({
    issues: [issue],
    siteUrl: 'https://chinhbui.github.io/apple-platform-issue-guide',
  });

  assert.match(html, /href="\.\/issues\/6\/"/);
  assert.match(html, /data-issue-card/);
  assert.match(html, /data-search=/);
  assert.match(html, /data-labels=/);
  assert.match(html, /name="q"/);
  assert.match(html, /\?label=area%2Fhls/);
});

test('issue page exposes canonical document and section links', () => {
  const html = renderIssuePage({
    issue,
    siteUrl: 'https://chinhbui.github.io/apple-platform-issue-guide',
  });

  assert.match(html, /rel="canonical" href="https:\/\/chinhbui\.github\.io\/apple-platform-issue-guide\/issues\/6\/"/);
  assert.match(html, /href="https:\/\/github\.com\/chinhbui\/apple-platform-issue-guide\/issues\/6"/);
  assert.match(html, /id="problem"/);
  assert.match(html, /href="#evidence-level"/);
  assert.match(html, /href="#verification"/);
  assert.match(html, /data-copy-link/);
});
