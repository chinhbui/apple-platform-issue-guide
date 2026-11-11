# Issue Authoring Guide

## Objective

Each issue should be a compact engineering decision record for one Apple platform behavior.

## Recommended order

1. Source
2. Problem
3. Environment
4. Symptoms
5. Evidence level
6. Cause / Explanation
7. Solution / Guideline
8. Example
9. Verification
10. References

## Source hierarchy

Prefer sources in roughly this order:

1. Apple documentation
2. Apple release notes
3. WWDC session
4. Apple DTS response
5. Explicit Apple engineer answer on Developer Forums
6. Reproduction evidence
7. Inference / reverse engineering

A lower-ranked source may still be useful, but the issue must describe its evidence level accurately.

## Readability and typography

These guidelines keep long technical investigations scannable on GitHub's desktop and mobile issue views. Treat numbers below as editorial targets, not scientific thresholds.

- **Lead with the answer:** in the first 150–250 words, present the observable symptom, strongest evidence, current confidence/root-cause status, and most useful next action.
- **Keep emphasis rare:** GitHub Docs recommends highlighting no more than 10% of article text. Prefer one or two short bold spans per section at most, and no more than five consecutive bold words. Do not bold complete findings, paragraphs, every label in a list, or repeat all-caps declarations.
- **Prefer short paragraphs:** one idea per paragraph; aim for 2–4 sentences, splitting dense paragraphs when helpful. Use meaningful `##` section headings and `###` only for actual subsections.
- **Make evidence easy to scan:** use compact tables for A/B comparisons, evidence grades and verification matrices. Keep observations, documented contracts, implementation evidence, hypotheses, and unknowns distinct.
- **Keep code purposeful:** include only the smallest snippet needed to establish behavior. Move long traces, detailed experiments, and the specialized second-AI prompt into a collapsed `<details>` section near the end. GitHub supports Markdown inside collapsed sections.
- **Never hide the verdict:** sources, first divergence, root-cause confidence, reusable rule, client-only mitigation, and remaining unknowns must remain visible without expanding anything.
- **Avoid overformatting:** do not use repeated callouts, giant headings, or large blocks of bold/capitalized text. Let whitespace, concise headings and a single clear conclusion establish hierarchy.
- **Preserve technical precision:** do not remove caveats, evidence citations, error chains or test conditions merely to shorten the article. Link detailed source evidence where possible.

### Preferred issue outline

1. Source and environment
2. Problem and observed behavior
3. Evidence level / current verdict
4. First divergence and explanation
5. Verification matrix / competing hypotheses
6. Client-only guideline
7. Reusable engineering rule
8. References
9. Collapsed optional investigation prompt and supporting details

### Review checklist

Before publishing, check the rendered Markdown preview:

- Can a reader understand the symptom and verdict without scrolling into the AI prompt?
- Is bold text a rare visual cue rather than the default body weight?
- Are long paragraphs and numbered experimental procedures easy to scan?
- Are the evidence limitations and client-versus-server scope visible?
- Do collapsed sections contain supporting detail only?

References:
- [GitHub Docs: Best practices for readability and scannability](https://docs.github.com/en/contributing/writing-for-github-docs/best-practices-for-github-docs)
- [GitHub Docs: Style guide — emphasis](https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide)
- [GitHub Docs: Collapsed sections](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections)
