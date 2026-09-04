const REPO_URL = 'https://github.com/chinhbui/apple-platform-issue-guide';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function decodeEntities(value = '') {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textFromHtml(value = '') {
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function sentenceCase(value = '') {
  const text = String(value).replace(/[-_]+/g, ' ').trim();
  return text ? text[0].toUpperCase() + text.slice(1) : '';
}

function labelDisplay(label) {
  const [group, ...rest] = String(label).split('/');
  const value = rest.length ? rest.join('/') : group;
  if (group === 'evidence' && value === 'apple-confirmed') return 'Apple confirmed';
  if (group === 'triage' && value === 'root-cause-known') return 'Root cause known';
  return sentenceCase(value);
}

function leadingDomain(title = '') {
  const match = String(title).match(/^\[([^\]]+)\]\s*/);
  return match ? match[1] : 'Investigation';
}

function displayTitle(title = '') {
  return String(title).replace(/^\[[^\]]+\]\s*/, '').trim();
}

function normalizeSiteUrl(siteUrl) {
  return String(siteUrl || '').replace(/\/+$/, '');
}

export function slugify(text) {
  const slug = textFromHtml(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
  return slug || 'section';
}

export function anchorHeadings(html = '') {
  const counts = new Map();
  const headings = [];
  const rendered = String(html).replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelText, attrs, inner) => {
    const level = Number(levelText);
    const text = textFromHtml(inner);
    const base = slugify(text);
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    headings.push({ id, text, level });
    const cleanedAttrs = attrs.replace(/\s+id=("[^"]*"|'[^']*'|[^\s>]+)/i, '');
    return `<h${level} id="${escapeHtml(id)}"${cleanedAttrs}>${inner}<a class="section-anchor" href="#${escapeHtml(id)}" aria-label="Link to ${escapeHtml(text)}">#</a></h${level}>`;
  });
  return { html: rendered, headings };
}

function documentHead({ title, description, canonical, assetPrefix = './', ogType = 'article' }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonical = escapeHtml(canonical);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <link rel="canonical" href="${safeCanonical}">
  <meta name="theme-color" content="#f4f1ea">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:url" content="${safeCanonical}">
  <link rel="stylesheet" href="${assetPrefix}styles.css">
</head>`;
}

function siteHeader({ homeHref = './' } = {}) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="shell header-inner">
    <a class="brand" href="${homeHref}" aria-label="Apple Platform Issue Guide home">
      <span class="brand-mark" aria-hidden="true">AP</span>
      <span><strong>Apple Platform</strong><small>Issue Guide</small></span>
    </a>
    <nav class="header-nav" aria-label="Primary">
      <a href="${homeHref}#investigations">Investigations</a>
      <a href="${REPO_URL}/issues">GitHub Issues</a>
      <a class="repo-link" href="${REPO_URL}">Repository <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
</header>`;
}

function labelPills(labels = [], limit = 8) {
  return labels.slice(0, limit).map((label) => {
    const group = String(label).split('/')[0];
    return `<span class="label label-${escapeHtml(group)}">${escapeHtml(labelDisplay(label))}</span>`;
  }).join('');
}

function issueSearchText(issue) {
  return [issue.number, issue.title, ...issue.labels].join(' ').toLowerCase();
}

function renderIssueCard(issue) {
  const state = issue.state === 'closed' ? 'Closed' : 'Open';
  const labels = issue.labels || [];
  return `<article class="issue-card" data-issue-card data-search="${escapeHtml(issueSearchText(issue))}" data-labels="${escapeHtml(labels.join('|'))}">
  <a class="issue-card-link" href="./issues/${issue.number}/" aria-label="Open investigation ${issue.number}: ${escapeHtml(displayTitle(issue.title))}">
    <div class="issue-card-meta">
      <span class="issue-number">#${String(issue.number).padStart(3, '0')}</span>
      <span class="domain">${escapeHtml(leadingDomain(issue.title))}</span>
      <span class="state state-${issue.state}">${state}</span>
    </div>
    <h3>${escapeHtml(displayTitle(issue.title))}</h3>
    <div class="label-row">${labelPills(labels, 5)}</div>
    <span class="card-arrow" aria-hidden="true">→</span>
  </a>
</article>`;
}

