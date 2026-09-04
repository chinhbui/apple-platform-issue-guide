# Linkable Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a deep-linkable GitHub Pages knowledge base from repository Issues while keeping Issues as the canonical content source.

**Architecture:** A dependency-free Node build fetches GitHub Issues in their full rendered representation, normalizes records, adds deterministic anchors to rendered headings, and writes a static index plus `/issues/<number>/index.html` pages. A tiny progressive-enhancement script handles index query/label filtering and copy-link actions; GitHub Actions runs tests, builds `_site`, and deploys only from the default branch.

**Tech Stack:** Node.js ES modules, Node built-in test runner, static HTML/CSS/JavaScript, GitHub REST API, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-04-linkable-knowledge-base-design.md`

## Global Constraints

- GitHub Issues remain the canonical authoring and discussion source.
- Investigation URLs are `/issues/<number>/`.
- Material issue-body headings receive deterministic fragment IDs.
- No SPA/router and no third-party runtime dependency.
- Closed issues remain readable and visibly marked closed.
- Pull requests returned by the Issues REST endpoint are excluded.
- No decorative page-transition or scroll animation.
- Feature branches must not deploy GitHub Pages.

---

### Task 1: Renderer contract and tests

**Files:**
- Create: `site/tests/render.test.mjs`
- Create: `site/lib/render.mjs`

**Interfaces:**
- Produces: `slugify(text) -> string`
- Produces: `anchorHeadings(html) -> { html, headings }`
- Produces: `renderIndexPage({ issues, siteUrl }) -> string`
- Produces: `renderIssuePage({ issue, siteUrl }) -> string`

- [ ] **Step 1: Write failing renderer tests**

Cover slug normalization, duplicate heading IDs, direct issue links from the index, canonical issue URLs, GitHub-source links, and section anchors.

- [ ] **Step 2: Run the renderer test and verify RED**

Run:

```bash
node --test site/tests/render.test.mjs
```

Expected: FAIL because `site/lib/render.mjs` does not exist.

- [ ] **Step 3: Implement the minimal renderer**

Implement HTML escaping for metadata, deterministic heading IDs, table-of-contents extraction, static index cards, article layout, canonical/Open Graph metadata, and visible GitHub source links.

- [ ] **Step 4: Run the renderer test and verify GREEN**

```bash
node --test site/tests/render.test.mjs
```

Expected: all renderer tests PASS.

### Task 2: GitHub issue ingestion and build orchestration

**Files:**
- Create: `site/tests/github.test.mjs`
- Create: `site/lib/github.mjs`
- Create: `site/build.mjs`
- Create: `site/fixtures/issues.json`

**Interfaces:**
- Produces: `normalizeIssue(raw) -> normalized issue`
- Produces: `filterIssues(items) -> normalized issue[]`
- Produces: `fetchIssues({ repository, token, fetchImpl }) -> Promise<issue[]>`
- `site/build.mjs` consumes normalized issues and renderer functions and writes an output directory.

- [ ] **Step 1: Write failing ingestion tests**

Test that pull-request-shaped items are excluded, labels are normalized to strings, closed issues remain present, and pagination can continue when a 100-item page is returned.

- [ ] **Step 2: Run ingestion tests and verify RED**

```bash
node --test site/tests/github.test.mjs
```

Expected: FAIL because `site/lib/github.mjs` does not exist.

- [ ] **Step 3: Implement GitHub ingestion**

Use `Accept: application/vnd.github.full+json`, optional bearer authentication, `per_page=100`, and a clear thrown error for non-2xx responses.

- [ ] **Step 4: Implement build orchestration**

Support:

```bash
node site/build.mjs --output _site
node site/build.mjs --output _site --fixture site/fixtures/issues.json
```

The fixture path is used for deterministic verification without network access.

- [ ] **Step 5: Run ingestion tests and verify GREEN**

```bash
node --test site/tests/github.test.mjs
```

Expected: all ingestion tests PASS.

### Task 3: Progressive enhancement and visual system

**Files:**
- Create: `site/client.js`
- Modify: `site/styles.css`
- Stop using committed `site/index.html` as the production homepage; the build generates the output index.

**Interfaces:**
- Index cards expose `data-issue-card`, `data-search`, and `data-labels`.
- Search uses query parameter `q`.
- Label filters use query parameter `label`.
- Copy controls expose `data-copy-link`.

- [ ] **Step 1: Add DOM contract assertions to renderer tests**

Assert search/filter controls, card data attributes, permalink controls, and copy-link controls exist in generated HTML.

- [ ] **Step 2: Run tests and verify RED**

```bash
node --test site/tests/render.test.mjs
```

Expected: the new DOM-contract assertions FAIL.

- [ ] **Step 3: Extend renderer and add `client.js`**

Implement progressive filtering from `?q=` and `?label=`, result-count updates, copy-link feedback, and no-op behavior when the relevant controls are absent.

- [ ] **Step 4: Replace the visual system**

Use an editorial engineering-document layout: compact sticky header, restrained hero, high-density investigation cards, monospaced metadata, readable article measure, sticky TOC on wide screens, in-flow TOC on narrow screens, visible focus, and reduced-motion handling.

- [ ] **Step 5: Run renderer tests and verify GREEN**

```bash
node --test site/tests/render.test.mjs
```

Expected: all renderer tests PASS.

### Task 4: Pages workflow and build verification

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Workflow sets `GITHUB_REPOSITORY` and passes `${{ secrets.GITHUB_TOKEN }}` as `GITHUB_TOKEN` to the build.
- Workflow uploads `_site` instead of `site`.

- [ ] **Step 1: Update workflow triggers and permissions**

Add issue-event triggers for `opened`, `edited`, `closed`, `reopened`, `labeled`, `unlabeled`, and `deleted`; add `issues: read`; retain Pages write/id-token permissions.

- [ ] **Step 2: Add test and build steps**

Run:

```bash
node --test site/tests/*.test.mjs
node site/build.mjs --output _site
```

before the Pages artifact upload.

- [ ] **Step 3: Verify fixture build locally**

```bash
rm -rf _site
node site/build.mjs --output _site --fixture site/fixtures/issues.json
node --test site/tests/*.test.mjs
```

Expected:

```text
_site/index.html
_site/styles.css
_site/client.js
_site/issues/5/index.html
_site/issues/6/index.html
```

and all tests PASS.

- [ ] **Step 4: Inspect generated URLs and anchors**

Check generated HTML contains:

```text
/issues/6/
/issues/6/#problem
/issues/6/#evidence-level
/issues/6/#verification
```

and links back to the canonical GitHub issue.

### Task 5: Branch completion

**Files:** no production file changes required unless verification finds a defect.

- [ ] **Step 1: Run complete verification**

```bash
node --test site/tests/*.test.mjs
rm -rf _site
node site/build.mjs --output _site --fixture site/fixtures/issues.json
```

- [ ] **Step 2: Review branch diff for accidental deployment or unrelated changes**

Confirm the work is only on `design/linkable-knowledge-base`, and the workflow still deploys only when it runs from the default branch context.

- [ ] **Step 3: Open a pull request to `main`**

The PR description must call out the URL contract, source-of-truth model, workflow issue triggers, test coverage, and the fact that merging will cause the Pages workflow to publish the redesign.
