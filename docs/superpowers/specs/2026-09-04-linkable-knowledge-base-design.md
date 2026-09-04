# Linkable Knowledge Base Design

## Goal

Turn the GitHub Pages site into the primary reading surface for the repository while keeping GitHub Issues as the canonical authoring and discussion source. Every investigation must have a stable site URL and every material section inside an investigation must have a stable fragment URL.

## Approved outcome

The site exposes this URL contract:

```text
/                                      knowledge index
/issues/<number>/                      investigation document
/issues/<number>/#<section-slug>       directly linkable section
```

Example:

```text
/issues/6/
/issues/6/#problem
/issues/6/#evidence-level
/issues/6/#investigation
/issues/6/#solution-guideline
/issues/6/#verification
```

## Source of truth

GitHub Issues remain canonical. The generated site never creates a second editable content store. The build reads issue title, state, labels, URL, timestamps, and GitHub-rendered body HTML and emits static documents.

## Journey

### Index

The homepage becomes an engineering knowledge index rather than a marketing landing page. It contains:

- a compact product statement;
- search and label-filter controls;
- one card per repository issue;
- evidence, platform, framework, and area metadata derived from labels;
- direct links to `/issues/<number>/`;
- links back to the GitHub repository and issue tracker.

### Investigation

Each investigation page contains:

- breadcrumb and issue number;
- title, state, and label metadata;
- sticky desktop table of contents;
- GitHub-rendered issue body;
- deterministic anchors on headings;
- per-section permalink controls;
- a copy-page-link action;
- a prominent link to the canonical GitHub issue.

On narrow viewports the table of contents becomes an in-flow block above the article.

## Build architecture

No application framework or third-party runtime package is required.

```text
GitHub issue event or site push
          ↓
GitHub Actions
          ↓
Node build script
          ↓
GitHub Issues REST API (full representation)
          ↓
normalized issue records
          ↓
static renderer
          ↓
_site/index.html
_site/issues/<number>/index.html
_site/styles.css
_site/client.js
          ↓
GitHub Pages artifact
```

The build uses the GitHub full media representation so issue bodies arrive as GitHub-rendered, sanitized HTML. The renderer adds deterministic heading IDs and permalink controls without attempting to implement Markdown itself.

## URL and anchor rules

- Investigation URLs use the immutable GitHub issue number.
- Heading anchors are generated from visible heading text with lowercase ASCII-compatible slugs.
- Duplicate headings receive numeric suffixes (`-2`, `-3`, ...).
- Existing issue edits may change a section slug if the heading text changes; the issue URL itself remains stable.
- Canonical metadata points to the site investigation URL, while the page visibly identifies the GitHub issue as the canonical authoring source.

## Filtering

Index filtering is progressive enhancement:

- each card is rendered server-side into static HTML;
- query text uses `?q=`;
- label filtering uses `?label=`;
- client JavaScript reads those parameters and hides non-matching cards;
- without JavaScript, all issue cards remain visible and directly navigable.

## Accessibility and motion

- semantic headings, landmarks, lists, forms, and links remain real HTML;
- keyboard focus is clearly visible;
- controls provide at least 24×24 CSS-pixel target dimensions and are designed larger where practical;
- the article remains readable without client JavaScript;
- no decorative page-transition or scroll animation is introduced;
- hover/focus state changes are the only motion, and reduced-motion mode disables nonessential transitions.

## Failure behavior

The build fails instead of publishing a silently incomplete site when the Issues API is unavailable or returns an unexpected response. Pull requests returned by the Issues endpoint are excluded. Closed issues remain readable and are marked as closed; this preserves durable links to resolved investigations.

## Workflow triggers

Pages rebuilds on:

- pushes to `main` affecting `site/**` or the deploy workflow;
- issue opened, edited, closed, reopened, labeled, unlabeled, or deleted events;
- manual workflow dispatch.

A feature branch must not deploy Pages.

## Testing

Node's built-in test runner covers:

- heading slug generation and duplicate handling;
- heading-anchor injection and table-of-contents extraction;
- issue normalization and pull-request exclusion;
- index cards linking to `/issues/<number>/`;
- investigation canonical URL, GitHub source link, and section anchors.

The build is also executed against fixture issue data during verification so generated files can be inspected without calling GitHub.

## Non-goals

- replacing GitHub Issues as the authoring UI;
- comments or reactions on the Pages site;
- a client-side SPA/router;
- external search infrastructure;
- copying issue bodies into committed article files;
- deployment from the implementation branch.
