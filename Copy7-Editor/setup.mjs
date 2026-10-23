#!/usr/bin/env node
// One-time setup: checks tools, installs the editing engine (Herk Edit Kit) into kit/,
// renders a test video into outbox/, and reports what is ready. Safe to re-run.
//
//   node setup.mjs
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { pythonCommand } from './tools/python-command.mjs';

const { values: opts } = parseArgs({ options: { check: { type: 'boolean' }, help: { type: 'boolean' } } });
if (opts.help) {
  console.log('Usage: node setup.mjs [--check]\n--check: check prerequisites only; no downloads or changes.');
  process.exit(0);
}

const root = dirname(fileURLToPath(import.meta.url));
const kit = join(root, 'kit');
const KIT_REPO = 'https://github.com/nateherkai/herk-edit-kit.git';
// Pinned so an upstream change cannot break a working setup. Bump deliberately.
const KIT_COMMIT = '10511e5af86fc47756ea89803b397422e2d89284';
// The kit's showcase and teaching-project media is about 380 MB and is not needed to edit.
const SPARSE = ['/*', '!/examples/showcase/', '!/video-projects/**/*.mp4', '!/video-projects/**/*.mov',
  '!/video-projects/**/*.webm', '!/video-projects/**/*.mp3', '!/video-projects/**/*.wav'];

const win = process.platform === 'win32';
const step = (msg) => console.log(`\n== ${msg}`);
const run = (cmd, args, cwd = root, quiet = false) => {
  const opts = { cwd, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8' };
  // npm and npx are .cmd shims on Windows and need a shell; every argument here is a fixed constant.
  const r = win && (cmd === 'npm' || cmd === 'npx')
    ? spawnSync([cmd, ...args].join(' '), { ...opts, shell: true })
    : spawnSync(cmd, args, opts);
  return !r.error && r.status === 0;
};
const fail = (msg) => { console.error(`\nSETUP STOPPED: ${msg}`); process.exit(1); };

step('Checking tools');
const missing = [];
if (Number(process.versions.node.split('.')[0]) < 22) missing.push('Node.js 22 or newer');
for (const [tool, flag, label] of [['git', '--version', 'Git'], ['ffmpeg', '-version', 'FFmpeg'], ['ffprobe', '-version', 'FFmpeg']]) {
  if (!run(tool, [flag], root, true)) missing.push(label);
}
if (missing.length) {
  const hint = win
    ? 'Run separately: winget install --id OpenJS.NodeJS.LTS --exact; winget install --id Git.Git --exact; winget install --id Gyan.FFmpeg --exact. Then open a new terminal.'
    : process.platform === 'darwin' ? 'brew install node git ffmpeg' : 'Use your package manager: node (22+), git, ffmpeg';
  fail(`missing ${[...new Set(missing)].join(', ')}.\nInstall with: ${hint}`);
}
console.log(`Node ${process.versions.node}, Git, FFmpeg: OK`);
if (opts.check) {
  console.log('Prerequisites OK. Chrome/Chromium rendering is verified by the full setup.');
  process.exit(0);
}

step('Installing the editing engine (Herk Edit Kit) into kit/');
if (!existsSync(join(kit, '.git'))) {
  if (!run('git', ['clone', '--quiet', '--no-checkout', '--depth', '1', '--filter=blob:limit=1m', KIT_REPO, kit])) {
    fail('could not download Herk Edit Kit. Check your internet connection and run setup again.');
  }
  if (!run('git', ['-C', kit, 'fetch', '--quiet', '--depth', '1', '--filter=blob:limit=1m', 'origin', KIT_COMMIT])) fail('Could not fetch the pinned engine commit.');
  if (!run('git', ['-C', kit, 'sparse-checkout', 'set', '--no-cone', ...SPARSE])) fail('Could not configure the sparse checkout.');
  if (!run('git', ['-C', kit, '-c', 'advice.detachedHead=false', 'checkout', '--quiet', KIT_COMMIT])) {
    fail(`could not check out kit commit ${KIT_COMMIT}.`);
  }
} else {
  const head = spawnSync('git', ['-C', kit, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  if (head.status !== 0 || head.stdout.trim() !== KIT_COMMIT) fail('Existing kit/ does not match the pinned commit. Back up its video-projects first, then move kit/ aside and rerun setup. No files were deleted.');
  console.log('kit/ matches the pinned commit.');
}

step('Installing kit packages (npm ci)');
if (!existsSync(join(kit, 'node_modules', 'hyperframes')) && !run('npm', ['ci', '--no-audit', '--no-fund'], kit)) {
  fail('npm ci failed in kit/. Read the error above.');
}
if (!run('npm', ['run', 'setup', '--silent'], kit)) fail('Engine setup failed. Read the error above.');

step('Rendering a test video');
const demo = join(kit, 'video-projects', 'demo');
const testVideo = join(root, 'outbox', 'setup-test.mp4');
for (const dir of ['inbox', 'outbox', 'my-sounds']) mkdirSync(join(root, dir), { recursive: true });
if (!existsSync(demo) && !run('npm', ['run', 'demo', '--silent'], kit)) fail('Could not create the demo project.');
const rendered = join(demo, 'renders', 'demo.mp4');
if (!existsSync(rendered) && !run('npx', ['hyperframes', 'render', '--quality', 'draft', '--output', 'renders/demo.mp4'], demo)) {
  fail('the test render failed. Run `npx hyperframes doctor` inside kit/video-projects/demo to see why (usually Chrome).');
}
if (!existsSync(rendered)) fail('Renderer did not produce the expected demo.mp4.');
copyFileSync(rendered, testVideo);
console.log(`Test video: ${testVideo}`);

step('Transcription');
if (!existsSync(join(root, '.env'))) copyFileSync(join(root, '.env.example'), join(root, '.env'));
try { process.loadEnvFile(join(root, '.env')); } catch {}
const groq = Boolean(process.env.GROQ_API_KEY);
const localWhisper = Boolean(run(pythonCommand(root), ['-c', 'import faster_whisper'], root, true));
console.log(`Groq key in .env: ${groq ? 'yes' : 'no'}`);
console.log(`Local faster-whisper: ${localWhisper ? 'yes' : 'no'}`);

console.log(`\nSETUP COMPLETE${groq || localWhisper ? '' : ' (transcription not configured yet)'}`);
console.log(`Drop assets in ${resolve(root, 'inbox')} and ask your coding agent to use copy7-editor.`);