function topFilterLabels(issues) {
  const counts = new Map();
  for (const issue of issues) {
    for (const label of issue.labels || []) {
      if (!/^(area|framework|platform|evidence)\//.test(label)) continue;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([label]) => label);
}

export function renderIndexPage({ issues = [], siteUrl }) {
  const baseUrl = normalizeSiteUrl(siteUrl);
  const filters = topFilterLabels(issues);
  const issueWord = issues.length === 1 ? 'investigation' : 'investigations';
  const cards = issues.map(renderIssueCard).join('\n');
  const filterLinks = filters.map((label) => `<a class="filter-chip" data-filter-link data-label="${escapeHtml(label)}" href="?label=${encodeURIComponent(label)}#investigations">${escapeHtml(labelDisplay(label))}</a>`).join('');
  const description = 'Evidence-graded engineering investigations for AVFoundation, HLS, FairPlay, CoreMedia, iOS, and tvOS.';

  return `${documentHead({
    title: 'Apple Platform Issue Guide',
    description,
    canonical: `${baseUrl}/`,
    assetPrefix: './',
    ogType: 'website',
  })}
<body data-page="index">
${siteHeader({ homeHref: './' })}
<main id="main">
  <section class="hero shell">
    <div class="hero-main">
      <p class="eyebrow">Evidence-graded engineering knowledge base</p>
      <h1>Apple playback investigations, written to be <em>linked</em>.</h1>
      <p class="hero-copy">Diagnose AVFoundation, HLS and LL-HLS, FairPlay Streaming, CoreMedia, and related Apple platform behavior from durable engineering records.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="#investigations">Browse investigations <span aria-hidden="true">↓</span></a>
        <a class="button button-secondary" href="${REPO_URL}">View source on GitHub</a>
      </div>
    </div>
    <aside class="hero-aside" aria-label="Knowledge base principles">
      <div><span>01</span><strong>Durable URLs</strong><small>Every issue and material section is addressable.</small></div>
      <div><span>02</span><strong>Evidence first</strong><small>Labels expose how strongly a conclusion is supported.</small></div>
      <div><span>03</span><strong>GitHub canonical</strong><small>Discussion and authoring stay attached to the source issue.</small></div>
    </aside>
  </section>

  <section class="investigations shell" id="investigations" aria-labelledby="investigations-heading">
    <div class="section-topline">
      <div>
        <p class="section-kicker">Knowledge index</p>
        <h2 id="investigations-heading">Investigations</h2>
      </div>
      <p class="result-count" aria-live="polite"><strong data-result-count>${issues.length}</strong> ${issueWord}</p>
    </div>

    <form class="search-panel" data-search-form action="./" method="get" role="search">
      <label for="issue-search">Search symptoms, APIs, error codes, or labels</label>
      <div class="search-row">
        <input id="issue-search" data-search-input name="q" type="search" autocomplete="off" placeholder="FairPlay, -42811, live edge…">
        <button type="submit">Search</button>
      </div>
      <div class="filter-row" aria-label="Common filters">
        <a class="filter-chip filter-all" href="./#investigations">All</a>
        ${filterLinks}
      </div>
    </form>

    <div class="issue-list" data-issue-list>
      ${cards || '<div class="empty-state"><strong>No investigations yet.</strong><p>Create a GitHub issue to add the first engineering record.</p></div>'}
    </div>
    <div class="empty-state" data-filter-empty hidden><strong>No matching investigations.</strong><p>Clear the search or choose another label.</p></div>
  </section>

  <section class="method-section">
    <div class="shell method-grid">
      <div><p class="section-kicker">Method</p><h2>Problem → evidence → platform behavior → guideline → verification.</h2></div>
      <p>Each record separates documented platform contract from reproduced behavior and engineering inference. The site is a reading layer; GitHub remains the place to author, discuss, and revise the underlying issue.</p>
    </div>
  </section>
</main>
<footer class="site-footer"><div class="shell footer-inner"><span>Apple Platform Issue Guide</span><a href="${REPO_URL}">GitHub source ↗</a></div></footer>
<script src="./client.js" type="module"></script>
</body>
</html>`;
}

function renderToc(headings) {
  const items = headings.filter(({ level }) => level === 2 || level === 3);
  if (!items.length) return '';
  return `<nav class="toc" aria-label="On this page">
    <p>On this page</p>
    <ol>${items.map(({ id, text, level }) => `<li class="toc-level-${level}"><a href="#${escapeHtml(id)}">${escapeHtml(text)}</a></li>`).join('')}</ol>
  </nav>`;
}

function evidenceLabel(issue) {
  const evidence = (issue.labels || []).find((label) => label.startsWith('evidence/'));
  return evidence ? labelDisplay(evidence) : 'Evidence not classified';
}

export function renderIssuePage({ issue, siteUrl }) {
  const baseUrl = normalizeSiteUrl(siteUrl);
  const canonical = `${baseUrl}/issues/${issue.number}/`;
  const anchored = anchorHeadings(issue.bodyHtml || '<p>No issue body has been published yet.</p>');
  const title = displayTitle(issue.title);
  const description = `${leadingDomain(issue.title)} investigation #${issue.number}: ${title}`;
  const state = issue.state === 'closed' ? 'Closed' : 'Open';

  return `${documentHead({
    title: `${title} — Apple Platform Issue Guide`,
    description,
    canonical,
    assetPrefix: '../../',
  })}
<body data-page="issue">
${siteHeader({ homeHref: '../../' })}
<main id="main" class="article-shell shell">
  <header class="article-header">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../">Apple Platform</a><span>/</span><a href="../../#investigations">${escapeHtml(leadingDomain(issue.title))}</a><span>/</span><span>#${issue.number}</span></nav>
    <div class="article-meta-line">
      <span class="issue-number">#${String(issue.number).padStart(3, '0')}</span>
      <span class="domain">${escapeHtml(leadingDomain(issue.title))}</span>
      <span class="state state-${escapeHtml(issue.state)}">${state}</span>
    </div>
    <h1>${escapeHtml(title)}</h1>
    <div class="article-labels">${labelPills(issue.labels || [], 12)}</div>
    <div class="article-actions">
      <a class="button button-primary" href="${escapeHtml(issue.htmlUrl)}">GitHub source <span aria-hidden="true">↗</span></a>
      <button class="button button-secondary" type="button" data-copy-link data-copy-value="${escapeHtml(canonical)}">Copy page link</button>
    </div>
    <p class="source-note"><strong>${escapeHtml(evidenceLabel(issue))}.</strong> This page is generated from GitHub Issue #${issue.number}; GitHub remains the canonical authoring and discussion source.</p>
  </header>

  <div class="article-layout">
    <aside class="toc-column">${renderToc(anchored.headings)}</aside>
    <article class="prose" data-article-body>
      ${anchored.html}
      <footer class="article-source-footer">
        <span>End of investigation #${issue.number}</span>
        <a href="${escapeHtml(issue.htmlUrl)}">View or discuss on GitHub ↗</a>
      </footer>
    </article>
  </div>
</main>
<footer class="site-footer"><div class="shell footer-inner"><a href="../../">← All investigations</a><a href="${REPO_URL}">Repository ↗</a></div></footer>
<script src="../../client.js" type="module"></script>
</body>
</html>`;
}
