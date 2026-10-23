#!/usr/bin/env node
// Adapted from riecodes/free247editor (MIT); see LICENSE and NOTICE.md.
// Local by default. --groq explicitly uploads extracted audio to Groq.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, existsSync, mkdtempSync, statSync } from 'node:fs';
import { dirname, join, parse, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { pythonCommand } from './python-command.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    local: { type: 'boolean' }, groq: { type: 'boolean' },
    model: { type: 'string', default: 'large-v3' },
    output: { type: 'string' }, help: { type: 'boolean' },
  },
});
if (opts.help || positionals.length !== 1) {
  console.log('Usage: node tools/transcribe.mjs <video-or-audio> [--local | --groq] [--model large-v3] [--output file.json]\nDefault: local faster-whisper. --groq uploads audio. Existing output files are never overwritten.');
  process.exit(opts.help ? 0 : 1);
}
const media = resolve(positionals[0]);
if (opts.local && opts.groq) throw new Error('Choose --local OR --groq.');
if (!existsSync(media) || !statSync(media).isFile()) throw new Error('Source media file does not exist.');
const { dir, name } = parse(media);
const out = opts.output ? resolve(opts.output) : join(dir, `${name}.json`);
if (existsSync(out)) throw new Error('Output already exists. Reuse it or specify a new --output path.');
if (!existsSync(dirname(out))) throw new Error('The output directory must already exist.');
try { process.loadEnvFile(join(root, '.env')); } catch {}
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true });
  if (r.error || r.status !== 0) throw new Error(`${cmd} failed: ${r.error?.message || r.stderr.trim().split('\n').pop()}`);
  return r.stdout;
};
const duration = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', media]));
if (!Number.isFinite(duration) || duration <= 0) throw new Error('No valid duration found.');
let words;
if (!opts.groq) {
  words = JSON.parse(run(pythonCommand(root), [join(root, 'tools', 'transcribe_local.py'), media, opts.model]));
} else {
  if (!process.env.GROQ_API_KEY) throw new Error('Set GROQ_API_KEY in local .env or use --local.');
  // Conservative client-side cap, not a promise of the provider/account limit.
  const temp = mkdtempSync(join(tmpdir(), 'copy7-editor-transcribe-'));
  try {
    const audio = join(temp, 'audio.mp3');
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', media, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '64k', audio]);
    if (statSync(audio).size > 24_000_000) throw new Error('Extracted audio exceeds the 24 MB client cap. Use --local or split the source first.');
    const form = new FormData();
    form.append('file', new Blob([readFileSync(audio)]), 'audio.mp3');
    form.append('model', opts.model === 'large-v3' ? 'whisper-large-v3' : opts.model);
    form.append('response_format', 'verbose_json');
    form.append('timestamp_granularities[]', 'word');
    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form, signal: AbortSignal.timeout(180000),
    });
    if (!res.ok) throw new Error(`Groq transcription failed: HTTP ${res.status}. Check account limits/key in the provider console, or use --local.`);
    const body = await res.json();
    words = (body.words || []).map(w => ({ text: w.word?.trim(), start: w.start, end: w.end }));
  } finally { rmSync(temp, { recursive: true, force: true }); }
}
if (!Array.isArray(words) || !words.length) throw new Error('No word timestamps returned. Is there speech?');
for (const [i, w] of words.entries()) {
  if (typeof w.text !== 'string' || !w.text.trim() || !Number.isFinite(w.start) || !Number.isFinite(w.end) || w.start < 0 || w.end < w.start || w.end > duration + 0.5 || (i && w.start < words[i - 1].start)) {
    throw new Error(`Invalid timestamp/text at word ${i}. Review the transcription result.`);
  }
}
writeFileSync(out, JSON.stringify({ text: words.map(w => w.text).join(' '), audio_duration_secs: duration, words }, null, 2) + '\n', { flag: 'wx' });
console.log(`Wrote ${words.length} words (${duration.toFixed(1)} s) to ${out}`);
