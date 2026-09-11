# [AVFoundation] Manual subtitle selection reverts to Off during live LL-HLS playback

> Canonical investigation: https://github.com/chinhbui/apple-platform-issue-guide/issues/4

## Source

Apple Developer Forums:

https://developer.apple.com/forums/thread/838684

## Problem

On live LL-HLS, an app explicitly selects a non-forced WebVTT subtitle option:

```swift
playerItem.select(option, in: legibleGroup)
```

Immediately after the call, `currentMediaSelection.selectedMediaOption(in:)` reports the requested option. In affected long-running sessions, however, the selection can later revert to Off or remain on the previous language.

A tempting explanation is that normal live playlist reloads trigger automatic media selection and override the manual choice. Apple AVFoundation engineering stated that this is not the expected contract.

## Environment

- Framework: AVFoundation
- Player: AVPlayer / AVPlayerItem
- Content: Live
- Streaming: LL-HLS
- Alternate media: non-forced WebVTT subtitles
- Selection mode: explicit application-owned selection via `select(_:in:)`

## Symptoms

- Manual subtitle selection initially succeeds.
- `currentMediaSelection` can later report Off or another option.
- The failure correlates with long-running live playback or reconnect conditions.
- Short clean sessions may not reproduce it consistently.

## Evidence level

**Apple Confirmed** for the manual-versus-automatic media-selection contract.

**Investigating / platform bug candidate** for spontaneous selection reversion during long-running live or LL-HLS playback.

Apple stated that:

- Normal HLS playlist refetching does not itself invoke automatic media selection.
- A specific manual selection should not be changed by automatic selection unless the application explicitly returns the group to automatic mode.
- Manual selection disables automatic media selection for that group.

## Cause / Explanation

Keep three mechanisms separate:

```text
manual selection
playerItem.select(option, in: group)

            ≠

automatic selection
playerItem.selectMediaOptionAutomatically(in: group)

            ≠

selection criteria
player.setMediaSelectionCriteria(...)
```

The debugging boundary is the first unexpected state transition:

```text
user intent
   ↓
manual AVMediaSelection state
   ↓
subtitle rendition request
   ↓
WebVTT delivery
   ↓
legible rendering
```

If `currentMediaSelection` changes before subtitle delivery diverges, investigate the selection state itself rather than treating the symptom as a WebVTT rendering problem.

## Solution / Guideline

For an application-owned subtitle picker:

1. Use explicit `select(_:in:)`.
2. Treat the resulting option as manual selection state.
3. Do not periodically reapply automatic criteria as a workaround.
4. Observe `currentMediaSelection` so the first unexpected mutation can be timestamped.
5. If the selected option changes without an application-issued selection command, collect Media Playback logging and sysdiagnose around that timestamp.

Avoid a timer that continuously re-selects the subtitle. It can hide the original transition and destroy useful diagnostic evidence.

## Verification

Run at least these controls:

```text
A. Live LL-HLS + manual subtitle selection
B. Regular live HLS + same subtitle renditions
C. LL-HLS + explicit subtitles Off
D. LL-HLS + automatic selection intentionally invoked
```

For each run, record:

```text
timestamp
requested subtitle language
selected option before select
selected option immediately after select
selected option periodically afterwards
AVPlayerItem identity
AVMediaSelectionGroup identity/options
playlist/reconnect events
AVPlayerItem status
access/error log events
route/interruption changes
application calls that alter selection mode
```

Then distinguish:

```text
selection state changed?
        ↓
subtitle playlist requests changed?
        ↓
legible output disappeared?
```

This identifies whether the first divergence is media-selection state, HLS rendition delivery, or legible rendering.

## Engineering rule

> Separate desired media selection from delivered media. Prove whether AVFoundation changed selection state before debugging HLS/WebVTT delivery.

## References

- Apple Developer Forums thread 838684: https://developer.apple.com/forums/thread/838684
- AVPlayerItem: https://developer.apple.com/documentation/avfoundation/avplayeritem
- mediaSelectionCriteriaCanBeAppliedAutomatically(to:): https://developer.apple.com/documentation/avfoundation/avmediaselection/mediaselectioncriteriacanbeappliedautomatically(to:)
- HLS Authoring Specification for Apple Devices: https://developer.apple.com/documentation/http-live-streaming/hls-authoring-specification-for-apple-devices/
