// Cross-platform Gradle runner (Windows uses gradlew.bat, macOS/Linux uses ./gradlew).
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const dir = fileURLToPath(new URL('../android', import.meta.url));
const cmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const r = spawnSync(cmd, process.argv.slice(2), { cwd: dir, stdio: 'inherit', shell: true });
process.exit(r.status ?? 1);
