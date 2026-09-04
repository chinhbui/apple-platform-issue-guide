# GitHub Pages Design

## Goal

Publish a lightweight GitHub Pages site for `chinhbui/apple-platform-issue-guide` at:

`https://chinhbui.github.io/apple-platform-issue-guide/`

The site should make the repository easier to discover and browse without duplicating the issue knowledge base.

## Product boundary

GitHub Issues remain the canonical incident and investigation store. The Pages site is a navigational and explanatory front door, not a second content system.

The site must not mirror or regenerate all issue bodies. Links should send readers to the live GitHub Issues, label views, authoring guide, and repository source.

## Information architecture

The landing page contains:

1. Repository title and one-sentence purpose.
2. Primary actions:
   - Browse issues
   - View repository on GitHub
3. Coverage summary:
   - AVFoundation / AVPlayer
   - HLS / LL-HLS
   - FairPlay Streaming
   - CoreMedia / VideoToolbox
   - iOS / iPadOS / tvOS / macOS
4. Evidence model:
   - Apple Confirmed
   - Reproduced
   - Inferred
5. Quick links:
   - GitHub Issues
   - Label taxonomy
   - Issue authoring guide
   - Example investigation
   - Contributing guide
6. Short repository principle explaining that entries move from observable problem to evidence, platform behavior, guideline, and verification.

## Visual direction

Use a restrained engineering-documentation aesthetic rather than a marketing landing page.

- Dark text on a light background.
- One restrained accent color aligned with Apple-platform / GitHub documentation conventions.
- Strong typography and spacing.
- Responsive layout for desktop and mobile.
- No framework dependency, animation system, or client-side application runtime.
- No decorative imagery required.

## Implementation architecture

Use a small static site committed under `site/`:

- `site/index.html` — semantic page structure and copy.
- `site/styles.css` — responsive presentation only.

Publish with GitHub Actions using the official Pages deployment actions. The workflow will package `site/` as the Pages artifact and deploy it on pushes to `main` that change site or Pages workflow files.

The deployment workflow will use GitHub's built-in `GITHUB_TOKEN` and Pages permissions rather than a personal access token.

## Repository metadata

Update `.github/repository-metadata.json` so `homepage` is:

`https://chinhbui.github.io/apple-platform-issue-guide/`

The existing repository-metadata sync workflow will then publish that URL into the repository Website field.

## Navigation targets

The landing page will use these canonical targets:

- Repository: `https://github.com/chinhbui/apple-platform-issue-guide`
- Issues: `https://github.com/chinhbui/apple-platform-issue-guide/issues`
- Labels: `https://github.com/chinhbui/apple-platform-issue-guide/labels`
- Label taxonomy: `https://github.com/chinhbui/apple-platform-issue-guide/blob/main/docs/labels.md`
- Authoring guide: `https://github.com/chinhbui/apple-platform-issue-guide/blob/main/docs/issue-authoring-guide.md`
- Example investigation: `https://github.com/chinhbui/apple-platform-issue-guide/blob/main/examples/avplayer-live-edge.md`
- Contributing: `https://github.com/chinhbui/apple-platform-issue-guide/blob/main/CONTRIBUTING.md`

## Deployment workflow

The Pages workflow will:

1. Trigger on pushes to `main` affecting `site/**` or the Pages workflow itself, plus manual dispatch.
2. Check out the repository.
3. Configure GitHub Pages.
4. Upload `site/` with the official Pages artifact action.
5. Deploy with the official Pages deployment action.

Required permissions:

- `contents: read`
- `pages: write`
- `id-token: write`

The deployment job will use the `github-pages` environment and expose the deployment URL as its environment URL.

## Verification

Implementation is complete only when all of the following are true:

- The Pages workflow completes successfully.
- `https://chinhbui.github.io/apple-platform-issue-guide/` returns the published site.
- The repository Website field points to the same Pages URL.
- Primary navigation links resolve to the intended repository resources.
- The landing page remains usable at narrow mobile widths without horizontal scrolling.
- No issue content is duplicated into a second static knowledge base.

## Non-goals

- Full-text issue search outside GitHub.
- A Jekyll, Hugo, Docusaurus, Next.js, or other static-site-generator dependency.
- Mirroring every issue into static HTML.
- Custom domains.
- Analytics, comments, authentication, or client-side state.
