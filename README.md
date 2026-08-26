# Apple Platform Issue Guide

A practical engineering knowledge base for Apple platform issues reported through Apple Developer Forums, documentation, release notes, WWDC sessions, and reproducible platform behavior.

Each GitHub Issue should answer two questions:

1. What is the issue?
2. What should an engineer do about it?

## Scope

Initial focus:

- AVFoundation / AVPlayer
- HLS / LL-HLS
- FairPlay Streaming
- CoreMedia
- VideoToolbox
- Apple networking behavior relevant to media playback
- iOS / iPadOS / tvOS

## Issue format

Every issue should contain at minimum:

- Title
- Labels
- Source
- Problem
- Solution / Guideline

Recommended additions:

- Environment
- Symptoms
- Cause / Explanation
- Evidence level
- Verification
- References

## Title convention

```text
[Area] Observable problem
```

Examples:

```text
[AVFoundation] AVPlayer stops when catch-up playback reaches live boundary
[FairPlay] AVContentKeyRequest fails after key rotation
[HLS] LL-HLS playback stalls when blocking playlist reload is invalid
[CoreMedia] Error -12888 when live playlist stops updating
```

Avoid vague titles such as `AVPlayer bug` or `HLS issue`.

## Evidence levels

### Apple Confirmed

Supported by Apple documentation, release notes, WWDC, DTS, or an explicit Apple engineer statement.

### Reproduced

Consistently reproduced experimentally, but not documented as a platform contract.

### Inferred

Derived from logs, experiments, implementation behavior, or reverse engineering.

Never present inferred behavior as an Apple contract.

## Label convention

### Framework

- `framework:avfoundation`
- `framework:avkit`
- `framework:coremedia`
- `framework:videotoolbox`
- `framework:network`
- `framework:uikit`

### Area

- `area:hls`
- `area:ll-hls`
- `area:fairplay`
- `area:abr`
- `area:drm`
- `area:playback`
- `area:networking`

### Type

- `type:bug`
- `type:platform-behavior`
- `type:known-issue`
- `type:guideline`
- `type:workaround`
- `type:documentation-gap`

### Evidence

- `evidence:apple-confirmed`
- `evidence:apple-forum`
- `evidence:documentation`
- `evidence:release-notes`
- `evidence:wwdc`
- `evidence:reproduced`
- `evidence:inferred`

### Platform

- `platform:ios`
- `platform:ipados`
- `platform:tvos`
- `platform:macos`

### Status

- `status:investigating`
- `status:reproduced`
- `status:confirmed`
- `status:workaround`
- `status:resolved`

## Workflow

```text
Apple source
   ↓
Create issue
   ↓
Reproduce / analyze
   ↓
Determine evidence level
   ↓
Document solution / guideline
   ↓
Verify
   ↓
Reference from topic guide
```

## Repository rule

This repository should not simply archive Apple forum discussions.

Every useful entry should transform a source into:

```text
Problem → Evidence → Platform behavior → Engineering guideline → Verification
```
