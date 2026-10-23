# General command prompts — copy/paste

Lahat ng blocks dito ay para sa **agent chat**, hindi PowerShell. Palitan ang bracketed fields bago gamitin. Optional prefix: Codex `$copy7-editor`; Claude Code `/copy7-editor`; Antigravity can use the explicit skill-file instruction in each prompt.

## 1. Universal first-time setup prompt

```text
Set up this copy7-editor repository on my computer.
Read AGENTS.md and .agents/skills/copy7-editor/SKILL.md first.
Follow docs/INSTALL-TAGLISH.md and explain the steps in Taglish.

Run node setup.mjs --check, then node setup.mjs when prerequisites are ready.
Use local faster-whisper transcription in the repository .venv.
Check which tools are missing before proposing installation.
Do not use paid APIs, upload my media, or replace existing .env/style files.
Respect approvals required by my environment; do not bypass them.

Render and verify the setup demo. If any step fails, show the actual error
and the concrete fix. Tell me the absolute inbox/outbox paths and what
was verified. If style is missing, start with natural pacing, readable
Taglish captions, light SFX, and narration louder than music.
```

## 2. Universal general editing prompt

```text
Use the copy7-editor skill in this repository.
Read AGENTS.md and .agents/skills/copy7-editor/SKILL.md first.
Act as my video editor and communicate in Taglish.

PROJECT: [project-slug]
ASSETS: [folder path]
VOICEOVER: [exact filename, or none]
BRIEF / PRODUCT FACTS: [brief.md path or supplied facts]
PLATFORM: [Shopee Video / Facebook Reels / YouTube Shorts / YouTube]
TARGET DURATION: [30 seconds, or another duration]
FORMAT: [1080x1920 vertical 9:16, 30 fps]
STYLE: [natural / energetic / cinematic / minimal]
CTA: [exact desired CTA]
TRANSCRIPTION: local faster-whisper; reuse a verified transcript if supplied.

First inspect the images, videos, audio, duration, and available product facts.
Give a short asset inventory and identify missing items. If enough assets
are available, continue to a draft without waiting for another confirmation.
Ask only if a missing item prevents an accurate edit.

Build a clear hook, product/demo section, and CTA. Preserve the actual product
appearance and use only supported claims. Keep cuts between complete phrases.
Use the supplied voiceover; do not generate a replacement voice without asking.
Add accurate Filipino/Taglish captions, placed clear of app UI and screen edges.
Choose useful transitions/SFX from supplied files and keep narration clear.
For silent images, use restrained motion without changing product details.

Use a project under kit/video-projects/[project-slug]/.
Preserve originals. Reuse the existing project if this is a revision.
After cuts, retime captions to the edited audio. Run applicable preflight/lint,
review the rendered frames and audio, and record the results in VERIFY.md.
Do not use paid services or upload media. Do not post the finished video.

Export outbox/[project-slug]-v1.mp4 and give a short editing summary,
actual output path, and anything that still needs my review.
```

## 3. Ready-to-use 30-second affiliate prompt

Use this after putting the actual assets in `inbox/koby-001/` and completing its brief. Product name is an example; change it for another product.

```text
Use copy7-editor. Read AGENTS.md and the shared skill first.
Edit inbox/koby-001 into a 30-second Filipino Shopee affiliate video.
Read inbox/koby-001/brief.md for product facts and the voiceover filename.
Use kit/video-projects/koby-001 as the editable project.

1080x1920, 9:16, 30 fps. Start with a clear hook, show the supplied product
and actual demonstration, then CTA: “Check ang product link para sa details.”
Use existing footage/images and supplied audio. Preserve packaging and label.
Do not add antibacterial, safety, or performance claims unless the brief supports them.
Add accurate Taglish captions and leave space for a shopping-basket overlay.
Use my-sounds for music/SFX if appropriate. Narration must stay clear.
Use local transcription or reuse the verified transcript.

Inspect assets first and report what is missing. If complete, build and review
a draft. If the voiceover cannot fit naturally in 30 seconds, explain the
conflict and propose the smallest change before cutting required content.
Export outbox/koby-001-v1.mp4. No paid services and no posting/uploading.
```

## 4. Existing Windows assets without moving your originals

```text
Use the copy7-editor skill and read AGENTS.md first.
My source assets are at:
C:\Users\Meo\Videos\AI-Editing\herk-edit-kit\video-projects\koby\assets

Inspect that folder and identify the intended narration, images, and clips.
Create the new edit in this repository's kit/video-projects/koby-new-edit/.
Copy only needed assets into that project. Preserve the original source folder.
Use a 30-second 9:16 draft, clear Taglish captions, supplied audio, and local
transcription. Choose relevant SFX/transitions if available. Tell me if the
path is inaccessible in your environment rather than pretending it was read.
```

## 5. Revision command

```text
Use the existing project kit/video-projects/[slug].
Revise draft [v1] using these notes:
- [timestamp and exact change]
- [timestamp and exact change]
Keep the current source assets and approved narration.
Reuse the transcript; retime it only if cuts change.
Review the new render and export outbox/[slug]-v2.mp4 without replacing v1.
Update EDIT-PLAN.md and VERIFY.md, then summarize the differences.
```

## 6. Final export command

```text
Approved ang draft [slug]-v2.mp4.
Use the existing project and render with the engine's final-quality settings.
Keep the approved content, framing, and audio mix.
Check resolution, fps, duration, caption readability, audio joins, and A/V sync.
Export outbox/[slug]-final.mp4, preserve the drafts and editable project,
and give the exact output path. Do not upload or publish it.
```

## 7. Handoff from one agent to another

```text
Continue the existing edit in kit/video-projects/[slug].
Read AGENTS.md, the shared editing skill, BRIEF.md, EDIT-PLAN.md, and VERIFY.md.
Reuse existing assets, approved decisions, and verified transcripts.
Latest draft: outbox/[slug]-v2.mp4.
Next task: [specific remaining edit].
Do not restart the project or run transcription again unless evidence requires it.
```

## 8. Explicit Groq opt-in (optional addition)

```text
For this project, I choose Groq transcription instead of local faster-whisper.
I authorize uploading the narration audio to Groq via --groq. Use the API key
already stored in local .env; do not display it. Use my configured account
within its limits. No other uploads or paid generation services are authorized.
```
