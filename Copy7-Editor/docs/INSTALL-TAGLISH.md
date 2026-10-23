# Installation — Taglish

## 1. Piliin ang workspace

Extract ang ZIP sa isang permanent folder. Example sa Windows:

```text
C:\Users\Meo\Videos\AI-Editing\Copy7-Editor
```

Example path lang ito; palitan kung iba ang username/folder mo. Buksan ang folder na may `setup.mjs` at `AGENTS.md`, hindi ang parent folder o `kit/` lang. Hiwalay ang workspace na ito sa existing `herk-edit-kit` folder mo; puwede mong i-reference o kopyahin ang existing assets.

Ang package ay may root folder na `Copy7-Editor`. Kung gagamit ng GitHub clone, use the actual URL ng repository mo; hindi awtomatikong nagbabago ang remote name kapag nire-name ang local package. Open the directory with `setup.mjs` and `AGENTS.md`.

## 2. Install required programs sa Windows

Buksan ang PowerShell. Kung installed na ang program, skip ang install nito.

```powershell
winget install --id OpenJS.NodeJS.LTS --exact
winget install --id Git.Git --exact
winget install --id Gyan.FFmpeg --exact
winget install --id Google.Chrome --exact
```

Sundin ang installer prompts. Kung walang `winget`, use the official download pages: [Node.js](https://nodejs.org/en/download), [Git](https://git-scm.com/downloads), [FFmpeg](https://ffmpeg.org/download.html), at [Chrome](https://www.google.com/chrome/). Sa FFmpeg manual install, idagdag ang folder na may `ffmpeg.exe` at `ffprobe.exe` sa Windows PATH.

Close/reopen PowerShell at ang coding agent pagkatapos ng installation para makita ang updated PATH. Check:

```powershell
node --version
npm --version
git --version
ffmpeg -version
ffprobe -version
```

Node must be **22 or newer**. Chrome/Chromium is used by the renderer; `node setup.mjs --check` does not verify browser rendering. Disk use varies with clips, dependencies, cached fonts/browser, and Whisper models; allow several GB and more for long/high-resolution footage.

## 3. Run repository setup

```powershell
Set-Location "C:\Users\Meo\Videos\AI-Editing\Copy7-Editor"
node setup.mjs --check
node setup.mjs
```

`--check` reads prerequisite availability only. Full setup downloads a pinned Herk Edit Kit to `kit/`, installs npm dependencies, creates its synthetic demo, renders `outbox/setup-test.mp4`, and creates `.env` if absent. Internet is needed. It does not install Node/Git/FFmpeg for you and does not transcribe your footage.

Successful render file:

```powershell
Start-Process ".\outbox\setup-test.mp4"
```

Kapag “transcription not configured yet” lang ang notice, puwede nang gumana ang synthetic demo. Configure speech transcription next. Kapag `SETUP STOPPED`, fix the actual error before editing; see troubleshooting.

## 4A. Local transcription — default

Choose this kung gusto mong walang audio upload to a transcription API. Install Python 3.12 from [python.org](https://www.python.org/downloads/), including the Windows Python launcher. Then run **inside this repository**:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install faster-whisper
.\.venv\Scripts\python.exe -c "import faster_whisper; print('faster-whisper ready')"
```

No activation script is needed; the helper detects `.venv\Scripts\python.exe`. Kung unavailable ang `py -3.12` pero may supported Python 3, use `python -m venv .venv` after checking `python --version`.

Example, once may voiceover file ka:

```powershell
node tools/transcribe.mjs "inbox\koby-001\voiceover.wav" --local
```

Default local model is `large-v3`; it can be slow and memory-heavy on CPU. To try a smaller model:

```powershell
node tools/transcribe.mjs "inbox\koby-001\voiceover.wav" --local --model small --output "inbox\koby-001\voiceover-small.json"
```

Model choice affects speed and accuracy; review Taglish words. First run downloads the selected model. GPU is attempted; CPU fallback uses int8. “Local transcription” means the transcription helper processes audio on your computer; your chosen AI coding agent still has its own cloud/data settings.

## 4B. Groq transcription — optional external service

1. Open [Groq Console](https://console.groq.com/keys), sign in, and create your own key.
2. Check current account limits, supported models, and pricing. This repo does not enforce a billing cap.
3. Prepare/open local `.env` without replacing an existing file:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

4. Paste your key after `GROQ_API_KEY=` and save. Do not paste the key into AI chat or commit it.
5. Explicitly select Groq in your prompt or run:

```powershell
node tools/transcribe.mjs "inbox\koby-001\voiceover.wav" --groq
```

This extracts audio and **uploads it to Groq**. Having a key in `.env` does not change the default from local. The helper sends one audio file per request and imposes its own conservative 24 MB cap; it has no automatic chunking. Check [Groq speech-to-text docs](https://console.groq.com/docs/speech-to-text) for current service requirements.

Both options produce `{text, audio_duration_secs, words:[{text,start,end}]}` JSON next to the input. Existing output JSON is never overwritten. Reuse it or choose a new `--output` filename.

## 5. Install/open one coding agent

Follow [AGENTS-TAGLISH.md](AGENTS-TAGLISH.md). One agent is enough; hindi kailangan sabay-sabay ang Claude, Codex, at Antigravity. No MCP server is required for this repo's local shell/file workflow.

## 6. Add your style and first brief

```powershell
if (-not (Test-Path my-style.md)) { Copy-Item templates\my-style.example.md my-style.md }
New-Item -ItemType Directory -Force inbox\koby-001
Copy-Item templates\brief.example.md inbox\koby-001\brief.md
```

Edit these files. Put the actual videos, images, and narration in `inbox\koby-001`; put licensed music/SFX in `my-sounds`. The template has no product claims pre-filled. Use the editing prompt in [PROMPTS-TAGLISH.md](PROMPTS-TAGLISH.md).

## macOS/Linux notes

Install Node.js 22+, Git, FFmpeg/ffprobe, and Chrome/Chromium using your OS package manager or official installers. On macOS with Homebrew already installed, `brew install node git ffmpeg` installs the CLI prerequisites. On Linux, distro Node versions can be old, so verify the actual version.

From the repo folder:

```bash
node setup.mjs --check
node setup.mjs
python3 -m venv .venv
.venv/bin/python -m pip install faster-whisper
node tools/transcribe.mjs "inbox/my-project/voiceover.wav" --local
```

Linux may require its `python3-venv` package. Windows and WSL are separate environments: install Node/FFmpeg/Python in the environment that will run the tools. Windows paths like `C:\Users\...` map to `/mnt/c/Users/...` in WSL.
