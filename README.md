# Apple Platform Issue Guide

> Evidence-graded engineering guidance for diagnosing Apple platform behavior.

A practical knowledge base for engineers working with Apple media and playback technologies. The repository turns Apple Developer Forums discussions, documentation, release notes, WWDC sessions, reproducible experiments, and implementation observations into guidance that can be applied and verified.

This is **not an official Apple repository**. Behavior marked as inferred is an implementation observation, not an Apple platform contract.

## Start here

- [Browse issues](https://github.com/chinhbui/apple-platform-issue-guide/issues) — search known symptoms, APIs, error codes, and platform behavior.
- [Example investigation](examples/avplayer-live-edge.md) — see the expected structure of an engineering entry.
- [Issue authoring guide](docs/issue-authoring-guide.md) — how to document a new issue.
- [Label taxonomy](docs/labels.md) — framework, area, platform, evidence, type, and status labels.
- [Contributing](CONTRIBUTING.md) — contribution and evidence requirements.

## What this repository provides

When an Apple platform issue appears in production or testing, an entry should help answer five questions:

1. **What can I observe?**
2. **What evidence supports the explanation?**
3. **What platform behavior is relevant?**
4. **What should the client engineer do?**
5. **How can the conclusion be verified?**

The repository uses one canonical investigation model:

```text
Problem → Evidence → Platform behavior → Engineering guideline → Verification
```

The goal is not to archive discussions. The goal is to turn scattered platform information into a compact engineering decision record.

## Coverage

| Area | Current focus |
| --- | --- |
| Playback | AVFoundation, AVPlayer, AVKit |
| Streaming | HLS, LL-HLS, live playback, ABR behavior |
| DRM | FairPlay Streaming, AVContentKeySession, key lifecycle |
| Media pipeline | CoreMedia, VideoToolbox |
| Networking | Apple client networking behavior relevant to media playback |
| Platforms | iOS, iPadOS, tvOS, and macOS where the behavior applies |

The initial emphasis is media playback and streaming. The same evidence model can be extended to other Apple frameworks when useful.

## Find an issue

Start with the observable signal rather than an assumed root cause. Search GitHub Issues using combinations of:

- framework or API — `AVPlayer`, `AVContentKeySession`, `CoreMedia`
- error code — `-12888`, `-11800`
- symptom — `black video`, `stall`, `key rotation`
- area — `HLS`, `LL-HLS`, `FairPlay`
- platform — `iOS`, `iPadOS`, `tvOS`, `macOS`

Examples:

```text
AVPlayer live edge
CoreMedia -12888
FairPlay key rotation
label:"area:ll-hls" stall
label:"platform:tvos" AVPlayer
```

Use the [label taxonomy](docs/labels.md) when you need to narrow results by framework, area, issue type, evidence, platform, or status.

## Evidence model

Every conclusion should make its evidence strength explicit.

| Level | Meaning |
| --- | --- |
| **Apple Confirmed** | Supported by Apple documentation, release notes, WWDC, DTS, or an explicit Apple engineer statement. |
| **Reproduced** | Consistently observed in controlled testing, but not documented as a platform contract. |
| **Inferred** | Derived from logs, experiments, implementation behavior, or reverse engineering. |

**Do not present reproduced or inferred behavior as an Apple guarantee.**

Evidence can become stronger over time. An inferred explanation may later become reproduced, and a reproduced behavior may later become Apple Confirmed when an authoritative source appears.

## Anatomy of an entry

A useful issue should be readable as a small investigation report rather than a conversation transcript.

| Section | Purpose |
| --- | --- |
| **Source** | Identify the Apple source, reproduction, or other primary evidence. |
| **Problem** | State the observable engineering problem. |
| **Environment** | Record OS, framework, API, stream type, content type, and relevant conditions. |
| **Symptoms** | Capture logs, error codes, notifications, timing, and visible behavior. |
| **Evidence level** | State how strongly the explanation is supported. |
| **Cause / Explanation** | Explain the relevant platform behavior and separate fact from inference. |
| **Solution / Guideline** | State the recommended engineering action or workaround. |
| **Verification** | Define steps and expected signals that another engineer can reproduce. |
| **References** | Link related Apple documentation, standards, WWDC sessions, and issues. |

See [the example AVPlayer live-edge investigation](examples/avplayer-live-edge.md) for a complete entry.

## What belongs here

Good entries are narrow, observable, and actionable. Typical examples include:

- AVPlayer behavior that changes under a specific live-stream condition.
- FairPlay failures associated with a specific content-key lifecycle.
- CoreMedia error codes with reproducible playlist or transport conditions.
- LL-HLS behavior involving blocking reloads, live-edge distance, or playlist freshness.
- Platform behavior documented or clarified by Apple but easy to misinterpret in application code.

This repository is not intended to be a general application bug tracker, a copy of Apple Developer Forums, or a collection of unsupported platform claims.

## Contributing

Before adding an entry, search for the same observable failure mode and prefer primary Apple sources where available.

Use a specific title such as:

```text
[AVFoundation] AVPlayer stops when catch-up playback reaches live boundary
```

Avoid titles such as `AVPlayer bug` or `HLS issue`.

For the complete authoring rules, see:

- [Contributing](CONTRIBUTING.md)
- [Issue authoring guide](docs/issue-authoring-guide.md)
- [Label taxonomy](docs/labels.md)
- [Apple platform issue template](.github/ISSUE_TEMPLATE/apple-platform-issue.yml)

## Repository principle

A source is only the beginning of an entry. The useful output is the engineering conclusion:

```text
Problem
  ↓
Evidence
  ↓
Platform behavior
  ↓
Engineering guideline
  ↓
Verification
```

If another engineer can identify the same symptom, understand the evidence strength, apply the recommended action, and verify the result, the entry has done its job.
