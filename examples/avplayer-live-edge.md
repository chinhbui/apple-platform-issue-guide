# [AVFoundation] AVPlayer reaches live seekable end during catch-up playback

## Source

Apple Developer Forums:

https://developer.apple.com/forums/

Replace with the exact source thread before publishing this entry.

## Problem

When live playback uses a rate greater than `1.0` to reduce latency, the playhead can catch the end of the currently available seekable range. Playback may then stop even though the HLS presentation itself remains live.

## Environment

- Framework: AVFoundation
- Player: AVPlayer
- Content: Live
- Streaming: HLS / LL-HLS

## Symptoms

- Playback unexpectedly stops during catch-up.
- `AVPlayerItemDidPlayToEndTime` may be emitted.
- `currentTime()` approaches the current seekable boundary.
- Playback rate was above `1.0`.

## Evidence level

Reproduced / Apple source pending exact citation.

## Cause / Explanation

`seekableTimeRanges.end` represents the currently seekable media boundary, not an unlimited future live edge. A catch-up strategy that continuously runs above `1.0` can consume the available margin and reach that boundary.

This explanation should be upgraded to Apple Confirmed only when an authoritative Apple source explicitly defines the contract.

## Solution / Guideline

- Keep a safety margin from the currently available media boundary.
- Reduce the rate back toward `1.0` before the playhead exhausts that margin.
- Do not treat `seekableTimeRanges.end` as a permanently advancing live-edge contract.
- Re-evaluate the live position as the playlist advances.
- Treat end notifications carefully for live playback and verify the presentation state before deciding the stream has truly ended.

## Verification

1. Start a live HLS stream several seconds behind the newest available media.
2. Set playback rate above `1.0`.
3. Track `currentTime()` and `seekableTimeRanges`.
4. Observe the remaining distance to the seekable end.
5. Record whether an end notification is emitted when the distance reaches approximately zero.
6. Repeat while restoring rate to `1.0` before the boundary and compare behavior.

## References

Add the exact Apple Developer Forums thread, Apple documentation, and relevant HLS references before promoting this issue from draft status.
