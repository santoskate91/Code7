# Repository analysis — Taglish

Reviewed on 2026-10-23. Read-only source inspection plus Git history review; walang claim na alam natin ang private prompts o reasoning ng original author.

## Snapshot na na-review

| Repository | Commit |
| --- | --- |
| free247editor | `86bb088d08c6209c6b427385fe363c8110de3b5b` |
| Herk Edit Kit | `10511e5af86fc47756ea89803b397422e2d89284` |

Sa review na ito, Herk `main` at ang commit na naka-pin sa free247editor `setup.mjs` ay pareho. Puwedeng magbago ang `main`; ang links sa ibaba ay pinned para reproducible ang analysis.

## Paano niya ginamit at ni-revise ang reference

**Wrapper ang free247editor sa ibabaw ng Herk Edit Kit.** Nakikita ito sa setup code: dina-download nito ang Herk repo sa `kit/`, nag-checkout ng fixed commit, saka pinapatakbo ang npm setup at demo render. Walang independent rendering engine na ipinalit. Ang malaking pagbabago ay nasa user workflow, setup, transcription integration, at agent instructions.

| Bahagi | Herk Edit Kit | free247editor addition/change |
| --- | --- | --- |
| Core editing | HyperFrames + GSAP, editing skills, cutting scripts, validators, starter project | Reuses this engine through `kit/` |
| Setup | `npm ci`, `npm run setup`, demo commands | Root `setup.mjs` coordinates tool checks, sparse clone, pinned checkout, npm install, test render |
| Skill routing | Multiple editing skills; original `.claude/skills` mirrored into `.agents/skills` | One personal-editor entry skill in `.agents/skills/free247editor`; Claude adapter points to it |
| Speech recognition | Included helper uses ElevenLabs; docs allow alternative providers | Adds Groq and local faster-whisper helpers with compatible word JSON |
| User assets | Project-centered `video-projects/<slug>/assets` | Adds simpler `inbox/`, `outbox/`, `my-sounds/` |
| Style | Kit's design references, playbook, project design | Personal `my-style.md` and learned `my-rules.md` take precedence |
| Iteration | Full planning/editing/verification workflow | Plain-language “edit this”, numbered drafts, “final”, and saved preferences |
| Dependencies | Broad starter kit plus teaching projects/media | Sparse checkout omits showcase and much teaching media; engine pinned intentionally |
| Output | Rendered MP4 and HyperFrames project | Copies MP4 into outbox; still retains project in kit |

“Learning” dito ay saving instructions sa Markdown files. Hindi ito model training o automatic fine-tuning. Agent-guided din ang workflow: ang skill ay instruction document, hindi standalone executable video editor.

## Ano ang makikita sa commit history

Public history ng free247editor at the reviewed snapshot:

| Commit | Recorded change |
| --- | --- |
| `fd6574b` | Initial personal AI editor focused on Claude |
| `0ab06fb` | Adds one-prompt setup instructions |
| `43a4d09` | Moves editor workflow into an Agent Skill for other coding agents |
| `fe805d8` | Adds browser-assisted Groq key setup guidance and Windows PATH reload instructions |
| `86bb088` | README badge update |

Ito ang supported sequence ng changes. Hindi nito pinapatunayan kung anong AI prompt, editor, o private development process ang ginamit ng author.

## Practical strengths and limitations

Maganda ang separation: user files/preferences stay outside the downloaded engine, kaya mas madaling mag-backup at update. Pinning reduces unexpected upstream changes. Compatible word timestamps let the wrapper substitute transcription without rewriting the cutting pipeline.

May limitations sa reviewed source: existing `kit/` was treated as already installed without checking its commit; some setup subprocess results were not checked; transcription can overwrite a same-name JSON; the default Groq path uploads audio; one audio file is sent per request rather than chunked; and the README's compatibility claims are broader than its reported manual testing. These are code observations, not evidence that every installation fails.

Herk already allows alternative transcription and already supports Codex. Kaya hindi tamang sabihing free247editor ang unang nagdagdag ng Codex support sa engine, o na kailangan ng paid APIs para sa local synthetic demo.

## Ano ang binago sa Copy7-Editor version

- Taglish installation, operation, agent setup, prompts, troubleshooting, and publishing guides.
- Canonical shared skill plus a Claude Code adapter; Antigravity follows current `.agents/skills` convention.
- Existing media plus separate voiceover workflow; local transcription default, explicit `--groq` opt-in.
- Setup checks the installed engine commit and stops on failed prerequisite stages.
- Transcription refuses to overwrite outputs, uses temporary audio cleanup, validates word timestamps, and detects repo `.venv` Python.
- Product-claim checks, caption safe areas, retimed transcript handling, persistent style rules, and inter-agent handoff notes.
- Same pinned engine; no copied AIS brand assets or teaching footage.

## Source files

- [free247editor setup](https://github.com/riecodes/free247editor/blob/86bb088d08c6209c6b427385fe363c8110de3b5b/setup.mjs)
- [free247editor skill](https://github.com/riecodes/free247editor/blob/86bb088d08c6209c6b427385fe363c8110de3b5b/.agents/skills/free247editor/SKILL.md)
- [free247editor transcription](https://github.com/riecodes/free247editor/blob/86bb088d08c6209c6b427385fe363c8110de3b5b/tools/transcribe.mjs)
- [free247editor history](https://github.com/riecodes/free247editor/commits/main/)
- [Herk workspace guide](https://github.com/nateherkai/herk-edit-kit/blob/10511e5af86fc47756ea89803b397422e2d89284/AGENTS.md)
- [Herk package scripts and dependencies](https://github.com/nateherkai/herk-edit-kit/blob/10511e5af86fc47756ea89803b397422e2d89284/package.json)
- [Herk license and brand restrictions](https://github.com/nateherkai/herk-edit-kit/blob/10511e5af86fc47756ea89803b397422e2d89284/LICENSE)
