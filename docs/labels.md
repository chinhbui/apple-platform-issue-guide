# Labels

This repository uses a structured `family/value` label taxonomy inspired by mature projects such as Kubernetes and Rust. The label name carries the primary meaning; color is a secondary visual cue for the family or confidence/state.

## Rules

- Use `/` to separate a label family from its value.
- Keep dimensions independent: source is not evidence strength, and evidence strength is not triage state.
- Reuse colors within a family instead of assigning an arbitrary color to every label.
- Prefer labels that answer one clear question.

## Framework

Which Apple framework or API surface is involved?

- `framework/avfoundation`
- `framework/avkit`
- `framework/coremedia`
- `framework/videotoolbox`
- `framework/network`
- `framework/uikit`

Framework labels use blue.

## Area

Which technical domain is involved?

- `area/hls`
- `area/ll-hls`
- `area/fairplay`
- `area/abr`
- `area/drm`
- `area/playback`
- `area/networking`

Area labels use the same strong blue so related technical domains scan as one family.

## Kind

What kind of entry is this?

- `kind/bug`
- `kind/regression`
- `kind/platform-behavior`
- `kind/known-issue`
- `kind/guideline`
- `kind/documentation-gap`

`kind/bug` and `kind/regression` use red because they identify failure classes. Guidance and informational kinds use quieter colors.

An issue can carry both `kind/bug` and `kind/regression`, matching the pattern used by large triage-oriented repositories.

## Evidence

How strongly is the engineering conclusion supported?

- `evidence/apple-confirmed`
- `evidence/reproduced`
- `evidence/inferred`

Evidence color carries confidence semantics:

- green — Apple confirmed or independently reproduced
- yellow — inferred from observations, experiments, logs, or implementation behavior

## Source

Where did the evidence originate?

- `source/apple-forum`
- `source/apple-docs`
- `source/apple-release-notes`
- `source/wwdc`

Source labels use muted blue because they are provenance metadata rather than confidence indicators.

A source label and an evidence label are deliberately independent. For example:

```text
source/apple-forum
evidence/apple-confirmed
```

means an Apple Developer Forums thread contains an explicit Apple confirmation, while:

```text
source/apple-forum
evidence/inferred
```

means the forum case is the source but the engineering conclusion remains inferred.

## Platform

Which Apple platform is affected?

- `platform/ios`
- `platform/ipados`
- `platform/tvos`
- `platform/macos`

Platform labels are filtering metadata and use a green/teal family.

## Triage

What is the current investigation state?

- `triage/needs-evidence`
- `triage/investigating`
- `triage/root-cause-known`

Triage labels describe workflow state only. They must not duplicate evidence strength.

## Resolution

What outcome is available?

- `resolution/workaround`
- `resolution/resolved`

Use `resolution/workaround` when a practical mitigation exists even though the underlying platform behavior remains unchanged.

## Migration from the original taxonomy

The repository automatically migrates the original colon-based labels. Key mappings include:

```text
area:hls                    → area/hls
type:bug                    → kind/bug
evidence:apple-forum        → source/apple-forum
evidence:apple-confirmed    → evidence/apple-confirmed
platform:ios                → platform/ios
status:investigating        → triage/investigating
status:confirmed            → triage/root-cause-known
type:workaround             → resolution/workaround
status:workaround           → resolution/workaround
```

The canonical definition, colors, descriptions, and aliases live in `.github/labels.json` and are synchronized by `.github/workflows/sync-labels.yml`.
