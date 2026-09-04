# GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a lightweight GitHub Pages front door for the Apple Platform Issue Guide and link the repository Website field to it.

**Architecture:** Commit a dependency-free static site under `site/` and deploy that directory with GitHub's official Pages Actions. Keep GitHub Issues as the canonical knowledge base; the site only explains the project and links into live repository resources.

**Tech Stack:** HTML5, CSS, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-04-github-pages-design.md`

## Global Constraints

- Pages URL: `https://chinhbui.github.io/apple-platform-issue-guide/`.
- GitHub Issues remain the canonical incident and investigation store.
- No Jekyll, Hugo, Docusaurus, Next.js, JavaScript framework, analytics, authentication, or custom domain.
- Deployment uses official GitHub Pages Actions and repository-scoped workflow permissions.
- The landing page must remain responsive without horizontal scrolling.

---

### Task 1: Static landing page

**Files:**
- Create: `site/index.html`
- Create: `site/styles.css`

**Interfaces:**
- Consumes: canonical repository URLs from the design spec.
- Produces: a self-contained static directory deployable as a Pages artifact.

- [ ] **Step 1: Create semantic landing-page HTML**

Include the project purpose, Browse Issues and GitHub repository actions, coverage summary, evidence model, quick links, and repository principle. Use relative `styles.css` only; no JavaScript or external runtime dependency.

- [ ] **Step 2: Create responsive CSS**

Use system fonts, restrained documentation styling, responsive grids, visible keyboard focus, and a mobile breakpoint that collapses multi-column sections.

- [ ] **Step 3: Verify site source**

Confirm `site/index.html` references only existing repository URLs and `styles.css`, contains a viewport meta tag, and contains no fixed-width layout that requires horizontal scrolling.

### Task 2: GitHub Pages deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: `site/` from Task 1.
- Produces: GitHub Pages deployment at `https://chinhbui.github.io/apple-platform-issue-guide/`.

- [ ] **Step 1: Add official Pages workflow**

Use `actions/checkout@v6`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, and `actions/deploy-pages@v4`. Upload `./site` and grant `contents: read`, `pages: write`, and `id-token: write`.

- [ ] **Step 2: Trigger deployment**

Run on pushes to `main` affecting `site/**` or the workflow itself, plus `workflow_dispatch`.

- [ ] **Step 3: Verify Actions**

Inspect the resulting workflow run. If it fails, use the failing step and logs to identify the exact Pages configuration or permission problem before changing the workflow.

### Task 3: Repository Website metadata

**Files:**
- Modify: `.github/repository-metadata.json`

**Interfaces:**
- Consumes: the stable Pages URL.
- Produces: GitHub repository Website/Homepage metadata synchronized by the existing repository-metadata workflow.

- [ ] **Step 1: Set homepage**

Set `homepage` to `https://chinhbui.github.io/apple-platform-issue-guide/` without changing description or topics.

- [ ] **Step 2: Verify metadata sync**

Inspect the existing `Sync repository metadata` workflow and verify the repository metadata reflects the Pages URL.

### Task 4: End-to-end verification

**Files:** none

- [ ] **Step 1: Verify deployment workflow completes successfully**
- [ ] **Step 2: Fetch the live Pages URL and confirm the landing-page title/content is served**
- [ ] **Step 3: Verify primary GitHub navigation targets resolve**
- [ ] **Step 4: Verify repository Website field points to the Pages URL**
