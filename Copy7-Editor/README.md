# Copy7-Editor

Taglish video-editing workspace para sa **Claude Code, Codex, at Google Antigravity**. Gumagamit ng Herk Edit Kit/HyperFrames para sa rendering at ng workflow pattern ng free247editor para sa madaling setup, personal style, drafts, at revisions.

Gamitin ito sa Shopee affiliate videos, YouTube Shorts, Facebook Reels, o iba pang video edits. May support sa supplied video clips, images, voiceover, captions, music, at sound effects. Agent-guided ang editing: AI agent ang bumubuo ng project at nagpapatakbo ng tools; kailangan pa rin ng human review ng finished video.

## Unahin basahin

Start here: [Complete Taglish usage guide](GABAY-SA-PAGGAMIT.md). Kasama na sa package ang hidden skill/config files at media-folder placeholders.

| Kailangan mo | Guide |
| --- | --- |
| Paano binuo ang free247editor mula sa Herk | [Repository analysis](docs/ANALYSIS-TAGLISH.md) |
| Installation, Windows setup, local/Groq transcription | [Installation guide](docs/INSTALL-TAGLISH.md) |
| Claude Code, Codex, Antigravity instructions | [Agent guide](docs/AGENTS-TAGLISH.md) |
| Daily workflow, revisions, final export | [Usage guide](docs/USAGE-TAGLISH.md) |
| Copy-paste commands/prompts | [Prompt collection](docs/PROMPTS-TAGLISH.md) |
| Errors at troubleshooting | [Troubleshooting](docs/TROUBLESHOOTING-TAGLISH.md) |
| Paano gumawa ng sarili mong GitHub repository | [GitHub publishing](docs/PUBLISH-GITHUB-TAGLISH.md) |
| Ano ang na-test at hindi pa | [Validation](docs/VALIDATION.md) |

## Quick start

1. Extract ang package sa sariling folder, halimbawa `C:\Users\Meo\Videos\AI-Editing\Copy7-Editor`.
2. Install Node.js 22+, Git, FFmpeg/ffprobe, at Chrome/Chromium. Install Python only if gagamit ng local transcription.
3. Open PowerShell sa folder. Run `node setup.mjs --check`, then `node setup.mjs`.
4. Configure local faster-whisper o explicit Groq transcription ayon sa installation guide.
5. Open **the repository root** sa chosen agent; paste the universal setup prompt sa prompt collection.
6. Put your assets in `inbox/<project>/`, add product facts and your brief, then ask the agent to edit. Review drafts in `outbox/`.

## Invocation sa agent chat

| Agent | I-type sa chat, hindi sa PowerShell |
| --- | --- |
| Codex | `$copy7-editor` followed by your request |
| Claude Code | `/copy7-editor` followed by your request |
| Antigravity | “Use the copy7-editor skill. Read AGENTS.md and edit my supplied assets.” |

Antigravity App/CLI versions with skill slash commands can also invoke `/copy7-editor`. Natural-language invocation with the explicit file path works as a fallback. Skill paths follow the official docs linked in the agent guide; end-to-end compatibility on your installed versions still needs a local smoke test.

## Ano ang nasa repository

- Shared workflow sa `.agents/skills/copy7-editor/` for Codex and Antigravity.
- Claude Code adapter sa `.claude/skills/copy7-editor/` plus `CLAUDE.md`.
- Setup script that installs the pinned upstream engine into `kit/` and renders its demo.
- Transcription helper: **local by default**, optional `--groq` audio upload.
- `templates/` for editing brief and style preferences.
- Detailed Taglish docs, prompts, comparison, troubleshooting, and handoff workflow.

`inbox/`, `outbox/`, `my-sounds/`, `kit/`, `.venv/`, `.env`, `my-style.md`, and `my-rules.md` are ignored by Git. Keep private assets in these folders. Gitignore prevents accidental staging in normal use; it does not prevent external services or AI agents from accessing files under their configured permissions.

## Output, cost, and limits

Output is **MP4 plus editable HyperFrames project**, not a native CapCut draft. No CapCut MCP is required. You can import the finished MP4 into CapCut for further edits, but the generated layers will be flattened.

The wrapper and Herk code use MIT licenses. AI agent access can have separate fees/usage limits. Local faster-whisper does not need a transcription API key, but downloads a model on first use and uses your hardware. Groq's availability, limits, and billing depend on your account; check them before using `--groq`. No claim that one provider is always more accurate for Taglish is made.

## Credits

Derived portions of setup and transcription helpers: [riecodes/free247editor](https://github.com/riecodes/free247editor), copyright 2026 riecodes. Engine downloaded separately: [nateherkai/herk-edit-kit](https://github.com/nateherkai/herk-edit-kit), copyright 2026 Nate Herk. Preserve [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md). Upstream AIS brand assets are excluded from its reusable brand license; use your own brand and supplied media.
