# Troubleshooting

| Error/symptom | Practical fix |
| --- | --- |
| `node`/`npm`/`git`/`ffmpeg` not recognized | Install the missing tool, check PATH, restart terminal and coding agent. Run `node setup.mjs --check`. |
| Node older than 22 | Upgrade Node, reopen terminal, verify `node --version`. |
| Cannot find `setup.mjs` | You are in the wrong folder. Use `Set-Location` to the repo root. |
| Network/fetch/npm failure | Check connection and allowed GitHub/npm access in your environment. Retain the error output; do not silently switch engine versions. |
| Existing `kit/` commit mismatch or interrupted clone | Back up all `kit/video-projects` first, then rename `kit` to a unique backup name and rerun setup. Never delete a project just to fix setup. |
| Render fails / Chrome not found | From `kit/video-projects/demo`, run `npx hyperframes doctor`. Install/fix the reported Chrome/Chromium dependencies and retry. |
| Installed package folder but npm state incomplete | From `kit/`, run `npm ci --no-audit --no-fund`, then return to root and rerun setup. |
| `No module named faster_whisper` | Install it using the repo virtualenv Python, not another system Python. See installation guide. |
| GPU/CUDA error | Local helper falls back to CPU; use a smaller model if slow. If CPU also fails, retain the actual error and check Python/model installation. |
| First transcript is slow | Initial model download plus CPU inference can take time. Check progress/network before interrupting. |
| No word timestamps | Check there is speech and select the actual voiceover file. Silent B-roll needs no transcription. |
| Output already exists | Reuse the existing JSON or select a new `--output path.json`. The helper intentionally avoids overwriting. |
| Groq 401/403 | Check your key/account/model permissions locally; never print the key in chat. |
| Groq 413/429 or client audio cap | Use local transcription or shorter audio chunks. If chunking manually, offset timestamps before joining; do not concatenate unadjusted JSON. |
| Captions drift after cuts | Use the retimed transcript associated with the edited media; do not use original timestamps. |
| Skill does not appear | Open root folder, restart agent, and explicitly ask it to read `AGENTS.md` plus the canonical skill path. |
| Wrong product/claim in generated edit | Stop final export, correct brief and footage mapping, and rerender. Do not rely on guessed product facts. |

## Safe engine refresh

Keep a backup first. Example PowerShell, from repo root, choosing a backup name that does not exist:

```powershell
Rename-Item kit kit-backup-before-update
node setup.mjs
```

This reinstalls the **same pinned commit** unless you intentionally changed `KIT_COMMIT`. To use a new version, review upstream changes, update the pin deliberately, render the demo, then migrate a copy of one project. Do not merge old `node_modules` into the new engine.

A renamed backup such as `kit-backup-before-update` is not covered by the existing `kit/` ignore rule. Keep it outside the repository or add its exact directory to your local `.git/info/exclude` before staging. The safer approach for large/private backups is an external backup folder.

## What to send when asking for help

Send the command, working directory, relevant error text, OS, and Node/FFmpeg versions. Do not include `.env` contents, account credentials, private footage, or unrelated personal files. State whether the error happened during engine setup, transcription, or rendering.
