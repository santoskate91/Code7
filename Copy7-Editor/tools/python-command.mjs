import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export function pythonCommand(root) {
  const local = join(root, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  if (existsSync(local)) return local;
  for (const command of ['python', 'python3']) {
    const result = spawnSync(command, ['-c', 'import sys; sys.exit(0 if sys.version_info.major == 3 else 1)'], { stdio: 'ignore' });
    if (result.status === 0) return command;
  }
  return 'python';
}
