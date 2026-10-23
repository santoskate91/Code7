# Paggamit sa Claude Code, Codex, at Antigravity

Pareho ang editing engine at project files sa tatlo. Ang nag-iiba ay kung saan nila binabasa ang instructions at paano mo ini-invoke ang skill. Gamitin ang local coding environment na may file at terminal access sa repository.

| Agent | Entry files in this repo | Prompt entry |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` imports `AGENTS.md`; `.claude/skills/copy7-editor/SKILL.md` points to shared skill | `/copy7-editor` |
| Codex CLI/IDE | `AGENTS.md`; `.agents/skills/copy7-editor/SKILL.md` | `$copy7-editor` |
| Antigravity | `.agents/skills/copy7-editor/SKILL.md`; explicit root guide in prompt | Natural language, or skill slash command when supported by your surface |

## Claude Code

Sa Windows PowerShell, install from the official supported package:

```powershell
winget install --id Anthropic.ClaudeCode --exact
```

Reopen terminal, then:

```powershell
claude --version
Set-Location "C:\Users\Meo\Videos\AI-Editing\Copy7-Editor"
claude
```

Follow the sign-in flow. Sa **Claude Code chat**, type:

```text
/copy7-editor start
```

Pag ready na:

```text
/copy7-editor I-edit ang assets sa inbox/koby-001. Basahin ang brief.md. Use local transcription and produce a reviewed draft.
```

Kung hindi makita ang slash command, restart the session in the repo root, then ask it to read `AGENTS.md` and `.agents/skills/copy7-editor/SKILL.md` explicitly. Sa Claude desktop, use a Code/local project session with this folder selected; a normal website chat does not automatically have access to your Windows files.

[Official Claude installation](https://code.claude.com/docs/en/setup) · [Official skills guide](https://code.claude.com/docs/en/skills)

## Codex

Install Codex CLI using the Windows or npm tab in the [official Codex CLI installation guide](https://learn.chatgpt.com/docs/codex/cli). Kung installed na ang Codex app/IDE extension, puwedeng buksan mismo ang repo as a local workspace.

For CLI, verify and launch:

```powershell
codex --version
Set-Location "C:\Users\Meo\Videos\AI-Editing\Copy7-Editor"
codex
```

Follow its sign-in flow. Sa **Codex chat**, type:

```text
$copy7-editor start
```

Then:

```text
$copy7-editor I-edit ang assets sa inbox/koby-001. Basahin ang brief.md. Use local transcription and produce a reviewed draft.
```

Type `/skills` or `$` to check available skills. Kung hindi makita, verify the open folder and restart Codex. File/terminal/network approvals depend on your environment; approve only the setup or edit operations you intend. A cloud session cannot automatically read an arbitrary `C:\Users\...` file on your PC.

[Official skill discovery and invocation](https://learn.chatgpt.com/docs/build-skills)

## Google Antigravity

1. Download/install from [Google Antigravity](https://antigravity.google/download), then sign in.
2. Open/add the **copy7-editor root folder** as the workspace/project. UI labels may vary between App and IDE versions.
3. Open the agent chat/prompt panel. If available, inspect active skills in Customizations.
4. Paste this:

```text
Use the copy7-editor skill in this workspace.
Read AGENTS.md and .agents/skills/copy7-editor/SKILL.md first.
Set up the repo following docs/INSTALL-TAGLISH.md, then report the test-render path.
Use local transcription. Explain errors in Taglish and do not claim success if a required step failed.
```

5. After setup, paste the general editing prompt from the prompt collection.

Current official docs use `.agents/skills` for App/CLI/IDE and mention legacy `.agent/skills` compatibility. Kaya hindi kailangan ng duplicate skill copy. In Antigravity App/CLI with slash-command skills, `/copy7-editor` can invoke the skill. If unavailable in your version, use the explicit-file prompt above.

[Official Antigravity skills](https://www.antigravity.google/docs/skills?tab=ide)

## Paano magpalit ng agent

Finish the current render and stop editing in the first agent. Ask it to update `BRIEF.md`, `EDIT-PLAN.md`, and `VERIFY.md` in the video project. Open the same root folder in the next agent and tell it the existing project path. Ask it to reuse media and transcripts. Huwag magpa-edit ng parehong project simultaneously sa dalawang agents.

## Important command distinction

`node setup.mjs`, `claude`, and `codex` are terminal commands. `$copy7-editor`, `/copy7-editor`, and the long editing prompts go **inside the agent chat**. Do not paste `$copy7-editor` directly into PowerShell; PowerShell interprets `$` as a variable marker.
