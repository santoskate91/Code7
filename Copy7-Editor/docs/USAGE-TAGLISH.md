# Daily editing workflow — Taglish

## Prepare your project

Gumawa ng folder tulad ng `inbox/koby-001/`. Ilagay rito ang product images, video clips, recorded voiceover, at `brief.md` na galing sa template. Puwedeng mag-reference ng existing absolute asset path, pero kailangang accessible iyon sa agent environment. Sabihin ang exact voiceover filename kung higit sa isa.

Put licensed music and SFX in `my-sounds/`. Kung wala, sabihin “no music” o allow simple synthesized SFX. Hindi required na may audio ang bawat video clip; ang supplied voiceover ang maaaring maging pangunahing audio track.

## Give a clear brief

Specify platform, duration target, aspect ratio, product name, supported claims, CTA, style, at files to use. Default dito ay 1080x1920, 30 fps, 9:16. Target lang ang 30 seconds kung 30-second edit ang hiningi; kung mas mahaba ang narration, kailangan ng sensible cut o revised voiceover, hindi pagputol sa gitna ng salita.

Use [PROMPTS-TAGLISH.md](PROMPTS-TAGLISH.md). Ang asset review ay dapat ilahad muna: file inventory, usable footage, missing details, at timeline plan. Kapag enough ang materials, ituloy ang authorized local draft; magtanong lang kung may blocker na hindi ma-infer.

## What the agent should do

1. Inspect metadata and representative frames/audio; check that the product and narration match.
2. Create `kit/video-projects/<slug>/` using the engine's project command, or reuse the existing project for revisions.
3. Copy source assets into project assets, preserving originals and filenames where practical.
4. Transcribe the actual narration source if needed. Reuse verified transcripts; silent B-roll/images need no speech transcription.
5. Draft the hook, product demonstration, supported benefit, and CTA sequence in `EDIT-PLAN.md`.
6. Apply cuts, framing, captions, motion, and audio mix. After cuts, keep the transcript synchronized with the shortened media.
7. Run upstream validators and lint as applicable, then review frames and audio from the encoded draft. Save review evidence and limitations in `VERIFY.md`.
8. Export `outbox/<slug>-v1.mp4`, summarize changes, and request revision notes.

## Review and revise

Watch the entire draft with sound. Check that captions match speech, product details are correct, words are not clipped, transitions have no black flashes, and music does not mask narration. Safe margins are platform-dependent; preview in the target app before publishing because interface overlays can change.

Example revision:

```text
Sa existing koby-001 project, masyadong malakas ang music from 00:08–00:16.
Bawasan ito, alisin ang duplicate caption sa 00:19, at gawing 3 seconds ang CTA.
Keep the same voiceover. Export v2 and summarize the changes.
```

For a persistent preference:

```text
Always use natural pacing and keep captions above the lower shopping-basket area.
Save this in my-rules.md and apply it to future edits.
```

`my-rules.md` is saved preference text. The model itself is not being trained.

## Final and backup

Say “Approved ang v2; render final.” Keep the previous draft, and place the final MP4 in `outbox/`. The editable project remains under `kit/video-projects/<slug>/`. A file called `final` is not evidence of successful visual review; retain `VERIFY.md`.

Back up the **whole video-project directory**, including assets/transcripts/compositions, and your `my-style.md`, `my-rules.md`, inbox, and outbox. Gitignore means normal `git push` does not back up these personal project files. The project can also depend on the pinned engine and its npm environment; record the pin and keep the wrapper docs with your backup.

To preview manually, substitute the real slug:

```powershell
Set-Location "kit\video-projects\koby-001"
npx hyperframes preview
```

Stop preview with Ctrl+C when done. For manual draft render from the same project folder:

```powershell
npx hyperframes render --quality draft --output renders/manual-draft.mp4
```

The agent should consult the installed CLI help for final-quality options, since flags are engine-version-specific. Do not label a draft-quality render as final-quality without changing the render settings.
