"""Offline CLI regression tests. Mock recognizer: no real speech model/API used."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import wave

REPO = Path(__file__).resolve().parents[1]


class EditorCliTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='copy7-editor-test-')
        self.root = Path(self.temp.name)
        shutil.copytree(REPO / 'tools', self.root / 'tools')
        shutil.copy2(REPO / 'setup.mjs', self.root / 'setup.mjs')
        self.audio = self.root / 'voice over.wav'
        with wave.open(str(self.audio), 'wb') as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(16000)
            wav.writeframes(b'\x00\x00' * 16000)
        mock = self.root / 'mock'
        mock.mkdir()
        (mock / 'faster_whisper.py').write_text('''
import os
from types import SimpleNamespace as O
class WhisperModel:
    def __init__(self, *args, **kwargs): pass
    def transcribe(self, *args, **kwargs):
        mode = os.environ.get("TEST_WORDS", "valid")
        words = [] if mode == "empty" else [O(word="Kumusta", start=0.1, end=0.6)]
        if mode == "bad": words[0].start = -1
        return iter([O(words=words)]), None
''')
        self.env = dict(os.environ, PYTHONPATH=str(mock), GROQ_API_KEY='test-not-a-real-key')

    def tearDown(self):
        self.temp.cleanup()

    def run_cli(self, *args, env=None):
        return subprocess.run(['node', str(self.root / 'tools/transcribe.mjs'), *args],
                              env=env or self.env, capture_output=True, text=True, timeout=30)

    def test_local_default_even_when_key_present(self):
        r = self.run_cli(str(self.audio))
        self.assertEqual(r.returncode, 0, r.stderr)
        data = json.loads(self.audio.with_suffix('.json').read_text())
        self.assertEqual(data['text'], 'Kumusta')
        self.assertEqual(data['words'][0]['start'], 0.1)
        self.assertAlmostEqual(data['audio_duration_secs'], 1)

    def test_existing_transcript_preserved(self):
        out = self.audio.with_suffix('.json')
        out.write_text('important existing transcript')
        r = self.run_cli(str(self.audio))
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('Output already exists', r.stderr)
        self.assertEqual(out.read_text(), 'important existing transcript')

    def test_explicit_output(self):
        out = self.root / 'alternate.json'
        r = self.run_cli(str(self.audio), '--local', '--output', str(out))
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue(out.exists())
        self.assertFalse(self.audio.with_suffix('.json').exists())

    def test_invalid_and_empty_words_rejected(self):
        for mode in ['bad', 'empty']:
            with self.subTest(mode=mode):
                r = self.run_cli(str(self.audio), env=dict(self.env, TEST_WORDS=mode))
                self.assertNotEqual(r.returncode, 0)
                self.assertFalse(self.audio.with_suffix('.json').exists())

    def test_provider_conflict_rejected(self):
        r = self.run_cli(str(self.audio), '--groq', '--local')
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('Choose --local OR --groq', r.stderr)

    def test_help(self):
        r = self.run_cli('--help')
        self.assertEqual(r.returncode, 0)
        self.assertIn('Default: local', r.stdout)

    def test_setup_check_is_read_only(self):
        r = subprocess.run(['node', str(self.root / 'setup.mjs'), '--check'],
                           capture_output=True, text=True, timeout=30)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertFalse((self.root / 'kit').exists())
        self.assertFalse((self.root / '.env').exists())

    def test_existing_unpinned_kit_stops_without_deletion(self):
        kit = self.root / 'kit'
        kit.mkdir()
        subprocess.run(['git', 'init', str(kit)], check=True, capture_output=True)
        source = kit / 'important-video.txt'
        source.write_text('preserve me')
        r = subprocess.run(['node', str(self.root / 'setup.mjs')],
                           capture_output=True, text=True, timeout=30)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('does not match the pinned commit', r.stderr)
        self.assertEqual(source.read_text(), 'preserve me')


if __name__ == '__main__':
    unittest.main()
