# Copy7-Editor — Installation at Paggamit

Gamitin ang Copy7-Editor para gumawa ng Shopee affiliate videos, YouTube Shorts, Facebook Reels, at iba pang video edits gamit ang sarili mong footage, images, voiceover, music, at sound effects.

Ang AI coding agent ang nagbabasa ng editing instructions, gumagawa ng project, at nagpapatakbo ng local tools. Herk Edit Kit at HyperFrames ang ginagamit para sa editing/rendering. Output ay MP4 at editable HyperFrames project. Kailangan pa ring panoorin at pakinggan ang draft bago gamitin.

## Contents

1. [Requirements](#1-requirements)
2. [Download at tamang folder](#2-download-at-tamang-folder)
3. [Install ang editing engine](#3-install-ang-editing-engine)
4. [Configure transcription](#4-configure-transcription)
5. [Gamitin sa Claude Code, Codex, o Antigravity](#5-gamitin-sa-claude-code-codex-o-antigravity)
6. [Prepare ang assets](#6-prepare-ang-assets)
7. [General editing prompt](#7-general-editing-prompt)
8. [Review, revise, at final export](#8-review-revise-at-final-export)
9. [Output at backup](#9-output-at-backup)
10. [Troubleshooting](#10-troubleshooting)

## 1. Requirements

| Program | Para saan |
| --- | --- |
| Node.js 22+ at npm | Setup scripts at editing dependencies |
| Git | Download repository at pinned engine |
| FFmpeg at ffprobe | Media inspection, audio extraction, at processing |
| Chrome o Chromium | HyperFrames rendering |
| Python 3 | Local faster-whisper transcription, kung gagamitin |
| Claude Code, Codex, **o** Antigravity | Coding agent na may local file at terminal access |

Isa lang sa tatlong agents ang kailangan. Internet is needed sa installation, dependency/model downloads, at cloud AI services. Walang required CapCut MCP server para sa workflow na ito.

### Windows installation

Open PowerShell. Run only the installers for programs na wala pa sa computer mo:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact
winget install --id Git.Git --exact
winget install --id Gyan.FFmpeg --exact
winget install --id Google.Chrome --exact
```

Kung walang `winget`, gamitin ang download pages ng [Node.js](https://nodejs.org/en/download), [Git](https://git-scm.com/downloads), [FFmpeg](https://ffmpeg.org/download.html), at [Chrome](https://www.google.com/chrome/).

Pagkatapos ng install, close/reopen PowerShell at ang coding agent para ma-refresh ang PATH. Check:

```powershell
node --version
npm --version
git --version
ffmpeg -version
ffprobe -version
```

Dapat Node 22 o mas bago. Kapag hindi recognized ang command, ayusin muna ang installation/PATH bago magpatuloy.

## 2. Download at tamang folder

Extract ang `Copy7-Editor.zip` sa parent folder, halimbawa:

```text
C:\Users\Meo\Videos\AI-Editing
```

May isang `Copy7-Editor/` directory na ang ZIP. Pagkatapos mag-extract, open PowerShell at pumunta rito:

```powershell
Set-Location "$env:USERPROFILE\Videos\AI-Editing\Copy7-Editor"
```

Kung ibang location ang pinili mo, palitan ang path. Kumpleto na ang package kasama ang `.agents`, `.claude`, `.env.example`, `.gitignore`, at empty media-folder placeholders. Panatilihin ang mga hidden files kapag kumokopya o nag-u-upload sa GitHub.

### Confirm ang working directory

```powershell
Get-Location
Test-Path .\setup.mjs
Test-Path .\AGENTS.md
Test-Path .\.agents\skills\copy7-editor\SKILL.md
Test-Path .\.claude\skills\copy7-editor\SKILL.md
Test-Path .\.env.example
Test-Path .\.gitignore
```

Dapat `True` ang lahat ng file checks. Ito ang **project root** sa guide. Kung `False`, hanapin ang directory na may `setup.mjs` at buksan iyon. Huwag magdagdag ng extra nested `Copy7-Editor` folder sa loob ng project root.

Kung galing sa GitHub ang files, gamitin ang actual clone URL ng repository mo at hanapin ang folder na may `setup.mjs`. Ang pag-rename ng local package ay hindi awtomatikong nagre-rename o nag-u-update ng remote GitHub repository. See [GitHub instructions](docs/PUBLISH-GITHUB-TAGLISH.md).

## 3. Install ang editing engine

Mula sa project root:

```powershell
node setup.mjs --check
```

Kapag pasado ang prerequisites:

```powershell
node setup.mjs
```

Ang full setup ay:

1. Nagda-download ng pinned Herk Edit Kit sa `kit/`.
2. Nag-i-install ng npm dependencies ng engine.
3. Gumagawa at nagre-render ng synthetic demo.
4. Naglalagay ng demo sa `outbox/setup-test.mp4`.
5. Gumagawa ng `.env` kung wala pa, at nagre-report ng transcription availability.

Open ang sample:

```powershell
Start-Process .\outbox\setup-test.mp4
```

Kung `SETUP STOPPED` ang output, ayusin muna ang nakasaad na error. Ang `--check` ay prerequisite check lang; hindi nito pinapatunayang gumagana na ang browser/video rendering.

Ang notice na “transcription not configured yet” ay nangangahulugang kailangan pang i-configure ang speech transcription. Hindi kailangan ng transcription API para sa synthetic setup demo.

## 4. Configure transcription

### Option A: Local faster-whisper — default

Piliin ito para sa transcription na ginagawa sa computer mo. Install Python 3.12 mula sa [python.org](https://www.python.org/downloads/) kasama ang Windows Python launcher, then run from project root:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install faster-whisper
.\.venv\Scripts\python.exe -c "import faster_whisper; print('Ready')"
```

Kung walang `py -3.12` pero may supported Python 3, check `python --version` at gamitin ang `python -m venv .venv`.

Hindi kailangang i-activate ang virtual environment; automatic na ginagamit ng helper ang Python sa repo `.venv`.

Kapag may actual narration file na:

```powershell
node tools/transcribe.mjs "inbox\project-001\voiceover.wav" --local
```

First run may download a model. Default `large-v3` can be slow sa CPU. Para sumubok ng mas maliit na model:

```powershell
node tools/transcribe.mjs "inbox\project-001\voiceover.wav" --local --model small --output "inbox\project-001\voiceover-small.json"
```

Review ang accuracy ng Filipino/Taglish captions. Local transcription does not require a transcription API key; the AI agent itself still follows its own account and data settings.

### Option B: Groq — optional

Groq sends narration audio to an external service. Check current account limits/pricing before choosing it.

1. Create your own key at [Groq Console](https://console.groq.com/keys).
2. Open the local `.env`:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

3. Paste the key after `GROQ_API_KEY=` and save. Huwag i-post sa chat o i-commit sa Git.
4. Explicitly select Groq:

```powershell
node tools/transcribe.mjs "inbox\project-001\voiceover.wav" --groq
```

Having a key in `.env` does not change the local default. Use `--groq` only when you intend to upload the audio. The helper has a 24 MB extracted-audio cap and no automatic chunking.

Both providers output word-timestamp JSON beside the input unless a separate `--output` is supplied. Existing JSON files are preserved; reuse the transcript or specify a new filename.

## 5. Gamitin sa Claude Code, Codex, o Antigravity

Buksan ang **project root**, ang folder na may `AGENTS.md` at `setup.mjs`. A normal web chat does not automatically have access to Windows files on your computer.

| Agent | Entry files | Invocation sa agent chat |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` and `.claude/skills/copy7-editor/SKILL.md` | `/copy7-editor` |
| Codex | `AGENTS.md` and `.agents/skills/copy7-editor/SKILL.md` | `$copy7-editor` |
| Antigravity | `.agents/skills/copy7-editor/SKILL.md` | Ask it to use the skill explicitly; slash invocation depends on surface/version |

### Claude Code

Install using the [official instructions](https://code.claude.com/docs/en/setup). Windows option:

```powershell
winget install --id Anthropic.ClaudeCode --exact
```

Reopen terminal. From project root:

```powershell
claude --version
claude
```

Complete sign-in. Inside **Claude Code chat**:

```text
/copy7-editor start
```

For editing:

```text
/copy7-editor Edit inbox/project-001 using its brief.md. Use local transcription and produce a reviewed draft.
```

### Codex

Install/open Codex using the [official CLI guide](https://learn.chatgpt.com/docs/codex/cli), or use its local IDE/app environment with the project root selected.

For an installed CLI, from project root:

```powershell
codex --version
codex
```

Complete sign-in. Inside **Codex chat**:

```text
$copy7-editor start
```

For editing:

```text
$copy7-editor Edit inbox/project-001 using its brief.md. Use local transcription and produce a reviewed draft.
```

If missing from the skill list, verify the folder and restart the session. See [official skill discovery instructions](https://learn.chatgpt.com/docs/build-skills).

### Antigravity

Install from [Google Antigravity](https://antigravity.google/download), sign in, and open/add the project root as a workspace. In the agent panel, paste:

```text
Use the copy7-editor skill in this workspace.
Read AGENTS.md and .agents/skills/copy7-editor/SKILL.md first.
Follow the repository setup instructions and verify the demo render.
Use local transcription and explain progress/errors in Taglish.
Preserve existing project files and do not upload my media.
```

Then use the general editing prompt below. Current [Antigravity skill docs](https://www.antigravity.google/docs/skills?tab=ide) use `.agents/skills`; App/CLI surfaces with skill slash commands can also use `/copy7-editor`. The explicit-path prompt is the fallback if the shortcut is unavailable.

### Terminal versus agent chat

- **Terminal:** `node setup.mjs`, `claude`, `codex`, at `git clone ...`.
- **Agent chat:** `/copy7-editor`, `$copy7-editor`, at natural-language editing prompts.

Huwag i-type ang `$copy7-editor` sa PowerShell; ituturing ang `$` bilang variable syntax.

## 6. Prepare ang assets

From project root:

```powershell
New-Item -ItemType Directory -Force .\inbox\project-001 | Out-Null
if (-not (Test-Path .\inbox\project-001\brief.md)) {
    Copy-Item .\templates\brief.example.md .\inbox\project-001\brief.md
}
if (-not (Test-Path .\my-style.md)) {
    Copy-Item .\templates\my-style.example.md .\my-style.md
}
```

Ilagay ang files sa sumusunod na locations. Examples lang ang filenames; gamitin ang actual names mo.

| Location | Laman |
| --- | --- |
| `inbox/project-001/` | Product images, footage, supplied narration, completed `brief.md` |
| `my-sounds/` | Music/SFX na may permission kang gamitin |
| `my-style.md` | Caption, pacing, color, at audio preferences |
| `my-rules.md` | Persistent preferences na ise-save ng agent mula sa instructions mo |

Sa brief, specify product name, supported facts, exact voiceover file, platform, target duration, and CTA. Kung separate voiceover ang gamit, iyon ang ipa-transcribe. Silent product shots do not need their own transcript.

## 7. General editing prompt

Paste sa agent chat. Palitan ang details para sa actual project mo. This example assumes you prepared `inbox/project-001/brief.md`.

```text
Use the copy7-editor skill.
Read AGENTS.md and .agents/skills/copy7-editor/SKILL.md first.
Act as my video editor and communicate in Taglish.

Project: project-001
Assets: inbox/project-001
Brief: inbox/project-001/brief.md
Editable project: kit/video-projects/project-001
Platform: Shopee Video, YouTube Shorts, and Facebook Reels
Target duration: 30 seconds
Format: 1080x1920, vertical 9:16, 30 fps
Transcription: local faster-whisper, or reuse my verified transcript

First inspect all supplied videos, images, voiceover, and product facts.
Report usable assets, durations, and missing items.
If enough information is available, proceed to a draft.
Ask only if a missing item prevents an accurate edit.

Build a clear hook, product demonstration, and CTA based on the brief.
Preserve actual product appearance and use only supported claims.
Use my existing narration; do not generate a replacement voice.
Remove unnecessary pauses without cutting words or complete phrases.
Add accurate Filipino/Taglish captions and keep them clear of screen edges
and the lower shopping-basket area.
Choose suitable transitions and supplied SFX. Keep narration clear above music.
If there are no suitable sound files, skip them or use simple synthesized SFX.

Preserve originals and retime captions whenever cuts change the audio.
If the narration cannot fit naturally in 30 seconds, explain the conflict
before removing required content.
Run applicable validation, inspect rendered frames, and check audio/sync.
Record checks and any review limitations in VERIFY.md.

Export outbox/project-001-v1.mp4 and summarize the edit.
Do not use paid services, upload my media, or post the video.
```

For Codex, optionally put `$copy7-editor` at the start. For Claude Code, use `/copy7-editor`. For Antigravity, the explicit shared-skill instruction above is sufficient as a request.

The prompt is an editing brief for the agent. It is not a standalone terminal command or a guarantee that any media can be edited perfectly without review.

## 8. Review, revise, at final export

Open the first draft from project root:

```powershell
Start-Process .\outbox\project-001-v1.mp4
```

Watch with sound. Check caption spelling/timing, product appearance, complete words, music volume, black frames, and CTA placement. Verify safe areas in the actual target platform because app overlays can change.

### Revision prompt

```text
Use the existing kit/video-projects/project-001 project.
Revise project-001-v1.mp4:
- Bawasan ang music sa 00:08–00:16.
- Ayusin ang caption sa 00:19: [exact corrected text].
- Keep the CTA visible for 3 seconds.
Preserve the approved narration and source assets.
Review the new output and export outbox/project-001-v2.mp4.
Do not overwrite v1. Update EDIT-PLAN.md and VERIFY.md.
```

### Final prompt

```text
Approved ang project-001-v2.mp4.
Render the existing project using the engine's final-quality settings.
Keep the approved content, framing, and audio mix.
Check resolution, fps, duration, captions, audio joins, and A/V sync.
Export outbox/project-001-final.mp4 and preserve the drafts/editable project.
Do not upload or publish the video.
```

### Persistent preference

```text
Always keep natural pacing and place captions above the shopping-basket area.
Save this preference in my-rules.md and apply it to future projects.
```

Saving a rule updates a local Markdown file; it does not train the AI model.

## 9. Output at backup

| File/folder | Purpose |
| --- | --- |
| `outbox/project-001-v1.mp4` | First draft |
| `outbox/project-001-v2.mp4` | Revised draft |
| `outbox/project-001-final.mp4` | Approved final export |
| `kit/video-projects/project-001/` | Editable project, assets, transcripts, and review notes |

Back up the whole editable project and original media. Also back up `my-style.md` and `my-rules.md`. These personal files and generated media are ignored by Git, so a normal `git push` does not back them up.

If you switch from Claude to Codex or Antigravity, stop the first agent's edit, update project notes, then open the same root folder in the next agent. Have it read `BRIEF.md`, `EDIT-PLAN.md`, and `VERIFY.md`. Use one agent at a time on the same project.

For CapCut, import the finished MP4. Copy7-Editor does not export a native CapCut draft with separate caption/effect layers.

## 10. Troubleshooting

| Problem | Solution |
| --- | --- |
| GitHub clone gives 404/authentication error | Verify the actual repository URL, branch, and account permissions. Private repositories need authentication. |
| `setup.mjs` not found | Check the extracted project folder. Open the directory that actually contains `setup.mjs` and `AGENTS.md`. |
| `node`, `git`, or `ffmpeg` not recognized | Install missing program, fix PATH, reopen terminal/agent. |
| Test render fails | From `kit/video-projects/demo`, run `npx hyperframes doctor`; fix the reported browser/dependency issue. |
| Existing `kit/` does not match pinned commit | Back up its projects, move the old engine outside the repository, then rerun setup. |
| `faster_whisper` module missing | Install it using `.\.venv\Scripts\python.exe -m pip install faster-whisper` from project root. |
| Local transcription is slow | Allow initial model download; try `--model small` and review accuracy. |
| Existing transcript output | Reuse it or pass a new `--output` filename. |
| Captions drift after cuts | Use the retimed transcript paired with the edited audio/video. |
| Skill not found | Verify `.agents/skills/copy7-editor/SKILL.md`, open project root, restart agent, or explicitly ask it to read the file. |
| Agent cannot access `C:\Users\...` | Use the local coding environment with that folder open, or provide files through the environment's supported route. |

## Validation and limitations

The prepared Copy7-Editor package passed offline CLI regression checks, syntax checks, skill validation, and documentation-link checks. These do not establish that your uploaded copy or your machine has passed a full render. Run the demo and a short real project locally before relying on a larger workflow.

No real transcription accuracy, live Groq request, or end-to-end editing session across all three agents was verified during package preparation. Agent access and external services may have fees or limits. Local faster-whisper has no transcription API fee, but consumes local compute and disk space.

## Credits

Copy7-Editor builds on [free247editor](https://github.com/riecodes/free247editor) and downloads the [Herk Edit Kit](https://github.com/nateherkai/herk-edit-kit) engine. Preserve the repository's LICENSE and NOTICE.md. Use your own brand/media and respect the upstream brand-asset restrictions.
