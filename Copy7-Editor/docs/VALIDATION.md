# Validation record

Reviewed 2026-10-23 in a Linux execution environment with Node.js 24.19.0, Python 3, Git, and FFmpeg 6.1.1.

## Completed

- `node setup.mjs --check`: Node/Git/FFmpeg/ffprobe prerequisite checks passed.
- JavaScript syntax validation for setup and the transcription/runtime helpers.
- Python syntax validation for the local helper and regression tests.
- Skill Creator `quick_validate.py`: canonical skill and Claude adapter both valid.
- Eight offline CLI regression tests passed: default local provider even with a key present, existing transcript preservation, alternate output path, invalid/empty timestamps rejection, conflicting provider flags, CLI help, read-only prerequisite check, and preservation of an existing unpinned engine folder.
- Relative Markdown link checks and `git diff --check`.

The local transcription success-path tests use a **mock faster-whisper module** plus a real one-second WAV/ffprobe. They verify CLI integration and timestamp/output handling; they do not measure speech recognition accuracy.

## Not verified end to end

- Full engine dependency installation and HyperFrames video rendering.
- Real faster-whisper model download/inference or CUDA performance.
- Live Groq transcription/authentication/quotas/billing.
- Editing a real user video in Claude Code, Codex, or Antigravity.
- Native Windows/macOS runtime behavior.

Agent entry paths and invocation instructions were checked against official documentation, but documentation compatibility is not equivalent to a real editing session on each product.

## Repeat checks locally

With Node 22+, Python 3, Git, FFmpeg, and ffprobe on PATH:

```text
node setup.mjs --check
node --check setup.mjs
node --check tools/transcribe.mjs
python tests/test_cli.py
```

For the actual rendering smoke test, run `node setup.mjs`, then watch `outbox/setup-test.mp4`. For transcription, use your own short speech sample, compare the words and timing with the audio, and confirm the chosen provider. Review one short draft on your own machine before using the workflow for larger projects.
