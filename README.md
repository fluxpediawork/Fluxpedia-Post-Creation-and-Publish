# TezScroll Post Creation and Publishing

An online operations dashboard for the TezScroll news workflow. It turns the approved SOP into a guided, persistent checklist from research through Canva, Trello, Meta Business Suite, and final verification.

## Included

- Five-stage production checklist
- Automatic progress tracking and device-local autosave
- Story folder-name generator
- Three-line headline word-count checker
- SOP-compliant caption and disclaimer template
- Mandatory sensitive-media gate
- Enforced Canva rule: video or image stays at the bottom of the layer stack
- News-source framing guidance based on The Tatva and India in Last 24hr
- GitHub-backed story records and repository memory

## Mandatory media safety rule

Do not use incident video when a story involves a minor, visible blood or graphic injury, sexual content or abuse, or self-injury/suicide. Create a respectful, non-graphic illustrative image instead and clearly identify it as an illustration. Do not imply that a generated image is authentic footage.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## GitHub records and memory

Every story can be saved as a versioned JSON record under `data/stories/`. The record covers research, corroboration, rejected leads, sensitivity flags, media choice, headline, caption, Canva export, Trello handoff, Meta publication, final verification, and the lesson learned.

Configure a fine-grained `GITHUB_TOKEN` in the hosted environment with Contents read/write access limited to this repository. Never commit the token. The target repository defaults to `fluxpediawork/Post-Creation-and-Publish`.

The canonical structure is `data/story-record-template.json`. The durable learning process is documented under `memory/`.

## Verify

```bash
npm run build
```

See [docs/news-source-playbook.md](docs/news-source-playbook.md) for the source analysis and editorial rules.
