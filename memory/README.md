# TezScroll Repository Memory

This folder is the durable operating memory for the publishing workflow. It stores reusable evidence-backed lessons, not unsupported assumptions.

## Memory cycle for every story

1. Record the search query and discovery source.
2. Save the primary source, corroborating sources, date, location, people, and authority.
3. Record rejected leads and the reason each was rejected.
4. Save the sensitive-media decision and its reason.
5. Store headline revisions, final caption, credits, and asset paths.
6. Confirm the video or image is at the bottom of the Canva layer stack and every branding/text element is above it.
7. Record Canva export verification, Trello card, Meta publication links, and final status.
8. Add one concise lesson describing what should be repeated, changed, or avoided next time.

## Memory rules

- A repeated claim does not become true without evidence.
- Separate observed facts, source claims, and editorial judgment.
- Do not retain credentials, private contact data, or unnecessary identifiers.
- Never store access tokens in story records or repository files.
- Update playbooks only when a lesson is supported by a completed story or verified correction.
- Sensitive-story lessons must not reproduce graphic details or self-harm methods.

Story records live in `data/stories/`. The canonical structure is `data/story-record-template.json`.

User workflow preferences live in `memory/editorial-preferences.md`. A supplied link selects the lead but never converts an unsupported claim into a verified fact.
